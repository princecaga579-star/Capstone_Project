<?php

namespace Database\Factories;

use App\Models\WorkoutProgram;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkoutProgram>
 */
class WorkoutProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $programs = [
            [
                'name' => 'Full Body Strength',
                'description' => 'A complete workout targeting all major muscle groups.',
            ],
            [
                'name' => 'Upper Body Power',
                'description' => 'A workout focused on building strength in the upper body.',
            ],
            [
                'name' => 'Lower Body Strength',
                'description' => 'A workout designed to build strength in the legs and lower body.',
            ],
            [
                'name' => 'Chest and Triceps',
                'description' => 'A workout focused on developing the chest and triceps.',
            ],
            [
                'name' => 'Back and Biceps',
                'description' => 'A workout focused on building back and biceps strength.',
            ],
            [
                'name' => 'Shoulder Builder',
                'description' => 'A workout designed to build stronger and more defined shoulders.',
            ],
            [
                'name' => 'Leg Day',
                'description' => 'A workout focused on building strength in the legs.',
            ],
            [
                'name' => 'Push Workout',
                'description' => 'A workout targeting the chest, shoulders, and triceps.',
            ],
            [
                'name' => 'Pull Workout',
                'description' => 'A workout targeting the back, biceps, and other pulling muscles.',
            ],
            [
                'name' => 'Beginner Fitness Program',
                'description' => 'A beginner-friendly workout program for building basic fitness and strength.',
            ],
        ];

        $program = fake()->randomElement($programs);

        return [
            'name' => $program['name'],
            'description' => $program['description'],

            'difficulty' => fake()->randomElement([
                'Beginner',
                'Intermediate',
                'Advanced',
            ]),

            'duration' => fake()->randomElement([
                30,
                45,
                60,
                75,
                90,
            ]),
        ];
    }
}