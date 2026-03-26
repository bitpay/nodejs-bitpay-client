import { PrivateKey } from '../src/PrivateKey';
import * as BitPaySDK from '../src/index';

let client;
const tokens = new BitPaySDK.TokenContainer();
tokens.addMerchant('D9zgmn4bHmrKcpUY72N28JAKzEEKSF4UpMWdCpWyBKJx');
const privateKey = new PrivateKey('81cc183fe31e318337f885f0d7058a615855f5e930f25dc1510c4283a52a823f');
describe('BitPaySDK.Client', () => {
  beforeAll(() => {
    jest.setTimeout(20000); // browser takes a while
  });

  it('should prepare client', async () => {
    client = new BitPaySDK.Client(null, privateKey, tokens, null);
    expect(client).toBeDefined();
  });
});
