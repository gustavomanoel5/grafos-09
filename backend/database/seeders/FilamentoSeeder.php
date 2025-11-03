<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filamento;

class FilamentoSeeder extends Seeder
{
    public function run(): void
    {
        Filamento::create([
            'nome' => 'PLA Vermelho',
            'tempo_troca' => 5,
            'tipo_material' => 'PLA',
            'cor_hex' => '#FF0000',
        ]);

        Filamento::create([
            'nome' => 'ABS Preto',
            'tempo_troca' => 8,
            'tipo_material' => 'ABS',
            'cor_hex' => '#000000',
        ]);

        Filamento::create([
            'nome' => 'PETG Azul',
            'tempo_troca' => 6,
            'tipo_material' => 'PETG',
            'cor_hex' => '#0000FF',
        ]);

        Filamento::create([
            'nome' => 'TPU Transparente',
            'tempo_troca' => 10,
            'tipo_material' => 'TPU',
            'cor_hex' => '#E0E0E0',
        ]);
    }
}
