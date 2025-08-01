import { ethers } from "ethers";
import { mainProvider, walletMain } from "../00_Ethers_Base/Base.js";
import ora from "ora";

const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)"
]

const addressDAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

const contractDAI = new ethers.Contract(addressDAI, abiDAI, mainProvider)

const spinner = new ora("wait for a minite....\n")

const main = async () => {
    try {
        spinner.start()
        const address = await walletMain.getAddress()
        spinner.succeed('success')
        console.log(`wallet address: ${address}`)

        console.log(`\n1. get wallet dai balance`)
        spinner.start()
        const balanceDAI = await contractDAI.balanceOf(address)
        const balanceDAIVitalik = await contractDAI.balanceOf("vitalik.eth")
        spinner.succeed(`✅ success get balance`)
        console.log(`wallet test balance: ${ ethers.formatEther(balanceDAI)}`)
        console.log(`wallet Vitalik balance: ${ethers.formatEther(balanceDAIVitalik)}`)

        console.log('\n2. 用staticCall尝试调用transfer转账1DAI, msg.sender为 Vitalik地址')
        spinner.start()
        const tx = await contractDAI.transfer.staticCall('vitalik.eth', ethers.parseEther('1'), {from: await mainProvider.resolveName("vitalik.eth")})
        spinner.succeed('❓')
        console.log(`🤔 交易会成功吗❓：`, tx)

        console.log('\n3. 用staticCall尝试调用transfer转账1 DAI, msg.sender为测试钱包地址')
        spinner.start()
        const tx2 = await contractDAI.transfer.staticCall('vitalik.eth', ethers.parseEther("10000"), {from: address})
        spinner.succeed('❓')
        console.log(`🤔 交易会成功吗❓`, tx2)
    } catch (e) {
        console.error(e)
        spinner.fail("fail")
    }
}

main()