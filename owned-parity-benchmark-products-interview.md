# Owned Parity Benchmark Products Interview Log

## Date

April 7, 2026

## Initial Draft

After discovering that the benchmark plan still required manual provisioning of Appsmith, Plane, and Chatwoot environments, the user proposed avoiding that operational dependency by building the products in-house instead.

## Interview Progression

### Round 1

Question:

Should the project replace the external apps with small owned benchmark fixtures, or build broader in-house replacements?

Options presented:

- benchmark-surface replicas only
- mid-fidelity product slices
- full public-product clones

Recommendation given:

- benchmark-surface replicas only

Reasoning:

That path would have kept the benchmark deterministic while avoiding the cost of building three separate products.

User response:

Rejected the narrow option and explicitly chose full feature parity.

Significance:

The work shifted from benchmark-fixture design to a parity-products program.

### Round 2

Question:

What should “full feature parity” mean in a stable way?

Options presented:

- self-hostable or community-visible parity as of April 7, 2026
- current public cloud product parity as of April 7, 2026
- ongoing parity with future upstream releases

Recommendation given:

- self-hostable or community-visible parity frozen on April 7, 2026

Reasoning:

That is the only stable target that can be specified, tested, and completed.

User response:

Accepted the recommendation.

### Round 3

Question:

Should the products share a platform, or should each be a fully separate stack?

Options presented:

- shared platform services with separate product apps
- three fully independent products

Recommendation given:

- shared platform underneath, three distinct product apps on top

Reasoning:

Auth, tenancy, storage, permissions, jobs, audit, and realtime would otherwise be built three times with little benchmark value.

User response:

Accepted the recommendation.

### Round 4

Question:

What should the delivery order be?

Options presented:

- Plane-like first, Chatwoot-like second, Appsmith-like third
- alternate orderings

Recommendation given:

- Plane-like first, Chatwoot-like second, Appsmith-like third

Reasoning:

The project-management product establishes the shared multi-tenant CRUD substrate; the support workspace adds realtime messaging and automation; the app builder is the largest and most complex surface and should be phased last.

User response:

Accepted the recommendation.

### Round 5

Question:

How broad should integrations, admin scope, and Appsmith depth be?

Options presented:

- adapter-first integrations
- true multi-tenant admin and RBAC from the start
- full Appsmith parity phased last

Recommendation given:

- choose all three

Reasoning:

Without adapter-first integrations, the products would stall on provider dependencies. Without real multi-tenancy and admin, they would not meet parity-grade expectations. Without full Appsmith parity, one-third of the benchmark surface would remain strategically hollow.

User response:

Chose the kitchen-sink path, which I interpreted as agreement with the expansive recommendation set.

### Round 6

Question:

What should compatibility, collaboration, and migration scope be?

Options presented:

- workflow parity only versus workflow plus major-resource API compatibility
- full realtime collaboration versus reduced collaboration
- no import/migration versus basic import or direct upstream migration

Recommendation given:

- workflow parity plus major-resource API compatibility
- full realtime collaboration parity
- no import or migration support in v1

Reasoning:

Major-resource API compatibility makes the parity target concrete and testable. Full realtime is required for Plane- and Chatwoot-class behavior. Import and migration were excluded to keep the program from becoming a separate migration business.

User response:

Accepted the recommendations.

### Round 7

Question:

How exact should the UI parity be, what technical stack should underpin the program, and are these products internal or standalone businesses?

Options presented:

- workflow and information-architecture parity versus visual mimicry
- TypeScript monorepo versus mixed-language services or monolith
- internal-first versus fully commercial standalone products

Recommendation given:

- workflow and information-architecture parity, not pixel-perfect cloning
- TypeScript monorepo with shared packages
- internal-first, externalizable later

Reasoning:

Behavioral parity matters to benchmark realism; pixel mimicry does not. The current repo and planned package structure favor a TypeScript monorepo. Internal-first keeps the roadmap centered on the QA platform rather than turning into three unrelated commercial products.

User response:

Accepted the recommendations.

### Round 8

Question:

What branding and finish-line definition should be used?

Options presented:

- distinct internal branding versus lookalike branding
- parity-complete defined by a frozen feature matrix versus looser “usable enough” language

Recommendation given:

- distinct internal names and branding
- parity-complete means a frozen checked-in feature matrix passes, even if some adapters are mock-backed initially

Reasoning:

Distinct branding avoids unnecessary legal and product noise. A feature-matrix finish line is concrete enough to implement and validate.

User response:

Accepted the recommendations.

## Final Decisions

- Build three in-house parity products instead of relying on provisioned Appsmith, Plane, and Chatwoot instances.
- Freeze the parity target to self-hostable or community-visible public surfaces as of April 7, 2026.
- Use a shared TypeScript platform with three separate product apps.
- Deliver in this order: Plane-parity first, Chatwoot-parity second, Appsmith-parity third.
- Preserve workflow and information-architecture parity, not pixel-perfect visual cloning.
- Support major-resource API compatibility for each product.
- Require full realtime collaboration parity where the reference products are collaborative.
- Use adapter-first integrations, with real core adapters and local or mock adapters allowed initially for non-core providers.
- Exclude import and migration support from v1.
- Build true multi-tenant RBAC, admin, audit, and governance from the start.
- Brand the products distinctly as internal-first products that could be externalized later.
- Define completion by a frozen per-product feature matrix that maps to automated tests.

## Source Basis Used During Interview

Official product sources consulted to bound the public parity surface:

- Appsmith docs and widgets pages
- Plane docs and API reference
- Chatwoot features pages and developer docs

## Significant Deviations From Initial Draft

1. The initial fallback was to build only narrow owned fixtures.
Reason for change:
The user explicitly prioritized the broadest possible parity target over a narrower benchmark-only wedge.

2. The initial recovery plan could have kept the products as disposable internal mocks.
Reason for change:
The final direction requires production-grade shared platform architecture, multi-tenancy, admin, and externalizable product quality.

3. The initial idea could have tolerated weak or absent APIs for the owned fixtures.
Reason for change:
The user accepted a stronger recommendation: major-resource API compatibility is part of parity and must be tested.

4. The initial approach could have reduced realtime and integration depth to speed delivery.
Reason for change:
The final spec preserves collaborative and adapter-driven behavior as a first-class requirement.

## Coverage Summary

Covered:

- goal and rationale
- frozen parity target
- legal and branding boundary
- shared platform architecture
- product naming
- parity definition and finish line
- integration model
- collaboration model
- admin, RBAC, and governance
- API compatibility
- delivery order
- scope exclusions

Closing checkpoint:

The user reviewed the coverage summary and confirmed that it looked good before the final specification was written.
