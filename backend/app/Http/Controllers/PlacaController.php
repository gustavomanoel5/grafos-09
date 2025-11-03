<?php

namespace App\Http\Controllers;

use App\Models\Placa;
use Illuminate\Http\Request;

class PlacaController extends Controller
{
    /**
     * Lista todas as placas com seus modelos e filamentos.
     */
    public function index()
    {
        $placas = Placa::with(['modelo', 'filamento'])->get();
        return response()->json($placas);
    }

    /**
     * Cria uma nova placa.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_modelo' => 'required|exists:modelo,id_modelo',
            'id_filamento' => 'required|exists:filamento,id_filamento',
            'status' => 'required|string|max:50',
            'tempo_estimado' => 'required|numeric',
            'arquivo' => 'nullable|string|max:255',
        ]);

        $placa = Placa::create($validated);

        return response()->json($placa, 201);
    }

    /**
     * Exibe uma placa específica.
     */
    public function show($id)
    {
        $placa = Placa::with(['modelo', 'filamento'])->findOrFail($id);
        return response()->json($placa);
    }

    /**
     * Atualiza uma placa existente.
     */
    public function update(Request $request, $id)
    {
        $placa = Placa::findOrFail($id);

        $validated = $request->validate([
            'id_modelo' => 'sometimes|exists:modelo,id_modelo',
            'id_filamento' => 'sometimes|exists:filamento,id_filamento',
            'status' => 'sometimes|string|max:50',
            'tempo_estimado' => 'sometimes|numeric',
            'arquivo' => 'nullable|string|max:255',
        ]);

        $placa->update($validated);

        return response()->json($placa);
    }

    /**
     * Remove uma placa.
     */
    public function destroy($id)
    {
        $placa = Placa::findOrFail($id);
        $placa->delete();

        return response()->json(['message' => 'Placa excluída com sucesso.']);
    }
}
