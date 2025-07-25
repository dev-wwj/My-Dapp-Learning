module.exports = {
    networks: {
        sepolia: {
            http: 'https://sepolia.infura.io/v3/${process.env.INFURA_ID}',
            ws: 'wss://sepolia.infura.io/ws/v3/${process.env.INFURA_ID}'
        }
    },
    gas: {
        limit: 8000000,
    },
    contracts: {
        incrementer: {
            initialValue: 5
        }
    }
}