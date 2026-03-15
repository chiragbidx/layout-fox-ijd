# Changelog
<!--
  Purpose:
  - Track project change history over time.
  - Record date, summary, and key files touched for each change set.
  - Keep entries append-only (do not delete past entries).
-->

## 2024-05-30
- Added support for real client, project, and invoice management
- Updated Drizzle schema and migration for clients, projects, invoices
- Implemented server actions and UI for dashboard/clients
- Updated sidebar to include "Clients" link
- Files: lib/db/schema.ts, drizzle/0001_add_clients_projects_invoices.sql, drizzle/meta/_journal.json, app/dashboard/clients/actions.tsx, app/dashboard/clients/page.tsx, components/dashboard/sidebar-nav.tsx