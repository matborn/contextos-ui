

import React, { ReactNode } from 'react';

// --- Design System Types ---

export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type Status = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'generating';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

// --- Icons ---

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// --- Navigation ---

export type AppMode = 'landing' | 'app' | 'dev';
export type AppId = 
  | 'launcher' 
  | 'context-os' // Atlas
  | 'projects'   // Projects Hub
  | 'life-os'    // Horizon
  | 'ai-builder' // App Builder
  | 'scriptor' 
  | 'muse' 
  | 'forge' 
  | 'pilot';

// Auth Views
export type AuthView = 'login' | 'register' | 'forgot-password' | 'profile';

// ContextOS Views
export type ContextView = 
  | 'landing'
  | 'knowledge' // Knowledge Base Discovery
  | 'query'     // Direct interface to query the knowledge
  | 'ontology'  // Schema/Ontology Viewer
  | 'team'       // Team Management
  | 'settings'   // Project Settings & Integrations
  | 'design-system' 
  | 'ai-playground'
  | 'showcase'   // UX Showcase
  | 'doc-generator' // AI Document Generator
  | 'doc-gen-v2' // Multi-Agent Document Generator
  | 'workspace' 
  | 'wizard';

// Scriptor Views
export type ScriptorView = 
  | 'dashboard'
  | 'projects_hub' // New global projects view
  | 'project'      // Specific Project View
  | 'editor'
  | 'templates'
  | 'settings';

// LifeOS Views
export type LifeView = 
  | 'dashboard'
  | 'freedom'
  | 'scenarios'
  | 'wealth'
  | 'settings'
  | 'copilot';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// --- Toast / Feedback ---

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

// --- Auth & User Models ---

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

// --- Workspace Models (Atlas Knowledge Containers) ---

export type WorkspaceVisibility = 'private' | 'protected' | 'public';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  visibility: WorkspaceVisibility;
  health: number; // 0-100
  memberCount: number;
  lastActive: Date;
}

// --- Project Models (Work Containers) ---

export interface Project {
  id: string;
  name: string;
  description: string;
  primaryAtlasWorkspaceId: string; // Link to Knowledge Core
  secondaryAtlasWorkspaceIds: string[];
  documentCount: number;
  lastActive: Date;
  colorTheme: string;
}

// --- Scriptor Specific Models ---

export interface ScriptorDoc {
  id: string;
  projectId: string; // Linked to Project
  title: string;
  status: 'draft' | 'review' | 'approved' | 'outdated' | 'archived';
  templateId?: string;
  lastModified: Date;
  authorId: string; // Or "AI Agent"
  collaborators: string[];
}

// --- Context OS Domain Models (Clean Naming) ---

export type DocStatus = 'draft' | 'review' | 'approved' | 'outdated';

// --- Architecture Blueprint Models (Graph Store) ---

export type AtomKind = 'fact' | 'decision' | 'risk' | 'assumption' | 'requirement';
export type AtomStatus = 'active' | 'superseded';
export type AtomLayer = 'canonical' | 'exploratory' | 'staging'; // Added staging
export type AtomRelationType = 'supports' | 'contradicts' | 'related';

export interface Atom {
  id: string;
  capsuleId: string;
  statement: string; // The core knowledge content
  type: AtomKind;
  confidenceScore: number; // 0-100
  layer: AtomLayer;
  status: AtomStatus;
  sourceDocumentId?: string;
  createdAt: Date;
  clusterId?: string; // New: For grouping in staging
  
  // Specific properties for Decision types (mapped from UI needs)
  daci?: DaciRoles;
  decisionMatrix?: DecisionMatrix;
  
  // AI metadata
  aiReasoning?: string[]; // e.g. ["Contradicts Atom #123", "High Confidence"]
  aiActionTaken?: 'auto-fixed' | 'conflict-detected' | 'duplicate-merged' | null;
}

export interface AtomRelation {
  id: string;
  fromAtomId: string;
  toAtomId: string;
  type: AtomRelationType;
  confidence: number;
}

// --- UI View Models (Mappings) ---

// KnowledgeItem is the "View Model" used by the React components
// It maps closely to Atom but includes UI-specific convenience fields like 'sourceName'
export type KnowledgeType = AtomKind; 
export type KnowledgeStatus = AtomLayer | 'superseded'; 

export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  content: string; // mapped from Atom.statement
  status: KnowledgeStatus;
  sourceId: string;
  sourceName: string;
  confidence: number; 
  dateDiscovered: Date;
  clusterId?: string; // New
  relatedItems?: { id: string; type: KnowledgeType; relation: string; title: string }[]; // Mapped from Relations
  
  // Specific properties for Decision types
  daci?: DaciRoles;
  decisionMatrix?: DecisionMatrix;

  // Staging / AI specific
  aiReasoning?: string[]; 
  aiActionTaken?: 'auto-fixed' | 'conflict-detected' | 'duplicate-merged' | null;
}

export interface KnowledgeCluster {
    id: string;
    title: string; // "Performance Requirements"
    summary: string; // "Contains 3 facts about latency and throughput."
    items: KnowledgeItem[];
    status: 'pending' | 'approved' | 'rejected';
    confidence: number;
}

export type IngestionStage = 'idle' | 'extracting' | 'embedding' | 'clustering' | 'correlating' | 'complete';

// --- Decision Frameworks (DACI & Two-Way Door) ---

export interface DaciRoles {
  driver: string[];       // Who drives the decision
  approver: string[];     // Who makes the final call
  contributor: string[];  // Who is consulted
  informed: string[];     // Who needs to know
}

export interface DecisionMatrix {
  impact: 'high' | 'low';
  reversibility: 'reversible' | 'irreversible'; // Two-way door vs One-way door
}

export interface ValidationItem {
  id: string;
  label: string;
  status: 'pending' | 'passed' | 'failed' | 'manual';
  description?: string;
}

// Template Definition Types
export interface ValidationRule {
  id: string;
  label: string;
  type: 'ai' | 'manual';
  severity: 'blocking' | 'warning';
  description: string; // Instructions for human or Prompt for AI
  isActive: boolean;
}

export interface DocumentSection {
  id: string;
  type: 'heading' | 'text' | 'list' | 'info';
  title?: string;
  content: string;
  status: DocStatus;
  hasConflict?: boolean;
  comments?: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  sections: string[]; // Default section titles
  rules?: ValidationRule[]; // Checklist items
}

// NEW: Advanced Elicitation Methods
export interface ElicitationMethod {
  id: string;
  name: string;
  description: string;
  systemPrompt: string; // The instruction given to the AI
  icon: string; // Icon identifier
  complexity: 'low' | 'medium' | 'high';
  isActive: boolean;
}

export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  lastUpdate: string;
  validationScore: number; // 0-100
  documents: {
    id: string;
    title: string;
    type: string;
    status: DocStatus;
    lastModified: string;
  }[];
}

export interface DataSource {
  id: string;
  type: 'confluence' | 'slack' | 'gdrive' | 'web';
  name: string;
  status: 'synced' | 'syncing' | 'error';
  lastSync: string;
  itemsFound?: number;
}

// AI Agent Types
export interface AgentMessage {
  id: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  actions?: {
    label: string;
    actionId: string;
    variant?: Variant;
  }[];
  timestamp: Date;
}
// --- Ontology/Schema Types ---

export interface EntityType {
  id: string;
  name: string;
  namespace: string;
  kind: 'entity' | 'event';
  shortDescription: string;
  synonyms: string[];
  properties: { name: string; type: string; required: boolean }[];
  stats: { instanceCount: number };
}

export interface RelationType {
  id: string;
  name: string;
  shortDescription: string;
  fromEntityId: string;
  toEntityId: string;
}

export interface OntologyGraph {
  entities: EntityType[];
  relations: RelationType[];
}

// NEW: Ontology Evolution / Staging
export type SuggestionType = 'new-entity' | 'new-relation' | 'update-property';

export interface OntologySuggestion {
  id: string;
  type: SuggestionType;
  status: 'pending' | 'approved' | 'rejected';
  content: {
    name: string;
    description: string;
    // For relations:
    fromEntity?: string;
    toEntity?: string;
    // For properties:
    targetEntity?: string;
    propertyName?: string;
  };
  reasoning: string; // "Found in 5 documents", "User Request"
  confidence: number; // 0-100
  sourceIds?: string[]; // IDs of docs where this was discovered
  detectedAt: Date;
}

// --- LifeOS (Financial App) Types ---

export interface FinancialAsset {
    id: string;
    name: string;
    type: 'property' | 'super' | 'share' | 'cash' | 'loan';
    value: number; // For loans, this is negative implicitly or explicitly handled
    currency: string;
    growthRate?: number; // annual %
}

export interface FinancialSnapshot {
    netWorth: number;
    cashflow: number; // monthly
    assets: FinancialAsset[];
    freedomDate: number; // Year
    freedomProgress: number; // 0-100
}

export interface LifeScenario {
    id: string;
    title: string;
    description: string;
    impact: {
        netWorth: number;
        freedomYearDelta: number; // +2 or -2
        monthlyCashflow: number;
    };
    isActive: boolean;
}

// --- AI App Builder / LifeOS Gen 2 Types ---

export type ViewSpecType = 'dashboard' | 'line_chart' | 'bar_chart' | 'table' | 'insight_card' | 'form' | 'object_card';

export interface BaseComponentSpec {
  id: string;
  type: ViewSpecType;
  title?: string;
  description?: string;
  isFrozen?: boolean; // New: Supports freezing/pinning widgets
}

export interface ChartSpec extends BaseComponentSpec {
  type: 'line_chart' | 'bar_chart';
  data_source: string;
  x_axis: string;
  y_axis: string;
  series: string[]; // keys in data
  filters?: Record<string, any>;
  data?: any[]; // Embedded data for rendering
}

export interface TableSpec extends BaseComponentSpec {
  type: 'table';
  columns: { key: string; label: string; type?: 'text' | 'currency' | 'date' | 'badge' }[];
  data_source: string;
  data?: any[];
}

export interface InsightCardSpec extends BaseComponentSpec {
  type: 'insight_card';
  summary: string;
  confidence: number;
  trend?: 'up' | 'down' | 'neutral';
  value?: string;
  actions?: string[];
}

export interface SmartFormSpec extends BaseComponentSpec {
  type: 'form';
  fields: { 
      id: string; 
      label: string; 
      type: 'text' | 'currency' | 'textarea' | 'date' | 'select'; 
      required?: boolean; 
      placeholder?: string;
  }[];
  submitLabel: string;
}

export interface ObjectCardSpec extends BaseComponentSpec {
    type: 'object_card';
    entityType: string;
    data: Record<string, any>;
    actions?: string[];
}

export interface DashboardSpec extends BaseComponentSpec {
  type: 'dashboard';
  layout: 'grid' | 'stack';
  components: ViewSpec[]; // Recursive
}

export type ViewSpec = ChartSpec | TableSpec | InsightCardSpec | SmartFormSpec | ObjectCardSpec | DashboardSpec;