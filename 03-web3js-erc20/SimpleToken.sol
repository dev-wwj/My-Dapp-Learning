// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract SimpleToken is ERC20PresetMinterPauser {
    uint8 private _decimals;
    uint256 public INITIAL_SUPPLY;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initial_supply
     ) ERC20PresetMinterPauser(name, symbol) {
        _decimals = decimals_;
        INITIAL_SUPPLY = initial_supply;
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}

