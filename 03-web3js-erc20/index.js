require('dotenv').config();
const Web3 = require('web3');
const contractFile = require('./compile');
const config = require('./config');

console.log('=== Web3.js ERC20 代币项目 ===');

const web3 = new Web3(new Web3.providers.HttpProvider(config.networks.development.provider));
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

const account_from = {
    privateKey: account.privateKey,
    accountAddress: account.address,
};

const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// 重试函数
async function retryOperation(operation, maxRetries = 3, delay = 2000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            console.log(`尝试 ${i + 1}/${maxRetries} 失败:`, error.message);
            if (i === maxRetries - 1) throw error;
            console.log(`等待 ${delay}ms 后重试...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function main() {
    try {
        console.log('1. 创建 deployer 实例...');
        const ContractDeployer = require('./modules/deployer');
        const deployer = new ContractDeployer(web3, account_from);
        console.log('✅ Deployer 实例创建成功');
        
        console.log('\n2. 开始部署合约...');
        const contract = await retryOperation(async () => {
            return await deployer.deploy(abi, bytecode);
        });
        console.log('✅ 合约部署成功！');
        console.log('合约地址:', contract.options.address);
        
        // 等待部署确认
        console.log('\n3. 等待部署确认...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('\n4. 测试合约实例...');
        const totalSupply = await contract.methods.totalSupply().call();
        console.log('✅ 合约调用成功！总供应量:', totalSupply);
        
        console.log('\n5. 创建 interactor...');
        const ContractInteractor = require('./modules/interactor');
        const interactor = new ContractInteractor(web3, contract);
        console.log('✅ Interactor 创建成功');
        
        console.log('\n6. 测试转账...');
        const receiver = '0xE80cA1838EA28d921fb7E1bb12b5DE9D5E474425';
        
        // 使用重试机制进行转账
        const transferResult = await retryOperation(async () => {
            return await interactor.transfer(account_from, receiver, 100000);
        });
        console.log('✅ 转账成功！');
        
        // 等待转账确认
        console.log('\n7. 等待转账确认...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('\n8. 查询余额...');
        await interactor.balanceOf(receiver);
        console.log('✅ 余额查询成功！');
        
        console.log('\n9. 查询总供应量...');
        await interactor.totalSupply();
        console.log('✅ 总供应量查询成功');
        
        console.log('\n🎉 所有基本功能测试通过！');
        
        // 测试事件监听（使用 WebSocket 连接）
        console.log('\n10. 测试事件监听...');
        try {
            const web3Socket = new Web3(config.networks.development.publisher);
            const socketContract = new web3Socket.eth.Contract(abi, contract.options.address);
            
            const EventListener = require('./modules/eventListener');
            const eventListener = new EventListener(web3Socket, socketContract);
            await eventListener.subscribeToTransfers();
            console.log('✅ 事件监听器创建成功');
            
            console.log('等待事件...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            console.log('获取历史事件...');
            const deployBlock = await web3.eth.getBlockNumber();
            await eventListener.getPastTransfers(deployBlock);
            console.log('✅ 历史事件查询成功');
            
            eventListener.unsubscribeAll();
            console.log('✅ 订阅取消成功');
        } catch (error) {
            console.log('⚠️ 事件监听测试跳过:', error.message);
        }
        
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
        const { ErrorHandler } = require('./modules/errorHandler');
        await ErrorHandler.handle(error, web3);
        process.exit(1);
    }
}

main()
    .then(() => {
        console.log('\n程序执行完成');
        process.exit(0);
    })
    .catch((error) => {
        console.error('程序异常退出:', error);
        process.exit(1);
    });