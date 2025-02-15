module.exports = {
   
  compilers: {
    solc: {
      version: "^0.8.0", // A version or constraint - Ex. "^0.5.0"
                         // Can be set to "native" to use a native solc or
                         // "pragma" which attempts to autodetect compiler versions
      //docker: "false",  Use a version obtained through docker
      parser: "solcjs",  // Leverages solc-js purely for speedy parsing
      settings: {
        optimizer: {
          enabled: true,
          runs: 200   // Optimize for how many times you intend to run the code
        },
        evmVersion:"istanbul" // Default: "istanbul"
      },
     
    }
    
  },
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777", // Match any network id
    },
    develop: {
      port: 8545
    }
  }
};
