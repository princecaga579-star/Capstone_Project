<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkoutLogRequest;
use App\Models\WorkoutLog;
use Illuminate\Http\Request;

class WorkoutLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = WorkoutLog::with([
            'exercise.workoutProgram',
        ]);

        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        $logs = $query
            ->latest('logged_at')
            ->paginate(10);

        return response()->json($logs);
    }

    public function store(StoreWorkoutLogRequest $request)
    {
        $workoutLog = WorkoutLog::create([
            'user_id' => $request->user()->id,
            'exercise_id' => $request->validated()['exercise_id'],
            'sets_completed' => $request->validated()['sets_completed'],
            'reps_completed' => $request->validated()['reps_completed'],
            'weight' => $request->validated()['weight'],
            'logged_at' => $request->validated()['logged_at'],
        ]);

        $workoutLog->load([
            'exercise.workoutProgram',
        ]);

        return response()->json([
            'message' => 'Workout log created successfully.',
            'workout_log' => $workoutLog,
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();

        $query = WorkoutLog::with([
            'exercise.workoutProgram',
        ]);

        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        $workoutLog = $query->findOrFail($id);

        return response()->json([
            'workout_log' => $workoutLog,
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $user = $request->user();

        $query = WorkoutLog::query();

        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        $workoutLog = $query->findOrFail($id);

        $workoutLog->delete();

        return response()->json([
            'message' => 'Workout log deleted successfully.',
        ]);
    }
}