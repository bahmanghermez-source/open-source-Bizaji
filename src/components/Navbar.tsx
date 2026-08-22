import React, { useState, useEffect, useRef } from 'react';
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
  ChevronUp,
  HelpCircle,
  Sun,
  Moon,
  Workflow,
  Activity,
  Menu,
  X,
  Search,
  Grid,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  FolderPlus,
  FolderEdit
} from 'lucide-react';

interface NavbarProps {
  currentProject: Project | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  onSelectProject: (proj: Project) => void;
  onNewProject?: (proj: Project) => void;
  onOpenNewProjectWizard?: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
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
  onOpenNewProjectWizard,
  onEditProject,
  onDeleteProject,
  onOpenIntroModal,
  theme,
  onToggleTheme
}) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>('all');

  const megaMenuRef = useRef<HTMLDivElement>(null);

  // New Project Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [client, setClient] = useState('');
  const [industry, setIndustry] = useState('فناوری اطلاعات');
  const [startDateJalali, setStartDateJalali] = useState('۱۴۰۵/۰۵/۰۱');
  const [targetCompletionJalali, setTargetCompletionJalali] = useState('۱۴۰۵/۱۰/۳۰');
  const [description, setDescription] = useState('');

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Structured Mega Menu Groups
  const megaMenuCategories = [
    {
      id: 'cat-strategy',
      title: 'تحلیل و عارضه‌یابی استراتژیک',
      subtitle: 'ارزیابی بلوغ، ماتریس ذینفعان و چکاپ بوم',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      textColor: 'text-blue-700 dark:text-blue-300',
      items: [
        { 
          id: 'dashboard', 
          label: 'داشبورد جامع پروژه', 
          desc: 'نمای کلی وضعیت، آمار نیازمندی‌ها و شاخص‌های کلیدی', 
          icon: Layers, 
          badge: 'مرکزی' 
        },
        { 
          id: 'checkup', 
          label: 'چکاپ و عارضه‌یابی استراتژیک', 
          desc: 'ارزیابی ریسک‌ها، موانع قانونی و جاهای خالی نیازمندی', 
          icon: Activity, 
          badge: 'جدید' 
        },
        { 
          id: 'stakeholders', 
          label: 'ذینفعان و ماتریس قدرت', 
          desc: 'تحلیل حامیان، مخالفان و سطح نگاشت قدرت-علاقه‌مندی', 
          icon: Users, 
          badge: 'ماتریس' 
        },
      ]
    },
    {
      id: 'cat-discovery',
      title: 'کشف و اولویت‌بندی نیازمندی‌ها',
      subtitle: 'مصاحبه‌ها، کارگاه‌های طوفان فکری و اولویت‌بندی',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      textColor: 'text-amber-700 dark:text-amber-300',
      items: [
        { 
          id: 'requirements', 
          label: 'شناسنامه نیازمندی‌ها', 
          desc: 'دسته‌بندی فنی و رتبه‌بندی استاندارد MoSCoW', 
          icon: CheckSquare, 
          badge: 'MoSCoW' 
        },
        { 
          id: 'interview', 
          label: 'مصاحبه‌گر و الگوها', 
          desc: 'پرسش‌نامه‌های هوشمند بر اساس صنف و رسته شغلی', 
          icon: MessageSquare, 
          badge: 'الگوها' 
        },
        { 
          id: 'workshop', 
          label: 'کارگاه تعاملی کشف', 
          desc: 'تخته سفید تعاملی و ثبت کارت‌های نیازمندی زنده', 
          icon: UserCheck, 
          badge: 'تعاملی' 
        },
      ]
    },
    {
      id: 'cat-compliance',
      title: 'فرآیندها، اسناد و قوانین بومی',
      subtitle: 'مدلسازی Bizagi BPMN، پایگاه دانش ایران و PRD',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      items: [
        { 
          id: 'bizagi', 
          label: 'مدلساز فرآیند Bizagi', 
          desc: 'طراحی ویژوال دیاگرام‌های BPMN 2.0 و خروجی XML', 
          icon: Workflow, 
          badge: 'BPMN 2.0' 
        },
        { 
          id: 'knowledge', 
          label: 'پایگاه دانش قوانین ایران', 
          desc: 'سامانه مودیان، اصناف (ghanonsenfi.com)، شاپرک و بیمه', 
          icon: BookOpen, 
          badge: 'مرجع' 
        },
        { 
          id: 'prd', 
          label: 'تولیدگر PRD و اسناد', 
          desc: 'تولید اسناد رسمی سند نیازمندی‌های نرم‌افزار و معماری', 
          icon: FileText, 
          badge: 'اکسپورت' 
        },
      ]
    }
  ];

  // All flat items for mobile search and quick bar
  const allItems = megaMenuCategories.flatMap(c => c.items);

  const filteredMobileItems = allItems.filter(item => 
    item.label.toLowerCase().includes(mobileSearch.toLowerCase()) ||
    item.desc.toLowerCase().includes(mobileSearch.toLowerCase())
  );

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100 dark:border-slate-800/80 gap-2">
          
          {/* Right Side: Logo & Brand + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="باز کردن منوی موبایل"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 sm:p-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-sans">نیازکاو</span>
                  <span className="text-[10px] sm:text-[11px] bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    v1.0
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">سامانه هوشمند تحلیل نیازمندی‌های کسب‌وکار ایران</p>
              </div>
            </div>

          </div>

          {/* Left Side: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Jalali Date Badge */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>شنبـه ۱۸ مرداد ۱۴۰۵</span>
            </div>

            {/* AI Assistant Ready Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>هوش مصنوعی فعال</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title={theme === 'dark' ? 'تم روشن' : 'تم تاریک'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-[11px]">روشن</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline text-[11px]">تاریک</span>
                </>
              )}
            </button>

            {/* Tour Guide Button */}
            {onOpenIntroModal && (
              <button
                onClick={onOpenIntroModal}
                className="hidden sm:flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 transition cursor-pointer"
                title="راهنمای معرفی سامانه"
              >
                <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden lg:inline text-[11px]">راهنما</span>
              </button>
            )}

            {/* Project Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold px-2.5 sm:px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="max-w-[110px] sm:max-w-[150px] truncate text-[11px] sm:text-xs font-bold">
                  {currentProject ? currentProject.name : 'انتخاب یا ساخت پروژه'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 text-right">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span>پروژه‌های شما ({projects.length})</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1 space-y-1 px-1">
                    {projects.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-4">هنوز هیچ پروژه‌ای تعریف نشده است.</p>
                    ) : (
                      projects.map((p) => (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between px-3 py-2 text-xs rounded-xl transition ${
                            currentProject && p.id === currentProject.id 
                              ? 'bg-blue-50/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 font-bold text-blue-800 dark:text-blue-300' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <button
                            onClick={() => {
                              onSelectProject(p);
                              setShowDropdown(false);
                            }}
                            className="text-right flex-1 truncate pl-2"
                          >
                            <span className="truncate block font-bold">{p.name}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{p.code} | {p.client}</span>
                          </button>

                          <div className="flex items-center gap-1 shrink-0">
                            {onEditProject && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDropdown(false);
                                  onEditProject(p);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition"
                                title="ویرایش پروژه"
                              >
                                <FolderEdit className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {onDeleteProject && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`آیا از حذف پروژه «${p.name}» اطمینان دارید؟`)) {
                                    onDeleteProject(p.id);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                                title="حذف پروژه"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 px-2">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        if (onOpenNewProjectWizard) {
                          onOpenNewProjectWizard();
                        } else {
                          setShowProjectModal(true);
                        }
                      }}
                      className="w-full text-center flex items-center justify-center gap-2 text-xs text-white bg-blue-600 hover:bg-blue-700 font-bold py-2 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>تعریف پروژه جدید همراه با راهنما</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Desktop Mega Menu Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-between py-2 relative" ref={megaMenuRef}>
          
          {/* Quick Active Items Pills */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            
            {/* Mega Menu Toggle Button */}
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black rounded-xl transition cursor-pointer border ${
                isMegaMenuOpen
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-transparent shadow-sm'
              }`}
            >
              <Grid className="w-4 h-4 text-white" />
              <span>مگا منوی ماژول‌ها</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Primary Quick Navigation Tabs */}
            {allItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMegaMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Full-Width Mega Menu Dropdown Panel */}
          {isMegaMenuOpen && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 p-6 backdrop-blur-xl space-y-6 dir-rtl text-right animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-0.5">
                  <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>مگا منوی تخصصی تحلیل و مدیریت نیازمندی‌ها</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    دسترسی سریع به تمام ماژول‌های کشف، عارضه‌یابی، مدلسازی BPMN و پایگاه دانش قوانین ایران
                  </p>
                </div>
                <button
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Grid Columns for Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {megaMenuCategories.map((cat) => (
                  <div key={cat.id} className="space-y-3">
                    <div className={`p-3.5 rounded-2xl border ${cat.bgColor} space-y-1`}>
                      <span className={`text-[11px] font-black uppercase tracking-wider ${cat.textColor}`}>
                        {cat.title}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{cat.subtitle}</p>
                    </div>

                    <div className="space-y-2">
                      {cat.items.map((subItem) => {
                        const Icon = subItem.icon;
                        const isSubActive = activeTab === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setActiveTab(subItem.id);
                              setIsMegaMenuOpen(false);
                            }}
                            className={`w-full text-right p-3 rounded-2xl border transition flex items-start gap-3 cursor-pointer group ${
                              isSubActive
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                                : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 ${
                              isSubActive 
                                ? 'bg-white/20 text-white' 
                                : 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`font-bold text-xs truncate ${isSubActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                  {subItem.label}
                                </span>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                  isSubActive 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                  {subItem.badge}
                                </span>
                              </div>
                              <p className={`text-[10px] leading-relaxed line-clamp-2 ${
                                isSubActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                              }`}>
                                {subItem.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Footer Callout inside Mega Menu */}
              <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-4 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>مرجع کامل قوانین اصناف ایران (ghanonsenfi.com)، سامانه مودیان و شاپرک</span>
                </div>
                <button 
                  onClick={() => {
                    setActiveTab('knowledge');
                    setIsMegaMenuOpen(false);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-1.5 rounded-xl transition text-[11px] shrink-0"
                >
                  ورود به پایگاه دانش
                </button>
              </div>

            </div>
          )}

        </nav>

      </div>

      {/* Mobile & Tablet Full Screen Responsive Drawer / Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm h-full shadow-2xl flex flex-col p-5 overflow-y-auto space-y-5 text-right dir-rtl animate-in slide-in-from-right duration-200 border-r border-slate-200 dark:border-slate-800">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="font-black text-lg text-slate-900 dark:text-white">منوی هوشمند نیازکاو</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="جستجو در ابزارها و ماژول‌ها..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Mobile Categories Accordion */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {mobileSearch ? (
                /* Search Results */
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">نتایج جستجو ({filteredMobileItems.length})</span>
                  {filteredMobileItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-right p-3 rounded-xl border flex items-center gap-3 transition ${
                          isActive 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-blue-500 shrink-0" />
                        <div className="flex-1">
                          <span className="font-bold text-xs block">{item.label}</span>
                          <span className="text-[10px] text-slate-400">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Accordion Groups */
                megaMenuCategories.map((cat) => (
                  <div key={cat.id} className="space-y-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <button
                      onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)}
                      className="w-full flex items-center justify-between text-xs font-black text-slate-900 dark:text-white py-1"
                    >
                      <span>{cat.title}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedMobileCat === cat.id ? 'rotate-180' : ''}`} />
                    </button>

                    {(expandedMobileCat === cat.id || expandedMobileCat === 'all') && (
                      <div className="space-y-1.5 pt-1">
                        {cat.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full text-right p-2.5 rounded-xl border flex items-center gap-2.5 transition ${
                                isActive 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                              <span className="font-bold text-xs flex-1">{item.label}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}>
                                {item.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Mobile Footer Tools */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>وضعیت هوش مصنوعی:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  آنلاین و آماده
                </span>
              </div>

              <button
                onClick={() => {
                  onToggleTheme();
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                <span>تغییر به تم {theme === 'dark' ? 'روشن' : 'تاریک'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Bottom Quick Navigation Bar (For Phones & Small Screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around text-slate-600 dark:text-slate-400 shadow-lg dir-rtl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-xl transition ${
            activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>داشبورد</span>
        </button>

        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-xl transition ${
            activeTab === 'requirements' ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>نیازمندی‌ها</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-xl text-white bg-blue-600 px-3 py-1 shadow-md shadow-blue-500/30"
        >
          <Grid className="w-4 h-4" />
          <span>مگا منو</span>
        </button>

        <button
          onClick={() => setActiveTab('bizagi')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-xl transition ${
            activeTab === 'bizagi' ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>BPMN</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-xl transition ${
            activeTab === 'knowledge' ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>قوانین</span>
        </button>
      </div>

      {/* New Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-right dir-rtl">
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
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
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
