<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedido';
    protected $primaryKey = 'id_pedido';

    protected $fillable = [
        'cliente',
        'data_pedido',
        'prioridade',
        'prazo_entrega',
        'id_modelo',
    ];

    // Pedido pertence a um modelo
    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'id_modelo', 'id_modelo');
    }
}
