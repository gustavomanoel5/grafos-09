<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Execucao extends Model
{
    use HasFactory;

    protected $table = 'execucao';
    protected $primaryKey = 'id_execucao';

    protected $fillable = [
        'id_placa',
        'id_plano_producao',
        'id_impressora',
        'hora_inicio',
        'hora_fim',
        'status_execucao',
        'data_execucao',
        'ordem',
        'tempo_total',
        'observacao',
    ];

    // 🔗 Relacionamentos
    public function placa()
    {
        return $this->belongsTo(Placa::class, 'id_placa', 'id_placa');
    }

    public function planoProducao()
    {
        return $this->belongsTo(PlanoProducao::class, 'id_plano_producao', 'id_plano_producao');
    }

    public function impressora()
    {
        return $this->belongsTo(Impressora::class, 'id_impressora', 'id_impressora');
    }
}
