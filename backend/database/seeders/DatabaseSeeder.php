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
        // ==========================================
        // 1. ADMIN ACCOUNT
        // ==========================================

        $admin = User::updateOrCreate(
            ['email' => 'admin@primefitness.com'],
            [
                'name' => 'Prime Fitness Admin',
                'password' => Hash::make('Admin@12345'),
                'role' => 'admin',
            ]
        );

        // ==========================================
        // 2. MAIN MEMBER ACCOUNT
        // ==========================================

        $member = User::updateOrCreate(
            ['email' => 'member@primefitness.com'],
            [
                'name' => 'Prime Fitness Member',
                'password' => Hash::make('Member@12345'),
                'role' => 'member',
            ]
        );

        // ==========================================
        // 3. ADDITIONAL MEMBERS
        // ==========================================

        User::factory(10)->create([
            'role' => 'member',
        ]);

        // ==========================================
        // 4. CREATE MEMBERSHIPS
        // ==========================================

        Membership::factory(12)->create();

        Membership::factory()->create([
            'user_id' => $member->id,
            'membership_type' => 'Annual',
            'status' => 'active',
            'amount' => 4000,
        ]);

        // ==========================================
        // 5. CREATE WORKOUT PROGRAMS
        // ==========================================

        $programs = WorkoutProgram::factory(10)->create();

        // ==========================================
        // 6. CREATE EXERCISES
        // ==========================================

        foreach ($programs as $program) {
            Exercise::factory(3)->create([
                'workout_program_id' => $program->id,
            ]);
        }
    }
}