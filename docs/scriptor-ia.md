# **Scriptor — Information Architecture & Product Concept (AI-First Documents)**

This document defines the **information architecture, concepts, and workflows** for the **Scriptor** module in the Elori Platform.

Scriptor is **not** a traditional text editor.
It is an **AI-first document engine**:

* **AI agents write the documents.**
* **Users steer, review, and approve.**
* Users give feedback at document/section/paragraph level.
* AI continuously revises the document based on that feedback.

Users don’t “type out documents”; they **collaborate with AI agents** to create and maintain living documents rooted in Atlas’ knowledge graph.

---

# **1. Positioning of Scriptor in the Elori Platform**

Elori consists of the following modules:

* **Atlas** — knowledge engine (ingestion, ontology, governance)
* **Scriptor** — AI-written documents (narratives, specs, proposals, plans)
* **Muse** — ideation & scenario exploration
* **Forge** — product development intelligence
* **Pilot** — project execution & delivery
* **Horizon** — personal and financial planning
* **Build** — connectors, ontology, and admin setup

Elori operates on a **foundational architectural rule**:

> **Only two containers exist:**
>
> * **Atlas Workspace** — “what we know”
> * **Project** — “what we are doing”

All modules—including Scriptor—derive from this model.
Scriptor does **not** introduce a new container type.
Documents live **within Projects**, and Projects link to Atlas for knowledge.

**Atlas = system of record for knowledge**
**Scriptor = system of narrative for Projects**

---

# **2. Core Concepts**

---

## **2.1 Atlas Workspace (Knowledge Container)**

An **Atlas Workspace** defines a **knowledge boundary**.

It contains:

* Facts
* Decisions
* Metrics
* Entities
* Risks
* Historical validation
* Ingested and structured data

Atlas Workspaces store **canonical knowledge**, not work artifacts or documents.

All modules—including Scriptor—consume knowledge from Atlas via the Projects they belong to.

---

## **2.2 Project (Work Container)**

A **Project** is the universal work container used across all modules.

A Project contains:

* **Documents** (Scriptor)
* **Brainstorms, ideas, scenarios** (Muse)
* **Features, requirements, risks, metrics** (Forge)
* **Tasks, timelines, milestones** (Pilot)

A Project links to:

* **One primary Atlas Workspace**
* Optional additional Atlas Workspaces

Projects define the **default knowledge context** for all work within them.

Documents do **not** have their own container.
Documents belong to **exactly one Project**.

---

## **2.3 Project Management (Global)**

*(New, expanded section)*

Projects are managed at the **platform level**, not inside individual modules.

### **Projects Hub (Primary Location)**

The **Projects Hub** is where users:

* Create new Projects
* View all Projects
* Configure Project settings
* Manage knowledge context
* Manage module-level rules
* Manage permissions
* Archive or reactivate Projects

Each Project includes:

* Name
* Description
* Primary Atlas Workspace
* Additional Atlas Workspaces (optional)
* Enabled modules (Scriptor / Muse / Forge / Pilot)
* Permissions & roles
* Project metadata (owners, status, activity)

---

## **2.4 Creating a Project**

Users can create a Project from:

### **A. The Projects Hub (primary)**

This is the canonical creation pathway.

### **B. Any module (accelerators)**

From Scriptor, Muse, Forge, or Pilot, users may see:

* “New Project”

This simply opens the **same unified Project creation dialog**, ensuring the platform maintains a single Project object regardless of entry point.

---

## **2.5 What Happens When a Project Is Created**

When the user completes the creation form:

1. The Project is created at the platform level.
2. Its **primary Atlas Workspace** defines its knowledge domain.
3. All modules now recognize the Project as a valid work container.
4. Each module displays its own “view” of that Project:

   * Scriptor → Project · Documents
   * Muse → Project · Brainstorms
   * Forge → Project · Features
   * Pilot → Project · Tasks

No module owns the Project.
All modules **use** it.

---

## **2.6 Document**

A **Document** in Scriptor is:

* A **structured, AI-generated artifact**
* Composed of sections, blocks, tables, summaries
* Grounded in the Project’s Atlas knowledge context
* Continuously validated for consistency and accuracy
* Part of the governance model of the Project

Documents are always attached to a **Project**, never free-floating.

---

## **2.7 Document Type & Template**

**Document Type** = class of document
(PRD, Technical Design, RFC, Strategy Memo, Contract, etc.)

**Template** = the structure, rules, and knowledge bindings for a Document Type.

Templates define:

* Required sections
* Style rules
* AI validation rules
* Governance rules (approvals, required fields)
* Knowledge bindings to Atlas entities
* Formatting, tone, and content expectations

Templates exist at two levels:

* **Global Templates** (available platform-wide)
* **Project Templates** (enabled or customized for a specific Project)

Templates do **not** represent containers.
They define the **shape and standards of documents**.

---

## **2.8 Ask (AI Command & Reasoning Layer)**

Ask is Elori’s universal intelligence interface.

In Scriptor, Ask can:

* Generate full documents from intent
* Rewrite or refactor sections
* Pull in relevant knowledge from Atlas
* Detect contradictions or omissions
* Help navigate or summarize documents
* Maintain knowledge alignment over time

Ask always uses:

> **The active Project’s Atlas Workspace context**
> (Unless the user explicitly overrides this.)

---

# **3. Scriptor — Module-Level Information Architecture**

Scriptor offers four major areas:

* **Home**
* **Projects**
* **Templates**
* **Settings**

Ask is available globally (Cmd+K/Spotlight).

---

# **4. Scriptor Home**

The central place for document-driven work.

### **Start a New Document**

* Blank Draft (AI-assisted)
* Common Document Types (PRD, Technical Spec, Strategy Memo, Contract, etc.)

### **Recent Documents**

* Sorted across all Projects the user participates in
* Includes status (Draft, Review, Approved)
* Shows the owning Project

### **Your Projects**

Projects with recent Scriptor activity.

Scriptor Home is a **dashboard**, not a container.

---

# **5. Scriptor Projects View**

The **Projects** tab in Scriptor is a filtered view of global Projects—only showing Projects the user can create/edit documents in.

Each item shows:

* Project name & description
* Linked primary Atlas Workspace
* Document count
* Last activity
* “Open Project Documents”
* “New Document”

---

# **6. Inside a Project — Documents View**

When opening a Project inside Scriptor, the user enters:

> **Project Name · Documents**

This view includes:

### **Document List**

* Search, sort, filter
* Title
* Document type
* Status
* Last edited
* AI or human author

### **New Document Button**

Pre-populates the Project context.

### **Right Sidebar — Project Context**

#### **Project Knowledge Context (read-only)**

* Primary Atlas Workspace
* Additional Workspaces
* Link to manage this in the Projects Hub

#### **Project Document Rules**

* Required approvers
* Required sections per document type
* AI checks to run
* Any Project-specific governance

These rules apply automatically to all Scriptor documents within the Project.

---

# **7. Document Creation Flow (AI-First)**

### **1. User chooses a Project**

Either via Projects view or through the Home “New Document” dialog.

### **2. User selects a Document Type / Template**

### **3. User provides an intent / brief**

e.g., “Draft a PRD for Shared Workspaces”.

### **4. AI generates a complete structured draft**

Including:

* Sections
* Referenced Atlas entities
* Decisions, metrics, facts, risks
* TODOs where knowledge is missing
* Template rules

### **5. Document enters Draft state**

---

# **8. Editing Model (Human-Steered, AI-Authored)**

Users collaborate with AI:

* Give instructions at paragraph/section/whole-doc levels
* Ask for clarity, brevity, tone adjustments
* Ask AI to pull in relevant knowledge
* Apply template rules
* Maintain consistency with Atlas

Inline typing is available but not the primary mode.

---

# **9. Document Lifecycle**

* **Draft** — AI and human iterating
* **In Review** — Formal review workflow begins
* **Changes Requested** — Reviewer feedback
* **Approved** — Official document
* **Outdated** — Atlas knowledge changed; AI flags inconsistencies
* **Archived** — No longer active

AI continuously monitors the document’s connection to Atlas.

---

# **10. Knowledge Panel (Inside Document)**

The right-side panel displays:

* Entities referenced
* Related decisions, facts, risks, metrics
* Newly available knowledge from Atlas
* Conflicts or inconsistencies
* Suggested updates

One-click actions:

* Insert section
* Update with latest facts
* Refresh against decisions
* Explain content

---

# **11. Summary**

* **Atlas Workspace** = where knowledge lives
* **Project** = where work lives
* Scriptor documents always belong to a Project
* Projects manage knowledge context, permissions, and rules
* Templates define structure and governance
* Ask provides AI-first creation, reasoning, and orchestration
* Scriptor is the narrative layer of the Project
* No “Spaces” or third container types exist

This IA is clean, scalable, and fully aligned with the Elori platform architecture.

---