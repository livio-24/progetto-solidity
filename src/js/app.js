App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
        $.getJSON('../opere.json', function(data) {
          var Row = $('#Row');
          var Template = $('#Template');
          for (i = 0; i < data.length; i ++) {
            Template.find('.panel-title').text(data[i].Nome);
            Template.find('img').attr('src', data[i].pic);
            Template.find('.Autore').text(data[i].Autore);
            Template.find('.Anno').text(data[i].Anno);
            Template.find('.Costo').text(data[i].Costo);
            Template.find('.btn-buy').attr('data-id', data[i].id);  
            Row.append(Template.html());
          }
    });
    return await App.initWeb3();
  },

  // Inizializza web3 per il provider web su rete "http://localhost:7545" (ethereum)
  initWeb3: async function() {
   // Modern dapp browsers...
   if (window.ethereum) {
     App.web3Provider = window.ethereum;
     try {
       // Request account access
        await window.ethereum.enable();
     } catch (error) {
       // User denied account access...
        console.error("User denied account access")
     }
   }
   // Legacy dapp browsers...
   else if (window.web3) {
     App.web3Provider = window.web3.currentProvider;
   }
   // If no injected web3 instance is detected, fall back to Ganache
   else {
     App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
   }
   web3 = new Web3(App.web3Provider);
   return App.initContract();
 },
 
 // Inizializzo il contratto partendo dal contratto compilato
 initContract: function() { 
    $.getJSON('Acquisto.json', function(data) {
       // Get the necessary contract artifact file and instantiate it with @truffle/contract
       var AcquistoArtifact = data;
       App.contracts.Acquisto = TruffleContract(AcquistoArtifact);
       // Set the provider for our contract
       App.contracts.Acquisto.setProvider(App.web3Provider);
       return App.markBought ();
    });
    App.contracts.Acquisto
    return App.bindEvents();
 },
  
 // Attesa dell'evento di click sul pulsante "Acquista" di classe '.btn-send-money'
 bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleAcquisto);
 },

 markBought : function(buyers, account) {
   var buyInstance;
   App.contracts.Acquisto.deployed().then(function(instance) {
     buyInstance = instance;
     return buyInstance.getBuyers.call();
   }).then(function(buyers) {
     for (i = 0; i < buyers.length; i++) {
       if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
         $('.panel-art').eq(i).find('button').text('Comprata').attr('disabled', true);
       }
     }
   }).catch(function(err) {
        console.log(err.message);
   });
 },

 // Funzione effettuata al click del pulsante "Acquista" per inviare denaro,
 // completare la transazione e terminare il contratto deployato
 handleAcquisto: function(event) {      
    event.preventDefault();   
    var id_opera = parseInt($(event.target).data('id'));
    var venditore = null;     
    $.getJSON('../opere.json', function(data) {
       for (var i = 0; i < data.length; i++) {
          if (data[i].id == id_opera) {
              amount = data[i].Costo;
              break;
          }  
       } //endFor
       var amount = amount;    
       console.log("valore: "+ amount);
       amount = parseFloat(amount);
       // Conversione valore da Ether a Wei
       amount = web3.toWei(amount, "ether");
       var AcquistoInstance;
       window.ethereum.enable().then(function(accounts){
         for (var i = 0; i < accounts.length; i++) {
            console.log(accounts[i]);
          }
         console.log("id_opera: ", id_opera);
         venditore = accounts[1];
         console.log("indirizzo venditore: "+venditore);
         var account = accounts[0];
         console.log("indirizzo utente: "+ account);
         App.contracts.Acquisto.deployed().then(function(instance) {
              AcquistoInstance = instance;
              return AcquistoInstance.trasferimento(account, id_opera,{from: account, value: amount})
              

          }).then(function(result){console.log("Trasferimento completato ");}).catch(function(err) {
                    console.log(err.message);
               });
       }) //end window.ethereum.enable()
    }) //end getJSON
 } //end handle
};

$(function() {
 $(window).load(function() {
   App.init();
 });
});
