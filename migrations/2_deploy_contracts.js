const MainContract = artifacts.require("MainContract");
const Election = artifacts.require("Election");

module.exports = function(deployer) {
    deployer.deploy(MainContract);
};