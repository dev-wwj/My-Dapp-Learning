import { ethers } from "ethers";

console.group('\n1. BigNumber类')

const oneGwei = ethers.getBigInt('1000000000')
console.log(oneGwei)

console.log(ethers.getBigInt("0x3b9aca00"))
console.log(ethers.getBigInt(1000000000))

console.log('js中最大安全整数：', Number.MAX_SAFE_INTEGER)

console.log('加法：', oneGwei + 1n)
console.log('减法：', oneGwei - 1n)
console.log('乘法：', oneGwei * 2n)
console.log('除法：', oneGwei / 2n)

console.log("是否相等：", oneGwei == 1000000000n)

console.group('\n2. 格式化：小单位转大单位, formatUnits')
console.log(ethers.formatUnits(oneGwei, 0))
console.log(ethers.formatUnits(oneGwei, "gwei"))
console.log(ethers.formatUnits(oneGwei, 6))
console.log(ethers.formatUnits(oneGwei, "ether"))
console.log(ethers.formatUnits(1000000000, "gwei"))
console.log(ethers.formatEther(oneGwei))
console.groupEnd()

console.group('\n3. 解析：大单位转小单位，parseUnits')
console.log(ethers.parseUnits("1.0").toString())
console.log(ethers.parseUnits("1.0", "ether").toString())
console.log(ethers.parseUnits("1.0", 18).toString())
console.log(ethers.parseUnits("1.0", "gwei").toString())
console.log(ethers.parseUnits("1.0", 9).toString())
console.log(ethers.parseEther("1.0").toString())
console.groupEnd()
