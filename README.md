# zhold - Prove you can hold any RWA - Privately

> This repository demonstrates a **zero-knowledge eligibility pattern** for
> Real-World Asset (**RWA**) protocols.

<!--toc:start-->
- [zhold - Prove you can hold any RWA - Privately](#zhold-prove-you-can-hold-any-rwa-privately)
  - [Purposes](#purposes)
  - [The Problem RWA Teams Face](#the-problem-rwa-teams-face)
  - [High-Level Approach](#high-level-approach)
  - [What Is Proven](#what-is-proven)
  - [What Is Not Proven](#what-is-not-proven)
  - [Trust Assumptions](#trust-assumptions)
  - [Scope of This Repository](#scope-of-this-repository)
  - [Architecture](#architecture)
  - [User flows](#user-flows)
    - [Customer registration](#customer-registration)
    - [Building a ZKP locally](#building-a-zkp-locally)
    - [Proving eligibility on-chain](#proving-eligibility-on-chain)
    - [A word about Revocation](#a-word-about-revocation)
  - [Final Note](#final-note)
<!--toc:end-->

## Purposes

It allows an address to **prove compliance with off-chain rules** and obtain
on-chain authorization **without revealing identity, jurisdiction, or private
compliance data**.

> Here, the compliance is all about **holding** a **RWA**.

The design is **asset-agnostic**, focused on **policy enforcement**, not
tokenization.

---

## The Problem RWA Teams Face

Most RWA protocols do **not** struggle with token mechanics.
They struggle with **compliance without disclosure**.

In practice, RWA teams must enforce rules such as:

- 💵 investor eligibility
- 📜 jurisdictional constraints
- 🔑 accreditation requirements
- 🕑 time-bounded authorizations

But putting this data on-chain is **unacceptable**:

- 🚫 privacy violations
- 🔒 regulatory exposure
- ⚰️ irreversible disclosure

The core challenge is:

> How to **prove** eligibility on-chain **without revealing** why the user is
> eligible.

---

## High-Level Approach

This project separates concerns into **three layers**:

- Off-chain **compliance**
  - An **issuer** evaluates eligibility using private data.
  - An attestation built by the **customer** using **policy** properties and a
    local secret.
- Zero-Knowledge proof
  - From the **customer**'s attestation, a commitment is computed.
  - The commitment is transmitted to the **issuer**
  - No private data is revealed.
- On-chain enforcement
  - The **Issuer** record the commitment on-chain
  - A smart contract verifies the proof provided by the **customer**
  - Eligibility is granted or denied based solely on the proof and public
    inputs.

The **asset** itself remains **completely decoupled** from the **compliance logic**.

---

## What Is Proven

The zero-knowledge proof demonstrates that:

1. The caller is **eligible** under a specific policy
2. The **eligibility** is still within its validity window (or any policy property)
3. The proof is cryptographically bound to the on-chain action and a specific
   EVM address (thanks to the commitment and the circuit logic)
4. No private data is disclosed on-chain

The smart contract learns **only** whether the policy is satisfied - *nothing else*.

---

## What Is Not Proven

This system does not prove:

- The **customer**’s identity
- Jurisdiction or residency
- Accreditation details
- The correctness of the off-chain compliance process
- The legal validity of the **issuer**
- Real-time revocation at scale (manual revocation is possible)

---

## Trust Assumptions

This design makes the following assumptions explicit:

- **Issuer honesty**: The **issuer** correctly evaluates eligibility before
  recording **customer**'s commitments on-chain.
- **Circuit correctness**: The zero-knowledge circuit correctly enforces the
  intended rules.
- **Verifier integrity**: The on-chain verifier matches the circuit and is not
  upgradable without governance.
- **Policy governance**: Policies  are managed through trusted governance by
  the **issuer**

These assumptions are **unavoidable** in real-world RWA systems and are
intentionally surfaced.

---

## Scope of This Repository

This project focuses on:

- ZK policy enforcement patterns (about **holding eligibility**)
- Solidity ↔ Noir integration
- Minimal, **auditable** on-chain logic
- Minimal, **auditable** off-chain logic (circuit, proof generation and
  verification)

It is not a full RWA framework and does not attempt to replace regulatory processes.

---

## Architecture

Simple, main components are actually sub-directories of this repositories.
Built with [rake](https://github.com/m374-crypt0/rake), to manipulate each
components with a dedicated Makefile directly from the root of this repository.
For instance: `make circuits compile` or `make contracts test`

```text
circuits/
   |
   `- All stuff regarding the circuit, implemented using noir
      The customer generates a ZKP locally
      This ZKP is passed through a solidity verifier smart contract
   |
contracts/
   |
   `- Both business contract and verifier for ZKP
      The customer use them to prove his eligibility regarding holding an RWA
      The issuer commit or revoke a commitment of a customer
   |
customer/
   |
   `- Typescript local scripts to verify eligibility on-chain
issuer
   |
   `- An API to emulate a RWA provider/trader
```

---

## User flows

```text
Prospect
 │
 │  KYC / Registration (off-chain)
 │
 ▼
Issuer
 │
 │  report customer eligibility
 │
 ▼
Customer (local)
 │
 │  ZK proof generation
 │
 ▼
Blockchain
 │
 │  ZK proof verification
 │
 ▼
Customer is allowed or denied to hold a RWA regarding the proving outcome
```

### Customer registration

> A user want to register on the platform and prove privately he can hold a RWA
> from this platform.

- **input**
  - Private information for KYC
- **output**
  - customer id
- **Trust boundary**
  - Occurs here, during registration, where the issuer gathers customer private
    information

### Building a ZKP locally

- **input**
  - a customer id from the registration
  - The ethereum address the customer will use to verify the ZK proof on-chain
  - Any public policy records
    - id of the policy
    - validity time interval
    - Scope
    - 󰇘 (**extensible** as needed)
  - A secret value of his choosing
- output
  - eligibility status (user is **compliant** or not)
  - A **ZKP** to be used later on-chain using the provided EVM address
    beforehand
- trust boundary
  - Those listed in [Trust Assumptions section](#trust-assumptions)

### Proving eligibility on-chain

> A customer can verify on-chain the eligibility without any disclosure of
> private data

- **input**
  - A previously generated **ZKP**
  - A set of public inputs (**policy** properties, sender EVM address)
- **output**
  - **Eligibility** status confirmed on-chain
- **Trust boundary**
  - Circuit correctness
  - Verifier integrity

### A word about Revocation

As noted in [What is not Proven section](#what-is-not-proven) Real time
revocation at scale is not covered.
However, this system allow easy revocation by two means:

1. by manually invalidating commitment on-chain
2. automatically as each policy has a time validity

No need to submit a new KYC.

---

## Final Note

> As soon as the **customer** is registered and asked for on-chain eligibility
> **commitment** store, the **issuer** is entirely optional, the proof is 100%
> locally generated

This repository demonstrates **how** compliancy can be proven — **not who** is
eligible, **nor why**.

That distinction is intentional.
