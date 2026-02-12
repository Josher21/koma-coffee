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
    public function store(StoreReservationRequest $request): JsonResponse
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

                // 1) Intentar “reservar” una copia disponible de forma atómica
                $affected = Book::query()
                    ->where('id', $bookId)
                    ->where('available_copies', '>', 0)
                    ->decrement('available_copies', 1);

                // Si no afectó filas => no había stock (o no existe)
                if ($affected === 0) {
                    // Asegura si es por “no existe” o por “sin stock”
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
