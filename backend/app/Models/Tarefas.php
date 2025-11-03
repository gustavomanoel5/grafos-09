<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarefas extends Model
{
    use HasFactory;

    protected $table = 'tarefas';
    protected $primaryKey = 'id_tarefa'; // ✅ Corrigido

    protected $fillable = [
        'id_plano_producao',
        'id_placa',
        'id_impressora',
        'hora_inicio',
        'hora_fim',
        'ordem', // ✅ importante manter se o controller usa
    ];

    public $timestamps = false;

    // 🔗 Relacionamentos
    public function planoProducao()
    {
        return $this->belongsTo(PlanoProducao::class, 'id_plano_producao', 'id_plano_producao');
    }

    public function placa()
    {
        return $this->belongsTo(Placa::class, 'id_placa', 'id_placa');
    }

    public function impressora()
    {
        return $this->belongsTo(Impressora::class, 'id_impressora', 'id_impressora');
    }
}
