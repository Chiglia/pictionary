import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'rules',
        loadComponent: () => import('./pages/rules/rules').then(m => m.Rules)
    },
    {
        path: 'play',
        loadComponent: () => import('./pages/game/game').then(m => m.Game)
    },
    {
        path: '',
        redirectTo: localStorage.getItem('pictionary_view') === 'play' ? 'play' : 'rules',
        pathMatch: 'full'
    }
];
