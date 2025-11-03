<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Placa extends Model
{
    use HasFactory;

    protected $table = 'placa';
    protected $primaryKey = 'id_placa';

    protected $fillable = [
        'id_modelo',
        'status',
        'tempo_estimado',
        'id_filamento',
        'arquivo',
    ];

    public $timestamps = false; // ✅ mantém consistência

    // 🔗 Relacionamentos
    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'id_modelo', 'id_modelo');
    }

    public function filamento()
    {
        return $this->belongsTo(Filamento::class, 'id_filamento', 'id_filamento');
    }
}
