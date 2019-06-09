pragma solidity ^ 0.5.0;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

contract HachiToken is ERC20Mintable{
    string public name = "Hachi";
    string public symbol = "HC";
    uint8 public decimals = 18;
}