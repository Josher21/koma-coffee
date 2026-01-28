<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('category')->orderBy('title');

        if ($request->filled('search')) {
            $s = $request->query('search');
            $query->where('title', 'like', "%$s%");
        }

        if ($request->filled('category_id')) {
            $query->where('categoria_id', $request->query('category_id'));
        }

        return response()->json(
            $query->paginate(10)
        );
    }

    public function store(StoreBookRequest $request)
    {
        $book = Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'editorial' => $request->editorial,
            'pages' => $request->pages,
            'synopsis' => $request->synopsis,
            'image' => $request->image,
            'quantity' => $request->quantity,
            'category_id' => $request->category_id,
        ]);

        return response()->json($book->load('category'), 201);
    }

    public function show(Book $book)
    {
        return response()->json($book->load('category'));
    }

    public function update(UpdateBookRequest $request, Book $book)
    {
        $book->update([
            'title' => $request->title,
            'author' => $request->author,
            'editorial' => $request->editorial,
            'pages' => $request->pages,
            'synopsis' => $request->synopsis,
            'image' => $request->image,
            'quantity' => $request->quantity,
            'category_id' => $request->category_id,
        ]);

        return response()->json($book->load('category'));
    }

    public function destroy(Book $book)
    {
        $book->delete();
        return response()->json(['ok' => true]);
    }
}
