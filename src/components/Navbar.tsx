import React, { useState } from 'react';
import { Project } from '../types';
import { 
  Compass, 
  Layers, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  UserCheck, 
  BookOpen, 
  FileText, 
  Plus, 
  Calendar,
  Sparkles,
  Building2,
  ChevronDown,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  currentProject: Project;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  onSelectProject: (proj: Project) => void;
  onNewProject: (proj: Project) => void;
  onOpenIntroModal?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  activeTab,
  setActiveTab,
  projects,
  onSelectProject,
  onNewProject,
  onOpenIntroModal,
  theme,
  onToggleTheme
}) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // New Project Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [client, setClient] = useState('');
  const [industry, setIndustry] = useState('فناوری اطلاعات');
  const [startDateJalali, setStartDateJalali] = useState('۱۴۰۵/۰۵/۰۱');
  const [targetCompletionJalali, setTargetCompletionJalali] = useState('۱۴۰۵/۱۰/۳۰');
  const [description, setDescription] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      code: code || `NZK-${Math.floor(100 + Math.random() * 900)}`,
      client: client || 'نامشخص',
      industry,
      startDateJalali,
      targetCompletionJalali,
      description,
      author: 'تحلیلگر ارشد کسب‌وکار'
    };

    onNewProject(newProj);
    setShowProjectModal(false);
    setName('');
    setCode('');
    setClient('');
    setDescription('');
  };

  const navItems = [
    { id: 'dashboard', label: 'داشبورد پروژه', icon: Layers },
    { id: 'stakeholders', label: 'ذینفعان و ماتریس قدرت', icon: Users },
    { id: 'interview', label: 'مصاحبه‌گر و الگوها', icon: MessageSquare },
    { id: 'requirements', label: 'نیازمندی‌ها (MoSCoW)', icon: CheckSquare },
    { id: 'workshop', label: 'کارگاه کشف نیازمندی', icon: UserCheck },
    { id: 'knowledge', label: 'پایگاه دانش و قوانین ایران', icon: BookOpen },
    { id: 'prd', label: 'تولیدگر PRD / اسناد', icon: FileText },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 sticky top-0 z-40 shadow-sm transition-colors duration-200">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100 dark:border-slate-800/80">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white font-sans">نیازکاو</span>
                <span className="text-[11px] bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  NiazKav v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">سامانه هوشمند تحلیل نیازمندی‌های کسب‌وکار ایران</p>
            </div>
          </div>

          {/* Controls & Tools */}
          <div className="flex items-center gap-3">
            
            {/* Jalali Date Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>شنبه ۱۸ مرداد ۱۴۰۵</span>
            </div>

            {/* AI Assistant Ready Badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>هوش مصنوعی فعال</span>
            </div>

            {/* Sleek Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition shadow-xs cursor-pointer"
              title={theme === 'dark' ? 'تغییر به تم روشن (Sleek Light)' : 'تغییر به تم تاریک (Sleek Dark)'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden lg:inline">تم روشن</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden lg:inline">تم تاریک</span>
                </>
              )}
            </button>

            {/* Intro Tour Guide Button */}
            {onOpenIntroModal && (
              <button
                onClick={onOpenIntroModal}
                className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 transition shadow-xs cursor-pointer"
                title="راهنمای معرفی سامانه و تور آموزشی"
              >
                <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden lg:inline">راهنما</span>
              </button>
            )}

            {/* Current Project Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition shadow-xs cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="max-w-[160px] truncate">{currentProject.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 text-right">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800">
                    پروژه‌های شما
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProject(p);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-right px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition ${
                          p.id === currentProject.id 
                            ? 'bg-blue-50/70 dark:bg-blue-950/60 border-r-2 border-blue-600 font-bold text-blue-800 dark:text-blue-300' 
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{p.code} | {p.client}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1.5 px-2">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowProjectModal(true);
                      }}
                      className="w-full text-center flex items-center justify-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>تعریف پروژه جدید</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-reverse space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* New Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-right">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>تعریف پروژه جدید کشف نیازمندی</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">اطلاعات اولیه پروژه را بر اساس ساختار سازمانی بومیسازی شده وارد کنید.</p>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نام پروژه *</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: سامانه مدیریت صورتحساب‌های الکترونیکی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">کد اختصاصی پروژه</label>
                  <input
                    type="text"
                    placeholder="مثلاً: NZK-TAX-1405"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نام کارفرما / سازمان</label>
                  <input
                    type="text"
                    placeholder="مثلاً: شرکت صنایع آریا"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">تاریخ شروع (شمسی)</label>
                  <input
                    type="text"
                    value={startDateJalali}
                    onChange={(e) => setStartDateJalali(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">تاریخ پایان تحویل (شمسی)</label>
                  <input
                    type="text"
                    value={targetCompletionJalali}
                    onChange={(e) => setTargetCompletionJalali(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">شرح خلاصه محدوده پروژه</label>
                <textarea
                  rows={3}
                  placeholder="شرحی مختصر از اهداف، چالش‌ها و قوانین حقوقی یا مالیاتی مرتبط..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition"
                >
                  ایجاد پروژه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

