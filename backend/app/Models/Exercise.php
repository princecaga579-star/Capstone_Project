<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_program_id',
        'name',
        'description',
        'sets',
        'reps',
    ];

    public function workoutProgram()
    {
        return $this->belongsTo(WorkoutProgram::class);
    }
}