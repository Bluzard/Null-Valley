# Null Valley - Sistema de Votación de Juegos de Pelea

Sistema simple de votación construido con Nuxt 3 y Vuetify. Demo en vivo: [Null Valley](https://null-valley-sigma.vercel.app/)

## Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/Bluzard/null-valley.git
cd null-valley
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar servidor de desarrollo
```bash
npm run dev
```

## Configuración

`nuxt.config.ts`:
```ts
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    'nuxt-mongoose'
  ],
  mongoose: {
    uri: 'mongodb+srv://admin:admin@clusterjoaco.0liwp.mongodb.net/NullValley?retryWrites=true&w=majority&appName=ClusterJoaco',
    options: {},
    modelsDir: 'models',
    devtools: true,
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: '2024-11-15',
})
```

No es necesario tocar ese archivo.
