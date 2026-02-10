// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract CommitmentStore is Ownable {
  error InvalidZeroCommitment();
  error DuplicateCommitment();

  mapping(uint256 => bool) public commitments;

  event CommitmentStored(uint256 commitment_);

  constructor(address owner_) Ownable(owner_) { }

  function commit(uint256 commitment_) external onlyOwner {
    require(commitment_ != 0, InvalidZeroCommitment());
    require(commitments[commitment_] == false, DuplicateCommitment());

    commitments[commitment_] = true;

    emit CommitmentStored(commitment_);
  }
}
