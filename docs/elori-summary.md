
# **Elori Platform — Information Architecture (Compact Summary)**

## **1. What Elori Is**

Elori is a **personal operating system for work, knowledge, and creativity**.
It consists of several modules (“apps”), all powered by a shared intelligence layer and a unified knowledge graph.

Apps include:

* **Atlas** (knowledge engine)
* **Scriptor** (AI-written documents)
* **Muse** (brainstorming & ideation)
* **Forge** (product development)
* **Pilot** (project execution)
* **Horizon** (life & financial planning)
* **Build** (connectors, ontology, app creation)

All apps operate on shared conceptual foundations.

---

## **2. Two Core Containers: Knowledge vs Work**

Elori uses **two container types**.
Understanding these two is essential — they underpin the whole IA.

### **A. Atlas Workspace (Knowledge Container)**

* Stores **knowledge**, not documents
* Defines a **domain boundary**
* Houses canonical, validated knowledge
* Used for ingestion, ontology, and governance
* Example: *Atlas / Project Titan*, *Atlas / Customer 360*

Atlas Workspaces contain:

* Facts
* Decisions
* Requirements
* Risks
* Entities
* Historical validation

They are the **system of record** for organizational knowledge.

---

### **B. Project (Work Container)**

* Shared across **Scriptor, Muse, Forge, Pilot**
* Stores all work artifacts for a domain or initiative
* Contains:

  * AI-written documents (Scriptor)
  * Brainstorm sessions (Muse)
  * Features & requirements (Forge)
  * Tasks/timelines (Pilot)

A Project always links to:

* **One Primary Atlas Workspace** (for knowledge)
* Optional: additional Atlas Workspaces (advanced)

**Only two containers exist:**

* **Atlas Workspace (knowledge)**
* **Project (everything else)**

Muse does *not* create its own space type.
Scriptor does *not* create its own workspace type.

This keeps the IA clean and scalable.

---

## **3. Knowledge Types in Atlas**

Atlas stores **two kinds of knowledge**:

### **A. Canonical Knowledge**

Validated, reviewed, authoritative.
Used by all modules for reasoning.

### **B. Exploratory Knowledge**

Generated through brainstorming (Muse).
Stored in a Project’s **Brainstorm Knowledge Workspace** inside Atlas.
It is:

* Temporary
* Non-canonical
* Speculative
* Used only for ideation and scenario reasoning

**Validated ideas** can be **promoted** from exploratory → canonical.

This preserves reasoning quality while allowing deep creativity.

---

## **4. Module Overviews**

### **4.1 Atlas (Knowledge Engine)**

* Ingests data (documents, Slack, email, etc.)
* Extracts knowledge atoms
* Clusters and validates
* Maintains ontology
* Holds canonical + brainstorming knowledge
* Provides knowledge context to all modules

### **4.2 Scriptor (AI-Written Documents)**

* Users do *not* manually type entire documents
* AI writes & rewrites documents
* Users provide intent and feedback
* Documents belong to a **Project**
* Templates define structure + rules
* Documents are grounded in Atlas knowledge
* Output examples: PRDs, specs, reports, contracts, strategies

### **4.3 Muse (Brainstorming & Ideation)**

* Brainstorm Sessions live inside Projects
* AI agents guide ideation using structured methods
* Ideas & scenarios stored in a **Brainstorm Knowledge Workspace** in Atlas
* Generates an AI-written **Brainstorm Summary Document** in Scriptor
* Selected ideas can be promoted into canonical knowledge, Forge, Pilot

### **4.4 Forge (Product Development)**

* Operates on the same Project as Scriptor/Muse
* Manages features, requirements, risks, metrics
* Linked to Atlas knowledge

### **4.5 Pilot (Project Execution)**

* Also tied to the shared Project
* Handles tasks, dependencies, milestones
* Can consume ideas or decisions from Muse/Forge

### **4.6 Horizon (Life & Financial Planning)**

* Uses the Atlas knowledge engine for personal domains
* Works inside its own Projects (e.g., “My Life Plan”)

### **4.7 Build (Creators & Admins)**

* Manage connectors, ingestion, ontology
* Configure modules
* Create new apps
* Manage workspace and project permissions

---

## **5. Ask — The Universal Intelligence Interface**

Ask is not an app.
It is a **global reasoning and command layer**, available everywhere.

Ask can:

* Summarize
* Generate content
* Query knowledge
* Explain entities
* Refactor documents
* Launch workflows
* Analyse scenarios
* Connect insights across modules

Ask automatically uses the active Project’s primary Atlas Workspace as its knowledge context (unless overridden).

---

## **6. Document & Brainstorm Workflows (End-to-End)**

### **Brainstorm Workflow (Muse → Atlas → Scriptor)**

1. User starts a Brainstorm Session in a Project
2. AI + user generate ideas, assumptions, scenarios
3. All knowledge is stored in **Brainstorm Knowledge Workspace**
4. User ends the session
5. Muse sends structured output to Scriptor
6. Scriptor generates a **Brainstorm Summary Document**
7. User reviews / approves
8. Validated ideas can be promoted to:

   * Canonical knowledge (Atlas)
   * Features (Forge)
   * Tasks (Pilot)
   * Further docs (Scriptor)

### **Document Workflow (Scriptor)**

1. User chooses a template
2. AI generates the entire document
3. User steers and approves
4. Document stored under Project
5. AI keeps it consistent with Atlas knowledge over time

---

## **7. Why This IA Works**

### **Simplicity**

Only two containers exist:

* Atlas Workspace (knowledge)
* Project (work)

### **Scalability**

Any number of Projects → each linked to primary Atlas knowledge.

### **Cross-Module Consistency**

Projects unify Scriptor, Muse, Forge, Pilot.

### **Knowledge Integrity**

Exploratory vs canonical knowledge strictly separated.

### **AI-First Workflows**

Every module is designed around **agents as the primary workers** and **humans as reviewers/approvers**.

### **Traceability**

Everything links back to knowledge:

* Ideas → Requirements
* Scenarios → Decisions
* Docs → Knowledge
* Tasks → Docs

### **Future-Proof**

This IA supports:

* New modules
* New knowledge types
* Complex workflows
* Growing organizations

---

# **8. Final Conceptual Summary**

**Atlas = What we know**
Knowledge only.

**Project = What we are doing**
Documents + brainstorming + product + execution.

**Scriptor = How we communicate**
AI-written documents.

**Muse = How we think**
Ideas, scenarios, creativity.

**Forge = What we build**
Product development.

**Pilot = How we execute**
Tasks, timelines, milestones.

**Ask = How we talk to the system**
Reasoning and orchestration layer.

