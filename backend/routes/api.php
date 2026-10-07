<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\WorkoutProgramController;
use App\Http\Controllers\ExerciseController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Protected API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);


    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);


    // Admin test
    Route::get('/admin-test', function () {
        return response()->json([
            'message' => 'Welcome, Admin!'
        ]);
    })->middleware('admin');


    /*
    |--------------------------------------------------------------------------
    | Membership Routes
    |--------------------------------------------------------------------------
    */

    // Members can view memberships
    Route::get('/memberships', [MembershipController::class, 'index']);
    Route::get('/memberships/{membership}', [MembershipController::class, 'show']);

    // Admin-only membership management
    Route::middleware('admin')->group(function () {

        // Create membership
        Route::post('/memberships', [MembershipController::class, 'store']);

        // Update membership
        Route::put('/memberships/{membership}', [MembershipController::class, 'update']);
        Route::patch('/memberships/{membership}', [MembershipController::class, 'update']);

        // Update membership status
        Route::patch(
            '/memberships/{membership}/status',
            [MembershipController::class, 'updateStatus']
        );

        // Delete membership
        Route::delete('/memberships/{membership}', [MembershipController::class, 'destroy']);
    });


    /*
    |--------------------------------------------------------------------------
    | Workout Program Routes
    |--------------------------------------------------------------------------
    */

    // Members can view workout programs
    Route::get('/workout-programs', [WorkoutProgramController::class, 'index']);
    Route::get('/workout-programs/{workout_program}', [WorkoutProgramController::class, 'show']);

    // Admin-only workout program management
    Route::middleware('admin')->group(function () {

        // Create workout program
        Route::post('/workout-programs', [WorkoutProgramController::class, 'store']);

        // Update workout program
        Route::put('/workout-programs/{workout_program}', [WorkoutProgramController::class, 'update']);
        Route::patch('/workout-programs/{workout_program}', [WorkoutProgramController::class, 'update']);

        // Delete workout program
        Route::delete('/workout-programs/{workout_program}', [WorkoutProgramController::class, 'destroy']);
    });


    /*
    |--------------------------------------------------------------------------
    | Exercise Routes
    |--------------------------------------------------------------------------
    */

    // Members can view exercises
    Route::get('/exercises', [ExerciseController::class, 'index']);
    Route::get('/exercises/{exercise}', [ExerciseController::class, 'show']);

    // Admin-only exercise management
    Route::middleware('admin')->group(function () {

        // Create exercise
        Route::post('/exercises', [ExerciseController::class, 'store']);

        // Update exercise
        Route::put('/exercises/{exercise}', [ExerciseController::class, 'update']);
        Route::patch('/exercises/{exercise}', [ExerciseController::class, 'update']);

        // Delete exercise
        Route::delete('/exercises/{exercise}', [ExerciseController::class, 'destroy']);
    });

});