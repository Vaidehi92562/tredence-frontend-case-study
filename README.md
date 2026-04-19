# HRFlow Studio – Tredence Frontend Case Study

HRFlow Studio is a polished frontend prototype for an HR workflow designer built with React, TypeScript, Tailwind CSS, and React Flow.

It is designed to feel less like a coursework submission and more like an early-stage internal product.

## Overview

This project focuses on building a mini HR workflow designer where a reviewer can:

- load workflow templates
- drag nodes onto a live canvas
- connect workflow steps
- edit node details in a live configuration panel
- configure automated steps with dynamic parameter fields
- validate workflow structure in real time
- simulate execution of the workflow
- export the current workflow as JSON

## Features implemented

- cinematic intro splash screen
- premium product-style UI
- React Flow powered workflow canvas
- draggable node library
- custom nodes for:
  - Start
  - Task
  - Approval
  - Automated Step
  - End
- template switching
- live node editing
- dynamic automated-step form
- mock API layer
- workflow validation:
  - single Start node check
  - End node presence
  - unreachable node detection
  - missing incoming/outgoing edge checks
  - cycle detection
  - Start/End structure validation
- simulation timeline with execution logs
- export JSON
- copy JSON
- reset template

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Flow
- Lucide React

## Folder structure

```text
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
