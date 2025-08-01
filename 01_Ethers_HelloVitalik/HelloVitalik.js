import { ethers }  from "ethers";
import { provider } from "../00_Ethers_Base/Base.js";


const address = "vitalik.eth";

const main = async() => {
    const balance = await provider.getBalance(address)
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`)
}

main()