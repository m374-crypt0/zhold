// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import { CommitmentStore } from "../src/CommitmentStore.sol";

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { Test } from "forge-std/Test.sol";

contract CommitmentStoreTests is Test {
  address private issuer;
  CommitmentStore store;

  function setUp() public {
    issuer = makeAddr("issuer");
    store = new CommitmentStore(issuer);
  }

  function test_deploy_fails_forZeroAdressOwner() public {
    vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableInvalidOwner.selector, address(0)));

    new CommitmentStore(address(0));
  }

  function test_commit_fails_storingZeroCommitment() public {
    vm.startPrank(issuer);

    vm.expectRevert(CommitmentStore.InvalidZeroCommitment.selector);
    store.commit(0);

    vm.stopPrank();
  }

  function test_commit_fails_whenNotCalledByOwner() public {
    vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, address(this)));
    store.commit(1);
  }

  function test_commit_emit_whenCommitmentIsStored() public {
    vm.startPrank(issuer);

    vm.expectEmit();
    emit CommitmentStore.CommitmentStored(1);
    store.commit(1);

    vm.stopPrank();
  }

  function test_commit_fails_atStoringSameCommitmentTwice() public {
    vm.startPrank(issuer);

    store.commit(1);

    vm.expectRevert(CommitmentStore.DuplicateCommitment.selector);
    store.commit(1);

    vm.stopPrank();
  }
}
