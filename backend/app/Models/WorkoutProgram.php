<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'difficulty',
        'duration',
    ];

    public function exercises()
    {
        return $this->hasMany(Exercise::class);
    }
}