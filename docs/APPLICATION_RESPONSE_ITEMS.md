# Application Response Items

This document contains the response items requested in the internship application.

---

## 1) GitHub link to the project

**Project Repository:**  
[https://github.com/Vaidehi92562/tredence-frontend-case-study](https://github.com/Vaidehi92562/tredence-frontend-case-study)

---

## 2) Any other apps or repos I’ve built

Add your best links here before final submission.

- **Project 1:** [https://github.com/Vaidehi92562/CropSight-AI]
- **Project 2:** [https://github.com/Vaidehi92562/tradewise-nexus]


---

## 3) A short note on one tricky frontend bug I solved

One tricky issue I solved during this build was a TypeScript production build error caused by a duplicate `kind` field inside the exported workflow payload object in `AppShell.tsx`.

I was explicitly setting `kind: node.data.kind` and then also spreading `...node.data` into the same object. Since `node.data` already contained `kind`, TypeScript raised `TS2783` because the property was being specified more than once and then overwritten by the spread.

I fixed it by removing the redundant explicit field and keeping a single source of truth through `...node.data`. This cleaned up the serialization logic and allowed the project to pass `npm run build` successfully.

---

## 4) Resume or LinkedIn

**Resume (Google Drive):**  
[https://drive.google.com/file/d/1LJMjlGMOaBSG0VectGA_NfQHkCAxREEi/view?usp=sharing]

**LinkedIn:**  
[https://www.linkedin.com/in/pvvaidehi-mishra-48527a326/]

---

## Short Submission Note

This submission is a React + TypeScript + React Flow based HR workflow designer prototype with:

- custom workflow nodes
- drag-and-drop canvas interactions
- live configuration panel
- mock API integration
- workflow validation
- simulation sandbox
- JSON export
- premium product-style UI

The project was designed to demonstrate both frontend implementation skills and product thinking.
