<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreReservationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ReservationResource;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\ReservationPdfService;
use Illuminate\Support\Facades\Storage;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreReservationRequest $request,
        ReservationPdfService $reservationPdfService
    ): JsonResponse
    {
        $user = $request->user();
        $bookId = (int) $request->validated()['book_id'];

        // No duplicar reserva activa del mismo libro
        $alreadyActive = Reservation::query()
            ->where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->where('status', 'active')
            ->exists();

        if ($alreadyActive) {
            return response()->json([
                'message' => 'Ya tienes una reserva activa de este libro.',
            ], 422);
        }

        try {
            $reservation = DB::transaction(function () use ($user, $bookId) {

                // 1) Intentar reservar una copia disponible de forma atómica
                $affected = Book::query()
                    ->where('id', $bookId)
                    ->where('available_copies', '>', 0)
                    ->decrement('available_copies', 1);

                // Si no afectó filas => no había stock o no existe
                if ($affected === 0) {
                    $exists = Book::query()->where('id', $bookId)->exists();

                    if (! $exists) {
                        abort(404, 'Libro no encontrado.');
                    }

                    abort(409, 'No hay copias disponibles para reservar este libro.');
                }

                // 2) Crear la reserva
                return Reservation::create([
                    'user_id' => $user->id,
                    'book_id' => $bookId,
                    'status' => 'active',
                    'reserved_at' => now(),
                ]);
            });

            /*
            * 3) Generar el PDF después de crear la reserva.
            * Lo hacemos fuera de la transacción porque el PDF depende
            * de que la reserva ya exista correctamente en la base de datos.
            */
            $pdfPath = $reservationPdfService->generate($reservation);

            /*
            * 4) Guardar la ruta del PDF en la reserva.
            */
            $reservation->update([
                'pdf_path' => $pdfPath,
            ]);

            return response()->json([
                'message' => 'Reserva creada correctamente.',
                'data' => new ReservationResource($reservation->load('book')),
            ], 201);

        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            return response()->json(['message' => $e->getMessage()], $e->getStatusCode());
        }
    }

        // GET /api/reservations/me
        // Devuelve todas tus reservas paginadas con los datos del libro
        public function me(Request $request): JsonResponse
        {
            $userId = Auth::id();

            $reservations = Reservation::query()
                ->where('user_id', $userId)
                ->with('book')
                ->orderByDesc('reserved_at')
                ->paginate(10);

            return response()->json(ReservationResource::collection($reservations));
        }

    public function cancel(Request $request, Reservation $reservation): JsonResponse
    {
        $user = $request->user();

        // 1) Solo el dueño puede cancelarla
        if ($reservation->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        // 2) Solo se cancela si está activa
        if ($reservation->status !== 'active') {
            return response()->json([
                'message' => 'Solo se puede cancelar una reserva activa.',
            ], 422);
        }

        DB::transaction(function () use ($reservation) {
            // Bloqueo simple para evitar dobles cancelaciones simultáneas
            $res = Reservation::query()
                ->where('id', $reservation->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($res->status !== 'active') {
                // si ya fue cancelada por otro proceso
                return;
            }
            
            $res->update(['status' => 'cancelled']);

            // devolver la copia al stock
            Book::query()
                ->where('id', $res->book_id)
                ->increment('available_copies', 1);
        });

        $reservation->refresh()->load('book');

        return response()->json([
            'message' => 'Reserva cancelada correctamente.',
            'data' => new ReservationResource($reservation),
        ]);
    }

    public function downloadPdf(Reservation $reservation)
    {
        $user = request()->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado.',
            ], 401);
        }

        /*
        * Solo puede descargar el PDF:
        * - el usuario dueño de la reserva
        * - o un administrador
        */
        if ($reservation->user_id !== $user->id && $user->role !== 'ADMIN') {
            return response()->json([
                'message' => 'No tienes permiso para descargar este PDF.',
            ], 403);
        }

        /*
        * Comprobamos que la reserva tenga PDF generado.
        */
        if (! $reservation->pdf_path) {
            return response()->json([
                'message' => 'Esta reserva todavía no tiene PDF generado.',
            ], 404);
        }

        /*
        * Comprobamos que el archivo exista físicamente.
        */
        if (! Storage::disk('local')->exists($reservation->pdf_path)) {
            return response()->json([
                'message' => 'El archivo PDF no existe.',
            ], 404);
        }

        /*
        * Descargamos el PDF ya generado anteriormente.
        */
        return Storage::disk('local')->download(
            $reservation->pdf_path,
            'reserva-koma-coffee-' . $reservation->id . '.pdf'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
