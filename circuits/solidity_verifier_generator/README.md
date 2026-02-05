# solidity_verifier_generator

> As its name suggests, generates a solidity verifier smart contract from
> abstract circuit intermediate representation using the barretenberg proving
> backend

## Why?

Because there are discrepancies in proving from *bb.js* when the *solidity
verifier* is generated from *bb cli*: generated verifier smart contracts are
different.

> [!warning] to verify
> These discrepancies disappear when the tech stack is the same (*bb.js*) used
> for both:

- generating the *solidity verifier*
- proving

## How

This script is designed to be used in the build process (see [the
makefile](../Makefile)) for more details.
