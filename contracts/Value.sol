pragma solidity ^0.5.12;

contract Value {

	mapping (string => uint[2]) internal prices; // key => price data [stamp, price]

	function setPrice(string calldata _key, uint _stamp, uint _val) external {
		if (prices[_key][0] < _stamp) prices[_key][1] = _val;
	}

	function getPrice(string memory _key) public view returns (uint) {
		return prices[_key][1];
	}

}
