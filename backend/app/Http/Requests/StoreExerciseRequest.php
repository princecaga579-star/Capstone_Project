<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExerciseRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'workout_program_id' => 'required|exists:workout_programs,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sets' => 'required|integer|min:1',
            'reps' => 'required|integer|min:1',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'workout_program_id.required' => 'Workout program is required.',
            'workout_program_id.exists' => 'The selected workout program does not exist.',
            'name.required' => 'Exercise name is required.',
            'sets.required' => 'Number of sets is required.',
            'sets.integer' => 'Sets must be a whole number.',
            'sets.min' => 'Sets must be at least 1.',
            'reps.required' => 'Number of reps is required.',
            'reps.integer' => 'Reps must be a whole number.',
            'reps.min' => 'Reps must be at least 1.',
        ];
    }
}