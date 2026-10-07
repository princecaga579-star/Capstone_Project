<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkoutProgramRequest;
use App\Http\Requests\UpdateWorkoutProgramRequest;
use App\Http\Resources\WorkoutProgramResource;
use App\Models\WorkoutProgram;
use Illuminate\Http\Request;

class WorkoutProgramController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkoutProgram::with('exercises');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('difficulty', 'like', "%{$search}%");
            });
        }

        // Filter by difficulty
        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        $programs = $query->latest()->paginate(10);

        return WorkoutProgramResource::collection($programs);
    }

    public function store(StoreWorkoutProgramRequest $request)
    {
        $program = WorkoutProgram::create($request->validated());

        return response()->json([
            'message' => 'Workout program created successfully.',
            'program' => new WorkoutProgramResource(
                $program->load('exercises')
            ),
        ], 201);
    }

    public function show(string $id)
    {
        $program = WorkoutProgram::with('exercises')->findOrFail($id);

        return new WorkoutProgramResource($program);
    }

    public function update(
        UpdateWorkoutProgramRequest $request,
        string $id
    ) {
        $program = WorkoutProgram::findOrFail($id);

        $program->update($request->validated());

        return response()->json([
            'message' => 'Workout program updated successfully.',
            'program' => new WorkoutProgramResource(
                $program->load('exercises')
            ),
        ]);
    }

    public function destroy(string $id)
    {
        $program = WorkoutProgram::findOrFail($id);

        $program->delete();

        return response()->json([
            'message' => 'Workout program deleted successfully.',
        ]);
    }
}