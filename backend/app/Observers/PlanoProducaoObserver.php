<?php

namespace App\Observers;

use App\Models\PlanoProducao;
use App\Services\LPTService;
use Illuminate\Support\Facades\Log;

class PlanoProducaoObserver
{
    public function saved(PlanoProducao $plano)
    {
        try {
            Log::info("🧠 Iniciando algoritmo LPT para o plano #{$plano->id_plano_producao}");

            if (!$plano->id_plano_producao) {
                Log::warning("⚠️ O plano ainda não possui ID, ignorando execução do LPT.");
                return;
            }

            $service = new LPTService($plano);
            $service->executar();

            Log::info("✅ Plano #{$plano->id_plano_producao} processado com sucesso.");
        } catch (\Exception $e) {
            Log::error("❌ Erro ao gerar plano #{$plano->id_plano_producao}: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}
