<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modelo;

class ModeloSeeder extends Seeder
{
    public function run(): void
    {
        $modelos = [
            'Suporte para Celular',
            'Engrenagem de Precisão',
            'Caixa de Projeto Arduino',
            'Miniatura de Carro',
            'Chaveiro Personalizado',
            'Base de Impressora 3D',
            'Peça de Drone',
            'Porta Canetas',
            'Tampa de Garrafa Custom',
            'Suporte para GoPro',
        ];

        foreach ($modelos as $nome) {
            Modelo::create(['nome' => $nome]);
        }
    }
}
