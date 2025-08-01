import { ethers } from "ethers"
import { mainProvider } from "../00_Ethers_Base/Base.js"
import ora from "ora"

// 合约地址
const addressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// 交易所地址
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60'

const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)",
    "function balanceOf(address) public view returns(uint)",
]

const contractUSDT = new ethers.Contract(addressUSDT, abi, mainProvider)

const spinner = new ora('等待...')

async function main() {
    try {
        console.log("\n1. 读取币安热钱包USDT余额")
        spinner.start()
        const balanceUSDT = await contractUSDT.balanceOf(accountBinance)
        spinner.succeed("查到数据")
        console.log(`USDT余额: ${ethers.formatUnits(balanceUSDT, 6)}\n`)
        console.log("\n2. 创建过滤器, 监听USDT转进交易")
        let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance)
        console.log("过滤器详情")
        console.log(filterBinanceIn)

        spinner.start()
        contractUSDT.on(filterBinanceIn, (res) => {
            console.log(`\n----------- listion bourse transcation in ----------`)
            console.log(
                `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2], 6)}`
            )
        })

        let filterBinanceOut = contractUSDT.filters.Transfer(accountBinance)
        console.log('\n3. 创建过滤器，监听USDT转出交易所')
        console.log('过滤器详情：')
        console.log(filterBinanceOut)
        contractUSDT.on(filterBinanceOut, (res) => {
            console.log(`\n----------- listion bourse transcation out ----------`)
            console.log(
                `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2], 6)}`
            )
        }) 
    } catch (e) {
        spinner.fail("❌ 事件监听失败! ")
        console.error(e)
    }
}

main()