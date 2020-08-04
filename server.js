var jsonInterface = [
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_key",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_stamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_val",
          "type": "uint256"
        }
      ],
      "name": "setPrice",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "_key",
          "type": "string"
        }
      ],
      "name": "getPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

const address = "0xACB002196ef793AEb24Aaf8AC839142A60770dAD";
const ipcLink = '/home/arek/.ethereum/net13/geth.ipc';

const express = require('express');
const app = express();
var Web3 = require('web3');
var net = require('net');
var web3 = new Web3(ipcLink, net);
var Contract = require('web3-eth-contract');
var contract = new web3.eth.Contract(jsonInterface, address);

const crypto = require('crypto');

// This part of the code is just to allow testing webservice, encryption and provide example data for automatic update
const currentPrice = 1000;

const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
  publicKeyEncoding:  { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

let buff = new Buffer.from(publicKey);
const encodedKey = buff.toString('base64');
const stamp = Date.now();

const sign = crypto.createSign('SHA256');
const data = '' + stamp + currentPrice;
sign.write(data);
sign.end();
const signature = sign.sign(privateKey, 'hex');

console.log("sample webservice call that will pass signature verification (ctrl-click):");
console.log('http://localhost:8080/ep1?key=' + encodedKey + '&data=' + data + '&signature=' + signature);
console.log();

console.log("sample webservice call that will retrieve price value (ctrl-click):");
console.log('http://localhost:8080/ep2?key=' + encodedKey);
console.log();
// End of testing code

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

app.get('/ep1', async function(req,res) {
	const {key = "", data = "", signature = ""} = req.query;
	try {
		let keyBuff = new Buffer.from(key, 'base64');
		let decodedKey = keyBuff.toString('ascii');
		const stamp = parseInt(data.substr(0, 13));
		const price = parseInt(data.substr(13));
		const verify = crypto.createVerify('SHA256');
		verify.write(data);
		verify.end();
		if(verify.verify(decodedKey, signature, 'hex')) {
			console.log("processing request...");
			let c = await web3.eth.getCoinbase();
			await contract.methods.setPrice(key, stamp, price).send({from: c});
			console.log("price updated");
			res.status(200).send({success: true});
		} else {
			console.error("signature does not match data");
			res.status(404).send({success: false});
		}
	} catch (error) {
		console.error(error);
		res.status(404).send({success: false});
	}
});	

app.get('/ep2', async function(req,res) {
	const {key = ""} = req.query;
	const pr = await contract.methods.getPrice(key).call();
	console.log("got price value: " + pr);
	res.status(200).send({success: true, price: pr});
});

function updatePrice() {
	web3.eth.getCoinbase().then((c) => {
		contract.methods.setPrice(encodedKey, Date.now(), currentPrice).send({from: c})
		.then(function(receipt){
		    console.log("contract automatically updated; next update in 30 min");
		});
	});	

}

setInterval(updatePrice, 30*60*1000); // every 30 min
