<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanoProducao extends Model
{
    use HasFactory;

    protected $table = 'plano_producao';
    protected $primaryKey = 'id_plano_producao';
    protected $keyType = 'int';

    protected $fillable = [
        'nome',
        'data',
        'algoritmo',
        'makespan',
    ];

    public $timestamps = false; // ✅ manter consistente com o resto

    // 🔗 Relacionamentos
    public function tarefas()
    {
        return $this->hasMany(Tarefas::class, 'id_plano_producao', 'id_plano_producao');
    }
}
