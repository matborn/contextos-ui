# **Elori — Project Information Architecture (Final, Canonical Version)**

## **0. Purpose of Projects**

A **Project** is one of the two fundamental containers in the Elori Platform.

> **Atlas Workspace = “What we know”**
> **Project = “What we are doing”**

Every module — Scriptor, Muse, Forge, Pilot — operates *inside* a Project.
Projects unify all work artifacts, all reasoning, and all outputs into a single domain of execution.

Projects connect:

* Knowledge (Atlas)
* Document work (Scriptor)
* Ideation (Muse)
* Product development (Forge)
* Execution (Pilot)
* Reasoning (Ask)

This is the backbone of the entire platform.

---

# **1. Role of Projects in the Elori Platform**

A **Project** represents a domain of work, initiative, team effort, product area, or strategic theme.

Examples:

* *Project Titan*
* *Customer 360 Platform*
* *Onboarding Flow Redesign*
* *ACME Q3 Proposal*
* *Personal Life Plan* (Horizon)

A Project defines:

1. **Knowledge context** ← which Atlas workspace(s) apply
2. **Work context** ← what artifacts and tasks belong to the initiative
3. **Governance** ← permissions, approvals, workflows
4. **Cross-module linkage** ← Scriptor ↔ Muse ↔ Forge ↔ Pilot

Everything “work-related” in Elori lives within a Project.

---

# **2. Project Structure**

A Project contains the following categories of work:

### **2.1 Scriptor (Documents)**

Documents of all types:

* PRDs
* Specs
* Strategies
* Reports
* Contracts
* Roadmaps
* Plans
* RFCs
* Playbooks

All Scriptor documents belong to a Project.

---

### **2.2 Muse (Ideation & Brainstorming)**

Each Project contains:

* Brainstorm sessions
* Ideas backlog
* Scenarios
* Brainstorm Summary documents (in Scriptor)
* Exploratory knowledge

All idea- and scenario-related knowledge is stored in an **Atlas Brainstorm Knowledge Workspace** that corresponds to the Project.

---

### **2.3 Forge (Product Development)**

A Project holds:

* Features
* Requirements
* Risks
* Acceptance criteria
* Product metrics

These are connected to both Scriptor docs and Muse ideas.

---

### **2.4 Pilot (Execution)**

Pilot adds:

* Tasks
* Timelines
* Milestones
* Dependencies
* Initiatives

Pilot links tasks to requirements (Forge), ideas (Muse), and documents (Scriptor).

---

### **2.5 Ask (Reasoning Layer)**

Ask automatically:

* Uses the Project’s primary Atlas Workspace
* References all work artifacts inside the Project
* Pulls knowledge from Atlas
* Navigates documents, tasks, features, and ideas
* Executes workflows

---

# **3. Project Contents (Full Model)**

Inside a Project, the platform exposes different views based on the active module:

```
Project
│
├── Documents (Scriptor)
├── Brainstorms (Muse)
├── Ideas (Muse)
├── Scenarios (Muse)
├── Features (Forge)
├── Requirements (Forge)
├── Risks (Forge)
├── Tasks (Pilot)
├── Milestones (Pilot)
├── Knowledge Context (Atlas)
├── Settings (Project-level)
└── Links (cross-module references)
```

This structure ensures **everything related to an initiative is in one place**.

---

# **4. Knowledge Model Inside a Project**

A Project links to:

### **4.1 Primary Atlas Workspace (required)**

Defines canonical knowledge for the domain:

* Facts
* Decisions
* Entities
* Metrics
* Risks
* Requirements
* System models

### **4.2 Additional Atlas Workspaces (optional)**

Advanced users can add more workspaces to enrich knowledge context (e.g., “Shared Data Models”).

### **4.3 Brainstorm Knowledge Workspace (auto-created)**

Muse stores all exploratory knowledge here:

* Ideas
* Scenarios
* Assumptions
* Hypotheses
* Clusters/themes

This workspace is **non-canonical** and does not influence global reasoning unless knowledge is promoted.

---

# **5. Project Creation & Lifecycle**

## **5.1 Where Projects Are Created**

Projects can be created from:

### **A. Projects Hub (Primary)**

This is the main interface for:

* Creating new Projects
* Viewing all Projects
* Editing Project metadata
* Assigning permissions
* Configuring knowledge context
* Managing modules and workflows

### **B. Within any module (Accelerators)**

Buttons like:

* “New Project”
* “Start Brainstorm → New Project”
* “New Document → Create New Project”

All open the same universal creation dialog.

---

## **5.2 Project Creation Flow**

Project creation includes:

1. **Project Name**
2. **Description**
3. **Primary Atlas Workspace** (required)
4. **Additional Atlas Workspaces** (optional)
5. **Enabled Modules**

   * Scriptor
   * Muse
   * Forge
   * Pilot
6. **Default Templates** (for Scriptor & Muse)
7. **Permissions (roles & access)**
8. **Owners / editors / viewers**

---

## **5.3 Project Lifecycle States**

* **Active**
* **Paused / Frozen**
* **Archived**

Archiving moves all associated documents, brainstorms, and tasks into read-only mode.

---

# **6. Project-Level Navigation**

Inside a Project, the left navigation includes:

* **Overview**
* **Documents** (Scriptor)
* **Brainstorms** (Muse)
* **Ideas** (Muse)
* **Scenarios** (Muse)
* **Features** (Forge)
* **Requirements** (Forge)
* **Risks** (Forge)
* **Tasks** (Pilot)
* **Milestones** (Pilot)
* **Links**
* **Settings**

This navigation is consistent across all modules.

---

# **7. Project Overview Page**

The Project Overview provides:

### **7.1 Header**

* Name
* Description
* Primary Atlas Workspace
* Last updated
* Owners
* Status

### **7.2 Activity Snapshot**

* Recent brainstorms
* Updated documents
* New tasks
* Recent decisions from Atlas

### **7.3 Quick Actions**

* New Document
* Start Brainstorm
* Add Feature
* Create Task

The Overview page becomes the **center of gravity** for any Project.

---

# **8. Project Settings**

Project Settings define:

### **8.1 Knowledge Context**

* Primary Atlas Workspace
* Additional workspaces

### **8.2 Module Settings**

For each module:

**Scriptor**

* Allowed document templates
* Approval workflows
* AI checks

**Muse**

* Enabled methods
* Summary document templates
* AI creativity level

**Forge**

* Feature templates
* Requirement rules

**Pilot**

* Task types
* Workflow automation

### **8.3 Permissions**

* Owners
* Editors
* Viewers
* Module-level permissions

### **8.4 Lifecycle Management**

* Archive Project
* Reactivate Project

---

# **9. Project Cross-Module Links**

Projects automatically track relationships:

* Ideas → Features
* Scenarios → Data → Decisions
* Features → Requirements
* Requirements → Tasks
* Tasks → Documents
* Documents → Knowledge (Atlas)
* Knowledge → Documents (via checks)

This creates the **Elori Knowledge Graph + Work Graph**.

---

# **10. Why This Project IA Works**

### **✔ True two-container model**

Only **Projects** and **Atlas Workspaces** exist.

### **✔ Always consistent across modules**

Muse, Scriptor, Forge, Pilot all operate inside the same Project.

### **✔ Fully AI-driven workflow**

Ask always uses the Project’s knowledge context.

### **✔ Clean mental model**

Users intuitively understand:

> “Documents, ideas, features, and tasks for the same initiative are all under the same Project.”

### **✔ Extensible**

New modules plug into the Project without changing architecture.

### **✔ Strong governance**

Project permissions, knowledge context, and AI rules ensure quality and consistency.

---
