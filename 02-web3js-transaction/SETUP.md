# 项目设置说明

## 环境变量配置

在项目根目录创建 `.env` 文件，包含以下内容：

```env
# 以太坊私钥 (64位十六进制字符，不带0x前缀)
# 示例: PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
PRIVATE_KEY=your_private_key_here

# Infura 项目 ID
# 在 https://infura.io 注册并创建项目获取
INFURA_ID=your_infura_project_id_here
```

## 快速设置步骤

1. 复制上面的环境变量配置
2. 在项目根目录创建 `.env` 文件
3. 将配置粘贴到 `.env` 文件中
4. 替换 `your_private_key_here` 为您的实际私钥
5. 替换 `your_infura_project_id_here` 为您的 Infura 项目 ID

## 获取私钥

1. 使用 MetaMask 或其他钱包导出私钥
2. 确保私钥是64位十六进制字符，不包含 `0x` 前缀
3. 注意：请使用测试网账户，不要使用主网账户

## 获取 Infura ID

1. 访问 https://infura.io
2. 注册账户并创建新项目
3. 复制项目 ID

## 注意事项

- 确保账户有足够的 Sepolia 测试网 ETH
- 私钥格式必须正确，否则会出现 "Invalid Private Key" 错误
- 请妥善保管私钥，不要提交到版本控制系统

## 故障排除

### InvalidPrivateKeyError 错误

如果遇到 `InvalidPrivateKeyError: Invalid Private Key, Not a valid string or uint8Array` 错误：

1. **检查 .env 文件是否存在**
   ```bash
   ls -la .env
   ```

2. **检查私钥格式**
   - 私钥必须是64位十六进制字符
   - 不包含 `0x` 前缀
   - 示例正确格式: `1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

3. **检查环境变量是否正确加载**
   ```bash
   node -e "require('dotenv').config(); console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? '已设置' : '未设置'); console.log('INFURA_ID:', process.env.INFURA_ID ? '已设置' : '未设置');"
   ```

4. **常见错误**
   - 私钥包含 `0x` 前缀 - 请移除
   - 私钥长度不是64位 - 请检查是否正确复制
   - 私钥包含空格或换行符 - 请确保没有多余字符 