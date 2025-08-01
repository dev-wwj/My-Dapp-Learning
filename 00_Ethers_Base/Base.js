import { ethers } from "ethers"

// require('dotenv').config()
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

export const addressERC20 = "0x2193a6479972Abe854c756CaB8260D756Df1e54D"

export const addressWETH = "0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa"

export const addressUSDT = "0xA1d7f71cbBb361A77820279958BAC38fC3667c1a"

export const address_MAINNET_ERC20 = ""
export const address_MAINNET_WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
export const address_MAINNET_USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

export const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL)

export const mainProvider = new ethers.JsonRpcProvider(process.env.ALCHEMY_MAINNET_URL)

export const wallet = new ethers.Wallet(process.env.PRIVATEKEY_4425, provider)

export const walletMain = new ethers.Wallet(process.env.PRIVATEKEY_4425, mainProvider)

async function test() {
    console.log(process.env)
    console.log(process.env.INFURA_SEPOLIA_URL)
    console.log(process.env.PRIVATEKEY_4425)
}

// test().catch(console.error);