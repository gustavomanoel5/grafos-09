<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executa a criação da tabela 'placa'.
     */
    public function up(): void
    {
        Schema::create('placa', function (Blueprint $table) {
            $table->id('id_placa');

            // Relacionamentos
            $table->unsignedBigInteger('id_modelo');
            $table->unsignedBigInteger('id_filamento')->nullable();

            // Campos adicionais
            $table->string('status', 50);
            $table->decimal('tempo_estimado', 8, 2)->nullable();
            $table->string('arquivo', 255)->nullable();

            // Chaves estrangeiras
            $table->foreign('id_modelo')
                ->references('id_modelo')
                ->on('modelo')
                ->onDelete('cascade');

            $table->foreign('id_filamento')
                ->references('id_filamento')
                ->on('filamento')
                ->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverte a criação da tabela.
     */
    public function down(): void
    {
        Schema::dropIfExists('placa');
    }
};
