const Acquisto = artifacts.require("Acquisto");


// Creazione contratto di test per controllare gli esiti delle transazioni e gli eventuali problemi di sicurezza
contract("Acquisto", async accounts => {

  it("dovrebbe effettuare acquisto", async () => {
  
    await Acquisto.deployed().then(function(instance) {
       
       newOwner = instance.change_owner(accounts[0]);
       console.log(newOwner);
       const Owner = accounts[0];
       const account = accounts[1];
       const operaId = 0;
       const amount = web3.utils.toWei("10", "ether");
       ownerAddress=instance.trasferimento(account, operaId, {from: account, value: amount});
       return ownerAddress;
    })  
  });
});

