const mapProject = artifacts.require("mapProject");
const Hachitoken = artifacts.require('HachiToken');

module.exports = function(deployer) {
    var totalReward = 99999;
    var coord = [0, 0, 0, 0];
    
    return deployer.then(function(){
        return deployer.deploy(Hachitoken);
    }).then(function(){
        return deployer.deploy(mapProject, totalReward, coord);
    });
    
    
};