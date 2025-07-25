// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.21;

contract Incrementer {
    uint256 public number;
    
    constructor(uint256 _initialNumber) {
        number = _initialNumber;
    }

    function  increment(uint256 _value) public {
        number = number + _value;
    }

    function reset() public {
        number = 0;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }
}