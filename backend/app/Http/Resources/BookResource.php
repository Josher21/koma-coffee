<?php

namespace App\Http\Resources;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = Auth::guard('sanctum')->user();

        // Por defecto: si no hay usuario autenticado
        $myReservationId = null;

        // Si viene con token, buscamos si el usuario tiene una reserva activa de este libro
        if ($user) {
            $myReservationId = Reservation::query()
                ->where('user_id', $user->id)
                ->where('book_id', $this->id)
                ->where('status', 'active')
                ->value('id'); // id o null
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => $this->author ?? null,
            'image' => $this->book->image ?? null,

            'total_copies' => $this->total_copies,
            'available_copies' => $this->available_copies,

            // 👇 Campos clave para React
            'my_active_reservation_id' => $myReservationId,
            'is_reserved_by_me' => (bool) $myReservationId,
        ];
    }
}
