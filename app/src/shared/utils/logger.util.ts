import { Service } from 'typedi';

@Service()
export class LoggerService {
 log(message: any) {
  console.log(`[${new Date().toISOString()}]`, message);
 }

 logRequest(method: string, path: string, body?: any) {
  console.log(
   `[${new Date().toISOString()}] 🟢 Incoming ${method} request to ${path}`,
   body ? `with payload: ${JSON.stringify(body)}` : ''
  );
 }

 logResponse(
  method: string,
  path: string,
  statusCode: number,
  duration: number
 ) {
  console.log(
   `[${new Date().toISOString()}] ✅ Completed ${method} ${path} with status ${statusCode} in ${duration}ms`
  );
 }

 logError(method: string, path: string, error: any) {
  console.error(
   `[${new Date().toISOString()}] 🔴 Error in ${method} ${path}:`,
   {
    message: error.message,
    stack: error.stack,
    code: error.httpCode || 500,
    details: error.details || error,
   }
  );
 }
}
