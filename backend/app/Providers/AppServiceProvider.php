<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\PlanoProducao;
use App\Observers\PlanoProducaoObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot()
    {
        PlanoProducao::observe(PlanoProducaoObserver::class);
    }
}
