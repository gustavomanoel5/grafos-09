<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\PlanoProducaoController;
use App\Http\Controllers\ImpressoraController;
use App\Http\Controllers\FilamentoController;
use App\Http\Controllers\ModeloController;
use App\Http\Controllers\PlacaController;
use App\Http\Controllers\TarefasController;
use App\Http\Controllers\ExecucaoController;


// Rota de teste mínima
Route::get('/teste', function () {
    return response()->json(['message' => 'API funcionando!']);
});

// Rotas API reais
Route::apiResource('pedido', PedidoController::class);
Route::apiResource('plano-producao', PlanoProducaoController::class);
Route::apiResource('impressora', ImpressoraController::class);
Route::apiResource('filamento', FilamentoController::class);
Route::apiResource('modelo', ModeloController::class);
Route::apiResource('placa', PlacaController::class);
Route::apiResource('tarefas', TarefasController::class);
Route::apiResource('execucao', ExecucaoController::class);

Route::get('/modelo/{id}/placas', [ModeloController::class, 'getPlacasPorModelo']);
Route::get('/tarefas/plano/{idPlano}', [TarefasController::class, 'getByPlano']);
