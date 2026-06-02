<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Justificante de reserva</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #2d1b12;
            font-size: 14px;
            line-height: 1.5;
        }

        .container {
            width: 100%;
            padding: 24px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #8b5e3c;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }

        .brand {
            font-size: 28px;
            font-weight: bold;
            color: #5c3a21;
            margin-bottom: 4px;
        }

        .subtitle {
            font-size: 15px;
            color: #7a5a44;
        }

        .section {
            margin-bottom: 22px;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #5c3a21;
            margin-bottom: 10px;
            border-bottom: 1px solid #d6c2ad;
            padding-bottom: 4px;
        }

        .row {
            margin-bottom: 8px;
        }

        .label {
            font-weight: bold;
            color: #4a2e1c;
        }

        .status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            background-color: #e8d8c3;
            color: #4a2e1c;
            font-weight: bold;
        }

        .footer {
            margin-top: 32px;
            padding-top: 12px;
            border-top: 1px solid #d6c2ad;
            font-size: 12px;
            color: #7a5a44;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">

        <div class="header">
            <div class="brand">Koma Coffee</div>
            <div class="subtitle">Justificante de reserva</div>
        </div>

        <div class="section">
            <div class="section-title">Datos de la reserva</div>

            <div class="row">
                <span class="label">Código de reserva:</span>
                #{{ $reservation->id }}
            </div>

            <div class="row">
                <span class="label">Estado:</span>
                <span class="status">
                    {{ $reservation->status ?? 'Activa' }}
                </span>
            </div>

            <div class="row">
                <span class="label">Fecha de reserva:</span>
                {{ $reservation->created_at?->format('d/m/Y H:i') }}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Datos del usuario</div>

            <div class="row">
                <span class="label">Nombre:</span>
                {{ $reservation->user->name ?? 'Usuario' }}
            </div>

            <div class="row">
                <span class="label">Email:</span>
                {{ $reservation->user->email ?? 'No disponible' }}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Libro reservado</div>

            <div class="row">
                <span class="label">Título:</span>
                {{ $reservation->book->title ?? 'No disponible' }}
            </div>

            <div class="row">
                <span class="label">Autor:</span>
                {{ $reservation->book->author ?? 'No disponible' }}
            </div>

            @if (!empty($reservation->book->category))
                <div class="row">
                    <span class="label">Categoría:</span>
                    {{ $reservation->book->category->name }}
                </div>
            @endif
        </div>

        <div class="footer">
            Este documento confirma la reserva realizada en Koma Coffee.
            <br>
            Presenta este justificante si necesitas acreditar tu reserva.
        </div>

    </div>
</body>
</html>