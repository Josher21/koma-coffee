<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => 'Libro ' . Str::random(6),
        'author' => 'Autor ' . Str::random(5),
        'editorial' => 'Editorial ' . Str::random(5),
        'pages' => rand(80, 450),
        'synopsis' => 'Sinopsis de prueba para el libro generado automáticamente.',
        'image' => 'https://picsum.photos/seed/' . Str::random(8) . '/400/250',
        'quantity' => rand(0, 20),
        'category_id' => Category::factory(),
        ];
    }
}
