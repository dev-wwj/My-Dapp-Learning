import { ethers } from "ethers";
import { addressWETH, provider, wallet } from "../00_Ethers_Base/Base.js";

const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
]

const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)

const main = async () => {

    const address = await wallet.getAddress()

    console.log(`\n1. 读取钱包WETH余额`)
    const param1 = contractWETH.interface.encodeFunctionData(
        "balanceOf",
        [address]
    )
    console.log(`编码结果: ${param1}`)
    const tx1 = {
        to: addressWETH,
        data: param1
    }

    const balanceWETH = await provider.call(tx1)
    console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`)

    const balanceETH = await provider.getBalance(wallet)
    
    if (ethers.formatEther(balanceETH) > 0.0015) {

        console.log(`\n2.  call deposit() function, deposit 0.0001 ETH`)
        const param2 = contractWETH.interface.encodeFunctionData(
            "deposit"
        )
        console.log(`编码结果: ${param2}`)

        const tx2 = {
            to: addressWETH,
            data: param2,
            value: ethers.parseEther("0.0001")
        }

        const receipt1 = await wallet.sendTransaction(tx2)
        await receipt1.wait()

        console.log(`交易详情：`)
        console.log(receipt1)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`after deposit the balance of WETH： ${balanceWETH_deposit}`)
    } else {
        console.log("ETH not enough")
    }
}

main()