<?php

namespace App\Http\Controllers;

use App\Models\Impressora;
use Illuminate\Http\Request;

class ImpressoraController extends Controller
{
    /**
     * Retorna todas as impressoras com seus respectivos filamentos.
     */
    public function index()
    {
        $impressoras = Impressora::with('filamento')->get();
        return response()->json($impressoras);
    }

    /**
     * Cria uma nova impressora.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100',
            'status' => 'required|string|max:50',
            'velocidade' => 'required|numeric',
            'id_filamento' => 'required|exists:filamento,id_filamento',
            'tempo_troca_filamento' => 'required|integer',
            'modelo' => 'required|string|max:100',
        ]);

        $impressora = Impressora::create($validated);
        $impressora->load('filamento');

        return response()->json($impressora, 201);
    }

    /**
     * Mostra uma impressora específica com seu filamento.
     */
    public function show($id)
    {
        $impressora = Impressora::with('filamento')->find($id);

        if (!$impressora) {
            return response()->json(['message' => 'Impressora não encontrada'], 404);
        }

        return response()->json($impressora);
    }

    /**
     * Atualiza uma impressora existente.
     */
    public function update(Request $request, $id)
    {
        $impressora = Impressora::find($id);

        if (!$impressora) {
            return response()->json(['message' => 'Impressora não encontrada'], 404);
        }

        $validated = $request->validate([
            'nome' => 'string|max:100',
            'status' => 'string|max:50',
            'velocidade' => 'numeric',
            'id_filamento' => 'exists:filamento,id_filamento',
            'tempo_troca_filamento' => 'integer',
            'modelo' => 'string|max:100',
        ]);

        $impressora->update($validated);
        $impressora->load('filamento');

        return response()->json($impressora);
    }

    /**
     * Remove uma impressora.
     */
    public function destroy($id)
    {
        $impressora = Impressora::find($id);

        if (!$impressora) {
            return response()->json(['message' => 'Impressora não encontrada'], 404);
        }

        $impressora->delete();

        return response()->json(['message' => 'Impressora excluída com sucesso']);
    }
}
