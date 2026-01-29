<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();   // usuario obtenido del token (auth:sanctum)

        // si no hay usuario o no es ADMIN => 403
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['message' => 'Forbbiden'], 403);
        }

        return $next($request);
    }
}
