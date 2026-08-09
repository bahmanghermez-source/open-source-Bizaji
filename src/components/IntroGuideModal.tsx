import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  UserCheck, 
  BookOpen, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  HelpCircle,
  Zap,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

interface IntroGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

interface Step {
  id: string;
  tabId: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  description: string;
  bullets: string[];
  tips: string;
}

export const IntroGuideModal: React.FC<IntroGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const steps: Step[] = [
    {
      id: 'welcome',
      tabId: 'dashboard',
      title: 'خوش‌آمدگویی به سامانه هوشمند «نیازکاو» (NiazKav)',
      subtitle: 'دستیار کامل تحلیل نیازمندی‌ها، مهندسی نرم‌افزار و قوانین بومی کسب‌وکار ایران',
      icon: Compass,
      color: 'from-blue-600 to-indigo-600',
      badge: 'معرفی کلی و ساختار',
      description: 'نیازکاو پلتفرم جامع مهندسان نرم‌افزار، تحلیلگران سیستم و مدیران محصول است که استانداردهای جهانی BABOK® و Agile را با قوانین رگولاتوری ایران (سامانه مودیان، کاشف و مالیاتی) پیوند می‌دهد.',
      bullets: [
        'طراحی کامل با فونت بومی وزیرمتن (Vazirmatn) در وزن‌های مختلف برای خوانایی حداکثری',
        'پشتیبانی از تحلیل هوشمند متون مصاحبه و تولید داستان کاربر با Gemini AI',
        'سازگار با قوانین مالیاتی ماده ۲۲، الگوریتم‌های صورتحساب الکترونیکی و امضای دیجیتال',
        'مدیریت سناریوهای کارگاهی، حل تضادهای ذینفعان و استخراج سند PRD/BRD'
      ],
      tips: 'می‌توانید با استفاده از کلیدهای بعدی و قبلی یا کلیک روی شماره گام‌ها، تور آموزشی سامانه را مرور کنید.'
    },
    {
      id: 'dashboard',
      tabId: 'dashboard',
      title: '۱. داشبورد اجرایی و ارزیابی سلامت نیازمندی‌ها',
      subtitle: 'نمای ۳۶۰ درجه از شاخص‌های کلیدی پروژه و میزان پیشرفت تحلیل',
      icon: Layers,
      color: 'from-blue-600 to-cyan-600',
      badge: 'مدیریت و آمار کلیدی',
      description: 'در این بخش وضعیت کلی پروژه شامل نسبت نیازمندی‌های کارکردی به غیرکارکردی، توزیع اولویت‌های MoSCoW و امتیاز آمادگی سیستم را مشاهده می‌کنید.',
      bullets: [
        'سنجش خودکار پوشش نیازمندی‌های الزامی رگولاتوری ایران',
        'جدول اولویت‌بندی سریع با تفکیک حوزه (مالی، مودیان، امنیت، اتوماسیون)',
        'مشاهده آخرین فعالیت‌ها و جلسات ثبت‌شده در پروژه'
      ],
      tips: 'کلیک روی کارت‌های آمار سریع شما را مستقیم به مخزن نیازمندی‌ها هدایت می‌کند.'
    },
    {
      id: 'stakeholders',
      tabId: 'stakeholders',
      title: '۲. مدیریت ذینفعان و ماتریس قدرت / علاقه (Mendelow Matrix)',
      subtitle: 'شناسایی و دسته‌بندی استراتژیک ذینفعان کلیدی پروژه',
      icon: Users,
      color: 'from-purple-600 to-indigo-600',
      badge: 'تحلیل ذینفعان',
      description: 'بر اساس متدولوژی BABOK®، ذینفعان در ۴ ربع ماتریس مندلو (بازیکنان کلیدی، رضایت‌بخش، مطلع و حداقل تلاش) تحلیل می‌شوند تا تعارضات مدیریت گردد.',
      bullets: [
        'ارزیابی و نمره‌دهی قدرت تأثیرگذاری (Power) و میزان منافع (Interest)',
        'تعریف راهبرد تعاملی اختصاصی برای هر گروه از ذینفعان',
        'ثبت نیازمندی‌های کلیدی مطرح‌شده توسط هر فرد'
      ],
      tips: 'تغییر قدرت یا علاقه هر ذینفع، جابه‌جایی او در بوم گرافیکی ماتریس را به صورت زنده نمایش می‌دهد.'
    },

    {
      id: 'interview',
      tabId: 'interview',
      title: '۳. دستیار هوشمند مصاحبه و پیاده‌سازی صورت‌جلسات',
      subtitle: 'تبدیل متن مصاحبه یا الگوی سوالات به نیازمندی‌های ساختاریافته با AI',
      icon: MessageSquare,
      color: 'from-emerald-600 to-teal-600',
      badge: 'هوش مصنوعی و مصاحبه',
      description: 'با استفاده از موتور پردازش هوش مصنوعی، متن پیاده‌شده از جلسات مصاحبه تحلیل شده و نیازمندی‌های کارکردی و غیرکارکردی به صورت خودکار استخراج می‌شوند.',
      bullets: [
        'بانک سوالات آماده بر اساس حوزه‌های مالیاتی، اتوماسیون، امنیت و انبارداری',
        'استخراج خودکار کد نیازمندی، عنوان، اولویت اولیه و معیارهای پذیرش اولیه',
        'افزایش مستقیم نیازمندی‌های استخراج‌شده به مخزن پروژه تنها با یک کلیک'
      ],
      tips: 'می‌توانید خلاصه گفتگوهای جلسه با مدیران را در کادر متن قرار دهید تا AI آن را کباب و تجزیه کند.'
    },
    {
      id: 'requirements',
      tabId: 'requirements',
      title: '۴. مخزن نیازمندی‌ها و داستان کاربر (MoSCoW Registry)',
      subtitle: 'ثبت، اولویت‌بندی ساختاریافته و تولید سناریوی BDD / Gherkin',
      icon: CheckSquare,
      color: 'from-amber-600 to-orange-600',
      badge: 'اولویت‌بندی MoSCoW',
      description: 'پایگاه مرکزی نیازمندی‌های Must, Should, Could و Won\'t Have. با امکان ردیابی تاریخچه تغییرات و تولید سناریوهای Given/When/Then برای تیم تست.',
      bullets: [
        'فیلتر پیشرفته بر اساس نوع نیازمندی، حوزه تخصصی و اولویت MoSCoW',
        'تولید خودکار داستان کاربر (User Story) استاندارد به زبان فارسی با AI',
        'تحلیل اثرات تغییر (Impact Analysis) بر سایر زیرسیستم‌ها'
      ],
      tips: 'دکمه «تولید داستان کاربر» روی هر نیازمندی سناریوی آماده‌ی Gherkin خلق می‌کند.'
    },
    {
      id: 'workshop',
      tabId: 'workshop',
      title: '۵. کارگاه تعاملی کشف و حل تضادها (Discovery Workshop)',
      subtitle: 'بوم طوفان فکری، کارت‌های JTBD و ماتریس حل اختلافات',
      icon: UserCheck,
      color: 'from-rose-600 to-pink-600',
      badge: 'کارگاه و طوفان فکری',
      description: 'تسهیل برگزاری کارگاه‌های همزمان کشف نیازمندی، ثبت سناریوهای Event Storming و مدیریت و حل شفاف تضاد دیدگاه‌های ذینفعان.',
      bullets: [
        'ثبت کارت‌های رنگی JTBD، رویدادها و ریسک‌های سیستم',
        'تایمر زنده و هوشمند مدیریت زمان کارگاه با کنترل پخش/توقف',
        'جدول ثبت مواضع متفاوت ذینفعان و توافقات حاصل‌شده در کارگاه'
      ],
      tips: 'تضادهای ثبت‌شده در این بخش مستقیماً در سند نهایی PRD/BRD منعکس می‌شوند.'
    },
    {
      id: 'knowledge',
      tabId: 'knowledge',
      title: '۶. پایگاه دانش قوانین، مالیات و مقررات بومی ایران',
      subtitle: 'مرجع الزامات قانونی سازمان امور مالیاتی، مودیان و کاشف',
      icon: BookOpen,
      color: 'from-violet-600 to-purple-600',
      badge: 'قوانین و رگولاتوری',
      description: 'مجموعه‌ای جامع از الزامات قانونی ایران شامل ماده ۲۲ ارزش افزوده، ساختار شماره مالیاتی ۲۲ کاراکتری، امضای دیجیتال RSA و استانداردهای بانک مرکزی.',
      bullets: [
        'دستورالعمل‌های الزامی سازمان امور مالیاتی جهت رعایت در طراحی نرم‌افزار',
        'واژه‌نامه تخصصی اصطلاحات کسب‌وکار ایران (کاشف، سامانه مودیان، صورتحساب الکترونیکی)',
        'بررسی اثر مستقیم هر قانون بر معماری دیتابیس و فرم‌های سیستم'
      ],
      tips: 'قبل از نهایی‌سازی نیازمندی‌های مالی، قوانین این بخش را حتماً مرور کنید.'
    },
    {
      id: 'prd',
      tabId: 'prd',
      title: '۷. تولیدگر خودکار اسناد PRD و BRD',
      subtitle: 'خروجی‌گیری استاندارد، آماده چاپ و تدوین هوشمند با AI',
      icon: FileText,
      color: 'from-teal-600 to-emerald-600',
      badge: 'خروجی‌گیری و چاپ',
      description: 'تجمیع تمام اطلاعات پروژه، ذینفعان، نیازمندی‌ها و قوانین در قالب یک سند رسمی و یکپارچه PRD یا BRD با امکان چاپ مستقیم و خروجی PDF.',
      bullets: [
        'امکان فعال/غیرفعال‌سازی بخش‌های مختلف سند قبل از چاپ',
        'تولید خودکار خلاصه اجرایی (Executive Summary) با هوش مصنوعی',
        'کادربندی رسمی همراه با محل امضای تحلیلگر ارشد و کارفرما'
      ],
      tips: 'استفاده از دکمه «چاپ / خروجی PDF» سندی شکیل و صفحه‌بندی‌شده تحویل می‌دهد.'
    }
  ];

  const handleCloseModal = () => {
    if (dontShowAgain) {
      localStorage.setItem('niazkav_intro_seen', 'true');
    }
    onClose();
  };

  const handleNavigateToSection = (tabId: string) => {
    onNavigateTab(tabId);
    handleCloseModal();
  };

  const activeStepData = steps[currentStep];
  const StepIcon = activeStepData.icon;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-right font-sans dir-rtl" dir="rtl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all">
        
        {/* Modal Top Bar */}
        <div className={`bg-gradient-to-r ${activeStepData.color} p-6 text-white relative transition-all duration-300`}>
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                {activeStepData.badge}
              </span>
              <span className="text-xs text-white/80 font-mono font-bold">
                گام {currentStep + 1} از {steps.length}
              </span>
            </div>

            <button
              onClick={handleCloseModal}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="بستن راهنما"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start gap-3.5 mt-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shrink-0">
              <StepIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white leading-snug">
                {activeStepData.title}
              </h2>
              <p className="text-xs md:text-sm text-white/90 mt-1 font-medium">
                {activeStepData.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50 dark:bg-slate-950/40">
          
          {/* Main Description */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs space-y-2">
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {activeStepData.description}
            </p>
          </div>

          {/* Key Bullet Points */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>قابلیت‌ها و امکانات کلیدی این بخش:</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
              {activeStepData.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tip Box */}
          <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-0.5">راهنمای سریع:</strong>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">{activeStepData.tips}</p>
            </div>
          </div>

        </div>

        {/* Progress Bar & Dots Indicator */}
        <div className="px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentStep 
                    ? 'w-8 bg-blue-600 dark:bg-blue-500' 
                    : idx < currentStep 
                    ? 'w-2.5 bg-blue-300 dark:bg-blue-800' 
                    : 'w-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
                title={step.title}
              />
            ))}
          </div>

          {activeStepData.tabId && (
            <button
              onClick={() => handleNavigateToSection(activeStepData.tabId)}
              className="hidden sm:flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-bold bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900/80 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 transition shrink-0 cursor-pointer"
            >
              <span>مشاهده و رفتن به این بخش</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Don't Show Again Checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="accent-blue-600 rounded w-4 h-4 cursor-pointer"
            />
            <span>دیگر این راهنما در شروع نشان داده نشود</span>
          </label>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center justify-center gap-1 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>گام قبلی</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <span>گام بعدی</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCloseModal}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>متوجه شدم / شروع کار با نیازکاو</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
