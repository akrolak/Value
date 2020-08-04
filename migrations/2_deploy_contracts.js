var Value = artifacts.require("./Value");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Value).then(function(instance) {
    return;
  });
}
