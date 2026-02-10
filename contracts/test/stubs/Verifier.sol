// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import { IVerifier } from "../../src/interfaces/IVerifier.sol";

contract Verifier is IVerifier {
  bool private verifyShouldSucceeds_ = true;

  function makeVerificationsFail() external {
    verifyShouldSucceeds_ = false;
  }

  function verify(bytes calldata, bytes32[] calldata) external view returns (bool) {
    return verifyShouldSucceeds_;
  }
}
