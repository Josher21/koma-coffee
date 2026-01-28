<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

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
            'title' => fake()->sentence(3),
            'author' => fake()->name(),
            'editorial' => fake()->company(),
            'pages' => fake()->numberBetween(80, 450),
            'synopsis' => fake()->paragraph(4),
            'image' => 'https://picsum.photos/seed/'.fake()->uuid().'/400/250',
            'quantity' => fake()->numberBetween(0, 20),
            'category_id' => Category::factory(),
        ];
    }
}
