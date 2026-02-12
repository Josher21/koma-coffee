<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'status' => $this->status,

            'reserved_at' => optional($this->reserved_at)->toISOString(),
            'expires_at'  => optional($this->expires_at)->toISOString(),
            'created_at'  => optional($this->created_at)->toISOString(),
            'updated_at'  => optional($this->updated_at)->toISOString(),

            'book' => $this->whenLoaded('book', function () {
                return [
                    'id' => $this->book->id,
                    'title' => $this->book->title,
                    // añade lo que necesites para la UI:
                    'cover_url' => $this->book->cover_url ?? null,
                    'available_copies' => $this->book->available_copies ?? null,
                    'total_copies' => $this->book->total_copies ?? null,
                ];
            }),
        ];
    }
}
