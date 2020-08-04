const Value = artifacts.require("./Value.sol");

// example test values to set
const key = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZJd0VBWUhLb1pJemowQ0FRWUZLNEVFQUFNRFBnQUVZZk9PdHdwVlB5UWlwMHJMSDhBRk14bFlRU3BCVGJRbwplNm5zUUJMVVMyZVYyU2ZqRm5SNlV0bGVlbzBVa3JGMHBOa09yV205aG90T05VSi8KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==";
const stamp = 1596543447045;
const price = 1000;

contract("Value", accounts => {

	let owner, val;

	before("should prepare accounts", function() {
		owner = accounts[0];
	});

	it("1. Set price", async () => {
		val = await Value.deployed();
		await val.setPrice(key, stamp, price, {from: owner});
		const pr = await val.getPrice.call(key);
		assert.equal(pr.toNumber(), price, "Wrong price value retrieved");
	});

});
