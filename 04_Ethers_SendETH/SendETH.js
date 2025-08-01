import { ethers, HDNodeWallet, Mnemonic } from "ethers";
import { provider, wallet } from "../00_Ethers_Base/Base";

const provider = provider;

const wallet1 = ethers.Wallet.createRandom()

const wallet1WithProvider = wallet1.connect(provider)

// Create Wallet From PrivateKey
const wallet2 = wallet

const phrase = 'device view scrub ...'
// Create Wallet From Phrase
const mnemonic = Mnemonic.fromPhrase(phrase, "")

const root = HDNodeWallet.fromMnemonic(mnemonic)

const child0 = root.derivePath("0")
const child1 = root.derivePath("1")

const privateKey3 = '44260ec9dfa3b14add9de1009719e718bf143e68c65eeaa46c695947379d4b03'

const wallet3 = new ethers.Wallet(privateKey3, "")

const main = async() => {

    for(let i = 0; i < 50; i ++) {
        console.log(`address ${i}: ${root.deriveChild(i).address}`)
    }

    const address1 = await wallet1.getAddress()
    const address2 = await wallet2.getAddress()
    const address3 = await wallet3.getAddress()

    console.log(`1. 获取钱包地址`)
    console.log(`钱包1地址：${ address1 }`)
    console.log(`钱包2地址：${ address2 }`)
    console.log(`钱包3地址：${ address3 }`)

    console.log(`2. 获取助记词`)
    console.log(`钱包1助记词：${ phrase }`)

    console.log(`3. 获取私钥`)
    console.log(`钱包1私钥：${ wallet1.privateKey }`)
    console.log(`钱包2私钥：${ wallet2.privateKey }`)
    console.log(`钱包3私钥：${ wallet3.privateKey }`)


    console.log(`4. 获取连上交易次数`)
    const txCount1 = await provider.getTransactionCount(wallet1WithProvider)
    const txCount2 = await provider.getTransactionCount(wallet2)
    const txCount3 = await provider.getTransactionCount(wallet3)

    console.log(`钱包1发送交易次数 ${ txCount1 }`)
    console.log(`钱包2发送交易次数 ${ txCount2 }`)  
    console.log(`钱包2发送交易次数 ${ txCount3 }`)  

    console.log(`5. 发送ETH (Sepolia)`)
    console.log(`i. 发送前余额`)
    console.log(`钱包2: ${ ethers.formatEther(await provider.getBalance(wallet2)) } ETH`)
    console.log(`钱包3: ${ ethers.formatEther(await provider.getBalance(wallet3)) } ETH`)

    const tx = {
        to: address3,
        value: ethers.parseEther("0.0001")
    }

    console.log(`\nii . 等待交易在区块确认(需要几分钟)`)
    const receipt = await wallet2.sendTransaction(tx)
    await receipt.wait() // 等待链上确认交易

    console.log(receipt) // 打印交易详情

    console.log(`\nTransaction Gas Userd: ${receipt.gasUsed}`)
    console.log(`\nTransaction Gas Price: ${receipt.effectiveGasPrice}`)


    console.log(`\niii. 发送后余额`)
    console.log(`钱包2: ${ ethers.formatEther(await provider.getBalance(wallet2)) } ETH`)
    console.log(`钱包3: ${ ethers.formatEther(await provider.getBalance(wallet3)) } ETH`)

}

main()