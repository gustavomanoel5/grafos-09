<?php

namespace App\Http\Controllers;

use App\Models\PlanoProducao;
use Illuminate\Http\Request;

class PlanoProducaoController extends Controller
{
    /**
     * Retorna todos os planos de produção.
     */
    public function index()
    {
        return response()->json(PlanoProducao::all());
    }

    /**
     * Cria um novo plano de produção.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100',
            'data' => 'required|date',
            'algoritmo' => 'required|string|max:100',
            'makespan' => 'required|numeric',
        ]);

        $plano = PlanoProducao::create($validated);

        return response()->json($plano, 201);
    }

    /**
     * Exibe um plano de produção específico.
     */
    public function show($id)
    {
        $plano = PlanoProducao::find($id);

        if (!$plano) {
            return response()->json(['message' => 'Plano de produção não encontrado'], 404);
        }

        return response()->json($plano);
    }

    /**
     * Atualiza um plano de produção existente.
     */
    public function update(Request $request, $id)
    {
        $plano = PlanoProducao::find($id);

        if (!$plano) {
            return response()->json(['message' => 'Plano de produção não encontrado'], 404);
        }

        $validated = $request->validate([
            'nome' => 'string|max:100',
            'data' => 'date',
            'algoritmo' => 'string|max:100',
            'makespan' => 'numeric',
        ]);

        $plano->update($validated);

        return response()->json($plano);
    }

    /**
     * Remove um plano de produção.
     */
    public function destroy($id)
    {
        $plano = PlanoProducao::find($id);

        if (!$plano) {
            return response()->json(['message' => 'Plano de produção não encontrado'], 404);
        }

        $plano->delete();

        return response()->json(['message' => 'Plano de produção excluído com sucesso']);
    }
}
