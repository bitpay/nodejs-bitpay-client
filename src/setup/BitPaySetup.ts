const fs = require('fs');
const axios = require('axios').default
const BitPaySDK = require('../index');
const readline = require('readline');

let privateKeyPath = __dirname+'/../secure/private_key';
let ConfFilePath = __dirname+'/../secure/BitPay.config.json';
let keyUtils = new BitPaySDK.KeyUtils();
let keyPair;
let ecKey;
let environment;
let storeFile = true;
let apiUrl;
let merchantToken;
let merchantPairCode;
let payoutToken;
let payoutPairCode;
let keyPath = '';
let keyPlain = '';

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let main = function () {
    selectEnv();
};
let selectEnv = async () => {
    try{
        console.log("Select target environment:");
        rl.question('Press T for testing or P for production: \n', async (answer) => {
            switch(answer.toLowerCase()) {
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
let setEnv = async (env) => {
    if (env == 'Test') {
        apiUrl = 'https://test.bitpay.com';
        return;
    }
    apiUrl = 'https://bitpay.com';
};
let selectCreateKey = async () => {
    try{
        console.log("Enter your private key or its location");
        rl.question('Or press Enter to generate a brand new key: ', async (answer) => {
            switch (answer.toLowerCase()) {
                case '':
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
let createNewKey = async () => {
    try {
        console.log("Generating private key... \n");
        keyPair = keyUtils.generate_keypair();
        ecKey = keyUtils.load_keypair(keyPair);
        await sleep(2000);
        console.log('Generated Private Key: ' + ecKey.getPrivate("hex"));
        console.log('With Public Key: ' + ecKey.getPublic("hex") + '\n');
        await storeKey();
    } catch (e) {
        console.log(e);
    }
};
let loadKey = async (privateKey) => {
    try {
        if(fs.existsSync(privateKey)) {
            console.log("Loading private key... \n");
            await sleep(2000);
            ecKey = keyUtils.load_keypair(fs.readFileSync(privateKey).toString().trim());
            console.log('Loaded Private Key: ' + ecKey.getPrivate("hex"));
            console.log('With Public Key: ' + keyUtils.getPublicKeyFromPrivateKey(ecKey));
            console.log('From: ' + privateKey);
            console.log("\n");
            selectTokens();
        }
        else {
            ecKey = keyUtils.load_keypair(privateKey);
            console.log("Loading private key... \n");
            await sleep(2000);
            console.log('Loaded Private Key: ' + ecKey.getPrivate("hex"));
            console.log('With Public Key: ' + keyUtils.getPublicKeyFromPrivateKey(ecKey));
            console.log('From: ' + privateKey);
            console.log("\n");
            selectTokens();
        }
    } catch (e) {
        console.log(e);
    }
};
let storeKey = async () => {
    try {
        if (!fs.existsSync(__dirname+'/../secure')){
            fs.mkdirSync(__dirname+'/../secure');
        }
        console.log("Select the way you want to store your private key:");
        rl.question('Press F for storing in a text file or T for plain text in your config file: ', async (answer) => {
            switch (answer.toLowerCase()) {
                case 'f':
                    storeFile = true;
                    keyPath = privateKeyPath + '_' + environment.toLowerCase() + '.key';

                    console.log("Saving private key... \n");
                    sleep(500);
                    fs.writeFile(privateKeyPath + '_' + environment.toLowerCase() + '.key', ecKey.getPrivate("hex"), {mode: 0o755}, function (err) {
                        if (err) throw err;
                        console.log('Private key saved in file: ' + keyPath + '\n');
                    });
                    await sleep(1000);

                    selectTokens();
                    break;
                case 't':
                    storeFile = false;
                    keyPlain = ecKey.getPrivate("hex");
                    console.log("Saving private key... \n");
                    await sleep(1000);

                    selectTokens();
                    break;
                default:
                    storeKey();
            }
        });
    } catch (e) {
        console.log(e);
    }
};
let selectTokens = async () => {
    try{
        console.log("Select the tokens that you would like to request:");
        rl.question('Press M for merchant, P for payout, or B for both: \n', async (answer) => {
            switch(answer.toLowerCase()) {
                case 'm':
                case 'p':
                case 'b':
                    console.log("Requesting tokens... \n");
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
let requestTokens = async (option) => {
    try{
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

        let sin = keyUtils.get_sin_from_key(ecKey);
        let headers = {
            "x-accept-version": "2.0.0",
            "Content-type": "application/json"
        };

        if (reqMerchant) {
            console.log("Requesting Merchant token... \n");
            let facade = 'merchant';
            let postData = {id: sin,facade: facade};
            let options = {
                url: apiUrl + '/tokens',
                method: 'POST',
                body: postData,
                headers: headers,
                json: true
            };

            axios({
                method: options.method,
                url: options.url,
                headers: options.headers,
                data: {
                    id: options.body.id,
                    facade: options.body.facade
                }
            }).then((response) => {
                const data = response.data.data[0]
                merchantToken = data.token
                merchantPairCode = data.pairingCode
            }).catch((e) => {
                console.log(e.message)
            })
            await sleep(2000);
        }
        
        if (reqPayout) {
            console.log("Requesting Payout token... \n");
            let facade = 'payout';
            let postData = {id: sin,facade: facade};
            let options = {
                url: apiUrl + '/tokens',
                method: 'POST',
                body: postData,
                headers: headers,
                json: true
            };

            axios({
                method: options.method,
                url: options.url,
                headers: options.headers,
                data: {
                    id: options.body.id,
                    facade: options.body.facade
                }
            }).then((response) => {
                const data = response.data.data[0]
                payoutToken = data.token
                payoutPairCode = data.pairingCode
            }).catch((e) => {
                console.log(e.message)
            })
            await sleep(2000);
        }

        await updateConfigFile();
    } catch (e) {
        console.log(e);

    }
};
let updateConfigFile = async () => {
    // console.log(merchantToken);
    // console.log(payoutToken);
    let confObj;

    if (environment == 'Test') {
        confObj = {
            'BitPayConfiguration': {
                "Environment": "Test",
                "EnvConfig": {
                    "Test": {
                        "PrivateKeyPath": keyPath,
                        "PrivateKey": keyPlain,
                        "ApiTokens": {
                            "merchant": merchantToken,
                            "payout": payoutToken
                        }
                    }
                }
            }
        };
    } else {
        confObj = {
            'BitPayConfiguration': {
                "Environment": "Prod",
                "EnvConfig": {
                    "Prod": {
                        "PrivateKeyPath": keyPath,
                        "PrivateKey": keyPlain,
                        "ApiTokens": {
                            "merchant": merchantToken,
                            "payout": payoutToken
                        }
                    }
                }
            }
        };
    }

    confObj['BitPayConfiguration']['EnvConfig'][environment] = {
        "PrivateKeyPath" : keyPath,
        "PrivateKey" : keyPlain,
        "ApiTokens" : {
            "merchant" : merchantToken,
            "payout": payoutToken
        }
    };

    fs.writeFile(ConfFilePath, JSON.stringify(confObj, null, 4), function (err) {
        if (err) throw err;
        console.log('Generated configuration file');
        console.log('And saved in file: ' + ConfFilePath + '\n');
    });
    await sleep(5000);

    console.log('Configuration generated successfully! \n');
    console.log("To complete your setup, Go to " + apiUrl + "/dashboard/merchant/api-tokens and pair this client with your merchant account using the pairing codes:");
    if (merchantToken) {
        console.log(merchantPairCode + " for the Merchant facade.");
    }
    if (payoutToken) {
        console.log(payoutPairCode + " for the Payout facade ONLY if you have requested access for this role.");
    }

    process.exit();
};
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main();
