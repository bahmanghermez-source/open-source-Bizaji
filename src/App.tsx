import React, { useState, useEffect } from 'react';
import { 
  Project, 
  Requirement, 
  Stakeholder, 
  InterviewSession, 
  QuestionTemplate, 
  RegulationItem 
} from './types';
import { 
  initialProject, 
  initialStakeholders, 
  initialRequirements, 
  questionTemplates, 
  initialInterviews, 
  initialRegulations 
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

  // Intro guide modal state (auto show on first visit unless disabled)
  const [showIntroModal, setShowIntroModal] = useState<boolean>(() => {
    return !localStorage.getItem('niazkav_intro_seen');
  });

  // Load state from localStorage or initialData
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('niazkav_projects');
    return saved ? JSON.parse(saved) : [initialProject];
  });

  const [currentProject, setCurrentProject] = useState<Project>(() => {
    return projects[0] || initialProject;
  });

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(() => {
    const saved = localStorage.getItem(`niazkav_stk_${currentProject.id}`);
    return saved ? JSON.parse(saved) : initialStakeholders;
  });

  const [requirements, setRequirements] = useState<Requirement[]>(() => {
    const saved = localStorage.getItem(`niazkav_req_${currentProject.id}`);
    return saved ? JSON.parse(saved) : initialRequirements;
  });

  const [interviews, setInterviews] = useState<InterviewSession[]>(() => {
    const saved = localStorage.getItem(`niazkav_int_${currentProject.id}`);
    return saved ? JSON.parse(saved) : initialInterviews;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('niazkav_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`niazkav_stk_${currentProject.id}`, JSON.stringify(stakeholders));
  }, [stakeholders, currentProject.id]);

  useEffect(() => {
    localStorage.setItem(`niazkav_req_${currentProject.id}`, JSON.stringify(requirements));
  }, [requirements, currentProject.id]);

  useEffect(() => {
    localStorage.setItem(`niazkav_int_${currentProject.id}`, JSON.stringify(interviews));
  }, [interviews, currentProject.id]);

  // Project Switcher
  const handleSelectProject = (proj: Project) => {
    setCurrentProject(proj);
    const savedStk = localStorage.getItem(`niazkav_stk_${proj.id}`);
    setStakeholders(savedStk ? JSON.parse(savedStk) : initialStakeholders);

    const savedReq = localStorage.getItem(`niazkav_req_${proj.id}`);
    setRequirements(savedReq ? JSON.parse(savedReq) : initialRequirements);

    const savedInt = localStorage.getItem(`niazkav_int_${proj.id}`);
    setInterviews(savedInt ? JSON.parse(savedInt) : initialInterviews);
  };

  const handleNewProject = (newProj: Project) => {
    setProjects([newProj, ...projects]);
    setCurrentProject(newProj);
    setStakeholders(initialStakeholders);
    setRequirements(initialRequirements);
    setInterviews(initialInterviews);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans dir-rtl text-right selection:bg-blue-600 selection:text-white transition-colors duration-200" dir="rtl">
      
      {/* Top Navbar */}
      <Navbar
        currentProject={currentProject}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            project={currentProject}
            requirements={requirements}
            stakeholders={stakeholders}
            interviews={interviews}
            onNavigate={(tab) => setActiveTab(tab)}
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

        {activeTab === 'knowledge' && (
          <KnowledgeBase regulations={initialRegulations} />
        )}

        {activeTab === 'prd' && (
          <PrdGenerator
            project={currentProject}
            requirements={requirements}
            stakeholders={stakeholders}
            interviews={interviews}
            regulations={initialRegulations}
          />
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
