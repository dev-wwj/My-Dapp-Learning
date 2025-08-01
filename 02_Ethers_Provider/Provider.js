import { ethers } from "ethers"
import { provider } from "../00_Ethers_Base/Base.js"

const address = "0xE80cA1838EA28d921fb7E1bb12b5DE9D5E474425"

// const providerMainnet = new ethers.JsonRpcProvider(INFURA_MAINNET_URL)
const providerSepolia = provider

const main = async () => {
    
    console.log("1. 查询Sepolia测试网的ETH余额")
    // const balance = await providerMainnet.getBalance(`vitalik.eth`)
    const balanceSepolia = await providerSepolia.getBalance(address)

    // console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`)
    console.log(`Sepolia ETH Balance of Address: ${ethers.formatEther(balanceSepolia)} ETH`)

    // 2. 查询provider连接的哪条链
    console.log("\n2. 查询provider连接的哪条链")
    const network = await providerSepolia.getNetwork();
    console.log(network.toJSON())

    console.log("\n3. 查询区块高度")
    const blockNumber = await providerSepolia.getBlockNumber()
    console.log(blockNumber)

    console.log("\n4. 查询 address 钱包历史交易次数")
    const txCount = await providerSepolia.getTransactionCount(address)
    console.log(txCount)

    console.log("\n5. 查询当前建议的gas设置")
    const feeData = await providerSepolia.getFeeData()
    console.log(feeData)

    console.log("\n6. 查询区块信息")
    const block = await providerSepolia.getBlock(0)
    console.log(block)
    
    console.log("\n7. 给定合约地址查询合约bytecode, WETH")
    const code = await providerSepolia.getCode("0xc778417e063141139fce010982780140aa0cd5ab");
    console.log(code)
}

main()