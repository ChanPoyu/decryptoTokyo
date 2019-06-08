var mapProject = artifacts.require("mapProject");

module.exports = function(deployer) {
    var totalReward = 99999;
    
    // deployment steps
    deployer.deploy(mapProject, totalReward);
};