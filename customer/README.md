# Customer - The user who proves compliance without disclosure

> The **customer** represents a registered user in the **Issuer** organization.
> He is able to prove he's compliant regarding an **Issuer**'s policy for a
> specific **RWA** without any disclosure of personal information both on-chain
> and off-chain

<!--toc:start-->
- [Customer - The user who proves compliance without disclosure](#customer-the-user-who-proves-compliance-without-disclosure)
  - [Responsibilities of the **Customer**](#responsibilities-of-the-customer)
  - [Trust boundaries](#trust-boundaries)
  - [Interactions in the entire *zhold* system](#interactions-in-the-entire-zhold-system)
    - [Flows](#flows)
  - [A word about the **Customer**](#a-word-about-the-customer)
<!--toc:end-->

## Responsibilities of the **Customer**

1. Create a secret attestation from data obtained from the **Issuer** and keep
   it safe
2. Compute a commitment from aforementioned data and a secret value
3. Send this commitment to the **Issuer** for on-chain storage
4. Generate a **ZKP** locally, binding an EVM address of its choice.
5. Use this **ZKP** to prove he's compliant without any disclosure of personnal
   information

## Trust boundaries

This part of *zhold* is essentially assumed **trustless** excepting for the
**Customer**'s identity that is not proven in the scope of this demonstration.

## Interactions in the entire *zhold* system

### Flows

Flow described here will amend the one defined in [Issuer
flow](/issuer/README.md#flows)

```text
+------------------------------------------------------------------------------+
|     Customer            Issuer            Blockchain            Circuit      |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
|         |        |         |         |         |         |         |         |
+------------------------------------------------------------------------------+
```

## A word about the **Customer**

A lot of work is done **locally** and **never get out** from the **customer**
machine.

> Compliancy without disclosure
