import { ec } from 'elliptic';
import * as fs from 'fs';
import * as readline from 'readline';
import * as BitPaySDK from '../index';

const keyUtils = new BitPaySDK.KeyUtils();
let configFilePath = process.cwd();
let keyPair: ec.KeyPair;
let ecKey: ec.KeyPair;
let environment: string;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let storeFile = true;
let apiUrl: string;
let merchantToken: string;
let merchantPairCode: string;
let payoutToken: string;
let payoutPairCode: string;
let keyPath = '';
let keyPlain = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const main = function () {
  selectEnv();
};
const selectEnv = async () => {
  try {
    console.log('Select target environment:');
    rl.question('Press T for testing or P for production: \n', async (answer) => {
      switch (answer.toLowerCase()) {
        case 't':
          environment = 'Test';
          await setEnv(environment);
          selectCreateKey();
          break;
        case 'p':
          environment = 'Prod';
          await setEnv(environment);
          selectCreateKey();
          break;
        default:
          selectEnv();
      }
    });
  } catch (e) {
    console.log(e);
  }
};
const setEnv = async (env: string) => {
  if (env == 'Test') {
    apiUrl = 'https://test.bitpay.com';
    return;
  }
  apiUrl = 'https://bitpay.com';
};
const selectCreateKey = async () => {
  try {
    rl.question('Press (E) for existing or (N) for new private key: ', async (answer) => {
      switch (answer.toLowerCase()) {
        case 'n':
          await createNewKey();
          break;
        default:
          await loadKey(answer);
          break;
      }
    });
  } catch (e) {
    console.log(e);
  }
};
const createNewKey = async () => {
  try {
    console.log('Generating private key... \n');
    keyPair = keyUtils.generate_keypair();
    ecKey = keyUtils.load_keypair(keyPair);
    await sleep(2000);
    console.log('Generated Private Key: ' + ecKey.getPrivate('hex'));
    console.log('With Public Key: ' + ecKey.getPublic('hex') + '\n');
    await prepareDirectory();
  } catch (e) {
    console.log(e);
  }
};
const loadKey = async (privateKey: string) => {
  try {
    if (fs.existsSync(privateKey)) {
      console.log('Loading private key... \n');
      await sleep(2000);
      ecKey = keyUtils.load_keypair(fs.readFileSync(privateKey).toString().trim());
      console.log('Loaded Private Key: ' + ecKey.getPrivate('hex'));
      console.log('With Public Key: ' + keyUtils.getPublicKeyFromPrivateKey(ecKey));
      console.log('From: ' + privateKey);
      console.log('\n');
      selectTokens();
    } else {
      ecKey = keyUtils.load_keypair(privateKey);
      console.log('Loading private key... \n');
      await sleep(2000);
      console.log('Loaded Private Key: ' + ecKey.getPrivate('hex'));
      console.log('With Public Key: ' + keyUtils.getPublicKeyFromPrivateKey(ecKey));
      console.log('From: ' + privateKey);
      console.log('\n');
      selectTokens();
    }
  } catch (e) {
    console.log(e);
  }
};

const formatDirecotryPath = (dir: string) => {
  if (dir === '' || dir === '.' || dir === '/' || !dir) {
    return process.cwd();
  }

  if (dir && dir.charAt(0) !== '/') {
    return process.cwd() + `/${dir}`;
  } else {
    return process.cwd() + dir;
  }
};

const prepareDirectory = async () => {
  rl.question('Enter the directory for your new private key: ', async (dir) => {
    configFilePath = formatDirecotryPath(dir);

    try {
      if (!fs.existsSync(configFilePath)) {
        console.error(`Directory ${configFilePath} does not exist.`);
        console.log(`Do you want to create ${configFilePath} ?`);
        rl.question(`Press (Y) to create or (N) to cancel process: `, async (answer) => {
          switch (answer.toLowerCase()) {
            case 'n':
              rl.close();
              break;
            default:
              fs.mkdirSync(configFilePath);
              await storeKey();
          }
        });
      } else {
        await storeKey();
      }
    } catch (e) {
      console.log(e);
    }
  });
};

const storeKey = async () => {
  console.log('Select the way you want to store your private key:');
  rl.question('Press F for storing in a text file or T for plain text in your config file: ', async (answer) => {
    switch (answer.toLowerCase()) {
      case 'f':
        storeFile = true;

        if (configFilePath.charAt(configFilePath.length - 1) !== '/') {
          keyPath = configFilePath + '/private_key' + '_' + environment.toLowerCase() + '.key';
        } else {
          keyPath = configFilePath + 'private_key' + '_' + environment.toLowerCase() + '.key';
        }

        console.log('Saving private key... \n');
        sleep(500);
        fs.writeFile(keyPath, ecKey.getPrivate('hex'), { mode: 0o755 }, function (err) {
          if (err) throw err;
          console.log('Private key saved in file: ' + keyPath + '\n');
        });
        await sleep(1000);

        selectTokens();
        break;
      case 't':
        storeFile = false;
        keyPlain = ecKey.getPrivate('hex');
        console.log('Saving private key... \n');
        await sleep(1000);

        selectTokens();
        break;
      default:
        prepareDirectory();
    }
  });
};
const selectTokens = async () => {
  try {
    console.log('Select the tokens that you would like to request:');
    rl.question('Press M for merchant, P for payout, or B for both: \n', async (answer) => {
      switch (answer.toLowerCase()) {
        case 'm':
        case 'p':
        case 'b':
          console.log('Requesting tokens... \n');
          await sleep(500);
          await requestTokens(answer);
          break;
        default:
          selectTokens();
      }
    });
  } catch (e) {
    console.log(e);
  }
};
const requestTokens = async (option: string) => {
  async function requestMerchantToken(options: {
    headers: { 'Content-type': string; 'x-accept-version': string };
    method: string;
    body: { id: string; facade?: string };
    url: string;
  }) {
    console.log('Requesting Merchant token... \n');
    options.body['facade'] = 'merchant';

    let result = await fetch(apiUrl + '/tokens', {
      method: options.method,
      headers: options.headers,
      body: JSON.stringify(options.body)
    })
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.log(e.message);
      });

    result = result.data[0];
    merchantToken = result.token;
    merchantPairCode = result.pairingCode;

    await sleep(2000);
  }

  async function requestPayoutToken(options: {
    headers: { 'Content-type': string; 'x-accept-version': string };
    method: string;
    body: { id: string; facade?: string };
    url: string;
  }) {
    console.log('Requesting Payout token... \n');
    options.body['facade'] = 'payout';

    let result = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: JSON.stringify(options.body)
    })
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.log(e.message);
      });

    result = result.data[0];

    payoutToken = result.token;
    payoutPairCode = result.pairingCode;

    await sleep(2000);
  }

  try {
    let reqMerchant = false;
    let reqPayout = false;
    switch (option.toLowerCase()) {
      case 'm':
        reqMerchant = true;
        reqPayout = false;
        break;
      case 'p':
        reqMerchant = false;
        reqPayout = true;
        break;
      case 'b':
        reqMerchant = true;
        reqPayout = true;
        break;
    }

    const headers = {
      'x-accept-version': '2.0.0',
      'Content-type': 'application/json'
    };
    const options = {
      url: apiUrl + '/tokens',
      method: 'POST',
      body: { id: keyUtils.get_sin_from_key(ecKey) },
      headers: headers
    };

    if (reqMerchant) {
      await requestMerchantToken(options);
    }

    if (reqPayout) {
      await requestPayoutToken(options);
    }

    await updateConfigFile();
  } catch (e) {
    console.log(e);
  }
};
const updateConfigFile = async () => {
  const configurationObject = {
    BitPayConfiguration: {
      Environment: environment,
      EnvConfig: {
        [environment]: {
          PrivateKeyPath: keyPath,
          PrivateKey: keyPlain,
          ApiTokens: {
            merchant: merchantToken,
            payout: payoutToken
          }
        }
      }
    }
  };

  fs.writeFile(configFilePath + '/BitPay.config.json', JSON.stringify(configurationObject, null, 4), function (err) {
    if (err) throw err;
    console.log('Generated configuration file');
    console.log('And saved in file: ' + configFilePath + '/BitPay.config.json' + '\n');
  });
  await sleep(5000);

  console.log('Configuration generated successfully! \n');
  console.log(
    'To complete your setup, Go to ' +
      apiUrl +
      '/dashboard/merchant/api-tokens and pair this client with your merchant account using the pairing codes:'
  );
  if (merchantToken) {
    console.log(merchantPairCode + ' for the Merchant facade.');
  }
  if (payoutToken) {
    console.log(payoutPairCode + ' for the Payout facade ONLY if you have requested access for this role.');
  }

  process.exit();
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main();
