// Simple JS entry point for the tester
import('./src/server.js').catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 