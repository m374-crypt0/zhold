// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import { IPrimeFieldOrderProvider } from "../src/interfaces/IPrimeFieldOrderProvider.sol";
import { IVerifier } from "../src/interfaces/IVerifier.sol";

import { CommitmentStore } from "../src/CommitmentStore.sol";
import { CompliancyProver } from "../src/CompliancyProver.sol";

import { PrimeFieldOrderProvider } from "./stubs/PrimeFieldOrderProvider.sol";
import { Verifier } from "./stubs/Verifier.sol";

import { Test } from "forge-std/Test.sol";

contract CompliancyProverTests is Test {
  address public customer;
  address public issuer;

  IPrimeFieldOrderProvider pfop;
  IVerifier verifier;

  CommitmentStore store;
  CompliancyProver prover;

  function setUp() public {
    issuer = makeAddr("issuer");
    customer = makeAddr("customer");

    pfop = new PrimeFieldOrderProvider();
    store = new CommitmentStore(pfop, issuer);
    verifier = new Verifier();
    prover = new CompliancyProver(verifier, store);
  }
}
