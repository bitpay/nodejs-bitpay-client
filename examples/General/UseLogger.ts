import {LoggerProvider} from "../../src/Logger/LoggerProvider";
import {BitPayLogger} from "../../src/Logger/BitPayLogger";

class UseLogger {
  public execute(): void {
    const logger: BitPayLogger = {
      logError(message: string): void {
        console.log(message);
      },

      logRequest(method: string, endpoint: string, json: string | null): void {
        console.log(method + ' ' + endpoint + ' ' + json)
      },

      logResponse(method: string, endpoint: string, json: string): void {
        console.log(method + ' ' + endpoint + ' ' + json)
      }
    }

    LoggerProvider.setLogger(logger);
  }
}