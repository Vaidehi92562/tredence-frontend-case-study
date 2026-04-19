Design Decisions
Used React + TypeScript + Vite for fast development, clean structure, and strong type safety.
Used React Flow because the assignment is fundamentally graph-driven and required node-based interactions.
Chose a local mock API layer because the task explicitly allowed mocks and did not require backend persistence.
Built a live configuration panel so reviewers can inspect and edit node properties in real time.
Added workflow validation so the prototype demonstrates graph reasoning instead of only static UI.
Added a simulation timeline so the flow can be tested like a product, not just displayed.
Used a more premium visual direction to make the submission feel like a real internal tool rather than a standard student assignment.
Structured the code so node rendering, workflow logic, validation logic, mock APIs, and UI panels remain independently maintainable.


Assumptions
No authentication was implemented because it was not required.
No backend persistence was added because the task asked for a functional prototype, not a production backend system.
Simulation results are mock-driven and intended to demonstrate workflow behavior and frontend architecture.
Templates are preloaded so reviewers can immediately test the experience without needing to build a graph from scratch.
Validation rules are intentionally practical and reviewer-friendly rather than overly strict.


What I Completed
React application using Vite
React Flow based workflow canvas
multiple custom node types
drag-and-drop node creation
node connection and edge deletion
live editable configuration panel
dynamic automated-step configuration from mock automation definitions
mock API integration
graph validation
workflow simulation / sandbox execution timeline
JSON export and copy functionality
starter templates for HR workflows
upgraded product-style UI and intro experience



What I Would Add With More Time
undo / redo support
import JSON
auto-layout for large graphs
inline validation badges directly on nodes
node version history
richer branching simulation logic
persistent saved workflows
reviewer comments / collaboration layer
keyboard shortcuts for faster editing
workflow analytics panel with path insights
Mock API Layer

The mock API layer supports the two required capabilities from the assignment.

GET /automations

Returns mock automated actions such as:

Send Email
Generate Document
Update Records
Parse Documents
Create Ticket

Each action includes dynamic parameter metadata used to render automated-step forms in the configuration panel.

POST /simulate

Accepts the current workflow graph and returns:

simulation summary
step-by-step execution logs
completion state

This helps demonstrate how the designed workflow can be tested in a small sandbox without backend persistence.

Validation Rules
The workflow validator currently checks for:
exactly one Start node
at least one End node
Start node should not have incoming edges
End node should not normally have outgoing edges
missing incoming connections
missing outgoing connections
cycle detection
unreachable nodes from Start
whether at least one End node is reachable

This gives the reviewer live feedback about workflow health and structural correctness.

Folder Structure
src/
  components/
    layout/
      AppShell.tsx
  features/
    workflow/
      api/
        mockWorkflowApi.ts
      components/
        WorkflowCanvas.tsx
      constants/
        templateFlows.ts
      nodes/
        PremiumNode.tsx
      panels/
        NodeConfigPreview.tsx
        ValidationSummary.tsx
      types/
        workflow.ts
      utils/
        simulateWorkflow.ts
        validateWorkflow.ts
  App.tsx
  main.tsx
  index.css
