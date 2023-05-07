import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.spec.ts",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env:{
    base_url_api: 'http://localhost:3002/api/todoItems/',
    base_url_ui:'http://localhost:3000'
  }
});
