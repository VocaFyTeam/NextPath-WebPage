import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * PrimeVue preset with the NextPath teal brand palette (based on the logo color #0a7f7a).
 */
const NextPathPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#e6f4f3',
            100: '#c2e5e3',
            200: '#93d1ce',
            300: '#5fb9b5',
            400: '#2f9f9a',
            500: '#0a7f7a',
            600: '#08716d',
            700: '#07605c',
            800: '#064e4b',
            900: '#053f3d',
            950: '#03282a'
        }
    }
});

export default NextPathPreset;
