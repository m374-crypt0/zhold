# Issuer - The Organization managing Real World Assets

> The **Issuer** represents the *organization* having real world assets, minting
> their **tokenized** representations for their **customers** if they are
> eligible to *hodl* them

<!--toc:start-->
- [Issuer - The Organization managing Real World Assets](#issuer-the-organization-managing-real-world-assets)
  - [Responsibilities of the **Issuer**](#responsibilities-of-the-issuer)
  - [Trust boundaries](#trust-boundaries)
  - [Interactions in the entire *zhold* system](#interactions-in-the-entire-zhold-system)
    - [Flows](#flows)
  - [A word about the **Issuer** platform](#a-word-about-the-issuer-platform)
<!--toc:end-->

## Responsibilities of the **Issuer**

1. Expose a way for potential a **Customer** (**prospects**) to register
2. Expose all supported **policies** and their properties regarding managed
   **RWA**
3. Handles **attestation** demands from **customer** to ensure **compliancy and
   regulation** obligations **without disclosure** of private information about
   them only storing **commitments** on-chain.

## Trust boundaries

The **Issuer** is assumed *trustful* for:

- Managing **RWA** regarding *laws, regulation and compliancy* disposals that
are currently in application in its *jurisdiction*.
- Ability to **protect it's customer private information**.
- Ensuring **customer** compliancy **without disclosure**

## Interactions in the entire *zhold* system

Regarding the [purpose of zhold](../README.md/#purposes), we can see the
**Issuer** sub system must interact with:

- A potential **prospect** that is not yet registered in the platform
- A registered **customer** for him to :
  - query information about supported **policies**
  - ask for *eligibility* regarding a specific **policy**
  - submit a **commitment** if eligible regarding a specific **policy**
- The **blockchain** to persist or **revoke** an **eligibility** commitment

### Flows

```text
+------------------------------------------------------------------------------+
|    Prospect             Issuer              Customer           Blockchain    |
|       |                   |                     |                   |        |
| (1) Register on           |                     |                   |        |
| the Issuer's    --------->|                     |                   |        |
| platform giving           |                     |                   |        |
| private info              |                     |                   |        |
|       |                   |                     |                   |        |
|       |            (2) Successful               |                   |        |
|       |            registration in              |                   |        |
|       |<-----------(1) returns a                |                   |        |
|       |            customer id and              |                   |        |
|       |            the prospect                 |                   |        |
|       |            becomes a                    |                   |        |
|       |            customer                     |                   |        |
|       |                   |                     |                   |        |
|       |                   |            (3) ask for                  |        |
|       |                   |<-----------policy list                  |        |
|       |                   |                     |                   |        |
|       |            Returns a list of            |                   |        |
|       |            policy id in     ----------->|                   |        |
|       |            response of (3)              |                   |        |
|       |                   |                     |                   |        |
|       |                   |            (4) ask for                  |        |
|       |                   |<-----------policy properties            |        |
|       |                   |                     |                   |        |
|       |            Returns a policy             |                   |        |
|       |            property list in ----------->|                   |        |
|       |            response of (4)              |                   |        |
|       |                   |                     |                   |        |
|       |                   |            (5) Submit an                |        |
|       |                   |<-----------eligibility                  |        |
|       |                   |            record   |                   |        |
|       |                   |                     |                   |        |
|       |            (6) If the                   |                   |        |
|       |            customer                     |                   |        |
|       |            is eligible in               |                   |        |
|       |            (5), ensure it   ------------------------------->|        |
|       |            can be recorded              |                   |        |
|       |            on-chain                     |                   |        |
|       |                   |                     |                   |        |
|       |            (7) Revoke a     ------------------------------->|        |
|       |            commitment                   |                   |        |
|       |                   |                     |                   |        |
+------------------------------------------------------------------------------+
```

## A word about the **Issuer** platform

Only useful within its [Trust boundaries](#trust-boundaries).
