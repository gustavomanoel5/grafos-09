<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarefas', function (Blueprint $table) {
            $table->id('id_tarefa'); // ✅ singular para combinar com o Model

            // Relacionamentos
            $table->unsignedBigInteger('id_plano_producao');
            $table->unsignedBigInteger('id_placa');
            $table->unsignedBigInteger('id_impressora');

            // Campos adicionais
            $table->dateTime('hora_inicio')->nullable();
            $table->dateTime('hora_fim')->nullable();
            $table->integer('ordem')->default(1); // ✅ evita erro 1364 (sem valor default)

            // Chaves estrangeiras
            $table->foreign('id_plano_producao')
                ->references('id_plano_producao')
                ->on('plano_producao')
                ->onDelete('cascade');

            $table->foreign('id_placa')
                ->references('id_placa')
                ->on('placa')
                ->onDelete('cascade');

            $table->foreign('id_impressora')
                ->references('id_impressora')
                ->on('impressora')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarefas');
    }
};
