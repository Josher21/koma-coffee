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
            'author' => $this->author,
            'editorial' => $this->editorial,
            'pages' => $this->pages,
            'synopsis' => $this->synopsis,
            'image' => $this->image,

            'quantity' => $this->quantity,
            'category_id' => $this->category_id,

            // Campos “extra” que ya estabas devolviendo
            'total_copies' => $this->total_copies,
            'available_copies' => $this->available_copies,

            // Si los calculas en el controlador, se devolverán aquí también
            'my_active_reservation_id' => $this->my_active_reservation_id ?? null,
            'is_reserved_by_me' => $this->is_reserved_by_me ?? false,
        ];
    }
}
