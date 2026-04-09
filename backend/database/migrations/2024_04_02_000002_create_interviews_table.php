<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->string('interviewee_name');
            $table->string('current_role')->nullable();
            $table->string('organization')->nullable();
            $table->string('client_type')->nullable(); // Usuario Final, Pagador, Decisor, Influenciador, Experto
            $table->boolean('validates_hypothesis')->default(false);
            $table->date('date');
            $table->string('location')->nullable();
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
