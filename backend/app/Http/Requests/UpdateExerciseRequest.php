<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExerciseRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'workout_program_id' => 'sometimes|required|exists:workout_programs,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'sets' => 'sometimes|required|integer|min:1',
            'reps' => 'sometimes|required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'workout_program_id.exists' =>
                'The selected workout program does not exist.',

            'name.required' =>
                'Exercise name is required.',

            'sets.required' =>
                'Number of sets is required.',

            'sets.integer' =>
                'Sets must be a whole number.',

            'sets.min' =>
                'Sets must be at least 1.',

            'reps.required' =>
                'Number of reps is required.',

            'reps.integer' =>
                'Reps must be a whole number.',

            'reps.min' =>
                'Reps must be at least 1.',
        ];
    }
}