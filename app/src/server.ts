import 'reflect-metadata';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { env } from './config/env.config';
import { App } from './app';

async function bootstrap() {
 try {
  const app = new App();
  const port = env.port;

  const server = await app.start().then(() => {
   return app.app.listen(port, () => {
    console.log(`Server running on port ${port}`);
   });
  });

  const signals = ['SIGTERM', 'SIGINT'];

  for (const signal of signals) {
   process.on(signal, async () => {
    console.log(`${signal} received. Starting graceful shutdown...`);

    // Close express server
    server.close(() => {
     console.log('HTTP server closed');
    });

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');

    // Allow some time for cleanup
    setTimeout(() => {
     console.log('Graceful shutdown completed');
     process.exit(0);
    }, 1000);
   });
  }
 } catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
 }
}

bootstrap();
