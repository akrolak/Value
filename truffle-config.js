module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      skipDryRun: true
    },
    ganache:{
      host:"127.0.0.1",
      port:8545,
      network_id:"*",
      skipDryRun: true
    },
  }
};
