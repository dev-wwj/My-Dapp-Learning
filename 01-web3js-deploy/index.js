let { Web3 } = require('web3')
let solc = require('solc')
let fs = require('fs');
const { json } = require('stream/consumers');

require('dotenv').config();

let privatekey = process.env.PRIVATE_KEY
if (privatekey.slice(0, 2) !== '0x') privatekey = '0x' + privatekey;

const source = fs.readFileSync(
    'Incrementer.sol',
    'utf8'
);

const input = {
    language: 'Solidity',
    sources: {
        'Incrementer.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            },
        },
    },
};

const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
const contractFile = compiledCode.contracts['Incrementer.sol']['Incrementer'];

// Get bin & abi
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

const web3 = new Web3('https://sepolia.infura.io/v3/' + process.env.INFURA_ID);
const accounts = web3.eth.accounts.wallet.add(privatekey);

/*
    -- Deploy Contract --
*/
// 添加错误处理和日志
const Deploy = async () => {
    try {
        // 添加部署前的检查
        if (!process.env.INFURA_ID) {
            throw new Error('Missing INFURA_ID environment variable')
        }
        if (!process.env.PRIVATE_KEY) {
            throw new Error('Missing PRIVATE_KEY environment variable')
        }

        // Create contract instance
        const deployContract = new web3.eth.Contract(abi);

        // Create Tx
        const deployTx = deployContract.deploy({
            data: '0x' + bytecode,
            arguments: [0]
        })

        // optionally, estimate the gas that will be used for development and log it
        const gas = await deployTx.estimateGas({
            from: accounts
        })
        console.log('estimated gas:', gas)
        
        // 添加更详细的日志
        console.log('Contract deployment started...')
        console.log('Network: Sepolia Testnet')
        console.log('Account:', accounts[0].address)

        const tx = await deployTx.send({
            from: accounts[0].address,
            gas
        })
        console.log('Contract deployed successfully!')
        console.log('Contract address:', tx.options.address)
        console.log('Transaction hash:', tx.transactionHash)

        // 添加部署后的验证
        const code = await web3.eth.getCode(tx.options.address);
        if (code === '0x') {
            throw new Error('Contract deployment failed - no code at address');
        }
        return tx.options.address
    } catch (error) {
        console.error('Deployment failed:', error.message)
    }
}

Deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })


