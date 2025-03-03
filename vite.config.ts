import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
//   server: {
//     host: '10.56.8.125', // This allows access via any network IP, use your specific IP if needed
//     port: 5173,       // You can change this to any port you prefer
//     open: true,       // Automatically open the app in the browser
//   },
});
