## ADDED Requirements

### Requirement: Dedicated book landing page
The site SHALL provide a dedicated page for the book as an isolated marketing surface within the existing Carobra website.

#### Scenario: User opens the book page
- **WHEN** a visitor navigates to the book route
- **THEN** the site displays a dedicated landing page focused on the book instead of embedding the experience into existing pages

#### Scenario: Existing pages remain intact
- **WHEN** the book landing is added to the site
- **THEN** the current home, services, contact, career, benefits, and about pages remain functionally unchanged except for minimal linking to the book page

### Requirement: Navigation entry to the book page
The site SHALL expose the book landing page through the shared primary navigation so visitors can discover it from anywhere in the site.

#### Scenario: Desktop navigation includes the book
- **WHEN** a user views the primary navigation on desktop
- **THEN** the navigation includes a visible link to the book page

#### Scenario: Mobile navigation includes the book
- **WHEN** a user opens the mobile navigation
- **THEN** the navigation includes a visible link to the book page

### Requirement: Editorial visual treatment aligned with Carobra
The book landing page SHALL use a more editorial and product-focused composition while remaining visually compatible with Carobra brand foundations.

#### Scenario: Brand continuity is preserved
- **WHEN** a visitor compares the book landing with the rest of the site
- **THEN** typography, palette anchors, and shared layout conventions identify the page as part of Carobra

#### Scenario: Product identity is visually prioritized
- **WHEN** a visitor lands on the book page
- **THEN** the book artwork, title, and product presentation receive stronger visual emphasis than in standard institutional pages

### Requirement: Content discipline based on validated inputs
The book landing page SHALL only present claims, descriptions, and content details that are supported by the approved book document or provided assets.

#### Scenario: Validated content is available
- **WHEN** the team provides confirmed description, pricing, or thematic points
- **THEN** the landing uses that information in the corresponding sections

#### Scenario: Validated content is missing
- **WHEN** a section would require unsupported claims or invented detail
- **THEN** the landing omits that claim, uses a visual-only treatment, or marks the content as pending input instead of fabricating copy

### Requirement: Purchase CTA prepared for later commerce integration
The book landing page SHALL include primary call-to-action placement that can be connected to the future commerce flow without redesigning the page.

#### Scenario: CTA is present before checkout implementation
- **WHEN** the initial landing is delivered before the commerce backend is complete
- **THEN** the page still includes a clearly positioned primary purchase CTA

#### Scenario: CTA evolves into checkout entrypoint
- **WHEN** the commerce flow is implemented in a later phase
- **THEN** the existing CTA can be connected to that flow without requiring a structural redesign of the landing
