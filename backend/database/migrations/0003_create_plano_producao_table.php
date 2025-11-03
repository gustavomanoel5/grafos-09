<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plano_producao', function (Blueprint $table) {
            $table->id('id_plano_producao');
            $table->string('nome', 100);
            $table->date('data');
            $table->string('algoritmo', 100);
            $table->decimal('makespan', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plano_producao');
    }
};
