<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('execucao', function (Blueprint $table) {
            $table->id('id_execucao');

            // Chaves estrangeiras
            $table->unsignedBigInteger('id_placa');
            $table->unsignedBigInteger('id_plano_producao');
            $table->unsignedBigInteger('id_impressora');

            // Campos principais
            $table->dateTime('hora_inicio')->nullable();
            $table->dateTime('hora_fim')->nullable();
            $table->enum('status_execucao', ['pendente', 'em_progresso', 'concluida', 'falha'])->default('pendente');
            $table->date('data_execucao')->nullable();
            $table->integer('ordem')->nullable();
            $table->decimal('tempo_total', 8, 2)->nullable();
            $table->text('observacao')->nullable();

            $table->timestamps();

            // 🔗 Relações
            $table->foreign('id_placa')->references('id_placa')->on('placa')->onDelete('cascade');
            $table->foreign('id_plano_producao')->references('id_plano_producao')->on('plano_producao')->onDelete('cascade');
            $table->foreign('id_impressora')->references('id_impressora')->on('impressora')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('execucao');
    }
};
