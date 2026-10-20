<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkoutProgramRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'difficulty' => 'sometimes|required|in:Beginner,Intermediate,Advanced',
            'duration' => 'sometimes|required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Workout program name is required.',
            'difficulty.required' => 'Difficulty is required.',
            'difficulty.in' => 'Difficulty must be Beginner, Intermediate, or Advanced.',
            'duration.required' => 'Duration is required.',
            'duration.integer' => 'Duration must be a whole number.',
            'duration.min' => 'Duration must be at least 1 minute.',
        ];
    }
}