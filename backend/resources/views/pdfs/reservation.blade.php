<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reserva Koma Coffee</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #2d2d2d;
            font-size: 14px;
        }

        .container {
            padding: 30px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #6f4e37;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .header h1 {
            margin: 0;
            color: #6f4e37;
        }

        .section {
            margin-bottom: 20px;
        }

        .section h2 {
            font-size: 18px;
            color: #6f4e37;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }

        .row {
            margin-bottom: 8px;
        }

        .label {
            font-weight: bold;
        }

        .footer {
            margin-top: 40px;
            font-size: 12px;
            text-align: center;
            color: #777;
        }

        .status {
            display: inline-block;
            padding: 6px 10px;
            background-color: #eee;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Koma Coffee</h1>
            <p>Justificante de reserva</p>
        </div>

        <div class="section">
            <h2>Datos de la reserva</h2>

            <div class="row">
                <span class="label">Número de reserva:</span>
                #{{ $reservation->id }}
            </div>

            <div class="row">
                <span class="label">Estado:</span>
                <span class="status">{{ ucfirst($reservation->status) }}</span>
            </div>

            <div class="row">
                <span class="label">Fecha de reserva:</span>
                {{ $reservation->reserved_at }}
            </div>

            @if ($reservation->expires_at)
                <div class="row">
                    <span class="label">Fecha de expiración:</span>
                    {{ $reservation->expires_at }}
                </div>
            @endif
        </div>

        <div class="section">
            <h2>Datos del usuario</h2>

            <div class="row">
                <span class="label">Nombre:</span>
                {{ $reservation->user->name }}
            </div>

            <div class="row">
                <span class="label">Email:</span>
                {{ $reservation->user->email }}
            </div>
        </div>

        <div class="section">
            <h2>Libro reservado</h2>

            <div class="row">
                <span class="label">Título:</span>
                {{ $reservation->book->title }}
            </div>

            <div class="row">
                <span class="label">Autor:</span>
                {{ $reservation->book->author }}
            </div>

            <div class="row">
                <span class="label">Editorial:</span>
                {{ $reservation->book->editorial }}
            </div>

            <div class="row">
                <span class="label">Páginas:</span>
                {{ $reservation->book->pages }}
            </div>

            @if ($reservation->book->category)
                <div class="row">
                    <span class="label">Categoría:</span>
                    {{ $reservation->book->category->name }}
                </div>
            @endif
        </div>

        <div class="footer">
            <p>Este documento ha sido generado automáticamente por Koma Coffee.</p>
        </div>
    </div>
</body>
</html>