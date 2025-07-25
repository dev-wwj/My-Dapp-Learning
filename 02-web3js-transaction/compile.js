const { info } = require('console')
const fs = require('fs')
const solc = require('solc')

const source = fs.readFileSync('Incrementer.sol', 'utf-8')

const input = {
    language: 'Solidity',
    sources: {
        'Incrementer.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
}

const tempFile = JSON.parse(solc.compile(JSON.stringify(input)))
const contractOfIncrementer =  tempFile.contracts['Incrementer.sol']['Incrementer']

module.exports = contractOfIncrementer