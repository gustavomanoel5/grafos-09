<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('impressora', function (Blueprint $table) {
            $table->id('id_impressora');
            $table->string('nome', 100);
            $table->string('status', 50);
            $table->decimal('velocidade', 8, 2);
            $table->integer('tempo_troca_filamento');
            $table->string('modelo', 100);
            $table->unsignedBigInteger('id_filamento');
            $table->timestamps();

            $table->foreign('id_filamento')
                ->references('id_filamento')
                ->on('filamento')
                ->onDelete('cascade');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('impressora');
    }
};
