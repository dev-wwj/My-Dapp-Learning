import { ethers } from "ethers"
import ora from 'ora' 

const INFURA_KEY = "988d604435204d0d816284fdcec4b98d"

const INFURA_SEPOLIA_URL = "https://sepolia.infura.io/v3/"

const provider = new ethers.JsonRpcProvider(`${INFURA_SEPOLIA_URL}${INFURA_KEY}`)

const privateKey = "44260ec9dfa3b14add9de1009719e718bf143e68c65eeaa46c695947379d4b03"
const wallet = new ethers.Wallet(privateKey, provider)

const abiWTEH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
    "function transfer(address, uint) public returns(bool)",
    "function withdraw(uint) public"
]

const addressWETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa'

const contractWETH = new ethers.Contract(addressWETH, abiWTEH, wallet)

const spinner = ora('等待交易...')

const main = async () => {
    const address = await wallet.getAddress()

    console.log(`wallet address: ${address}`)

    console.log("\n1. 读取WETH余额")
    const balanceWETH = await contractWETH.balanceOf(address)
    
    console.log(`存款前WTETH持仓: ${ethers.formatEther(balanceWETH)}\n`)
    
    //钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)

    if (ethers.formatEther(balanceETH) > 0.0001) {
        console.log(`\n2. 调用deposit()函数, 存入0.0001 ETH`)
        const tx = await contractWETH.deposit({value: ethers.parseEther("0.0001")})
        
        spinner.start();
        await tx.wait()
        spinner.succeed(`交易完成`)

        console.log(`tx交易详情:`)
        console.log(tx)

        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`)

        console.log("\n3. 调用transfer()函数，给vitalik转账0.0001 WETH")
        const tx2 = await contractWETH.transfer("vitalik.eth", ethers.parseEther("0.0001"))
        
        spinner.start()
        await tx2.wait()
        spinner.succeed('交易完成')

        console.log(`tx2交易详情:`)
        console.log(tx2)

        const balanceWETH_transfer = await contractWETH.balanceOf(address)
        console.log(`转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}`)
    } else {
        console.log("ETH不足，去水龙头领一些Goerli ETH")
    }
    
}

main()