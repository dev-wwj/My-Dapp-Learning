import { ethers, HDNodeWallet, Mnemonic } from "ethers";

// 1. 助记词 (种子)
const phrase = 'device view scrub enjoy pitch theory prefer order salute blur attract erupt'
console.log("=== 1. 助记词 ===")
console.log(`助记词: ${phrase}`)
console.log(`单词数量: ${phrase.split(' ').length}`)
console.log("")

// 2. 从助记词创建根节点
const root = HDNodeWallet.fromPhrase(phrase)
console.log("=== 2. 根节点信息 ===")
console.log(`根节点地址: ${root.address}`)
console.log(`根节点私钥: ${root.privateKey}`)
console.log(`派生路径: ${root.path}`)
console.log("")

// 3. 派生子账户
console.log("=== 3. 派生子账户 ===")
for(let i = 0; i < 3; i++) {
    const child = root.deriveChild(i)
    console.log(`账户 ${i}:`)
    console.log(`  地址: ${child.address}`)
    console.log(`  私钥: ${child.privateKey}`)
    console.log(`  路径: ${child.path}`)
    console.log("")
}

// 4. 验证关系
console.log("=== 4. 关系验证 ===")
const account0 = root.deriveChild(0)
const account1 = root.deriveChild(1)

// 验证私钥不同
console.log(`账户0和账户1私钥是否相同: ${account0.privateKey === account1.privateKey}`)

// 验证地址不同
console.log(`账户0和账户1地址是否相同: ${account0.address === account1.address}`)

// 验证从私钥可以恢复地址
const recoveredWallet = new ethers.Wallet(account0.privateKey)
console.log(`从私钥恢复的地址: ${recoveredWallet.address}`)
console.log(`恢复地址是否匹配: ${recoveredWallet.address === account0.address}`)
console.log("")

// 5. 实际应用场景
console.log("=== 5. 实际应用场景 ===")
console.log("场景1: 用户导入助记词到MetaMask")
console.log(`- MetaMask会显示第一个账户: ${root.address}`)
console.log(`- 用户可以添加更多账户: ${account0.address}, ${account1.address}`)
console.log("")

console.log("场景2: 从私钥导入钱包")
console.log(`- 可以直接导入私钥: ${account0.privateKey}`)
console.log(`- 获得对应地址: ${account0.address}`)
console.log("")

console.log("场景3: 备份和恢复")
console.log("- 只需要备份助记词，就可以恢复所有账户")
console.log("- 私钥丢失时，可以用助记词重新生成")
console.log("- 地址丢失时，可以从私钥重新计算")

// 6. 安全性说明
console.log("")
console.log("=== 6. 安全性说明 ===")
console.log("✅ 助记词: 必须安全备份，可以恢复所有账户")
console.log("✅ 私钥: 必须保密，控制单个账户")
console.log("✅ 地址: 可以公开分享，用于接收资金")
console.log("❌ 永远不要分享私钥或助记词") 