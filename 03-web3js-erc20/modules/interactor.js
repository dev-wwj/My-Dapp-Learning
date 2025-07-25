const config = require('../config')

class ContractInteractor {
    constructor(web3, contract) {
        this.web3 = web3
        this.contract = contract
    }

    async transfer(from, to, amount) {
        try {
            console.log(`Transferring ${amount} tokens from ${from.accountAddress} to ${to}...`)

            const transferTx = this.contract.methods.transfer(to, amount).encodeABI();

            // 获取 nonce
            const nonce = await this.web3.eth.getTransactionCount(from.accountAddress, 'pending')
            
            // 获取 gas 价格
            const gasPrice = await this.web3.eth.getGasPrice()
            
            // 估算 gas 费用
            const estimatedGas = await this.contract.methods.transfer(to, amount).estimateGas({ from: from.accountAddress })

            const transferTransaction = await this.web3.eth.accounts.signTransaction(
                {
                    from: from.accountAddress,
                    to: this.contract.options.address,
                    data: transferTx,
                    gas: estimatedGas,
                    gasPrice: gasPrice,
                    nonce: nonce
                },
                from.privateKey
            );

            const receipt = await this.web3.eth.sendSignedTransaction(
                transferTransaction.rawTransaction
            );

            console.log(`Transfer successful, transaction hash: ${receipt.transactionHash}`)
            return receipt
        } catch (error) {
            console.error('Transfer failed:', error)
            throw error
        }
    } 

    async balanceOf(address) {
        try {
            const balance = await this.contract.methods.balanceOf(address).call()
            console.log(`Balance of address ${address}: ${balance}`);
            return balance
        } catch (error) {
            console.error('Failed to query balance:', error);
            throw error
        }
    }

    async totalSupply() {
        try {
            const supply = await this.contract.methods.totalSupply().call();
            console.log(`TOTAL supply: ${supply}`)
            return supply
        } catch (error) {
            console.error('Failed to query total supply:', error);
            throw error;
        }
    }
}

module.exports = ContractInteractor;