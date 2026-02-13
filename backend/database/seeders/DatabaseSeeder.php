<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Book;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
    // Crear 1 admin
    User::factory()->admin()->create([
        'password' => Hash::make('admin123'),
    ]);

    // Crear 1 usuario normal
    User::factory()->user()->create([
        'password' => Hash::make('user123'),
    ]);
        Category::factory(6)->create();
        Book::factory(50)->create();
    }
}
