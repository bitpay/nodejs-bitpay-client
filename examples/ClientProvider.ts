import {Client} from "../src";

export class ClientProvider {
  static create(): Client {
    return Client.createClientByConfig('someConfigFile');
  }

  static createPos(): Client {
    return Client.createPosClient('somePosToken');
  }
}