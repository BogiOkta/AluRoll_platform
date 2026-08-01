# AluRoll Configurator — Project Specification

| | |
|---|---|
| Status | Draft |
| Version | 0.5 |
| Last updated | 2026-08-01 |
| Canonical language | English (Serbian translation: `ALUROLL_CONFIGURATOR_PROJECT_SR.md`) |

## 1. Introduction

This document defines what the AluRoll Configurator must achieve. It is written to be simple, practical, and easy to keep up to date — not a formal enterprise specification.

It is the input for the next phase: generating the first UX concepts in v0, and can serve as a functional assignment for a software company building version 1. It describes the product's purpose, users, journey, and behavior. It intentionally avoids describing how the product will be built (technology, architecture, screens).

## 2. Product Vision

AluRoll Configurator lets a customer configure a roller shutter in a few minutes, without needing to understand manufacturing terminology, and arrive at a result that is guaranteed to be technically valid and buildable.

Version 1 is a B2B web product for buyers, resellers, and installers. It does not need to support direct end-consumer (B2C) access yet, but the customer-facing flow must stay simple enough to support that later without being redesigned.

## 3. Business Problem

Choosing a roller shutter today requires knowledge the customer usually doesn't have — compatible dimensions, materials, and mechanisms are not obvious, and getting them wrong causes rework and delay. There is currently no simple, self-service way for a customer to reach a valid configuration on their own.

*Open: the exact current process and its cost are not yet documented — not required for the first v0 prototype.*

## 4. Product Goals

- Let a customer configure a roller shutter correctly, without expert knowledge, in only a few minutes.
- Guarantee that every finished configuration is technically valid — invalid combinations should never be reachable.
- Keep the customer experience short and simple: one clear decision at a time, plain customer language instead of manufacturing terminology.
- Show the customer only choices that are currently relevant and valid; prevent invalid states instead of reporting errors afterward.
- Give the customer immediate visual feedback and clear progress through the flow.
- Make it easy to correct a previous choice without restarting.
- Let each manufacturer control its own product options, rules, and how a result maps to its systems — without needing developer help.
- Hand off a finished configuration cleanly so existing systems (quotation, ERP, production) can take it from there.
- Deliver a professional, modern B2B experience that works desktop-first and is fully usable on tablets.

## 5. Users

- **Customer** — a B2B buyer, reseller, or installer configuring roller shutters for their own project or a client's. Wants a fast, guided, jargon-free experience. Direct B2C access is not part of version 1.
- **Manufacturer administrator** — sets up and maintains the product options, rules, and integration mapping for their own catalog. Can be a power user; a steeper learning curve is acceptable here, since this is a separate, more technical experience than the customer flow.

## 6. Customer Journey

The version 1 journey, described functionally rather than screen by screen:

1. The customer opens an existing project or creates a new one.
2. The customer adds a position to the project — one roller shutter to configure.
3. The customer enters the basic information and dimensions for that position.
4. The customer moves through a short, guided sequence of product choices, one decision at a time.
5. As the customer chooses, the visual preview and configuration summary update immediately.
6. The customer reaches a complete, valid configuration for that position — no manual checking required.
7. The customer saves the position, duplicates it to create a similar one, or adds another position.
8. The customer reviews all positions in the project.
9. The customer confirms the project, producing a complete, technically valid configuration handed off for further processing outside the configurator.

The exact sequence and content of roller-shutter questions in step 4 is intentionally not defined here — it will be refined through the v0 prototype.

## 7. Functional Overview

### Projects

- A project is how a customer organizes their work — for example, a building or a job.
- A project contains one or more positions.
- A customer can save an unfinished project and continue later.

### Positions

- A position represents one configured roller shutter and has a quantity.
- A position can be duplicated and then adjusted, to speed up configuring similar items.

### Guided configuration

- Configuration happens through a short guided flow, not a long technical form.
- One clear decision is presented at a time.
- Only choices that are currently relevant and valid are shown — invalid combinations are prevented rather than flagged afterward.
- Customer-facing language is plain and product-oriented, never internal manufacturing terminology or codes.
- A completed position should take the customer only a few minutes.

### Visual preview and live summary

- The customer sees an immediate visual representation, or a clear product preview, that updates as choices are made.
- On desktop, a live configuration summary stays visible throughout the flow.
- Version 1 does not require advanced 3D visualization — a clear 2D or representative visual preview is sufficient.

### Project review and confirmation

- Before confirming, the customer reviews all positions in the project.
- Confirming the project produces a complete, technically valid configuration for every position, ready for further processing.

### Automatic product-rule behavior

Handled automatically, without customer effort:
- Checking each choice against the manufacturer's dependency and validity rules.
- Filtering displayed choices down to what remains valid given prior selections.
- Assembling the finished configuration into a result the manufacturer's systems can use.
- Matching the configuration to the manufacturer's own product/item codes.

### Information hidden from the customer

- Manufacturing rule logic, dependency structures, or validation mechanics.
- Manufacturer-internal product/item codes.
- Pricing/costing logic and production details.

## 8. Administration

Manufacturer administration is a separate, more technical experience from the customer flow, intended for an authorized manufacturer user. At functional level, it must let that user maintain, for their own catalog only:

- Available product choices.
- The values shown to customers for each choice.
- Labels, descriptions, and supporting images for choices and values.
- The ordering and visibility of choices.
- Dependencies between choices.
- Dimension and compatibility restrictions.
- Automatic selections, where appropriate (e.g., a value that should default or be pre-set given other choices).
- Mapping of a valid finished configuration to the manufacturer's item/product codes.
- Activation or deactivation of catalog content.

Administration is expected to be more detailed and technical than the customer experience — the person configuring rules is assumed to understand the product domain. The administration screens and the rule language itself are not designed in this document.

*Open: who performs this administration day-to-day, and what tooling/workflow they need, is not yet defined — not required for the first v0 prototype.*

## 9. Integration

The configurator's job ends at producing a finished, valid configuration. It does not create quotations, orders, work orders, or production documents itself.

- The finished configuration is matched to the manufacturer's own product/item codes.
- Existing external systems (quotation, ERP, production/work-order systems) take that result and generate whatever they need — the configurator does not perform those steps.

*Open: the exact handoff mechanism and data format are not yet defined — not required for the first v0 prototype.*

## 10. MVP Scope

### Included in version 1

- B2B user access.
- Project list and project editing.
- Multiple positions per project.
- Guided configuration of roller shutters.
- Dimensions and core configurable choices.
- Dynamic filtering to valid choices.
- Visual preview.
- Live configuration summary.
- Save and continue later.
- Duplicate position.
- Project review and confirmation.
- Basic manufacturer administration of choices, rules, and mappings.
- One defined handoff format that can be consumed by an external system.

### Not required in version 1

- Direct B2C sales.
- Online payment.
- Quotation calculation.
- Order and work-order creation.
- Production planning.
- Advanced 3D rendering.
- CAD or technical drawing generation.
- Multiple ready-made ERP integrations.
- Advanced analytics.
- Support for product families other than roller shutters.

## 11. Future Ideas

Not committed — possible directions after the first version:

- Support for product domains beyond roller shutters.
- Direct end-consumer (B2C) access.
- Richer administration tools (e.g., testing rules before publishing them).
- Support for more external systems.

## 12. Delivery Approach and Version 1 Boundaries

### Initial reference

- The ELBI roller-shutter configurator is the initial functional reference for version 1.
- Version 1 may use the same general functional idea and product-selection flow as a starting point.
- The ELBI visual design must not be copied.
- AluRoll must provide a substantially more modern, clearer, faster, and more professional user experience.
- The initial goal is not to invent the most advanced configurator on the market, but to produce a strong, usable, modern first version quickly.

### Version 1 boundary

- Version 1 focuses only on roller-shutter configuration.
- The customer flow must be short and should normally be completed in a few minutes.
- The customer should see only understandable and currently valid options.
- Technical complexity, internal codes, dependency logic, and manufacturing knowledge remain hidden.
- The administration experience may be more technical and detailed.
- The administration must allow the manufacturer to maintain choices, content, validity rules, dependencies, and internal-code mappings without routine developer intervention.
- Version 1 should cover the essential customer capabilities of the reference configurator while improving usability and administration.
- Features outside this initial boundary remain future possibilities and must not delay version 1.

### Extensibility principle

- The product should solve the initial roller-shutter use case cleanly rather than attempting to support every future product immediately.
- The functional model should nevertheless avoid assumptions that would make later support for related configurable products unnecessarily difficult.
- Future extensibility is a design constraint, not a reason to expand version 1 scope.

### Design and delivery workflow

1. The synchronized EN/SR project specification defines the approved functional scope.
2. ChatGPT is used for product reasoning, market-reference analysis, UX decisions, and preparation of focused prompts.
3. Claude Code maintains the synchronized project specification and incorporates only approved decisions.
4. v0 is used to generate and iterate modern React-based UX prototypes from the approved project definition.
5. The v0 prototype is reviewed and corrected before production implementation begins.
6. The approved UX is then implemented in the project repository using the selected production stack.
7. Documentation is updated when approved UX or functional decisions materially change.

Additional principles:

- v0 is a prototyping and design tool, not the source of business rules.
- Visual concepts generated by v0 are proposals and become requirements only after review and approval.
- The project specification remains the functional source of truth.
- The approved prototype becomes the visual and interaction reference for implementation.

### Working principle

Use the reference workflow as a starting point, but redesign the experience.
