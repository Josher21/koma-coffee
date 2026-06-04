<?php

namespace App\Services;

use App\Models\Reservation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReservationPdfService
{
    public function generate(Reservation $reservation): string
    {
        /*
         * Cargamos relaciones necesarias para que el PDF tenga
         * todos los datos del usuario, libro y categoría.
         */
        $reservation->load([
            'user',
            'book.category',
        ]);

        /*
         * Nombre del archivo PDF.
         * Ejemplo: reservations/reservation_15.pdf
         */
        $filePath = 'reservations/reservation_' . $reservation->id . '.pdf';

        /*
         * Generamos el PDF usando una vista Blade.
         */
        $pdf = Pdf::loadView('pdfs.reservation', [
            'reservation' => $reservation,
        ]);

        /*
         * Guardamos el PDF en storage/app/private/reservations.
         * No lo guardamos en public para evitar que cualquiera pueda verlo.
         */
        Storage::disk('local')->put($filePath, $pdf->output());

        return $filePath;
    }
}