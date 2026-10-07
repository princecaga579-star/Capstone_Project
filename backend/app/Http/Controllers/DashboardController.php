<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Membership;
use App\Models\WorkoutProgram;
use App\Models\Exercise;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_members' => User::where('role', 'member')->count(),
            'total_memberships' => Membership::count(),
            'total_workout_programs' => WorkoutProgram::count(),
            'total_exercises' => Exercise::count(),
        ]);
    }
}