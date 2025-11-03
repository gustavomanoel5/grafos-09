<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Impressora;

class ImpressoraSeeder extends Seeder
{
    public function run(): void
    {
        Impressora::create([
            'nome' => 'Creality Ender 3 V2',
            'status' => 'disponivel',
            'velocidade' => 60,
            'id_filamento' => 1, // PLA Vermelho
            'tempo_troca_filamento' => 5,
            'modelo' => 'Ender 3 V2',
        ]);

        Impressora::create([
            'nome' => 'Prusa i3 MK3S',
            'status' => 'ocupada',
            'velocidade' => 70,
            'id_filamento' => 2, // ABS Preto
            'tempo_troca_filamento' => 6,
            'modelo' => 'MK3S',
        ]);

        Impressora::create([
            'nome' => 'Anycubic Kobra',
            'status' => 'disponivel',
            'velocidade' => 55,
            'id_filamento' => 3, // PETG Azul
            'tempo_troca_filamento' => 4,
            'modelo' => 'Kobra',
        ]);

        Impressora::create([
            'nome' => 'Artillery Sidewinder X2',
            'status' => 'manutencao',
            'velocidade' => 65,
            'id_filamento' => 4, // TPU Transparente
            'tempo_troca_filamento' => 7,
            'modelo' => 'Sidewinder X2',
        ]);
    }
}
