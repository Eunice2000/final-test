import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { env } from './config/env.config';
import { connectDB } from './config/database.config';
import { LoggerService } from './shared/utils/logger.util';

export class App {
 public app: express.Application;
 constructor() {
  this.app = express();
 }

 async start() {
  try {
   // Connect to MongoDB
   await connectDB();
   console.log('MongoDB Database connected');

   useContainer(Container);
   this.setMiddlewares();
   this.setRoutes();

   console.log('Application fully initialized');
   return this.app;
  } catch (error) {
   console.error('Failed to connect to database:', error);
   throw error;
  }
 }

 private setMiddlewares(): void {
  const logger = Container.get(LoggerService);

  // Add logging middleware
  this.app.use((req, res, next) => {
   const start = Date.now();
   logger.logRequest(req.method, req.path, req.body);

   res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logResponse(req.method, req.path, res.statusCode, duration);
   });

   next();
  });
  this.app.use(express.json());
  this.app.use(express.urlencoded({ extended: true }));
  this.app.use(
   cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
   })
  );
  this.app.use(
   helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
   })
  );

  this.app.use(
   session({
    secret: env.jwt.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
     secure: process.env.NODE_ENV === 'production',
     maxAge: 60000,
    },
   })
  );

  this.app.use(cookieParser());
 }

 private setRoutes(): void {
  useExpressServer(this.app, {
   routePrefix: '/api',
   controllers: [],
   middlewares: [],
   defaultErrorHandler: false,
   validation: true,
  });
 }
}
