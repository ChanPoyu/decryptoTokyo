App = {
  web3Provider: null,
  contracts: {},

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

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $('#totalReward').click(function(){
      App.getTotalReward();
    });

    $('#addnewcontract').click(function (){
      var rewardVal = Number($("input[type=text][name=rewardVal]").val());
      if(rewardVal){
        App.createNewProject(rewardVal);
      }
    });
  },

  getTotalReward : function(contractAddress){

    var mapProjectInstance = App.contracts.mapProject.at(contractAddress);
    
    mapProjectInstance.getTotalReward()
    .then(function(value){
      console.log(value.toNumber());
    })
    .catch(function(err){
      console.dir(err);
    });
  },

  createNewProject : function (rewardValue, coord){

    var geoString = String(coord);
    var geoStringArr = geoString.split(',');
    var temp = [];
    geoStringArr.forEach(str => temp.push(str.split('.')));
    var parsedGeoArr = [];
    for (var i = 0; i < 2; i ++){
      parsedGeoArr.push(temp[i][0]);
      parsedGeoArr.push(temp[i][1]);
    }

    App.contracts.mapProject.new(rewardValue, parsedGeoArr).then(function(inst){
      var newMapProInst = inst;

      App.contractAddress = newMapProInst.address;
      console.log(App.contractAddress);

      /******* 
       add logic to store contract address to database  

       $.ajax({
         url : '',
         type : '',
         data : {

         }
       })
       .done(function(data){

       })
       .fail(function(err){

       })
       .always(function(){

       });
       *********************/

      return newMapProInst.address;
    });

  },

  addPost : function(contractAddress, posterAddress, imageHash, ipAddress, geoCoordinate){
    
    var geoString = String(geoCoordinate);
    var geoStringArr = geoString.split(',');
    var temp = [];
    geoStringArr.forEach(str => temp.push(str.split('.')));
    var parsedGeoArr = [];
    for (var i = 0; i < 2; i ++){
      parsedGeoArr.push(temp[i][0]);
      parsedGeoArr.push(temp[i][1]);
    }
    
    var mapProjectInstance = App.contracts.mapProject.at(contractAddress);
    var length = 0;
    mapProjectInstance.getContractGeoCoord()
    .then(function(data){
      var coord = [];
      var geoCord = [];
      for(var i = 0; i < 4; i ++){
        coord.push(String(data[i].toNumer()));
      }
      geoCord.push(Number(coord[0] + "." + coord[1]));
      geoCord.push(Number(coord[2] + "." + coord[3]));

      length = 5;
      
    })

    if(length >= 10){
      return;
    }else{
      amapProjectInstance.addPost(posterAddress, imageHash, ipAddress, parsedGeoArr)
      .then(function(tx){

        if(tx){
          /* handle tx send to db

        $.ajax({
          url : '',
          type : '',
          data : {

          }
        })
        .success(function(data){

        })
        .fail(function(err){

        })
        .always(function(){

        });
        */

        console.log(tx);
        }
        
      })
      .catch(function(err){

      });
    }
    
    

  }

};

$(function() {
  $(window).load(function() {
    App.init();
    console.log("yo");
  });
});
