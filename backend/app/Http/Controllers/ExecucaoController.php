<?php

namespace App\Http\Controllers;

use App\Models\Execucao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExecucaoController extends Controller
{
    // 🔹 Listar todas as execuções
    public function index()
    {
        $execucoes = Execucao::with(['placa', 'planoProducao', 'impressora'])
            ->orderBy('data_execucao', 'desc')
            ->get();

        return response()->json($execucoes);
    }

    // 🔹 Mostrar uma execução específica
    public function show($id)
    {
        $execucao = Execucao::with(['placa', 'planoProducao', 'impressora'])->find($id);

        if (!$execucao) {
            return response()->json(['error' => 'Execução não encontrada'], 404);
        }

        return response()->json($execucao);
    }

    // 🔹 Criar nova execução
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_placa' => 'required|exists:placa,id_placa',
            'id_plano_producao' => 'required|exists:plano_producao,id_plano_producao',
            'id_impressora' => 'required|exists:impressora,id_impressora',
            'hora_inicio' => 'nullable|date',
            'hora_fim' => 'nullable|date|after_or_equal:hora_inicio',
            'status_execucao' => 'required|in:pendente,em_progresso,concluida,falha',
            'data_execucao' => 'nullable|date',
            'ordem' => 'nullable|integer',
            'tempo_total' => 'nullable|numeric',
            'observacao' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $execucao = Execucao::create($request->all());

        return response()->json($execucao, 201);
    }

    // 🔹 Atualizar execução
    public function update(Request $request, $id)
    {
        $execucao = Execucao::find($id);
        if (!$execucao) {
            return response()->json(['error' => 'Execução não encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'hora_inicio' => 'nullable|date',
            'hora_fim' => 'nullable|date|after_or_equal:hora_inicio',
            'status_execucao' => 'nullable|in:pendente,em_progresso,concluida,falha',
            'data_execucao' => 'nullable|date',
            'ordem' => 'nullable|integer',
            'tempo_total' => 'nullable|numeric',
            'observacao' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $execucao->update($request->all());

        return response()->json($execucao);
    }

    // 🔹 Excluir execução
    public function destroy($id)
    {
        $execucao = Execucao::find($id);
        if (!$execucao) {
            return response()->json(['error' => 'Execução não encontrada'], 404);
        }

        $execucao->delete();
        return response()->json(['message' => 'Execução removida com sucesso']);
    }
}
