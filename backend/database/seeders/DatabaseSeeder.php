<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Membership;
use App\Models\WorkoutProgram;
use App\Models\Exercise;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        $admin = User::updateOrCreate(
            ['email' => 'admin@primefitness.com'],
            [
                'name' => 'Prime Fitness Admin',
                'password' => Hash::make('Admin@12345'),
                'role' => 'admin',
            ]
        );


        $member = User::updateOrCreate(
            ['email' => 'member@primefitness.com'],
            [
                'name' => 'Prime Fitness Member',
                'password' => Hash::make('Member@12345'),
                'role' => 'member',
            ]
        );


        User::factory(10)->create([
            'role' => 'member',
        ]);


        Membership::factory(12)->create();

        Membership::factory()->create([
            'user_id' => $member->id,
            'membership_type' => 'Annual',
            'status' => 'active',
            'amount' => 4000,
        ]);


        $programs = WorkoutProgram::factory(10)->create();



        foreach ($programs as $program) {
            Exercise::factory(3)->create([
                'workout_program_id' => $program->id,
            ]);
        }
    }
}