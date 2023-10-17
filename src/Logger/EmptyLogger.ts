import { BitPayLogger } from './BitPayLogger';

/* eslint @typescript-eslint/no-unused-vars: "off" */

export class EmptyLogger implements BitPayLogger {
  logError(message: string) {}

  logRequest(method: string, endpoint: string, json: string) {}

  logResponse(method: string, endpoint: string, json: string) {}
}
