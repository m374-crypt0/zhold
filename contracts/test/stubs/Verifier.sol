// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import { IVerifier } from "../../src/interfaces/IVerifier.sol";

contract Verifier is IVerifier {
  function verify(bytes calldata proof_, bytes32[] calldata publicInputs_) external override returns (bool) { }
}
