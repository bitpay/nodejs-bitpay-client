const fs = require('fs');
const request = require('request');
const BitPaySDK = require('../src/index');

let privateKeyPath = '../secure/private_key.key';

let keyPair;
let ecKey;

const MY_PRIVATE_KEY = Buffer.from(
    '81cc183fe31e318337f885f0d7058a615855f5e930f25dc1510c4283a52a823f'
);


let keyUtils = new BitPaySDK.KeyUtils();
try {
  if(fs.existsSync(privateKeyPath)) {
    ecKey = keyUtils.load_keypair(fs.readFileSync(privateKeyPath).toString().trim());
    let key1 = keyUtils.load_keypair(MY_PRIVATE_KEY);

    let exp1 = ecKey.getPrivate("hex");
    let exp2 = key1.getPrivate("hex");
    let exp3 = keyUtils.getPublicKeyFromPrivateKey(ecKey.getPrivate());

    let sinecKey = keyUtils.get_sin_from_key(ecKey);
    let sinkey1 = keyUtils.get_sin_from_key(key1);


    console.log('Loaded Private Key: ' + ecKey.getPrivate("hex"));
    console.log('With Public Key: ' + keyUtils.getPublicKeyFromPrivateKey(ecKey));
    console.log('From: ' + privateKeyPath);
  }
  else {
    keyPair = keyUtils.generate_keypair();
    ecKey = keyUtils.load_keypair(keyPair);
    fs.writeFile(privateKeyPath, ecKey.getPrivate("hex"), { mode: 0o755 }, function (err) {
      if (err) throw err;
      console.log('Generated Private Key: ' + ecKey.getPrivate("hex"));
      console.log('With Public Key: ' + ecKey.getPublic("hex"));
      console.log('And saved in file: ' + privateKeyPath);
    });
  }

  let resourceUrl = 'https://test.bitpay.com/tokens';
  let facade = 'merchant';
  let sin = keyUtils.get_sin_from_key(ecKey);
  let postData = {id: sin,facade: facade};
  let headers = {
    "x-accept-version": "2.0.0",
    "Content-type": "application/json"
  };
  let options = {
    url: resourceUrl,
    method: 'POST',
    body: postData,
    headers: headers,
    json: true
  };

  request(options, function (error, response, body) {
    console.log(body);
  });
}
catch (error) {
  console.error(error);
}
