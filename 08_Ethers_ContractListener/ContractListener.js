import { ethers } from "ethers";
import { provider, addressUSDT } from "../00_Ethers_Base/Base.js"
import { mainProvider, address_MAINNET_USDT } from "../00_Ethers_Base/Base.js"

import ora from "ora";

const spinner = new ora('监听中...')

const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)",
]

const contractUSDT = new ethers.Contract(addressUSDT, abi, provider)
const contrast_MainNet_USDT = new ethers.Contract(address_MAINNET_USDT, abi, mainProvider)

// 使用轮询方式监听事件，避免过滤器过期问题
const setupPollingListener = (contract, networkName) => {
    let lastBlockNumber = 0;
    let isRunning = true;
    
    const handleTransfer = (from, to, value) => {
        console.log(`[${networkName}] ${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`)
    }

    const pollEvents = async () => {
        if (!isRunning) return;
        
        try {
            // 获取当前区块号
            const currentBlock = await contract.provider.getBlockNumber();
            
            if (lastBlockNumber === 0) {
                lastBlockNumber = currentBlock - 1; // 从上一个区块开始
            }
            
            // 查询指定区块范围内的事件
            const filter = contract.filters.Transfer();
            const events = await contract.queryFilter(filter, lastBlockNumber + 1, currentBlock);
            
            // 处理事件
            for (const event of events) {
                const { from, to, value } = event.args;
                handleTransfer(from, to, value);
            }
            
            lastBlockNumber = currentBlock;
            
        } catch (error) {
            console.error(`[${networkName}] 轮询错误:`, error.message);
            
            // 如果是网络错误，等待后重试
            if (error.code === 'NETWORK_ERROR' || error.code === 'UNKNOWN_ERROR') {
                console.log(`[${networkName}] 网络错误，5秒后重试...`);
                setTimeout(pollEvents, 5000);
                return;
            }
        }
        
        // 继续轮询
        setTimeout(pollEvents, 2000); // 每2秒轮询一次
    }
    
    // 启动轮询
    pollEvents();
    
    return () => {
        isRunning = false;
        console.log(`[${networkName}] 轮询监听已停止`);
    }
}

// 保留原有的事件监听方式作为备选
const setupEventListeners = (contract, networkName) => {
    let isConnected = true;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;
    
    const handleTransfer = (from, to, value) => {
        console.log(`[${networkName}] ${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`)
    }

    const reconnect = () => {
        if (!isConnected || reconnectAttempts >= maxReconnectAttempts) {
            console.log(`[${networkName}] 停止重连尝试`)
            return;
        }
        
        reconnectAttempts++;
        console.log(`[${networkName}] 尝试重新连接... (第${reconnectAttempts}次)`)
        
        setTimeout(async () => {
            try {
                contract.removeAllListeners('Transfer')
                contract.on('Transfer', handleTransfer)
                console.log(`[${networkName}] 重新连接成功`)
                reconnectAttempts = 0;
            } catch (reconnectError) {
                console.error(`[${networkName}] 重新连接失败:`, reconnectError.message)
                reconnect()
            }
        }, 5000)
    }

    try {
        contract.on('Transfer', handleTransfer)
        console.log(`[${networkName}] 事件监听器设置成功`)
    } catch (error) {
        console.error(`[${networkName}] 设置事件监听器失败:`, error.message)
    }
    
    contract.provider.on('error', (error) => {
        console.error(`[${networkName}] Provider 错误:`, error.message)
        if (error.code === 'UNKNOWN_ERROR' && error.error?.message?.includes('filter not found')) {
            console.log(`[${networkName}] 检测到过滤器过期，尝试重连...`)
            reconnect()
        }
    })
    
    contract.provider.on('disconnect', () => {
        console.log(`[${networkName}] Provider 断开连接`)
        isConnected = false
    })
    
    contract.provider.on('connect', () => {
        console.log(`[${networkName}] Provider 重新连接`)
        isConnected = true
        reconnectAttempts = 0;
    })
    
    return () => {
        isConnected = false
        contract.removeAllListeners('Transfer')
        console.log(`[${networkName}] 事件监听器清理完成`)
    }
}

const main = async () => {
    try {
        console.log("\n1. 利用contract.once()，监听一次Transfer事件")
        contractUSDT.once('Transfer', (from, to, value) => {
            console.log(
                `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`
            )
        })

        console.log("\n2. 使用轮询方式监听主网USDT Transfer事件")
        
        // 使用轮询方式监听主网USDT
        const stopPolling = setupPollingListener(contrast_MainNet_USDT, 'Mainnet')
        
        console.log("开始监听事件...")
        spinner.start()
        
        // 保持程序运行
        process.on('SIGINT', () => {
            console.log('\n停止监听...')
            stopPolling()
            spinner.stop()
            process.exit(0)
        })
        
    } catch(e) {
        console.log("初始化错误:", e)
        spinner.stop()
    }
}

main()