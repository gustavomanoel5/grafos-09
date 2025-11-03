<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filamento extends Model
{
    use HasFactory;

    // Nome da tabela (como é singular)
    protected $table = 'filamento';

    // Nome da chave primária
    protected $primaryKey = 'id_filamento';

    // Tipo da chave primária
    protected $keyType = 'int';

    // Campos que podem ser preenchidos via create() ou update()
    protected $fillable = [
        'nome',
        'tempo_troca',
        'tipo_material',
        'cor_hex',
    ];

    // Caso não use timestamps, descomente a linha abaixo:
    // public $timestamps = false;
}
