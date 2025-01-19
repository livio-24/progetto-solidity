var Acquisto = artifacts.require('Acquisto'); 
module.exports = function(deployer) {
deployer.deploy(Acquisto, 'Opera', 'Susa'); 
  
};
