import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';
import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';
import { MessageService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: definePreset(Aura, {
          semantic: {
            primary: palette('{blue}'),
          },
        }),
        options: {
          darkModeSelector: '.my-app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
