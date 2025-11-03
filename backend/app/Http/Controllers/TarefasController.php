<?php

namespace App\Http\Controllers;

use App\Models\Tarefas;
use Illuminate\Http\Request;

class TarefasController extends Controller
{
    /**
     * Lista todas as tarefas com seus relacionamentos.
     */
    public function index()
    {
        $tarefas = Tarefas::with(['planoProducao', 'placa', 'impressora'])->get();
        return response()->json($tarefas);
    }

    /**
     * Cria uma nova tarefa.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_plano_producao' => 'required|exists:plano_producao,id_plano_producao',
            'id_placa' => 'required|exists:placa,id_placa',
            'id_impressora' => 'required|exists:impressora,id_impressora',
            'hora_inicio' => 'nullable|date',
            'hora_fim' => 'nullable|date|after_or_equal:hora_inicio',
            'ordem' => 'required|integer|min:1',
        ]);

        $tarefa = Tarefas::create($validated);
        $tarefa->load(['planoProducao', 'placa', 'impressora']);

        return response()->json($tarefa, 201);
    }

    /**
     * Exibe uma tarefa específica.
     */
    public function show($id)
    {
        $tarefa = Tarefas::with(['planoProducao', 'placa', 'impressora'])->find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa não encontrada'], 404);
        }

        return response()->json($tarefa);
    }

    /**
     * Atualiza uma tarefa existente.
     */
    public function update(Request $request, $id)
    {
        $tarefa = Tarefas::find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa não encontrada'], 404);
        }

        $validated = $request->validate([
            'id_plano_producao' => 'exists:plano_producao,id_plano_producao',
            'id_placa' => 'exists:placa,id_placa',
            'id_impressora' => 'exists:impressora,id_impressora',
            'hora_inicio' => 'nullable|date',
            'hora_fim' => 'nullable|date|after_or_equal:hora_inicio',
            'ordem' => 'integer|min:1',
        ]);

        $tarefa->update($validated);
        $tarefa->load(['planoProducao', 'placa', 'impressora']);

        return response()->json($tarefa);
    }

    /**
     * Remove uma tarefa.
     */
    public function destroy($id)
    {
        $tarefa = Tarefas::find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa não encontrada'], 404);
        }

        $tarefa->delete();

        return response()->json(['message' => 'Tarefa excluída com sucesso']);
    }
    /**
     * Lista todas as tarefas de um determinado plano de produção.
     */
    public function getByPlano($idPlano)
    {
        $tarefas = Tarefas::with(['planoProducao', 'placa', 'impressora'])
            ->where('id_plano_producao', $idPlano)
            ->get();

        if ($tarefas->isEmpty()) {
            return response()->json(['message' => 'Nenhuma tarefa encontrada para este plano'], 404);
        }

        return response()->json($tarefas);
    }
}
