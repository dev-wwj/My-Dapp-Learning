const { error } = require('console')
const fs = require('fs')
const solc = require('solc')

const source = fs.readFileSync('SimpleToken.sol', 'utf8')

function findImports(path) {
    if (fs.existsSync(path)) {
        return {
            contents: fs.readFileSync(path, 'utf8')
        }
    } else if (fs.existsSync('./node_modules/' + path)) {
        return {
            contents: fs.readFileSync('./node_modules/' + path, 'utf8')
        }
    } else {
        return {
            error: 'File not found'
        }
    }
}

const input = {
    language: 'Solidity',
    sources: {
        'SimpleToken.sol': {
            content: source,
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
}

const output = solc.compile(JSON.stringify(input), { import: findImports })
const tempFile = JSON.parse(output)

// 添加错误检查
if (tempFile.errors) {
    console.error('编译错误:')
    tempFile.errors.forEach(error => {
        console.error(error.formattedMessage || error.message)
    })
}

// 检查编译是否成功
if (!tempFile.contracts || !tempFile.contracts['SimpleToken.sol']) {
    throw new Error('编译失败：无法找到 SimpleToken 合约')
}

const contractFile = tempFile.contracts['SimpleToken.sol']['SimpleToken']

if (!contractFile) {
    throw new Error('编译失败：无法找到 SimpleToken 合约的编译结果')
}

module.exports = contractFile
