// import { BitPayLogger } from './BitPayLogger';
// import * as winston from 'winston';
//
// export class WinstonLoggerExample implements BitPayLogger {
//   private logger: winston.Logger;
//
//   constructor() {
//     this.logger = winston.createLogger({
//       level: 'info',
//       transports: [
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'logs.log' })
//       ]
//     });
//   }
//
//   logRequest(method: string, endpoint: string, json: string) {
//     this.logger.info('Request method:' + method + ' Endpoint: ' + endpoint + ' Json: ' + json);
//   }
//
//   logResponse(method: string, endpoint: string, json: string) {
//     this.logger.info('Response method: ' + method + ' Endpoint: ' + endpoint + ' Json: ' + json);
//   }
//
//   logError(message: string) {
//     this.logger.error(message);
//   }
// }
