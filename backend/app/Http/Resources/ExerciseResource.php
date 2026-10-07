<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'workout_program_id' => $this->workout_program_id,

            'workout_program' => [
                'id' => $this->workoutProgram?->id,
                'name' => $this->workoutProgram?->name,
                'difficulty' => $this->workoutProgram?->difficulty,
            ],

            'name' => $this->name,
            'description' => $this->description,
            'sets' => $this->sets,
            'reps' => $this->reps,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}