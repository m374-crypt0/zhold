# zhold - Prove you can hold any RWA - Privately

> This repository demonstrates a **zero-knowledge eligibility pattern** for
> Real-World Asset (**RWA**) protocols.

It allows an address to **prove compliance with off-chain rules** and obtain
on-chain authorization **without revealing identity, jurisdiction, or private
compliance data**.

The design is **asset-agnostic**, focused on **policy enforcement**, not
tokenization.

---

## The Problem RWA Teams Face

Most RWA protocols do **not** struggle with token mechanics.
They struggle with **compliance without disclosure**.

In practice, RWA teams must enforce rules such as:

- investor eligibility
- jurisdictional constraints
- accreditation requirements
- time-bounded authorizations

But putting this data on-chain is **unacceptable**:

- privacy violations
- regulatory exposure
- irreversible disclosure

The core challenge is:

> How to **prove** eligibility on-chain **without revealing** why the user is
> eligible.

---

## High-Level Approach

This project separates concerns into **three layers**:

- Off-chain compliance
  - An issuer evaluates eligibility using private data.
  - An attestation is issued to the user.
- Zero-Knowledge proof
  - The user proves that the attestation satisfies a given policy.
  - No private data is revealed.
- On-chain enforcement
  - A smart contract verifies the proof.
  - Access is granted or denied based solely on the proof.

The **asset** itself remains **completely decoupled** from the **compliance logic**.

---

## What Is Proven

The zero-knowledge proof demonstrates that:

1. The caller owns a valid attestation issued under a specific policy
2. The attestation matches the policy identifier enforced on-chain
3. The attestation is still within its validity window
4. The proof is cryptographically bound to the on-chain action
5. No private compliance data is disclosed on-chain

The smart contract learns **only** whether the policy is satisfied - _nothing else_.

---

## What Is Not Proven

This system does not prove:

- The user’s identity
- Jurisdiction or residency
- Accreditation details
- The correctness of the off-chain compliance process
- The legal validity of the issuer
- Real-time revocation at scale

These concerns remain **explicitly off-chain**.

---

## Trust Assumptions

This design makes the following assumptions explicit:

- Issuer honesty
  The issuer correctly evaluates eligibility before issuing attestations.
- Circuit correctness
  The zero-knowledge circuit correctly enforces the intended rules.
- Verifier integrity
  The on-chain verifier matches the circuit and is not upgradable without governance.
- Policy governance
  Policy identifiers enforced on-chain are managed through trusted governance.

These assumptions are unavoidable in real-world RWA systems and are
intentionally surfaced.

---

## Why This Matters

This pattern enables:

- Compliance without disclosure
- Privacy-preserving authorization
- Asset-agnostic enforcement
- Modular policy evolution
- Clear separation between regulation and execution

It reflects how **production-grade RWA protocols are expected to operate**,
rather than simplified token demos.

---

## Scope of This Repository

This project focuses on:

- ZK policy enforcement patterns
- Solidity ↔ Noir integration
- Minimal, auditable on-chain logic

It is not a full RWA framework and does not attempt to replace regulatory processes.

---

## Final Note

This repository demonstrates **how** eligibility can be proven — **not who** is
eligible, **nor why**.

That distinction is intentional.
