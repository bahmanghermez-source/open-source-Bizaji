import React, { useState, useEffect } from 'react';
import { 
  Project, 
  Requirement, 
  Stakeholder, 
  InterviewSession, 
  QuestionTemplate, 
  RegulationItem,
  BpmnDiagram,
  StrategicCheckupData
} from './types';
import { 
  initialProject, 
  initialStakeholders, 
  initialRequirements, 
  questionTemplates, 
  initialInterviews, 
  initialRegulations,
  initialBpmnDiagrams,
  initialCheckupData,
  emptyCheckupData
} from './data/initialData';

import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StakeholderMatrix } from './components/StakeholderMatrix';
import { InterviewAssistant } from './components/InterviewAssistant';
import { RequirementsRegistry } from './components/RequirementsRegistry';
import { WorkshopCanvas } from './components/WorkshopCanvas';
import { KnowledgeBase } from './components/KnowledgeBase';
import { PrdGenerator } from './components/PrdGenerator';
import { IntroGuideModal } from './components/IntroGuideModal';
import { BizagiModelerCanvas } from './components/BizagiModelerCanvas';
import { BusinessCheckup } from './components/BusinessCheckup';
import { NewProjectWizard } from './components/NewProjectWizard';
import { EditProjectModal } from './components/EditProjectModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Sleek Theme state ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('niazkav_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('niazkav_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Intro guide modal state
  const [showIntroModal, setShowIntroModal] = useState<boolean>(() => {
    return !localStorage.getItem('niazkav_intro_seen');
  });

  // Load projects from localStorage or default to EMPTY array (no pre-created default project forced)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('niazkav_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Error parsing projects:', e);
      }
    }
    return [];
  });

  const [currentProject, setCurrentProject] = useState<Project | null>(() => {
    return projects[0] || null;
  });

  // State to control guided New Project Wizard view
  const [isCreatingProject, setIsCreatingProject] = useState<boolean>(() => {
    return projects.length === 0;
  });

  // State to control Editing Project Modal
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Child collections for active project
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(() => {
    if (!currentProject) return [];
    const saved = localStorage.getItem(`niazkav_stk_${currentProject.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [requirements, setRequirements] = useState<Requirement[]>(() => {
    if (!currentProject) return [];
    const saved = localStorage.getItem(`niazkav_req_${currentProject.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [interviews, setInterviews] = useState<InterviewSession[]>(() => {
    if (!currentProject) return [];
    const saved = localStorage.getItem(`niazkav_int_${currentProject.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [bpmnDiagrams, setBpmnDiagrams] = useState<BpmnDiagram[]>(() => {
    if (!currentProject) return [];
    const saved = localStorage.getItem(`niazkav_bpmn_${currentProject.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [checkupData, setCheckupData] = useState<StrategicCheckupData>(() => {
    if (!currentProject) return emptyCheckupData;
    const saved = localStorage.getItem(`niazkav_checkup_${currentProject.id}`);
    return saved ? JSON.parse(saved) : emptyCheckupData;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('niazkav_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem(`niazkav_stk_${currentProject.id}`, JSON.stringify(stakeholders));
    }
  }, [stakeholders, currentProject?.id]);

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem(`niazkav_req_${currentProject.id}`, JSON.stringify(requirements));
    }
  }, [requirements, currentProject?.id]);

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem(`niazkav_int_${currentProject.id}`, JSON.stringify(interviews));
    }
  }, [interviews, currentProject?.id]);

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem(`niazkav_bpmn_${currentProject.id}`, JSON.stringify(bpmnDiagrams));
    }
  }, [bpmnDiagrams, currentProject?.id]);

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem(`niazkav_checkup_${currentProject.id}`, JSON.stringify(checkupData));
    }
  }, [checkupData, currentProject?.id]);

  // Project Switcher
  const handleSelectProject = (proj: Project) => {
    setCurrentProject(proj);
    setIsCreatingProject(false);

    const savedStk = localStorage.getItem(`niazkav_stk_${proj.id}`);
    setStakeholders(savedStk ? JSON.parse(savedStk) : []);

    const savedReq = localStorage.getItem(`niazkav_req_${proj.id}`);
    setRequirements(savedReq ? JSON.parse(savedReq) : []);

    const savedInt = localStorage.getItem(`niazkav_int_${proj.id}`);
    setInterviews(savedInt ? JSON.parse(savedInt) : []);

    const savedBpmn = localStorage.getItem(`niazkav_bpmn_${proj.id}`);
    setBpmnDiagrams(savedBpmn ? JSON.parse(savedBpmn) : []);

    const savedCheckup = localStorage.getItem(`niazkav_checkup_${proj.id}`);
    setCheckupData(savedCheckup ? JSON.parse(savedCheckup) : emptyCheckupData);
  };

  // Handler for project wizard creation
  const handleProjectCreated = (newProj: Project, templateType: 'blank' | 'tax' | 'erp') => {
    const updatedProjects = [newProj, ...projects];
    setProjects(updatedProjects);
    setCurrentProject(newProj);
    setIsCreatingProject(false);

    if (templateType === 'tax') {
      setStakeholders(initialStakeholders);
      setRequirements(initialRequirements);
      setInterviews(initialInterviews);
      setBpmnDiagrams(initialBpmnDiagrams);
      setCheckupData(initialCheckupData);
    } else if (templateType === 'erp') {
      setStakeholders(initialStakeholders.slice(0, 2));
      setRequirements([]);
      setInterviews([]);
      setBpmnDiagrams([]);
      setCheckupData(emptyCheckupData);
    } else {
      // Blank Project: Starts completely empty
      setStakeholders([]);
      setRequirements([]);
      setInterviews([]);
      setBpmnDiagrams([]);
      setCheckupData(emptyCheckupData);
    }

    setActiveTab('dashboard');
  };

  // Update existing project
  const handleUpdateProject = (updatedProj: Project) => {
    const updatedList = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    setProjects(updatedList);
    if (currentProject && currentProject.id === updatedProj.id) {
      setCurrentProject(updatedProj);
    }
  };

  // Delete project
  const handleDeleteProject = (projectId: string) => {
    const remaining = projects.filter(p => p.id !== projectId);
    setProjects(remaining);

    // Remove local storage entries
    localStorage.removeItem(`niazkav_stk_${projectId}`);
    localStorage.removeItem(`niazkav_req_${projectId}`);
    localStorage.removeItem(`niazkav_int_${projectId}`);
    localStorage.removeItem(`niazkav_bpmn_${projectId}`);
    localStorage.removeItem(`niazkav_checkup_${projectId}`);

    if (currentProject && currentProject.id === projectId) {
      if (remaining.length > 0) {
        handleSelectProject(remaining[0]);
      } else {
        setCurrentProject(null);
        setIsCreatingProject(true);
      }
    }
  };

  // Handlers for Stakeholders
  const handleAddStakeholder = (stk: Stakeholder) => {
    setStakeholders([stk, ...stakeholders]);
  };

  const handleUpdateStakeholder = (stk: Stakeholder) => {
    setStakeholders(stakeholders.map(s => s.id === stk.id ? stk : s));
  };

  const handleDeleteStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  // Handlers for Requirements
  const handleAddRequirement = (req: Requirement) => {
    setRequirements([req, ...requirements]);
  };

  const handleAddMultipleRequirements = (newReqs: Requirement[]) => {
    setRequirements([...newReqs, ...requirements]);
  };

  const handleUpdateRequirement = (req: Requirement) => {
    setRequirements(requirements.map(r => r.id === req.id ? req : r));
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements(requirements.filter(r => r.id !== id));
  };

  // Handler for Interview
  const handleAddInterview = (session: InterviewSession) => {
    setInterviews([session, ...interviews]);
  };

  // Handlers for Bizagi BPMN Diagrams
  const handleSaveBpmnDiagram = (savedDiagram: BpmnDiagram) => {
    const exists = bpmnDiagrams.some((d) => d.id === savedDiagram.id);
    if (exists) {
      setBpmnDiagrams(bpmnDiagrams.map((d) => (d.id === savedDiagram.id ? savedDiagram : d)));
    } else {
      setBpmnDiagrams([savedDiagram, ...bpmnDiagrams]);
    }
  };

  const handleDeleteBpmnDiagram = (diagramId: string) => {
    setBpmnDiagrams(bpmnDiagrams.filter((d) => d.id !== diagramId));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans dir-rtl text-right selection:bg-blue-600 selection:text-white transition-colors duration-200" dir="rtl">
      
      {/* Top Navbar */}
      <Navbar
        currentProject={currentProject}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        onSelectProject={handleSelectProject}
        onOpenNewProjectWizard={() => setIsCreatingProject(true)}
        onEditProject={(proj) => setEditingProject(proj)}
        onDeleteProject={handleDeleteProject}
        onOpenIntroModal={() => setShowIntroModal(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Intro Onboarding Tour Guide Modal */}
      <IntroGuideModal
        isOpen={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
          onDelete={handleDeleteProject}
        />
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* If user is in New Project Wizard mode or has no active project */}
        {(isCreatingProject || !currentProject || projects.length === 0) ? (
          <NewProjectWizard
            onProjectCreated={handleProjectCreated}
            onCancel={projects.length > 0 ? () => setIsCreatingProject(false) : undefined}
            isFirstProject={projects.length === 0}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && currentProject && (
              <DashboardView
                project={currentProject}
                requirements={requirements}
                stakeholders={stakeholders}
                interviews={interviews}
                onNavigate={(tab) => setActiveTab(tab)}
                onEditProject={() => setEditingProject(currentProject)}
                onDeleteProject={handleDeleteProject}
              />
            )}

            {activeTab === 'checkup' && (
              <BusinessCheckup
                checkupData={checkupData}
                onSaveCheckupData={(updated) => setCheckupData(updated)}
              />
            )}

            {activeTab === 'stakeholders' && (
              <StakeholderMatrix
                stakeholders={stakeholders}
                onAddStakeholder={handleAddStakeholder}
                onUpdateStakeholder={handleUpdateStakeholder}
                onDeleteStakeholder={handleDeleteStakeholder}
              />
            )}

            {activeTab === 'interview' && (
              <InterviewAssistant
                questionTemplates={questionTemplates}
                stakeholders={stakeholders}
                interviews={interviews}
                onAddInterview={handleAddInterview}
                onAddRequirements={handleAddMultipleRequirements}
              />
            )}

            {activeTab === 'requirements' && (
              <RequirementsRegistry
                requirements={requirements}
                stakeholders={stakeholders}
                onAddRequirement={handleAddRequirement}
                onUpdateRequirement={handleUpdateRequirement}
                onDeleteRequirement={handleDeleteRequirement}
              />
            )}

            {activeTab === 'workshop' && (
              <WorkshopCanvas />
            )}

            {activeTab === 'bizagi' && (
              <BizagiModelerCanvas
                diagrams={bpmnDiagrams}
                requirements={requirements}
                onSaveDiagram={handleSaveBpmnDiagram}
                onDeleteDiagram={handleDeleteBpmnDiagram}
              />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeBase regulations={initialRegulations} />
            )}

            {activeTab === 'prd' && currentProject && (
              <PrdGenerator
                project={currentProject}
                requirements={requirements}
                stakeholders={stakeholders}
                interviews={interviews}
                regulations={initialRegulations}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600 dark:text-slate-300">سامانه «نیازکاو» (NiazKav) - طراحی بومی تحلیل نیازمندی‌های کسب‌وکار ایران</span>
          <span className="text-slate-400 dark:text-slate-500">پشتیبانی از متدولوژی‌های BABOK®، Agile و قوانین سازمان امور مالیاتی</span>
        </div>
      </footer>

    </div>
  );
}
