export interface BitPayLogger {
  logRequest(method: string, endpoint: string, json: string | null): void;

  logResponse(method: string, endpoint: string, json: string): void;

  logError(message: string): void;
}
