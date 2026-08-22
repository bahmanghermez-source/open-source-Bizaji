export type Priority = 'Must' | 'Should' | 'Could' | 'Wont';
export type RequirementType = 'Functional' | 'NonFunctional';
export type RequirementStatus = 'Draft' | 'UnderReview' | 'Approved' | 'Rejected';
export type DomainCategory = 'Financial' | 'Regulatory' | 'UX' | 'Security' | 'Integration' | 'Workflow' | 'Reporting';

export interface RequirementVersion {
  version: string;
  updatedAt: string; // Jalali date or ISO
  author: string;
  changeDescription: string;
}

export interface Requirement {
  id: string; // e.g. FR-01, NFR-02
  title: string;
  description: string;
  type: RequirementType;
  priority: Priority;
  status: RequirementStatus;
  domain: DomainCategory;
  stakeholderId?: string;
  stakeholderName?: string;
  acceptanceCriteria: string[];
  rationale: string;
  impactAnalysis?: string;
  tags: string[];
  versionHistory: RequirementVersion[];
  createdAt: string;
  updatedAt: string;
}

export type EngagementStrategy = 'ManageClosely' | 'KeepSatisfied' | 'KeepInformed' | 'Monitor';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department: string;
  power: number; // 1 to 5
  interest: number; // 1 to 5
  strategy: EngagementStrategy;
  email?: string;
  phone?: string;
  notes?: string;
  concerns?: string[];
}

export interface QuestionTemplate {
  id: string;
  targetRole: string; // e.g. 'مدیر مالی / مالیاتی', 'مدیر فناوری اطلاعات', etc.
  category: string;
  questionText: string;
  contextHint: string;
  culturalNote?: string; // Iranian corporate culture context
}

export interface InterviewNote {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
  extractedRequirementId?: string;
}

export interface InterviewSession {
  id: string;
  title: string;
  stakeholderId: string;
  stakeholderName: string;
  dateJalali: string;
  interviewer: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  keyTakeaways: string[];
  notes: InterviewNote[];
  transcript?: string;
}

export interface WorkshopNote {
  id: string;
  title: string;
  category: 'JTBD' | 'EventStorming' | 'UserStory' | 'Risk';
  content: string;
  author: string;
  color: string;
}

export interface ConflictItem {
  id: string;
  topic: string;
  stakeholderA: string;
  viewpointA: string;
  stakeholderB: string;
  viewpointB: string;
  resolution?: string;
  status: 'Open' | 'Resolved';
}

export interface RegulationItem {
  id: string;
  title: string;
  category: 'Tax' | 'ECommerce' | 'Guild' | 'Banking' | 'Labor' | 'IP' | 'Cybersecurity' | 'BPMS';
  referenceCode: string;
  summary: string;
  keyDirectives: string[];
  impactOnIT: string;
  penalties?: string;
  sourceUrl?: string;
  complianceChecklist?: string[];
}

export interface Project {
  id: string;
  name: string;
  code: string;
  client: string;
  industry: string;
  startDateJalali: string;
  targetCompletionJalali: string;
  description: string;
  author: string;
}

export interface UserStory {
  role: string;
  action: string;
  benefit: string;
  acceptanceCriteria: string[];
  fullText: string;
}

// Bizagi Modeler & BPMN 2.0 Process Architecture Types
export type BpmnElementType = 
  | 'startEvent'
  | 'startEventMessage'
  | 'startEventTimer'
  | 'endEvent'
  | 'endEventMessage'
  | 'endEventTerminate'
  | 'userTask'
  | 'serviceTask'
  | 'scriptTask'
  | 'businessRuleTask'
  | 'sendTask'
  | 'receiveTask'
  | 'exclusiveGateway' // XOR
  | 'parallelGateway'  // AND
  | 'inclusiveGateway' // OR
  | 'subProcess'
  | 'dataObject'
  | 'dataStore'
  | 'textAnnotation';

export interface BpmnLane {
  id: string;
  name: string;
  role?: string;
  height?: number;
}

export interface BpmnPool {
  id: string;
  name: string;
  lanes: BpmnLane[];
}

export interface BpmnNode {
  id: string;
  type: BpmnElementType;
  name: string;
  poolId: string;
  laneId: string;
  x: number;
  y: number;
  documentation?: string;
  performer?: string;
  slaHours?: number;
  dataInput?: string;
  dataOutput?: string;
  conditionText?: string;
}

export interface BpmnFlow {
  id: string;
  sourceRef: string;
  targetRef: string;
  name?: string;
  type?: 'sequence' | 'message' | 'association';
  conditionExpression?: string;
}

export interface BpmnDiagram {
  id: string;
  title: string;
  code: string;
  description: string;
  pools: BpmnPool[];
  nodes: BpmnNode[];
  flows: BpmnFlow[];
  createdAt: string;
  updatedAt: string;
  author: string;
  version: string;
}

export interface ProcessArchRuleCheck {
  id: string;
  ruleTitle: string;
  severity: 'Error' | 'Warning' | 'Info';
  passed: boolean;
  message: string;
  recommendation: string;
}

// Business Checkup & Strategic Diagnosis Types (پیش از طراحی کانواس)
export type InfoStatus = 'F' | 'A' | 'U'; // Fact (واقعیت), Assumption (فرض), Unknown (مجهول)

export interface CheckupInitialProblem {
  perceivedProblem: string;
  startDate: string;
  evidence: string;
  affectedSections: string;
  pastActions: string;
  pastResults: string;
  whySolveNow: string;
  ifNotSolved: string;
  expectedOutcome: string;
  problemStatementSentence: string;
}

export interface CheckupDesiredStateItem {
  metric: string; // فروش, حاشیه سود, جریان نقدی, تعداد مشتری, خرید مجدد, زمان تحویل, وابستگی به مدیر, ظرفیت عملیاتی
  currentValue: string;
  desiredValue: string;
  deadline: string;
}

export interface CheckupFunnelStage {
  stage: string; // دیده شدن, سرنخ, جلسه/تماس, پیشنهاد, خرید, خرید مجدد, معرفی
  currentCountOrRate: string;
  issue: string;
  probableCause: string;
  requiredData: string;
}

export interface CheckupEconomicMetric {
  metricName: string;
  currentValue: string;
  issueOrAmbiguity: string;
  actionRequired: string;
}

export interface CheckupRootCauseChain {
  id: string;
  symptom: string; // نشانه مشاهده شده
  evidence: string; // شواهد
  why1: string;
  why2: string;
  why3: string;
  systemOrDecision: string;
  bmcSection: string;
  probableRootCause: string;
}

export interface CheckupHealthScoreItem {
  id: string;
  title: string;
  score: number; // 1 to 5
  notes?: string;
}

export interface CheckupHeatmapArea {
  areaKey: string;
  title: string;
  status: 'Green' | 'Yellow' | 'Red' | 'Gray';
  keyFinding: string;
}

export interface CheckupPrioritizedIssue {
  id: string;
  issueTitle: string;
  severity: number; // 1 to 5
  urgency: number; // 1 to 5
  customerImpact: number; // 1 to 5
  economicImpact: number; // 1 to 5
  fixability: number; // 1 to 5
  totalScore: number;
}

export interface CheckupHypothesis {
  id: string;
  hypothesisText: string;
  currentEvidence: string;
  requiredData: string;
  validationMethod: string;
  owner: string;
  deadline: string;
}

export type StrategicDecisionPath = 
  | 'OptimizeCurrent'  // بهینه‌سازی مدل فعلی
  | 'AmendSections'    // اصلاح چند بخش از مدل
  | 'MajorRedesign'    // بازطراحی اساسی بیزینس‌مدل
  | 'DualModel'        // ساخت مدل جدید در کنار مدل فعلی
  | 'DownsizeExit';    // کوچک‌سازی یا خروج

export interface StrategicCheckupData {
  id: string;
  projectId: string;
  updatedAt: string;
  author: string;
  initialProblem: CheckupInitialProblem;
  desiredStates: CheckupDesiredStateItem[];
  currentModelOneLiner: string;
  funnelStages: CheckupFunnelStage[];
  economicMetrics: CheckupEconomicMetric[];
  rootCauses: CheckupRootCauseChain[];
  healthScores: CheckupHealthScoreItem[];
  heatmap: CheckupHeatmapArea[];
  prioritizedIssues: CheckupPrioritizedIssue[];
  hypotheses: CheckupHypothesis[];
  strategicDecision: {
    selectedPath: StrategicDecisionPath;
    justification: string;
    focusQuestionAnswer: string;
  };
  onePageCanvas: {
    announcedProblem: string;
    desiredOutcome: string;
    currentModelOneLiner: string;
    topStrengths: string[];
    topSymptomIssues: string[];
    probableRootCauses: string[];
    unprovenAssumptions: string[];
    missingData: string[];
    dangerousDependencies: string[];
    topOpportunities: string[];
    topThreats: string[];
    top3Priorities: string[];
    proposedDecision: string;
    bmcSectionsToRedesign: string[];
    actionsBeforeNextSession: string[];
  };
}

