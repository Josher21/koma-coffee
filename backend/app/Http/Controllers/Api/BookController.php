<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Http\Resources\BookResource;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('category')->orderBy('title');

        if ($request->filled('search')) {
            $s = $request->query('search');

            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                ->orWhere('author', 'like', "%{$s}%");
            });
        }

        if ($request->filled('category_id')) {
            // ✅ importante: column name debe ser category_id (o el que tengas en BD)
            $query->where('category_id', $request->query('category_id'));
        }

        return response()->json(
            $query->paginate(12)
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
        return new BookResource($book);
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
