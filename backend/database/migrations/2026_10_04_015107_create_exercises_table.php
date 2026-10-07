<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workout_program_id')
                  ->constrained('workout_programs')
                  ->cascadeOnDelete();

            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('sets');
            $table->integer('reps');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};