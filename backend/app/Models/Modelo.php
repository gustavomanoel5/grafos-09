<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modelo extends Model
{
    use HasFactory;

    protected $table = 'modelo';
    protected $primaryKey = 'id_modelo';

    protected $fillable = ['nome'];

    public function placas()
    {
        return $this->hasMany(Placa::class, 'id_modelo', 'id_modelo');
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'id_modelo', 'id_modelo');
    }
}
