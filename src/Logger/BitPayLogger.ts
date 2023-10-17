export interface BitPayLogger {
  logRequest(method: string, endpoint: string, json: string);

  logResponse(method: string, endpoint: string, json: string);

  logError(message: string);
}
