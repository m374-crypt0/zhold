# circuits — Zero-knowledge eligibility circuits

[![CI - Circuits](https://github.com/m374-crypt0/zk-assets/actions/workflows/ci-circuits.yaml/badge.svg)](https://github.com/m374-crypt0/zk-assets/actions/workflows/ci-circuits.yaml)

> **circuits** is a Noir workspace. Each member defines eligibility rules for a
> specific combination of asset and policy scope. Circuits compile to ACIR
> bytecode for local proof generation and produce a Solidity verifier contract
> deployable by the `contracts` component.

<!--toc:start-->
- [circuits — Zero-knowledge eligibility circuits](#circuits-zero-knowledge-eligibility-circuits)
  - [Workspace structure](#workspace-structure)
    - [Naming convention](#naming-convention)
    - [Current members](#current-members)
  - [Adding a new circuit](#adding-a-new-circuit)
  - [Trust boundaries](#trust-boundaries)
  - [Commands](#commands)
<!--toc:end-->

## Workspace structure

The workspace root is `circuits/Nargo.toml`. Each circuit lives under:

```
circuits/
└── <asset>/
    └── <policy_scope>/
        ├── Nargo.toml                     # circuit package
        ├── README.md
        ├── solidity_verifier_generator/   # bb.js-based verifier generator
        └── src/
            ├── main.nr
            ├── types.nr
            ├── utility.nr
            └── tests.nr
```

`nargo compile` processes all workspace members at once and emits one artifact
per circuit under `circuits/target/`.

### Naming convention

Circuit package names follow the pattern:

```
zk_assets_<asset>_<policy_scope>_v<version>
```

This guarantees that each compiled artifact and generated Solidity verifier is
unambiguously scoped to its asset and policy scope.

### Current members

| Path | Package | Asset | Policy scope |
|---|---|---|---|
| [`rwa_1/hold`](rwa_1/hold/README.md) | `zk_assets_rwa_1_hold_v1` | `rwa_1` | `hold` |

## Adding a new circuit

A new circuit is required whenever the issuer introduces a new asset or a new
policy scope for an existing asset. The steps below show how to register it in
the workspace.

**1. Scaffold the circuit package**

```bash
mkdir -p circuits/<asset>/<policy_scope>/src
```

Create `circuits/<asset>/<policy_scope>/Nargo.toml`:

```toml
[package]
name = "zk_assets_<asset>_<policy_scope>_v1"
type = "bin"
authors = ["..."]
compiler_version = "1.0.0"
entry = "src/main.nr"

[dependencies] # version of dependencies may differ
poseidon = { tag = "v0.2.6", git = "https://github.com/noir-lang/poseidon" }
```

**2. Register it in the workspace**

Add the new path to `circuits/Nargo.toml`:

```toml
[workspace]
members = [
  "rwa_1/hold",
  "<asset>/<policy_scope>",   # ← new entry
]
default-member = "rwa_1/hold" # or another existing member
```

**3. Implement the circuit**

Write `src/main.nr`. Refer to [`rwa_1/hold/src/`](rwa_1/hold/src/main.nr) for
the canonical implementation pattern: private inputs, public inputs, and the
Poseidon2 commitment check.

**4. Add a verifier generator**

Copy `rwa_1/hold/solidity_verifier_generator/` into the new circuit directory
and update the artifact path in `generator.ts` to match the new package name.

**5. Compile and generate the Solidity verifier**

```bash
make circuits compile
make circuits generate_solidity_verifiers
```

**6. Create deployment contracts**

```bash
mkdir contracts/script/verifier/zk_assets_<asset>_<policy_scope>_v<version>
```

Create a pair of contracts *Verifier.sol* and *PrimeFieldOrderProvider.sol* to
implement interfaces and use those contract at deployment time.
Refer to
[`zk_assets_rwa_1_hold_v1`](contracts/script/verifiers/zk_assets_rwa_1_hold_v1)
directory for the canonical implementation pattern.

## Trust boundaries

- **Circuit logic** — each circuit is the ground truth for what "eligible"
  means within its asset/scope combination. Any update must go through
  governance; a changed circuit invalidates all existing proofs for that scope.
- **Generated Solidity verifier** — tightly coupled to the circuit version it
  was generated from. Must not be replaced without governance.
- **Workspace membership** — adding a member to the workspace and deploying its
  verifier is a protocol-level change that must be coordinated with the issuer
  and the contracts deployment.

## Commands

```bash
make circuits compile                     # nargo compile — all workspace members
make circuits generate_solidity_verifiers # compile + write Verifier.sol(s) to contracts/
make circuits test                        # nargo test --show-output
make circuits watch                       # watch mode
```
