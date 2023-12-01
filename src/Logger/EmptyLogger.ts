import { BitPayLogger } from './BitPayLogger';

/* eslint @typescript-eslint/no-unused-vars: "off" */

export class EmptyLogger implements BitPayLogger {
  logError(message: string): void {}

  logRequest(method: string, endpoint: string, json: string | null): void {}

  logResponse(method: string, endpoint: string, json: string): void {}
}
