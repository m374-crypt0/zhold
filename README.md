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
  - [User flows](#user-flows)
    - [User registration](#user-registration)
    - [Proving eligibility without disclosure](#proving-eligibility-without-disclosure)
    - [A word about Revocation](#a-word-about-revocation)
  - [Final Note](#final-note)
<!--toc:end-->

## Purposes

It allows an address to **prove compliance with off-chain rules** and obtain
on-chain authorization **without revealing identity, jurisdiction, or private
compliance data**. Here, the compliance is all about **holding** a **RWA**.

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

- Off-chain **compliance*
  - An **issuer** evaluates eligibility using private data.
  - An attestation built by the **customer** using **policy** properties and a
    local secret.
- Zero-Knowledge proof
  - The eligible **customer** builds a secret note and a commitment. Only the
    commitment is transmitted to the **issuer**
  - No private data is revealed.
- On-chain enforcement
  - The **Issuer** record the commitment on-chain
  - A smart contract verifies the proof.
  - Eligibility is granted or denied based solely on the proof and public
    inputs.

The **asset** itself remains **completely decoupled** from the **compliance logic**.

---

## What Is Proven

The zero-knowledge proof demonstrates that:

1. The caller owns a valid attestation issued under a specific policy
2. The attestation matches the policy properties enforced on-chain thanks to
   the commitment
3. The attestation is still within its validity window (or any policy property)
4. The proof is cryptographically bound to the on-chain action (thanks to the
   commitment and the circuit logic)
5. No private compliance data is disclosed on-chain

The smart contract learns **only** whether the policy is satisfied - *nothing else*.

---

## What Is Not Proven

This system does not prove:

- The **customer**’s identity
- Jurisdiction or residency
- Accreditation details
- The correctness of the off-chain compliance process
- The legal validity of the **issuer**
- Real-time revocation at scale

These concerns remain **explicitly off-chain**.

---

## Trust Assumptions

This design makes the following assumptions explicit:

- **Issuer honesty**: The **issuer** correctly evaluates eligibility before
  issuing attestations.
- **Circuit correctness**: The zero-knowledge circuit correctly enforces the
  intended rules.
- **Verifier integrity**: The on-chain verifier matches the circuit and is not
  upgradable without governance.
- **Policy governance**: Policy identifiers enforced on-chain are managed
  through trusted governance.

These assumptions are **unavoidable** in real-world RWA systems and are
intentionally surfaced.

---

## Scope of This Repository

This project focuses on:

- ZK policy enforcement patterns (about **holding eligibility**)
- Solidity ↔ Noir integration
- Minimal, **auditable** on-chain logic
- Minimal, **auditable** off-chain logic (circuit)

It is not a full RWA framework and does not attempt to replace regulatory processes.

---

## User flows

```text
User
 │
 │  KYC / Registration (off-chain)
 │
 ▼
Issuer
 │
 │  report customer eligibility
 │
 ▼
User (local)
 │
 │  ZK proof generation
 │
 ▼
Smart Contract
 │
 │  ZK proof verification
 │
 ▼
Access granted / denied
```

### User registration

> A user want to register on the platform and prove privately he can hold a RWA
> from this platform.

- input
  - Private information for KYC
- output
  - customer id
- Trust boundary
  - Occurs here, during registration, where the issuer gathers customer private
    information

### Proving eligibility without disclosure

> A user can verify on-chain the eligibility on-chain wihtout any disclosure

- input
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
- trust boundary
  - Those listed in [Trust Assumptions section](#trust-assumptions)

### A word about Revocation

As noted in [What is not Proven section](#what-is-not-proven) Real time
revocation at scale is not covered.
However, this system allow easy revocation by two means:

1. by manually invalidating commitment on-chain
2. automatically as each policy has a time validity

No need to submit a new KYC.

---

## Final Note

> As soon as the **customer** is registered, the platform is entirely optional,
> the proof is 100% locally generated

This repository demonstrates **how** compliancy can be proven — **not who** is
eligible, **nor why**.

That distinction is intentional.
