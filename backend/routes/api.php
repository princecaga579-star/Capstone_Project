
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\WorkoutProgramController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\WorkoutLogController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/admin-test', function () {
        return response()->json([
            'message' => 'Welcome, Admin!'
        ]);
    })->middleware('admin');

    Route::get('/members', function () {
        return response()->json(
            User::where('role', 'member')
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get()
        );
    })->middleware('admin');

    Route::get('/memberships', [
        MembershipController::class,
        'index'
    ]);

    Route::get('/memberships/{membership}', [
        MembershipController::class,
        'show'
    ]);

    Route::middleware('admin')->group(function () {

        Route::post('/memberships', [
            MembershipController::class,
            'store'
        ]);

        Route::put('/memberships/{membership}', [
            MembershipController::class,
            'update'
        ]);

        Route::patch('/memberships/{membership}', [
            MembershipController::class,
            'update'
        ]);

        Route::patch('/memberships/{membership}/status', [
            MembershipController::class,
            'updateStatus'
        ]);

        Route::delete('/memberships/{membership}', [
            MembershipController::class,
            'destroy'
        ]);
    });

    Route::get('/workout-programs', [
        WorkoutProgramController::class,
        'index'
    ]);

    Route::get('/workout-programs/{workout_program}', [
        WorkoutProgramController::class,
        'show'
    ]);

    Route::middleware('admin')->group(function () {

        Route::post('/workout-programs', [
            WorkoutProgramController::class,
            'store'
        ]);

        Route::put('/workout-programs/{workout_program}', [
            WorkoutProgramController::class,
            'update'
        ]);

        Route::patch('/workout-programs/{workout_program}', [
            WorkoutProgramController::class,
            'update'
        ]);

        Route::delete('/workout-programs/{workout_program}', [
            WorkoutProgramController::class,
            'destroy'
        ]);
    });

    Route::get('/exercises', [
        ExerciseController::class,
        'index'
    ]);

    Route::get('/exercises/{exercise}', [
        ExerciseController::class,
        'show'
    ]);

    Route::middleware('admin')->group(function () {

        Route::post('/exercises', [
            ExerciseController::class,
            'store'
        ]);

        Route::put('/exercises/{exercise}', [
            ExerciseController::class,
            'update'
        ]);

        Route::patch('/exercises/{exercise}', [
            ExerciseController::class,
            'update'
        ]);

        Route::delete('/exercises/{exercise}', [
            ExerciseController::class,
            'destroy'
        ]);
    });

    Route::get('/workout-logs', [
        WorkoutLogController::class,
        'index'
    ]);

    Route::post('/workout-logs', [
        WorkoutLogController::class,
        'store'
    ]);

    Route::get('/workout-logs/{id}', [
        WorkoutLogController::class,
        'show'
    ]);

    Route::delete('/workout-logs/{id}', [
        WorkoutLogController::class,
        'destroy'
    ]);
});
