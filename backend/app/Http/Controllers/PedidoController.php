<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    /**
     * Lista todos os pedidos.
     */
    public function index()
    {
        return response()->json(Pedido::with('modelo.placas')->get());
    }

    /**
     * Cria um novo pedido.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente' => 'required|string|max:255',
            'data_pedido' => 'required|date',
            'prioridade' => 'required|string|max:100',
            'prazo_entrega' => 'nullable|date',
            'id_modelo' => 'required|integer|exists:modelo,id_modelo',
        ]);

        $pedido = Pedido::create($validated);

        return response()->json($pedido, 201);
    }

    /**
     * Exibe um pedido específico.
     */
    public function show($id)
    {
        $pedido = Pedido::with('modelo.placas')->findOrFail($id);
        return response()->json($pedido);
    }

    /**
     * Atualiza um pedido.
     */
    public function update(Request $request, $id)
    {
        $pedido = Pedido::findOrFail($id);

        $validated = $request->validate([
            'cliente' => 'sometimes|string|max:255',
            'data_pedido' => 'sometimes|date',
            'prioridade' => 'sometimes|string|max:100',
            'prazo_entrega' => 'nullable|date',
            'id_modelo' => 'sometimes|integer|exists:modelo,id_modelo',
        ]);

        $pedido->update($validated);

        return response()->json($pedido);
    }

    /**
     * Remove um pedido.
     */
    public function destroy($id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->delete();

        return response()->json(['message' => 'Pedido excluído com sucesso.']);
    }
}
