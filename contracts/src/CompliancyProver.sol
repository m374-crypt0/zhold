// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import { IVerifier } from "./interfaces/IVerifier.sol";

import { CommitmentStore } from "./CommitmentStore.sol";

contract CompliancyProver {
  constructor(IVerifier verifier_, CommitmentStore store_) { }
}
