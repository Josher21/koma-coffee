<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:2', 'max:200'],
            'author' => ['required', 'string', 'min:2', 'max:150'],
            'editorial' => ['nullable', 'string', 'max:150'],
            'pages' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'synopsis' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'url', 'max:500'],
            'quantity' => ['required', 'integer', 'min:0', 'max:100000'],
            'category_id' => ['required', 'exists:categories,id'],
        ];
    }
}
