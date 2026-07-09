## MODIFIED Requirements

### Requirement: Purchase CTA prepared for later commerce integration
The book landing page SHALL include a primary call-to-action that serves as the live entrypoint into the purchase flow while preserving the existing page structure and editorial presentation.

#### Scenario: CTA is present on the landing
- **WHEN** a visitor reviews the book landing page
- **THEN** the page displays a clearly positioned primary purchase CTA tied to the book offer

#### Scenario: CTA initiates live checkout flow
- **WHEN** a visitor activates the primary purchase CTA
- **THEN** the landing initiates the dedicated checkout session flow for the book instead of behaving as a placeholder for a future integration
