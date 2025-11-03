<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filamento', function (Blueprint $table) {
            $table->id('id_filamento');
            $table->string('nome', 100);
            $table->integer('tempo_troca');
            $table->string('tipo_material', 50);
            $table->string('cor_hex', 7); // Exemplo: #FF0000
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filamento');
    }
};
