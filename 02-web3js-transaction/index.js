const { Web3 } = require('web3');
const fs = require('fs')
const contractOfIncrementer = require('./compile')
const { resolve } = require('path')

require('dotenv').config()
const privatekey = process.env.PRIVATE_KEY
const infura_id = process.env.INFURA_ID

// 检查环境变量是否正确设置
if (!privatekey) {
    console.error('❌ 错误: PRIVATE_KEY 环境变量未设置');
    console.error('请在项目根目录创建 .env 文件，并添加以下内容:');
    console.error('PRIVATE_KEY=your_private_key_here');
    console.error('INFURA_ID=your_infura_project_id_here');
    console.error('');
    console.error('请参考 SETUP.md 文件获取详细设置说明');
    process.exit(1);
}

if (!infura_id) {
    console.error('❌ 错误: INFURA_ID 环境变量未设置');
    console.error('请在 .env 文件中添加 INFURA_ID');
    process.exit(1);
}

// 验证私钥格式并确保包含0x前缀
if (!/^[0-9a-fA-F]{64}$/.test(privatekey)) {
    console.error('❌ 错误: 私钥格式不正确');
    console.error('私钥必须是64位十六进制字符，不包含 0x 前缀');
    console.error(`当前私钥: ${privatekey}`);
    process.exit(1);
}

// 为 Web3.js v4 添加 0x 前缀
const privateKeyWithPrefix = privatekey.startsWith('0x') ? privatekey : '0x' + privatekey;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const providerRPC = {
    development: 'https://sepolia.infura.io/v3/' + process.env.INFURA_ID,
    moonbase: 'https://rpc.testnet.moonbeam.network',
}

const web3 = new Web3(providerRPC.development)

const account = web3.eth.accounts.privateKeyToAccount(privateKeyWithPrefix);
const account_from = {
    privateKey: privateKeyWithPrefix,
    accountAddress: account.address
}

const bytecode = contractOfIncrementer.evm.bytecode.object
const abi = contractOfIncrementer.abi


const { gas } = require('./config')

// 添加更细致的错误处理
class TransactionError extends Error {
    constructor(message, txHash) {
        super(message);
        this.name = 'TransactionError';
        this.txHash = txHash;
    }
}

const handleTransactionError = async (error, tx) => {
    console.error(`Transaction Failed: ${error.message}`);
    if (tx?.transactionHash) {
        const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
        console.error(`Transaction Receipt:`, receipt);
    }
    // 可以添加错误上报逻辑
};

const Trans = async () => {
    try {


        console.log('========================= 1. Deploy Contract')
        console.log(`Attempting to deploy from account ${account.address}`)

        const deployContract = new web3.eth.Contract(abi);

        const deployTx = deployContract.deploy({
            data: bytecode,
            arguments: [5]
        });

        // 获取当前 gas 价格
        const gasPrice = await web3.eth.getGasPrice();
        
        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                from: account.address,
                data: deployTx.encodeABI(),
                gas: 8000000,
                gasPrice: gasPrice
            },
            account_from.privateKey
        )

        // Get Transaction Receipt
        const createReceipt = await web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction
        );
        console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);

        const deployedBlockNumber = createReceipt.blockNumber;
        /*
             *
             *
             *
             * -- Verify Interface of Increment --
             *
             *
             */
        // Create the contract with contract address
        console.log();
        console.log(
            '============================ 2. Call Contract Interface getNumber'
        );

        let incrementer = new web3.eth.Contract(abi, createReceipt.contractAddress);
        console.log(
            `Making a call to contract at address: ${createReceipt.contractAddress}`
        );

        let number = await incrementer.methods.getNumber().call();
        console.log(`The current number stored is: ${number}`);

        // Add 3 to Contract Public Variable
        console.log();
        console.log(
            '============================ 3. Call Contract Interface increment'
        );

        const _value = 3;
        let incrementTx = incrementer.methods.increment(_value);
        // Sign with Pk
        let incrementTransaction = await web3.eth.accounts.signTransaction(
            {
                from: account.address,
                to: createReceipt.contractAddress,
                data: incrementTx.encodeABI(),
                gas: 8000000,
                gasPrice: gasPrice
            },
            account_from.privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(
            incrementTransaction.rawTransaction
        );
        console.log(`Tx successful with hash: ${receipt.transactionHash}`)

        number = await incrementer.methods.getNumber().call();
        console.log(`After increment, the current number stored is: ${number}`);

        /*
         *
         *
         *
         * -- Verify Interface of Reset --
         *
         *
         */
        console.log();
        console.log('============================ 4. Call Contract Interface reset');
        const resetTx = incrementer.methods.reset();

        const resetTransaction = await web3.eth.accounts.signTransaction(
            {
                from: account.address,
                to: createReceipt.contractAddress,
                data: resetTx.encodeABI(),
                gas: 8000000,
                gasPrice: gasPrice
            },
            account_from.privateKey
        )

        const resetReceipt = await web3.eth.sendSignedTransaction(
            resetTransaction.rawTransaction
        )

        console.log(`Tx successful with hash: ${resetReceipt.transactionHash}`);
        number = await incrementer.methods.getNumber().call();
        console.log(`After reset, the current number stored is: ${number}`);

        /*
        *
        *
        *
        * -- Listen to Event Increment --
        *
        *
        */
        console.log();
        console.log('============================ 5. Listen to Events');
        console.log(' Listen to Increment Event only once && continuouslly');

        // 创建 WebSocket 连接用于事件监听
        const web3Socket = new Web3(
            'wss://sepolia.infura.io/ws/v3/' + process.env.INFURA_ID
        )

        incrementer.once('Increment', (error, event) => {
            console.log('I am a onetime event lister, I am going to die now')

        })

        // listen to Increment event continuously
        // 改进事件监听机制
        const setupEventListeners = (contract, web3Socket) => {
            const eventHandler = {
                onIncrement: (event) => {
                    console.log('Increment Event:', event);
                },
                onReset: (event) => {
                    console.log('Reset Event:', event);
                },
                onError: (error) => {
                    console.error('Event Error:', error);
                },
            };

            return {
                startListening: async () => {
                    try {
                        const subscription = await web3Socket.eth.subscribe('logs', {
                            address: contract.options.address,
                            topics: [],
                        });
                        
                        subscription.on('data', eventHandler.onIncrement);
                        subscription.on('error', eventHandler.onError);
                    } catch (error) {
                        console.error('Failed to start listening:', error);
                    }
                },
                stopListening: () => {
                    web3Socket.eth.clearSubscriptions();
                },
            };
        };


        // listen to Increment event continuously
        try {
            const subscription = await web3Socket.eth.subscribe('logs', {
                address: createReceipt.contractAddress,
                topics: []
            });
            
            subscription.on('data', (event) => {
                console.log("New event: ", event);
            });
            
            subscription.on('error', (error) => {
                console.error("Subscription Error: ", error);
            });
        } catch (error) {
            console.error("Failed to subscribe to events:", error);
        }

        for (let step = 0; step < 3; step++) {
            incrementTransaction = await web3.eth.accounts.signTransaction(
                {
                    from: account.address,
                    to: createReceipt.contractAddress,
                    data: incrementTx.encodeABI(),
                    gas: 8000000,
                    gasPrice: gasPrice
                },
                account_from.privateKey
            );

            await web3.eth.sendSignedTransaction(incrementTransaction.rawTransaction);

            console.log("Waiting for events")
            await sleep(3000);

            if (step == 2) {
                // clear all the listeners
                web3Socket.eth.clearSubscriptions();
                console.log('Clearing all the events listeners !!!!');
            }
        }

        /*
         *
         *
         *
         * -- Get past events --
         *
         *
         */
        console.log();
        console.log('============================ 6. Going to get past events');
        const pastEvents = await incrementer.getPastEvents('Increment', {
            fromBlock: deployedBlockNumber,
            toBlock: 'latest',
        });

        pastEvents.map((event) => {
            console.log(event);
        });

        /*
         *
         *
         *
         * -- Check Transaction Error --
         *
         *
         */
        console.log();
        console.log('============================ 7. Check the transaction error');
        incrementTx = incrementer.methods.increment(0);
        incrementTransaction = await web3.eth.accounts.signTransaction(
            {
                from: account.address,
                to: createReceipt.contractAddress,
                data: incrementTx.encodeABI(),
                gas: 8000000,
                gasPrice: gasPrice
            },
            account_from.privateKey
        );

        await web3.eth
            .sendSignedTransaction(incrementTransaction.rawTransaction)
            .on('error', console.error);
    } catch (error) {
        console.error('Transaction failed:', error)
    }
}

Trans()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })