<?php

namespace App\Services;

use App\Models\Placa;
use App\Models\Impressora;
use App\Models\Tarefas;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class LPTService
{
    protected $plano;

    public function __construct($plano)
    {
        $this->plano = $plano;
    }

    public function executar()
    {
        Log::info('🧠 Iniciando algoritmo LPT', ['plano_id' => $this->plano->id_plano_producao ?? null]);

        DB::transaction(function () {
            // 1️⃣ Carregar dados
            $placas = Placa::where('status', 'aguardando')->get();
            $impressoras = Impressora::all();

            Log::info('📦 Dados carregados', [
                'placas_aguardando' => $placas->count(),
                'impressoras_totais' => $impressoras->count(),
            ]);

            // 2️⃣ Agrupar por filamento
            $grupos = $placas->groupBy('id_filamento');
            Log::info('🎨 Grupos de placas por filamento criados', [
                'total_grupos' => $grupos->count(),
                'ids_filamento' => $grupos->keys(),
            ]);

            // 3️⃣ Processar cada grupo (cor)
            foreach ($grupos as $idFilamento => $placasGrupo) {
                Log::info('🧩 Processando grupo de filamento', [
                    'id_filamento' => $idFilamento,
                    'qtd_placas' => $placasGrupo->count(),
                ]);

                $impressorasCompat = $impressoras->where('id_filamento', $idFilamento);

                if ($impressorasCompat->isEmpty()) {
                    Log::warning('⚠️ Nenhuma impressora compatível encontrada', [
                        'id_filamento' => $idFilamento,
                    ]);
                    continue;
                }

                Log::info('⚙️ Impressoras compatíveis', [
                    'id_filamento' => $idFilamento,
                    'qtd_impressoras' => $impressorasCompat->count(),
                ]);

                // 4️⃣ Ordenar placas por tempo estimado (desc)
                $placasOrdenadas = $placasGrupo->sortByDesc('tempo_estimado');
                Log::info('📋 Placas ordenadas por tempo estimado', [
                    'tempos' => $placasOrdenadas->pluck('tempo_estimado'),
                ]);

                // Inicializa carga (load) de cada impressora
                $cargas = $impressorasCompat->mapWithKeys(fn($i) => [$i->id_impressora => 0]);

                // Define data base (início do plano)
                $dataBase = $this->plano->data ?? now();

                // 5️⃣ Distribuir (LPT)
                foreach ($placasOrdenadas as $placa) {
                    $idImpressoraMenorCarga = $cargas->sort()->keys()->first();
                    $inicio = $cargas[$idImpressoraMenorCarga];
                    $fim = $inicio + $placa->tempo_estimado;

                    // Converte para datetime real
                    $horaInicio = Carbon::parse($dataBase)->addHours($inicio)->format('Y-m-d H:i:s');
                    $horaFim = Carbon::parse($dataBase)->addHours($fim)->format('Y-m-d H:i:s');

                    Log::info('🧮 Atribuindo placa', [
                        'placa_id' => $placa->id_placa,
                        'id_filamento' => $idFilamento,
                        'tempo_estimado' => $placa->tempo_estimado,
                        'impressora_escolhida' => $idImpressoraMenorCarga,
                        'hora_inicio' => $horaInicio,
                        'hora_fim' => $horaFim,
                    ]);

                    // Criar tarefa
                    Tarefas::create([
                        'id_plano_producao' => $this->plano->id_plano_producao,
                        'id_placa' => $placa->id_placa,
                        'id_impressora' => $idImpressoraMenorCarga,
                        'hora_inicio' => $horaInicio,
                        'hora_fim' => $horaFim,
                    ]);

                    // Atualiza carga e status da placa
                    $cargas[$idImpressoraMenorCarga] = $fim;
                    $placa->update(['status' => 'planejada']);
                }

                Log::info('✅ Grupo finalizado', [
                    'id_filamento' => $idFilamento,
                    'cargas_finais' => $cargas,
                ]);
            }

            // 7️⃣ Atualizar makespan (maior tempo total entre impressoras)
            if (isset($cargas) && $cargas->count() > 0) {
                $makespan = $cargas->max();
                $this->plano->update(['makespan' => $makespan]);
                Log::info('🏁 Algoritmo finalizado com sucesso', ['makespan' => $makespan]);
            } else {
                Log::warning('⚠️ Nenhuma tarefa criada — talvez não havia placas aguardando');
            }
        });
    }
}
