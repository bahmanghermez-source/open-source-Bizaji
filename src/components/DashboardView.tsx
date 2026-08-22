import React from 'react';
import { Project, Requirement, Stakeholder, InterviewSession } from '../types';
import { 
  CheckSquare, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck2, 
  Calendar, 
  ArrowLeft,
  Sparkles,
  Building,
  Target,
  Activity,
  FolderEdit,
  Trash2
} from 'lucide-react';

interface DashboardViewProps {
  project: Project;
  requirements: Requirement[];
  stakeholders: Stakeholder[];
  interviews: InterviewSession[];
  onNavigate: (tab: string) => void;
  onEditProject?: () => void;
  onDeleteProject?: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  requirements,
  stakeholders,
  interviews,
  onNavigate,
  onEditProject,
  onDeleteProject
}) => {
  const functionalCount = requirements.filter(r => r.type === 'Functional').length;
  const nonFunctionalCount = requirements.filter(r => r.type === 'NonFunctional').length;

  const mustCount = requirements.filter(r => r.priority === 'Must').length;
  const shouldCount = requirements.filter(r => r.priority === 'Should').length;
  const couldCount = requirements.filter(r => r.priority === 'Could').length;
  const wontCount = requirements.filter(r => r.priority === 'Wont').length;

  const approvedCount = requirements.filter(r => r.status === 'Approved').length;
  const reviewCount = requirements.filter(r => r.status === 'UnderReview').length;

  const highPowerStakeholders = stakeholders.filter(s => s.power >= 4).length;

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Hero Welcome & Project Summary Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-colors">
        <div className="absolute left-0 top-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                پروژه فعال تحلیل نیازمندی‌ها
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-mono">{project.code}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>کارفرما: <strong className="text-slate-800 dark:text-slate-200">{project.client}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>بازه زمانی: <strong className="text-slate-800 dark:text-slate-200">{project.startDateJalali} الی {project.targetCompletionJalali}</strong></span>
              </div>

              {onEditProject && (
                <button
                  onClick={onEditProject}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs mr-2 cursor-pointer"
                >
                  <FolderEdit className="w-3.5 h-3.5" />
                  <span>ویرایش شناسنامه پروژه</span>
                </button>
              )}

              {onDeleteProject && (
                <button
                  onClick={() => {
                    if (window.confirm(`آیا از حذف کامل پروژه «${project.name}» اطمینان دارید؟`)) {
                      onDeleteProject(project.id);
                    }
                  }}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium text-xs mr-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف پروژه</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('checkup')}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>چکاپ و عارضه‌یابی استراتژیک</span>
            </button>
            <button
              onClick={() => onNavigate('interview')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>مصاحبه جدید با ذینفعان</span>
            </button>
            <button
              onClick={() => onNavigate('prd')}
              className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>خروجی سند PRD</span>
            </button>
          </div>

        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Requirements */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">کل نیازمندی‌های استخراج‌شده</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{requirements.length}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">مورد ثبت‌شده</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
              <span className="text-blue-600 dark:text-blue-400 font-bold">{functionalCount} کارکردی</span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{nonFunctionalCount} غیرکارکردی</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Must Have Priority */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">نیازمندی‌های حیاتی (Must-Have)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{mustCount}</span>
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                ({requirements.length ? Math.round((mustCount / requirements.length) * 100) : 0}٪ کل)
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">نیازمندی‌های بدون اغماض فاز اول</p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Stakeholders Mapped */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">ذینفعان شناسایی‌شده</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{stakeholders.length}</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">{highPowerStakeholders} کلیدی</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">تحلیل ماتریس قدرت و نفوذ</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Interviews Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">جلسات مصاحبه ثبت‌شده</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{interviews.length}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">تکمیل‌شده</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">استخراج نیازمندی با AI</p>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl text-teal-600 dark:text-teal-400">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Priority Distribution + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MoSCoW Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>توزیع اولویت‌بندی نیازمندی‌ها (MoSCoW)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">بررسی سهم نیازمندی‌های ضروری در برابر ترجیحی و آتی</p>
            </div>
            <button
              onClick={() => onNavigate('requirements')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>مشاهده لیست کامل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            
            {/* Must Have */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Must Have (حیاتی و الزام‌آور)</span>
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{mustCount} مورد</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${requirements.length ? (mustCount / requirements.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Should Have */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Should Have (باید باشد - اولویت بالا)</span>
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{shouldCount} مورد</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${requirements.length ? (shouldCount / requirements.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Could Have */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Could Have (می‌تواند باشد - در صورت تمایل)</span>
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{couldCount} مورد</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${requirements.length ? (couldCount / requirements.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Won't Have */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>Won't Have (خارج از محدوده فاز جاری)</span>
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{wontCount} مورد</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-slate-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${requirements.length ? (wontCount / requirements.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-start gap-3 mt-4">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-200 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">تحلیل هوشمند توازن نیازمندی‌ها (BABOK)</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                سهم نیازمندی‌های Must-Have حدود {requirements.length ? Math.round((mustCount / requirements.length) * 100) : 0}٪ است. استانداردهای کشف نیازمندی توصیه می‌کنند سهم Must-Have زیر ۶۰٪ کل پروژه نگه داشته شود تا انعطاف‌پذیری زمان و بودجه در فاز توسعه حفظ شود.
              </p>
            </div>
          </div>

        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>میانبرهای فرایندی تحلیلگر</span>
          </h3>

          <div className="space-y-2.5">
            
            <button
              onClick={() => onNavigate('interview')}
              className="w-full text-right p-3 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/60 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">راهنمای مصاحبه هوشمند</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">با الگوهای پرسشگری بومیسازی شده</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:-translate-x-1 transition" />
            </button>

            <button
              onClick={() => onNavigate('stakeholders')}
              className="w-full text-right p-3 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/60 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">ماتریس قدرت و نفوذ ذینفعان</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">تحلیل تعاملات و استراتژی ارتباطی</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:-translate-x-1 transition" />
            </button>

            <button
              onClick={() => onNavigate('workshop')}
              className="w-full text-right p-3 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/60 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">کارگاه کشف نیازمندی</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">طراحی تعاملی، JTBD و Event Storming</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:-translate-x-1 transition" />
            </button>

            <button
              onClick={() => onNavigate('knowledge')}
              className="w-full text-right p-3 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/60 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">پایگاه قوانین و رگولاتوری ایران</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">سامانه مودیان، کاشف و الزامات مالیاتی</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:-translate-x-1 transition" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
