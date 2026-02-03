// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.33;

import { Script } from "forge-std/Script.sol";
import { Vm } from "forge-std/Vm.sol";

contract LocalDeployScript is Script {
  address private sender;
  address private commitmentStoreOwner;

  function setUp() public {
    sender = vm.envAddress("TEST_SENDER_ADDRESS");
    commitmentStoreOwner = vm.addr(uint256(vm.envBytes32("TEST_PRIVATE_KEY_01")));
  }

  function run() public { }

  // NOTE: To mute uncovered items in coverage reports
  function test() private { }
}

