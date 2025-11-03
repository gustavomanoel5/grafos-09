import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permite acesso externo (necessário no Docker)
    port: 3030, // Porta que o Docker está expondo
    strictPort: true,
    watch: {
      usePolling: true, // Necessário para hot reload funcionar via Docker
    },
  },
});
