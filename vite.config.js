import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/Gemini/",  // Your repository name (ensure it matches your GitHub repo)
});