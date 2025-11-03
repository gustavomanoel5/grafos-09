<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Impressora extends Model
{
    use HasFactory;

    protected $table = 'impressora';
    protected $primaryKey = 'id_impressora';

    protected $fillable = [
        'nome',
        'status',
        'velocidade',
        'id_filamento',
        'tempo_troca_filamento',
        'modelo',
    ];

    public $timestamps = false; // ✅ mantém consistência com os outros models

    // 🔗 Relacionamento
    public function filamento()
    {
        return $this->belongsTo(Filamento::class, 'id_filamento', 'id_filamento');
    }
}
