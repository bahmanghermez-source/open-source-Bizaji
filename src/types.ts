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
  category: 'Tax' | 'Banking' | 'Cybersecurity' | 'Commerce' | 'BPMS';
  referenceCode: string;
  summary: string;
  keyDirectives: string[];
  impactOnIT: string;
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
