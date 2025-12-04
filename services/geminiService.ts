

import { GoogleGenAI, Type } from "@google/genai";
import { 
  DocumentSection, 
  KnowledgeItem, 
  DataSource, 
  ValidationRule,
  Atom,
  AtomRelation,
  AtomKind,
  ElicitationMethod,
  OntologyGraph,
  EntityType,
  RelationType,
  OntologySuggestion
} from "../types";
import { generateId } from "../utils";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- IN-MEMORY GRAPH STORE (SIMULATION) ---

interface GraphStore {
  atoms: Atom[];
  relations: AtomRelation[];
  initialized: boolean;
}

// The canonical source of truth for the session
const GRAPH_STORE: GraphStore = {
  atoms: [],
  relations: [],
  initialized: false
};

// --- Elicitation Methods (BMAD) ---

const MOCK_STRATEGIES: ElicitationMethod[] = [
    {
        id: 'strat-1',
        name: 'Standard Interview',
        description: 'Direct questions to clarify scope and goals.',
        systemPrompt: 'You are a helpful assistant. Ask direct clarifying questions to understand the user intent.',
        icon: 'MessageSquare',
        complexity: 'low',
        isActive: true
    },
    {
        id: 'strat-2',
        name: 'Socratic Method',
        description: 'Probing questions to uncover underlying assumptions.',
        systemPrompt: 'Adopt the Socratic Method. Do not just accept the user\'s statements. Ask probing questions like "Why do you believe that?" or "What evidence supports this?" to uncover root assumptions.',
        icon: 'HelpCircle',
        complexity: 'high',
        isActive: true
    },
    {
        id: 'strat-3',
        name: 'Five Whys',
        description: 'Drill down into root causes by asking "Why?" repeatedly.',
        systemPrompt: 'Use the "Five Whys" technique. When the user states a problem or goal, ask "Why is that important?" or "Why does that happen?" to get to the root cause.',
        icon: 'Target',
        complexity: 'medium',
        isActive: true
    },
    {
        id: 'strat-4',
        name: 'Future Backwards',
        description: 'Imagine the ideal future state and work backwards.',
        systemPrompt: 'Ask the user to describe the ideal state 6 months from now. Then ask them to work backwards to identify the steps needed to get there.',
        icon: 'Zap',
        complexity: 'medium',
        isActive: true
    },
    {
        id: 'strat-5',
        name: 'Devil\'s Advocate',
        description: 'Challenge the premise to strengthen the argument.',
        systemPrompt: 'Play Devil\'s Advocate. Constructively challenge the user\'s ideas to identify weaknesses or gaps in their logic. Use phrases like "What if this fails?" or "Have you considered the opposite?"',
        icon: 'ShieldCheck',
        complexity: 'high',
        isActive: true
    }
];

export const fetchElicitationMethods = async (): Promise<ElicitationMethod[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_STRATEGIES;
};

// --- Ontology Service ---

export const fetchOntologyGraph = async (): Promise<OntologyGraph> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const entities: EntityType[] = [
        { 
            id: 'et_feature', name: 'Feature', namespace: 'core.product', kind: 'entity',
            shortDescription: 'A product feature or capability.',
            synonyms: ['Capability'],
            properties: [
                { name: 'id', type: 'string', required: true },
                { name: 'name', type: 'string', required: true },
                { name: 'status', type: 'string', required: true }
            ],
            stats: { instanceCount: 142 }
        },
        { 
            id: 'et_person', name: 'Person', namespace: 'core.identity', kind: 'entity',
            shortDescription: 'An individual user or employee.',
            synonyms: ['User', 'Employee'],
            properties: [
                { name: 'email', type: 'string', required: true },
                { name: 'role', type: 'string', required: false }
            ],
            stats: { instanceCount: 28 }
        },
        { 
            id: 'et_requirement', name: 'Requirement', namespace: 'core.product', kind: 'entity',
            shortDescription: 'A specific constraint or functional need.',
            synonyms: ['Spec', 'Constraint'],
            properties: [
                { name: 'priority', type: 'string', required: true }
            ],
            stats: { instanceCount: 315 }
        },
        { 
            id: 'evt_decision', name: 'Decision', namespace: 'core.governance', kind: 'event',
            shortDescription: 'A recorded architectural or product decision.',
            synonyms: ['ADR'],
            properties: [
                { name: 'status', type: 'string', required: true },
                { name: 'approverId', type: 'string', required: true }
            ],
            stats: { instanceCount: 19 }
        },
        { 
            id: 'et_risk', name: 'Risk', namespace: 'core.governance', kind: 'entity',
            shortDescription: 'Potential failure mode or compliance gap.',
            synonyms: ['Hazard'],
            properties: [
                { name: 'severity', type: 'string', required: true },
                { name: 'mitigation', type: 'string', required: false }
            ],
            stats: { instanceCount: 12 }
        },
        { 
            id: 'et_team', name: 'Team', namespace: 'core.identity', kind: 'entity',
            shortDescription: 'A group of people working together.',
            synonyms: ['Squad', 'Group'],
            properties: [
                { name: 'leadId', type: 'string', required: false }
            ],
            stats: { instanceCount: 6 }
        },
    ];

    const relations: RelationType[] = [
        { id: 'rt_owned_by', name: 'OWNED_BY', shortDescription: 'Ownership assignment', fromEntityId: 'et_feature', toEntityId: 'et_person' },
        { id: 'rt_has_req', name: 'HAS_REQUIREMENT', shortDescription: 'Feature dependency', fromEntityId: 'et_feature', toEntityId: 'et_requirement' },
        { id: 'rt_approver', name: 'APPROVED_BY', shortDescription: 'Sign-off authority', fromEntityId: 'evt_decision', toEntityId: 'et_person' },
        { id: 'rt_affects', name: 'IMPACTS', shortDescription: 'Risk target', fromEntityId: 'et_risk', toEntityId: 'et_feature' },
        { id: 'rt_member', name: 'MEMBER_OF', shortDescription: 'Team membership', fromEntityId: 'et_person', toEntityId: 'et_team' },
        { id: 'rt_decides', name: 'DECIDES_ON', shortDescription: 'Decision scope', fromEntityId: 'evt_decision', toEntityId: 'et_feature' },
    ];

    return { entities, relations };
};

export const fetchOntologySuggestions = async (): Promise<OntologySuggestion[]> => {
    // Simulate AI Drift Detection
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
        {
            id: 'sug_1',
            type: 'new-entity',
            status: 'pending',
            content: {
                name: 'Vendor',
                description: 'External third-party provider or supplier.',
            },
            reasoning: 'Detected 15 references to "Stripe", "Auth0", and "AWS" across 5 documents.',
            confidence: 92,
            detectedAt: new Date()
        },
        {
            id: 'sug_2',
            type: 'new-relation',
            status: 'pending',
            content: {
                name: 'MITIGATES',
                description: 'Action taken to reduce impact of a risk.',
                fromEntity: 'Feature',
                toEntity: 'Risk'
            },
            reasoning: 'Inferred inverse of IMPACTS from "Security Audit" doc.',
            confidence: 78,
            detectedAt: new Date()
        },
        {
            id: 'sug_3',
            type: 'update-property',
            status: 'pending',
            content: {
                name: 'compliance_level',
                description: 'Add property to Feature entity',
                targetEntity: 'Feature',
                propertyName: 'compliance_level'
            },
            reasoning: 'GDPR requirements appear frequently alongside Feature definitions.',
            confidence: 65,
            detectedAt: new Date()
        }
    ];
};

export const generateOntologyFromContext = async (context: string): Promise<OntologySuggestion[]> => {
    // Simulate AI Generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
        {
            id: `gen_${Date.now()}_1`,
            type: 'new-entity',
            status: 'pending',
            content: { name: 'Campaign', description: 'Marketing initiative.' },
            reasoning: 'Extracted from user context.',
            confidence: 90,
            detectedAt: new Date()
        },
        {
            id: `gen_${Date.now()}_2`,
            type: 'new-entity',
            status: 'pending',
            content: { name: 'Audience', description: 'Target user segment.' },
            reasoning: 'Extracted from user context.',
            confidence: 85,
            detectedAt: new Date()
        },
        {
             id: `gen_${Date.now()}_3`,
             type: 'new-relation',
             status: 'pending',
             content: { name: 'TARGETS', description: 'Campaign target.', fromEntity: 'Campaign', toEntity: 'Audience' },
             reasoning: 'Inferred relation.',
             confidence: 88,
             detectedAt: new Date()
        }
    ];
};

export const simulateAgentInterview = async (
  history: { role: string; content: string }[], 
  templateName: string,
  strategyId?: string
): Promise<{ text: string; findings?: string[] }> => {
  
  // Find strategy if provided
  const strategy = MOCK_STRATEGIES.find(s => s.id === strategyId);
  const strategyPrompt = strategy ? strategy.systemPrompt : "";

  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking

  const lastUserMsg = history[history.length - 1].content.toLowerCase();
  
  // Mock logic based on strategy
  let text = "";
  const findings: string[] = [];

  if (strategyId === 'strat-3') { // 5 Whys
      if (history.length < 3) {
          text = "That's a clear goal. But to dig deeper, why is this capability essential right now?";
      } else if (history.length < 5) {
          text = "I understand. And why does that specific constraint exist in the current system?";
      } else {
          text = "Thank you. I think we've identified the root driver. Shall I proceed with generating the draft based on these core needs?";
          findings.push("Root cause identified via 5 Whys analysis");
      }
  } else if (strategyId === 'strat-5') { // Devil's Advocate
      text = `Interesting approach for the ${templateName}. However, have you considered what happens if the primary dependency fails? How would this architecture handle that failure mode?`;
      findings.push("Potential single point of failure detected");
      findings.push("Resilience gap identified");
  } else if (strategyId === 'strat-4') { // Future Backwards
      if (history.length < 3) {
          text = "Let's project forward. Imagine it's 6 months from now and this project is a massive success. What does that look like specifically?";
      } else {
          text = "Great vision. Now, working backwards from that state, what was the very first technical milestone we must have hit to make that possible?";
      }
  } else {
      // Default / Standard
      if (lastUserMsg.includes("payment")) {
        text = "I see. For a payment integration, we should strictly define the retry logic and idempotency keys. Do you have a preferred provider, or should I scope it for a generic interface?";
        findings.push("Found existing 'Payment RFC' (2023) - checked for conflicts.");
      } else if (lastUserMsg.includes("mobile")) {
        text = "Understood. Mobile clients often have spotty connectivity. Shall I include a section on 'Offline Sync' strategies in the RFC?";
        findings.push("Mobile tag detected. Suggesting 'Offline' pattern.");
      } else {
        text = `Got it. I'll outline the ${templateName} with those goals. Are there any specific risks or non-goals we should explicitly list to avoid scope creep?`;
      }
  }

  // Final step heuristic for demo
  if (history.length > 5 && !text.includes("Shall I proceed")) {
      text = "I have enough context now. I've mapped out the key sections based on our discussion. Shall I proceed to generate the draft?";
  }

  return { text, findings };
};

// --- Ingestion Logic ---

const SAMPLE_TEXT = `
Project Titan Technical Specification
Date: 2024-05-12

1. System Latency
The system MUST respond to 99% of API requests within 25ms. This is a hard requirement for the high-frequency trading module.
We assume that the network overhead between regions is negligible (<5ms), but this needs verification.

2. Database Choice
We have decided to use PostgreSQL for the ledger. 
Decision Driver: Alex (PM). Approver: Sarah (CTO).
Rationale: Strong ACID compliance is required.
Risk: Horizontal scaling might be difficult if transaction volume exceeds 10k TPS.

3. Authentication
We will use OAuth2 via Auth0. 
Risk: If Auth0 goes down, users cannot log in. We need a disaster recovery plan.
`;

/**
 * Parses raw text using Gemini to extract Atoms and Relations,
 * then persists them to the in-memory GRAPH_STORE.
 * 
 * Includes simulated latency for pipeline visualization.
 */
export const ingestText = async (
    text: string, 
    capsuleId: string = 'cap-default',
    onProgress?: (stage: string) => void
): Promise<void> => {
  try {
    // 1. EXTRACTION
    if (onProgress) onProgress('extracting');
    
    const prompt = `
      You are a Knowledge Graph Engineer for ContextOS.
      Analyze the provided text and extract "Atoms" (atomic units of knowledge) and "Relations" (links between them).
      
      Atom Types: 'fact' | 'decision' | 'risk' | 'assumption' | 'requirement'
      Relation Types: 'supports' | 'contradicts' | 'related'
      
      For Decisions, try to extract DACI roles (Driver, Approver, Contributor, Informed) if mentioned.
      For Risks, extract the severity (high/low).
      
      Return a JSON object matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          { text: `TEXT TO ANALYZE:\n${text}` }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atoms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  statement: { type: Type.STRING, description: "The core fact or statement" },
                  type: { type: Type.STRING, enum: ['fact', 'decision', 'risk', 'assumption', 'requirement'] },
                  confidence: { type: Type.NUMBER, description: "Confidence 0-100" },
                  meta: { 
                     type: Type.OBJECT,
                     properties: {
                         driver: { type: Type.STRING },
                         approver: { type: Type.STRING },
                         impact: { type: Type.STRING }
                     }
                  }
                },
                required: ['statement', 'type', 'confidence']
              }
            },
            relations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  fromIndex: { type: Type.INTEGER, description: "Index of the source atom in the returned atoms array" },
                  toIndex: { type: Type.INTEGER, description: "Index of the target atom" },
                  type: { type: Type.STRING, enum: ['supports', 'contradicts', 'related'] }
                },
                required: ['fromIndex', 'toIndex', 'type']
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    // Process and Persist
    const newAtoms: Atom[] = [];
    const sourceDocId = `doc-${Date.now()}`; 

    // 2. EMBEDDING SIMULATION
    if (onProgress) await new Promise(r => setTimeout(r, 800)); // Simulate vectorizing
    if (onProgress) onProgress('embedding');

    // 3. CLUSTERING SIMULATION
    // We will bucket atoms into artificial clusters for the demo
    if (onProgress) await new Promise(r => setTimeout(r, 800));
    if (onProgress) onProgress('clustering');
    
    const clusters = [
        { id: `cl-${Date.now()}-1`, name: "System Architecture" },
        { id: `cl-${Date.now()}-2`, name: "Security & Compliance" }
    ];

    // 4. CORRELATION SIMULATION (Conflict Detection)
    if (onProgress) await new Promise(r => setTimeout(r, 800));
    if (onProgress) onProgress('correlating');

    if (data.atoms && Array.isArray(data.atoms)) {
        data.atoms.forEach((extracted: any, index: number) => {
            // Assign to random cluster
            const cluster = clusters[index % 2];
            
            // Simulate AI reasoning/actions
            const isConflict = index === 1; // Arbitrarily make the second item a conflict
            const isAutoFixed = index === 3;

            const atom: Atom = {
                id: generateId(),
                capsuleId,
                statement: extracted.statement,
                type: extracted.type as AtomKind,
                confidenceScore: extracted.confidence || 90,
                layer: 'staging', // NEW: Goes to staging first!
                status: 'active',
                sourceDocumentId: sourceDocId,
                createdAt: new Date(),
                clusterId: cluster.id,
                
                // Demo AI Reasoning
                aiReasoning: isConflict 
                    ? ["Contradicts Atom #892 (Legacy Spec)", "Confidence: 85%"] 
                    : isAutoFixed 
                        ? ["Fixed spelling error in 'PostgreSQL'", "Merged with duplicate"] 
                        : [],
                aiActionTaken: isConflict 
                    ? 'conflict-detected' 
                    : isAutoFixed 
                        ? 'auto-fixed' 
                        : null,

                daci: extracted.meta?.driver ? {
                    driver: [extracted.meta.driver],
                    approver: [extracted.meta.approver || 'Unknown'],
                    contributor: [],
                    informed: []
                } : undefined,
                decisionMatrix: extracted.type === 'decision' ? {
                    impact: (extracted.meta?.impact === 'high' ? 'high' : 'low'),
                    reversibility: 'reversible'
                } : undefined
            };
            newAtoms.push(atom);
        });
    }

    if (data.relations && Array.isArray(data.relations)) {
        data.relations.forEach((rel: any) => {
            const fromAtom = newAtoms[rel.fromIndex];
            const toAtom = newAtoms[rel.toIndex];
            
            if (fromAtom && toAtom) {
                const relation: AtomRelation = {
                    id: generateId(),
                    fromAtomId: fromAtom.id,
                    toAtomId: toAtom.id,
                    type: rel.type,
                    confidence: 80
                };
                GRAPH_STORE.relations.push(relation);
            }
        });
    }

    // 5. Save to Store
    GRAPH_STORE.atoms.push(...newAtoms);
    if (onProgress) onProgress('complete');
    
  } catch (error) {
    console.error("Ingestion Failed:", error);
    throw error;
  }
};

// --- Knowledge Base Logic (Graph Queries) ---

/**
 * Returns the Knowledge Graph as View Models for the UI.
 * Simulates a DB Query + View mapping layer.
 */
export const fetchKnowledgeGraph = async (projectName: string): Promise<KnowledgeItem[]> => {
    // 1. Lazy Initialization: Seed data if empty
    if (!GRAPH_STORE.initialized) {
        // Initial seed data is CANONICAL/EXPLORATORY, not Staging
        const seedAtoms: Atom[] = [
             { id: 'seed1', capsuleId: 'c1', statement: 'System latency must be < 100ms', type: 'requirement', confidenceScore: 100, layer: 'canonical', status: 'active', createdAt: new Date(), clusterId: 'seed-cluster' },
             { id: 'seed2', capsuleId: 'c1', statement: 'Using AWS as primary cloud', type: 'decision', confidenceScore: 95, layer: 'canonical', status: 'active', createdAt: new Date(), clusterId: 'seed-cluster' }
        ];
        GRAPH_STORE.atoms.push(...seedAtoms);
        GRAPH_STORE.initialized = true;
    }

    // 2. Map Store Atoms to UI KnowledgeItems
    return GRAPH_STORE.atoms.map(atom => {
        // Find relations for this atom
        const related = GRAPH_STORE.relations
            .filter(r => r.fromAtomId === atom.id)
            .map(r => {
                const target = GRAPH_STORE.atoms.find(a => a.id === r.toAtomId);
                return target ? {
                    id: r.id,
                    type: target.type,
                    relation: r.type,
                    title: target.statement.substring(0, 50) + (target.statement.length > 50 ? '...' : '')
                } : null;
            })
            .filter(Boolean) as any[];

        return {
            id: atom.id,
            type: atom.type,
            content: atom.statement,
            status: atom.status === 'active' ? atom.layer : 'superseded',
            sourceId: atom.sourceDocumentId || 'unknown',
            sourceName: atom.sourceDocumentId?.startsWith('doc') ? 'Imported Spec' : 'Knowledge Seed',
            confidence: atom.confidenceScore,
            dateDiscovered: atom.createdAt,
            clusterId: atom.clusterId,
            relatedItems: related,
            aiActionTaken: atom.aiActionTaken,
            aiReasoning: atom.aiReasoning,
            daci: atom.daci,
            decisionMatrix: atom.decisionMatrix
        };
    });
};

export const fetchDataSources = async (): Promise<DataSource[]> => {
    return [
        { id: 'ds1', type: 'gdrive', name: 'Product Specs (Drive)', status: 'synced', lastSync: '10m ago', itemsFound: 142 },
        { id: 'ds2', type: 'slack', name: '#engineering', status: 'syncing', lastSync: 'Syncing...', itemsFound: 0 },
        { id: 'ds3', type: 'confluence', name: 'Legacy Wiki', status: 'error', lastSync: '1d ago', itemsFound: 45 }
    ];
};

export const syncDataSource = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
};

// --- View/Doc Generation ---

export const getDocumentById = async (id: string): Promise<DocumentSection[]> => {
    // Return mock data for demo
    return [
        { id: 's1', type: 'heading', content: 'Technical RFC: Payment Gateway', status: 'approved' },
        { id: 's2', type: 'text', title: 'Context & Scope', content: 'We need to integrate a new global payment gateway to support multi-currency transactions.', status: 'approved' },
        { id: 's3', type: 'text', title: 'Proposed Solution', content: 'Use Stripe Connect for platform payments. This allows us to handle KYC and payouts automatically.', status: 'draft', hasConflict: true }
    ];
};

export const generateDocumentFromTemplate = async (templateId: string, context: string, intent: string): Promise<DocumentSection[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
        { id: 'gen-1', type: 'heading', content: intent.split('\n')[0] || 'New Document', status: 'draft' },
        { id: 'gen-2', type: 'text', title: 'Overview', content: `Generated based on intent: ${intent}`, status: 'draft' },
        { id: 'gen-3', type: 'text', title: 'Strategic Goals', content: '1. Increase efficiency.\n2. Ensure scalability.', status: 'draft' }
    ];
};

export const refineSectionContent = async (content: string, instruction: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `${content} [AI Refined: ${instruction}]`;
};

export const getAgentResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return `I can help with that. Based on the "Payment Gateway" RFC, we have a hard requirement for < 100ms latency.`;
};

export const generateUIContent = async (element: string, context: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return `${element} for ${context}`;
};

export const enhanceText = async (text: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return `${text} (Enhanced by AI)`;
};

export const generateValidationRule = async (prompt: string): Promise<ValidationRule> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        id: `gen-rule-${Date.now()}`,
        label: `Check: ${prompt.substring(0, 15)}...`,
        type: 'ai',
        severity: 'warning',
        description: `AI generated rule to ensure: ${prompt}`,
        isActive: true
    };
};
