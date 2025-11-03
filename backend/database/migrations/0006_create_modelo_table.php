<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria a tabela 'modelo'.
     */
    public function up(): void
    {
        Schema::create('modelo', function (Blueprint $table) {
            $table->id('id_modelo');
            $table->string('nome', 100);
            $table->timestamps();
        });
    }

    /**
     * Remove a tabela 'modelo' se existir.
     */
    public function down(): void
    {
        Schema::dropIfExists('modelo');
    }
};
