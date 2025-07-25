import { ethers }  from "ethers";

const INFURA_MAINNET_URL = "https://mainnet.infura.io/v3/988d604435204d0d816284fdcec4b98d"
// const provider = new ethers.JsonRpcProvider(INFURA_MAINNET_URL)
const provider = new ethers.InfuraProvider("sepolia", "988d604435204d0d816284fdcec4b98d")
const address = "vitalik.eth";

const main = async() => {
    const balance = await provider.getBalance(address)
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`)
}

main()