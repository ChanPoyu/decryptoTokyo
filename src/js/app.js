App = {
  web3Provider: null,
  contracts: {},
  contractAddress: "",

  init: async function() {
    

    return await App.initWeb3();
  },

  initWeb3: async function() {
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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('mapProject.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var mapProjectArtifact = data;
      App.contracts.mapProject = TruffleContract(mapProjectArtifact);
      App.contracts.mapProject.setProvider(App.web3Provider);

      console.log(App.contracts.mapProject);

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $('#totalReward').click(function(){
      var totalReward = App.getTotalReward();
      console.log('clicked');
      console.log(totalReward);
    });

    $('#addnewcontract').click(function (){
      var newContract = App.createNewProject();
      console.log(newContract);
    });
  },

  getTotalReward : function(){

    var mapProjectInstance = App.contracts.mapProject.at(App.contractAddress);
    
    mapProjectInstance.getTotalReward()
    .then(function(value){
      console.log(value.toNumber());
    })
    .catch(function(err){
      console.dir(err);
    });
  },

  createNewProject : function (){
    App.contracts.mapProject.new(1000).then(function(inst){
      var newMapProInst = inst;

      console.log(newMapProInst);

      // console.log("new contract address : " + newMapProInst.address);

      return newMapProInst.address;
    });

    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
    console.log("yo");
  });
});
