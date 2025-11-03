<?php

namespace App\Http\Controllers;

use App\Models\Filamento;
use Illuminate\Http\Request;

class FilamentoController extends Controller
{
    /**
     * Retorna todos os filamentos.
     */
    public function index()
    {
        return response()->json(Filamento::all());
    }

    /**
     * Cria um novo filamento.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100',
            'tempo_troca' => 'required|numeric',
            'tipo_material' => 'required|string|max:50',
            'cor_hex' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $filamento = Filamento::create($validated);

        return response()->json($filamento, 201);
    }

    /**
     * Exibe um filamento específico.
     */
    public function show($id)
    {
        $filamento = Filamento::find($id);

        if (!$filamento) {
            return response()->json(['message' => 'Filamento não encontrado'], 404);
        }

        return response()->json($filamento);
    }

    /**
     * Atualiza um filamento existente.
     */
    public function update(Request $request, $id)
    {
        $filamento = Filamento::find($id);

        if (!$filamento) {
            return response()->json(['message' => 'Filamento não encontrado'], 404);
        }

        $validated = $request->validate([
            'nome' => 'string|max:100',
            'tempo_troca' => 'numeric',
            'tipo_material' => 'string|max:50',
            'cor_hex' => ['regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $filamento->update($validated);

        return response()->json($filamento);
    }

    /**
     * Remove um filamento.
     */
    public function destroy($id)
    {
        $filamento = Filamento::find($id);

        if (!$filamento) {
            return response()->json(['message' => 'Filamento não encontrado'], 404);
        }

        $filamento->delete();

        return response()->json(['message' => 'Filamento excluído com sucesso']);
    }
}
