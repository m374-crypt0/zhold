// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.33;

import { Script } from "forge-std/Script.sol";
import { Vm } from "forge-std/Vm.sol";

import { IPrimeFieldOrderProvider } from "../src/interfaces/IPrimeFieldOrderProvider.sol";

import { CommitmentStore } from "../src/CommitmentStore.sol";
import { PrimeFieldOrderProvider } from "./PrimeFiledOrderProvider.sol";

contract LocalDeployScript is Script {
  address private sender;
  address private commitmentStoreOwner;

  IPrimeFieldOrderProvider pfop;
  CommitmentStore commitmentStore;

  function setUp() public {
    sender = vm.envAddress("TEST_SENDER_ADDRESS");
    commitmentStoreOwner = vm.addr(uint256(vm.envBytes32("TEST_PRIVATE_KEY_01")));
  }

  function run() public {
    vm.startBroadcast();

    pfop = new PrimeFieldOrderProvider();
    commitmentStore = new CommitmentStore(pfop, commitmentStoreOwner);

    vm.stopBroadcast();
  }

  // NOTE: To mute uncovered items in coverage reports
  function test() private { }
}
