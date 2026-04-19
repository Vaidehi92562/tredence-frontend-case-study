# HRFlow Studio – Tredence Frontend Case Study

HRFlow Studio is a polished frontend prototype for an HR workflow designer built with **React, TypeScript, Tailwind CSS, and React Flow**.

It is designed to feel less like a coursework submission and more like an early-stage internal product for People Operations teams.

---

## Project Link

**GitHub Repository:**  
[https://github.com/Vaidehi92562/tredence-frontend-case-study](https://github.com/Vaidehi92562/tredence-frontend-case-study)

---
For application-specific response items, see: [docs/APPLICATION_RESPONSE_ITEMS.md](docs/APPLICATION_RESPONSE_ITEMS.md)
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

The goal was to create something that demonstrates not just React Flow usage, but also **frontend architecture, product thinking, UI quality, controlled forms, and graph-based reasoning**.

---

## Features Implemented

- cinematic intro splash screen
- premium product-style UI
- React Flow powered workflow canvas
- draggable node library
- custom workflow nodes:
  - Start
  - Task
  - Approval
  - Automated Step
  - End
- template switching for multiple HR workflows
- editable configuration panel for every node type
- dynamic automated-step forms driven by mock automation metadata
- mock API integration
- workflow validation in real time
- simulation timeline with execution logs
- export JSON
- copy JSON
- reset template
- minimap and zoom controls
- delete selected nodes and edges

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Flow**
- **Lucide React**

---

## Architecture

The application is structured around a modular workflow-builder architecture:

- `src/components/layout`
  - application shell and overall page composition
- `src/features/workflow/components`
  - React Flow canvas and interaction surface
- `src/features/workflow/nodes`
  - reusable custom node UI
- `src/features/workflow/panels`
  - live configuration panel and validation panel
- `src/features/workflow/api`
  - mock API layer for automation metadata and workflow simulation
- `src/features/workflow/utils`
  - workflow validation and simulation logic
- `src/features/workflow/constants`
  - starter template flows and default graph data
- `src/features/workflow/types`
  - shared TypeScript interfaces for workflow nodes

This separation keeps rendering, graph logic, form state, and API simulation independent and easier to extend.

---

## How to Run

Install dependencies:

```bash
npm install
