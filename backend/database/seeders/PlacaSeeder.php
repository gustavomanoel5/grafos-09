<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Placa;

class PlacaSeeder extends Seeder
{
    public function run(): void
    {
        // Gerar 100 placas com variações
        for ($i = 1; $i <= 100; $i++) {
            Placa::create([
                'id_modelo' => rand(1, 10), // cada placa pertence a um modelo aleatório
                'status' => 'aguardando',
                'tempo_estimado' => rand(30, 240), // tempo entre 30 e 240 minutos
                'id_filamento' => rand(1, 4), // usa um dos 4 filamentos
                'arquivo' => "https://example.com/arquivo_" . $i . ".stl",
            ]);
        }
    }
}
