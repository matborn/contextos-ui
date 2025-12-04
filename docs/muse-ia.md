
# **Muse — Information Architecture (Corrected & Aligned Version)**

**Elori Platform — Brainstorming & Ideation Module**

---

## **1. Purpose of Muse**

**Muse is the AI-driven ideation and brainstorming module of the Elori Platform.**
It is designed for **structured creative thinking**, not manual note-taking.

Muse enables users to:

* Explore ideas with AI agents
* Use structured methods (SCAMPER, SWOT, 5 Whys, Pre-Mortem, Scenario Storm)
* Expand ideas through branching exploration
* Build and compare scenarios
* Identify risks, insights, opportunities
* Cluster, evaluate, and refine ideas
* Generate an AI-written **Brainstorm Summary Document** (via Scriptor)
* Promote selected ideas into **canonical knowledge** (Atlas), **features** (Forge), or **tasks** (Pilot)

Muse is an **AI-guided ideation engine**, deeply connected to the Elori knowledge and work model.

---

# **2. Core System Concepts**

Elori operates on **two containers only**:

1. **Atlas Workspace** — “what we know”
2. **Project** — “what we are doing”

Muse follows this architecture precisely.

---

## **2.1 Atlas Workspace (Knowledge Container)**

> The *only* place where knowledge lives.

Each Project links to **one primary Atlas Workspace**, defining its domain’s canonical knowledge:

* Facts
* Risks
* Decisions
* Requirements
* Entities/systems
* Metrics
* Historical context

Muse always references this canonical knowledge during brainstorming.

---

## **2.2 Project (Shared Work Container Across All Modules)**

> The environment where all work happens in Elori.

A Project contains:

* Scriptor documents
* Muse brainstorm sessions
* Ideas & scenarios
* Forge artefacts
* Pilot tasks & milestones

A Project:

* Links to **one primary Atlas Workspace**
* May link to additional workspaces (optional)
* Inherits governance rules
* Defines the default knowledge context for Muse and all other modules

Muse never creates its own container type.
All brainstorming happens **inside a Project**.

---

## **2.3 Project Creation & Management (Platform-Wide)**

*(Aligned with Scriptor architecture)*

Projects are managed globally through the:

### **Projects Hub (Primary Location)**

Users can:

* Create new Projects
* Manage Project metadata
* Set primary Atlas Workspace
* Add optional additional knowledge workspaces
* Configure module-level settings for Muse, Scriptor, Forge, Pilot
* Manage roles and permissions

### Users can create a Project from:

1. **Projects Hub** (the primary path)
2. **Within Muse** (accelerator), via:

   * “New Project”
   * “Start Brainstorm → New Project”

This opens the *same unified Project creation dialog* used across the entire platform.

### Once a Project is created:

All modules (Muse, Scriptor, Forge, Pilot) expose their respective **views** into that Project.

Example:

* Muse → *Project Titan · Brainstorms*
* Scriptor → *Project Titan · Documents*
* Pilot → *Project Titan · Tasks*

No module owns Projects.
Modules simply surface their part of the Project.

---

## **2.4 Brainstorm Knowledge Workspace (Atlas — Non-Canonical)**

Each Project automatically includes a **Brainstorm Knowledge Workspace** (inside Atlas), used exclusively by Muse.

It stores **exploratory knowledge**, such as:

* Ideas
* Hypotheses
* Assumptions
* Pros/cons
* Comparisons
* Scenarios
* Questions
* Groupings & clusters
* Conceptual diagrams

Characteristics:

* Non-canonical
* Temporary or semi-temporary
* Speculative
* Safe for exploration
* Not used by global reasoning (Ask) unless promoted
* Acts as a staging area for ideation

When an idea becomes validated, it may be **promoted** to canonical Atlas knowledge.

---

## **2.5 Brainstorm Session (The Activity Unit)**

A Brainstorm Session is a **focused, time-bounded ideation process**.

A session:

* Lives inside a Project
* Applies one or more ideation methods
* Uses a conversational AI interface
* Produces ideas, insights, assumptions, and scenarios
* Stores all outputs inside the Project’s **Brainstorm Knowledge Workspace**
* Optionally produces a **Brainstorm Summary Document** (via Scriptor)
* Supports idea triage (Keep, Park, Discard, Promote)

---

# **3. Module-Level Information Architecture for Muse**

Muse provides four main module-level areas:

* **Home**
* **Projects**
* **Ask**
* **Methods**
* **Settings**

---

# **4. Muse Home**

The Muse landing page focuses on ideation momentum.

Shows:

* Active Projects containing brainstorm activity
* Recently active Brainstorm Sessions
* Suggested methods based on context
* Suggested follow-ups (“You haven’t explored assumptions for X yet”)
* Quick-start actions:

  * “Start Brainstorm in Project Titan”
  * “Run Scenario Storm”
  * “Explore alternatives for [Topic]”

Purpose:
Provide immediate entry into creative, structured thinking.

---

# **5. Projects (Shared Across Elori)**

Muse uses the same **Project object** as Scriptor, Forge, and Pilot.

### **Project List**

* All Projects available to the user
* Filters (active, favorites, domain, team)
* Search
* “Start Brainstorm” for each Project

---

## **Entering a Project (Muse View)**

Each Project has multiple modules attached.
Muse adds the ideation-centric views:

Left-side navigation inside a Project:

* **Overview**
* **Brainstorms**
* **Ideas**
* **Scenarios**
* **Links**
* **Settings**

All content relates to **this Project only**.

---

# **6. Inside a Project — Muse Views**

---

## **6.1 Overview**

A snapshot of creative progress:

* Project description
* Recent brainstorms
* Highlighted ideas
* Scenario insights
* Quick actions:

  * “Continue last brainstorm”
  * “Start new brainstorm”

---

## **6.2 Brainstorms**

A complete list of the Project’s Brainstorm Sessions:

* Title
* Methods used
* Status (active/paused/completed)
* Last updated
* Participants
* Action: **Resume / Enter Session**
* Action: **Start New Brainstorm**

---

## **6.3 Ideas (Cross-Session Idea Backlog)**

A unified backlog of *all ideas* generated within this Project.

Each idea includes:

* Text
* Idea type (insight, risk, opportunity, solution, question, hypothesis)
* Tags
* Source session
* Status: Keep / Park / Discard / Promote
* Links to scenarios, documents, features, tasks

All ideas live inside the **Brainstorm Knowledge Workspace** of the Project.

Purpose:
Create a structured, reusable, cross-session idea library.

---

## **6.4 Scenarios**

A specialized area for scenario reasoning:

* Define assumptions
* Run scenario simulations
* Generate AI-predicted outcomes
* Compare alternatives (A vs B vs C)
* Extract lessons, insights, and implications
* Connect scenarios to:

  * Forge (features)
  * Pilot (tasks)
  * Scriptor (narratives / summary documents)

All scenario knowledge is stored in the Project’s Brainstorm Knowledge Workspace.

---

## **6.5 Links**

Cross-module traceability:

* Brainstorm Summary Documents (Scriptor)
* Features created from ideas (Forge)
* Project tasks or milestones (Pilot)
* Promoted canonical entities (Atlas)

---

## **6.6 Settings**

Muse settings **for this Project**, including:

* Enabled brainstorming methods
* Default prompts / ideation styles
* Default summary document template (for Scriptor)
* AI behaviour & tone tuning
* Permissions
* Knowledge context (read-only — managed via Projects Hub)

---

# **7. Brainstorm Session IA (Core UX)**

The experience consists of three main panels.

---

## **Left Panel — AI Conversational Guidance**

* Structured brainstorming steps
* Pivot between methods (SCAMPER → 5 Whys → Scenario Storm)
* Deep/lateral prompts
* “Explore this further”
* “Challenge assumptions”

---

## **Center — Idea Canvas**

A dynamic ideation surface:

* Idea cards
* Clusters
* Pros/cons
* Tags
* Theming
* Scoring (impact, effort, novelty, confidence)
* AI actions:

  * Generate variations
  * Highlight promising ideas
  * Cluster automatically
  * Generate alternative concepts
  * Evaluate feasibility

---

## **Right Panel — Knowledge & Scenario Tools**

Shows:

* Relevant canonical knowledge (facts, decisions, risks)
* Knowledge conflicts
* Dependencies
* Risk indicators
* Scenario tools:

  * Define assumption
  * Model scenario
  * Compare outcomes
  * Convert an idea into a scenario

All outputs are stored in the **Brainstorm Knowledge Workspace**.

---

# **8. End of Session → Brainstorm Summary Document (Scriptor)**

When the session ends:

1. User clicks **“Generate Summary Document”**

2. Muse compiles structured output:

   * Context
   * Methods used
   * All ideas
   * Themes & clusters
   * Pros/cons
   * Discarded ideas (optional)
   * Insights
   * Scenarios & outcomes
   * Recommendations
   * Open questions

3. The structured content is passed to **Scriptor**

4. Scriptor applies the **Brainstorm Summary template**

5. AI drafts the document

6. User reviews & approves

7. Document is stored within the **same Project**

This keeps the knowledge → narrative flow tightly integrated.

---

# **9. Knowledge Flow Model (Corrected & Aligned)**

### **1. All brainstorm-generated knowledge lives in Atlas**

…but in the Project’s **Brainstorm Knowledge Workspace**.

### **2. Exploratory → Canonical promotion is explicit**

* Ideas → requirements
* Chosen directions → decisions
* Risks discovered → risk library
* Opportunities → Forge features
* Tasks → Pilot

### **3. Perfect lineage**

Every canonical entry references:

* Brainstorm sessions
* Ideas
* Scenario reasoning
* Summary documents

This creates a gold-standard traceability chain from ideation → product → execution.

---

# **10. Why This IA Works**

### ✔ Follows the two-container model

Only **Atlas Workspaces** and **Projects** exist.

### ✔ Strong cross-module consistency

Muse → Scriptor → Forge → Pilot → Atlas operate in one shared Project environment.

### ✔ Clean mental model

Brainstorming is a Project activity, not a separate space.

### ✔ Knowledge integrity preserved

Exploratory knowledge never pollutes canonical knowledge.

### ✔ Scalable

Supports:

* Thousands of ideas
* Hundreds of sessions
* Dozens of Projects
  Without losing organization.

### ✔ AI-native

AI agents drive method selection, clustering, evaluation, scenario modeling, and summary generation.

---
