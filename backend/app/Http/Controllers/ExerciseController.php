<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExerciseRequest;
use App\Http\Requests\UpdateExerciseRequest;
use App\Http\Resources\ExerciseResource;
use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $query = Exercise::with('workoutProgram');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('name', 'like', "%{$search}%");
        }

        // Filter by workout program
        if ($request->filled('workout_program_id')) {
            $query->where(
                'workout_program_id',
                $request->workout_program_id
            );
        }

        $exercises = $query->latest()->paginate(10);

        return ExerciseResource::collection($exercises);
    }

    public function store(StoreExerciseRequest $request)
    {
        $exercise = Exercise::create($request->validated());

        return response()->json([
            'message' => 'Exercise created successfully.',
            'exercise' => new ExerciseResource(
                $exercise->load('workoutProgram')
            ),
        ], 201);
    }

    public function show(string $id)
    {
        $exercise = Exercise::with('workoutProgram')->findOrFail($id);

        return new ExerciseResource($exercise);
    }

    public function update(
        UpdateExerciseRequest $request,
        string $id
    ) {
        $exercise = Exercise::findOrFail($id);

        $exercise->update($request->validated());

        return response()->json([
            'message' => 'Exercise updated successfully.',
            'exercise' => new ExerciseResource(
                $exercise->load('workoutProgram')
            ),
        ]);
    }

    public function destroy(string $id)
    {
        $exercise = Exercise::findOrFail($id);

        $exercise->delete();

        return response()->json([
            'message' => 'Exercise deleted successfully.',
        ]);
    }
}