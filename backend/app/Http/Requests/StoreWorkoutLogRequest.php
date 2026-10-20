<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkoutLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exercise_id' => 'required|exists:exercises,id',
            'sets_completed' => 'required|integer|min:1',
            'reps_completed' => 'required|integer|min:1',
            'weight' => 'required|numeric|min:0',
            'logged_at' => 'required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'exercise_id.required' =>
                'Exercise is required.',

            'exercise_id.exists' =>
                'The selected exercise does not exist.',

            'sets_completed.required' =>
                'Completed sets are required.',

            'sets_completed.integer' =>
                'Completed sets must be a whole number.',

            'sets_completed.min' =>
                'Completed sets must be at least 1.',

            'reps_completed.required' =>
                'Completed reps are required.',

            'reps_completed.integer' =>
                'Completed reps must be a whole number.',

            'reps_completed.min' =>
                'Completed reps must be at least 1.',

            'weight.required' =>
                'Weight is required.',

            'weight.numeric' =>
                'Weight must be a number.',

            'weight.min' =>
                'Weight cannot be negative.',

            'logged_at.required' =>
                'Workout date and time are required.',

            'logged_at.date' =>
                'Please provide a valid date and time.',
        ];
    }
}