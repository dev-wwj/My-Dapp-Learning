import { ethers } from "ethers"
import { mainProvider } from "../00_Ethers_Base/Base.js"

const abiERC721 = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function supportsInterface(bytes4) public view returns(bool)"
]

const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"

const contractERC721 = new ethers.Contract(addressBAYC, abiERC721, mainProvider)

const selectorERC721 = "0x80ac58cd"

const main = async() => {
    try {
        const nameERC721 = await contractERC721.name()
        const symbolERC721 = await contractERC721.symbol()
        console.log(`\n1. 读取ERC721合约信息`)
        console.log(`address: ${addressBAYC}`)
        console.log(`name:    ${nameERC721}`)
        console.log(`symbol:  ${symbolERC721}`)

        const isERC721 = await contractERC721.supportsInterface(selectorERC721)
        console.log("\n2. 利用ERC165得supportsInterface, 确定合约是否为ERC721标准")
        console.log(`合约是否为ERC721标准: ${isERC721}`)
    } catch (e) {
        console.error(e)
    }
}

main()