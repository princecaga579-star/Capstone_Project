<?php

namespace Database\Factories;

use App\Models\Membership;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Membership>
 */
class MembershipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-6 months', 'now');
        $endDate = (clone $startDate)->modify('+1 year');

        return [
            'user_id' => User::where('role', 'member')->inRandomOrder()->value('id')
                ?? User::factory()->create(['role' => 'member'])->id,

            'membership_type' => fake()->randomElement([
                'Monthly',
                'Quarterly',
                'Semi-Annual',
                'Annual',
            ]),

            'start_date' => $startDate->format('Y-m-d'),

            'end_date' => $endDate->format('Y-m-d'),

            'status' => fake()->randomElement([
                'pending',
                'active',
                'expired',
            ]),

            'amount' => fake()->randomElement([
                500,
                1200,
                2200,
                4000,
            ]),
        ];
    }
}