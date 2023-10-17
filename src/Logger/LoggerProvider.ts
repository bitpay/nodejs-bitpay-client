import { BitPayLogger } from './BitPayLogger';
import { EmptyLogger } from './EmptyLogger';

export class LoggerProvider {
  private static logger: BitPayLogger | null = null;

  private constructor() {}

  public static getLogger(): BitPayLogger {
    if (LoggerProvider.logger === null) {
      LoggerProvider.logger = new EmptyLogger();
    }

    return LoggerProvider.logger;
  }

  /**
   * Set BitPayLogger.
   * @param bitPayLogger BitPayLogger
   */
  public static setLogger(bitPayLogger: BitPayLogger) {
    LoggerProvider.logger = bitPayLogger;
  }
}
