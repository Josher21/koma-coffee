<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),

            // Si no existe contraseña previa, se crea con valor "password"
            'password' => static::$password ??= Hash::make('password'),

            'remember_token' => Str::random(10),

            // Por defecto será USER
            'role' => 'USER',
        ];
    }

    /**
     * Estado para usuario ADMIN
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'ADMIN',
            'email' => 'admin@koma.com', // email fijo para pruebas
            'name' => 'Admin User',
        ]);
    }

    /**
     * Estado para usuario normal
     */
    public function user(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'USER',
            'email' => 'user@koma.com', // email fijo para pruebas
            'name' => 'Normal User',
        ]);
    }

    /**
     * Estado para email no verificado
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
