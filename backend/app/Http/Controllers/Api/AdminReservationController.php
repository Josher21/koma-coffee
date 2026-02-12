<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class AdminReservationController extends Controller
{
    /**
     * Listado paginado de todas las reservas.
     * Incluye libro y usuario.
     * Permite filtro onlyActive.
     */
    public function index(Request $request)
    {
        $query = Reservation::query()
            ->with(['book', 'user']) // 👈 IMPORTANTÍSIMO para React
            ->orderByDesc('id');

        // Filtro opcional: solo activas
        if ($request->boolean('onlyActive')) {
            $query->where('status', 'active');
        }

        // Paginación (10 por página)
        return $query->paginate(10);
    }

    /**
     * Cancelar reserva desde admin.
     */
    public function cancel(Reservation $reservation)
    {
        // Si ya está cancelada, evitamos repetir acción
        if ($reservation->status !== 'active') {
            return response()->json([
                'message' => 'La reserva no se puede cancelar.'
            ], 422);
        }

        $reservation->update([
            'status' => 'cancelled'
        ]);

        return response()->json([
            'message' => 'Reserva cancelada correctamente.'
        ]);
    }
}
