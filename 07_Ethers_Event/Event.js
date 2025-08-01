import { ethers } from "ethers";
import { provider, wallet } from "../00_Ethers_Base/Base.js";
import { addressWETH } from "../00_Ethers_Base/Base.js";

const abiWTEH = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
]

const contractWETH = new ethers.Contract(addressWETH, abiWTEH, provider)

const main = async () => {
    
    console.log("\n1. 获取过去10个区块内的Transfer事件, 并打印出1个")

    const block = await provider.getBlockNumber()
    console.log(`当前区块高度: ${block}`)
    console.log(`打印事件详情:`)
    
    const transferEvents = await contractWETH.queryFilter('Transfer', block - 10000, block)
    console.log(transferEvents[0])

    console.log("\n2.解析事件：")
    const amount = ethers.formatUnits(ethers.getBigInt(transferEvents[0].args["amount"]), "ether");
    console.log(`地址 ${transferEvents[0].args["form"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`)
}

main()

