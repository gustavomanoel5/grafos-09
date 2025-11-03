<?php

namespace App\Http\Controllers;

use App\Models\Modelo;
use Illuminate\Http\Request;

class ModeloController extends Controller
{
    /**
     * Retorna todos os modelos com suas respectivas placas.
     */
    public function index()
    {
        $modelos = Modelo::with('placas.filamento')->get();
        return response()->json($modelos);
    }

    /**
     * Cria um novo modelo.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100',
        ]);

        $modelo = Modelo::create($validated);

        return response()->json($modelo, 201);
    }

    /**
     * Exibe um modelo específico com suas placas.
     */
    public function show($id)
    {
        $modelo = Modelo::with('placas.filamento')->find($id);

        if (!$modelo) {
            return response()->json(['message' => 'Modelo não encontrado'], 404);
        }

        return response()->json($modelo);
    }

    /**
     * Atualiza um modelo existente.
     */
    public function update(Request $request, $id)
    {
        $modelo = Modelo::find($id);

        if (!$modelo) {
            return response()->json(['message' => 'Modelo não encontrado'], 404);
        }

        $validated = $request->validate([
            'nome' => 'sometimes|string|max:100',
        ]);

        $modelo->update($validated);

        return response()->json($modelo);
    }

    /**
     * Remove um modelo.
     */
    public function destroy($id)
    {
        $modelo = Modelo::find($id);

        if (!$modelo) {
            return response()->json(['message' => 'Modelo não encontrado'], 404);
        }

        $modelo->delete();

        return response()->json(['message' => 'Modelo excluído com sucesso']);
    }

    /**
     * Retorna todas as placas vinculadas a um modelo específico.
     */
    public function getPlacasPorModelo($id)
    {
        try {
            $modelo = Modelo::with(['placas.filamento'])->findOrFail($id);
            return response()->json($modelo->placas);
        } catch (\Exception $e) {
            \Log::error("Erro ao buscar placas do modelo ID {$id}: " . $e->getMessage());
            return response()->json(['error' => 'Erro ao buscar placas do modelo'], 500);
        }
    }
}
