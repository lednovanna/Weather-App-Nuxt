// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: ['~/plugins/pinia.js'],

  css: [
    '@/node_modules/bootstrap/dist/css/bootstrap.min.css'
  ],

  
});
