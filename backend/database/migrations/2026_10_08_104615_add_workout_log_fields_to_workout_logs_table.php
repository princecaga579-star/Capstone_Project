<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workout_logs', function (Blueprint $table) {
            $table->foreignId('exercise_id')
                ->after('user_id')
                ->constrained('exercises')
                ->cascadeOnDelete();

            $table->integer('sets_completed')
                ->after('exercise_id');

            $table->integer('reps_completed')
                ->after('sets_completed');

            $table->decimal('weight', 8, 2)
                ->after('reps_completed');

            $table->dateTime('logged_at')
                ->after('weight');
        });
    }

    public function down(): void
    {
        Schema::table('workout_logs', function (Blueprint $table) {
            $table->dropForeign(['exercise_id']);
            $table->dropColumn([
                'exercise_id',
                'sets_completed',
                'reps_completed',
                'weight',
                'logged_at',
            ]);
        });
    }
};