# circuits - where zero knowledge magic operates

> The **circuits** component contains the underlying logic allowing a
> **customer** to prove its **eligibility** regarding an **issuer**'s
> **policy** by providing only public inputs.

<!--toc:start-->
- [circuits - where zero knowledge magic operates](#circuits-where-zero-knowledge-magic-operates)
  - [Responsibilities](#responsibilities)
  - [Trust boundaries](#trust-boundaries)
    - [noir circuit](#noir-circuit)
    - [Generated solidity verifier smart contract](#generated-solidity-verifier-smart-contract)
  - [Inputs of the circuit](#inputs-of-the-circuit)
    - [private inputs](#private-inputs)
    - [public inputs](#public-inputs)
  - [Interactions in the entire *zhold* system](#interactions-in-the-entire-zhold-system)
    - [Flows](#flows)
  - [Final words](#final-words)
<!--toc:end-->

## Responsibilities

1. Define a sound logic for proving a **customer** eligibility without any ambiguity
2. Do not disclose any private information when verifying the proof
3. Generate a solidity verifier contract to be used by other solidity contract
   functions.

## Trust boundaries

### noir circuit

- The circuit is upgraded with governance, preventing wild update and
  invalidation of the proving system.

### Generated solidity verifier smart contract

- The same as for the circuit, the verifier must not be regenerated without
  governance.

## Inputs of the circuit

> They need to be defined perfectly to ensure a sound and privacy preserving
> logic.

### private inputs

- **customer** identifier
  - very private, obtained from the **issuer** at registration time
- secret **customer** salt
  - A secret value only the **customer** knows

### public inputs

- **policy** properties (specific to this demonstration)
  - the **policy** identifier (exposed by the **issuer**)
  - the scope of the policy (here *holding*)
  - validity time range
  - the ethereum address used to *prove* eligibility
  - the *commitment* computed by the **customer** and stored on-chain by the
    **issuer**

## Interactions in the entire *zhold* system

Essentially two-fold:

1. generate the solidity verifier smart contract
2. compile the circuit to *ACIR* byte code usable by the *barretenberg* proving
   backend at **customer** side.

### Flows

```text
+------------------------------------------------------------------------------+
|        contracts        |        circuits         |         customer         |
|            |            | (1) compile circuit to  |            |             |
|            |            | ACIR      |             |            |             |
|            |            |           |             |            |             |
|            |            | (2) proving backend     |            |             |
|            |<-------------generates solidity      |            |             |
|            |            | verifier smart contract |            |             |
|            |            |           |             |            |             |
|            |            |           |             | (3) executes the circuit |
|            |            |           |             | with public and private  |
|            |            |           |             | inputs using ACIR to get |
|            |            |           |             | the witness|             |
|            |            |           |             |            |             |
|            |            |           |             | (4) generates the proof  |
|            |            |           |             | using the proving        |
|            |            |           |             | backend and the witness  |
|            |            |           |             |            |             |
|            |            |           |             | (5) submit the generated |
|            |<---------------------------------------proof for verification   |
|            |            |           |             |            |             |
+------------------------------------------------------------------------------+
```

## Final words

**circuits** is a critical part of *zhold*. It must be designed carefully, be
crystal clear and updated with string governance rules.
