<?php

namespace Database\Factories;

use App\Models\Exercise;
use App\Models\WorkoutProgram;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Exercise>
 */
class ExerciseFactory extends Factory
{
    public function definition(): array
    {
        $exercises = [
            [
                'name' => 'Barbell Row',
                'description' => 'A compound exercise that targets the back and biceps.',
            ],
            [
                'name' => 'Bicep Curl',
                'description' => 'An isolation exercise that targets the biceps.',
            ],
            [
                'name' => 'Deadlift',
                'description' => 'A compound exercise that strengthens the back, legs, and glutes.',
            ],
            [
                'name' => 'Lat Pulldown',
                'description' => 'An exercise that targets the lat muscles and upper back.',
            ],
            [
                'name' => 'Leg Press',
                'description' => 'A lower-body exercise that targets the quadriceps, hamstrings, and glutes.',
            ],
            [
                'name' => 'Squat',
                'description' => 'A compound exercise that strengthens the legs and glutes.',
            ],
            [
                'name' => 'Bench Press',
                'description' => 'A compound exercise that targets the chest, shoulders, and triceps.',
            ],
            [
                'name' => 'Shoulder Press',
                'description' => 'An exercise that targets the shoulders and triceps.',
            ],
            [
                'name' => 'Tricep Pushdown',
                'description' => 'An isolation exercise that targets the triceps.',
            ],
            [
                'name' => 'Lateral Raise',
                'description' => 'An exercise that targets the side muscles of the shoulders.',
            ],
        ];

        $exercise = fake()->randomElement($exercises);

        return [
            'workout_program_id' => WorkoutProgram::factory(),
            'name' => $exercise['name'],
            'description' => $exercise['description'],
            'sets' => fake()->randomElement([3, 4, 5]),
            'reps' => fake()->randomElement([8, 10, 12, 15]),
        ];
    }
}