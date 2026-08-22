import React, { useState } from 'react';
import { Project } from '../types';
import { 
  Building2, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  BookOpen, 
  HelpCircle,
  FolderPlus,
  ShieldCheck,
  FileCode,
  Zap,
  Info
} from 'lucide-react';

interface NewProjectWizardProps {
  onProjectCreated: (project: Project, templateType: 'blank' | 'tax' | 'erp') => void;
  onCancel?: () => void;
  isFirstProject?: boolean;
}

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({
  onProjectCreated,
  onCancel,
  isFirstProject = false
}) => {
  const [step, setStep] = useState<number>(1);

  // Form Fields State
  const [name, setName] = useState('');
  const [code, setCode] = useState(`NZK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [client, setClient] = useState('');
  const [industry, setIndustry] = useState('فناوری اطلاعات و خدمات نرم‌افزاری');
  const [startDateJalali, setStartDateJalali] = useState('۱۴۰۵/۰۵/۰۱');
  const [targetCompletionJalali, setTargetCompletionJalali] = useState('۱۴۰۵/۱۰/۳۰');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('تحلیل‌گر ارشد کسب‌وکار');
  
  // Selected Regulations
  const [selectedRegulations, setSelectedRegulations] = useState<string[]>([
    'قانون سامانه مودیان و پایانه فروشگاهی'
  ]);

  // Selected Template
  const [templateType, setTemplateType] = useState<'blank' | 'tax' | 'erp'>('blank');

  const industriesList = [
    'فناوری اطلاعات و خدمات نرم‌افزاری',
    'مالی، حسابداری و امور مالیاتی',
    'بانکداری، فین‌تک و پرداخت',
    'خرده‌فروشی، بازرگانی و فروشگاه اینترنتی',
    'تولید، صنعتی و زنجیره تامین',
    'بهداشت، درمان و سلامت دیجیتال',
    'خدمات دولتی و عمومی',
    'سایر اصناف و مشاغل'
  ];

  const regulationsList = [
    { id: 'tax', name: 'قانون سامانه مودیان و پایانه‌های فروشگاهی (ماده ۲۲)', desc: 'ارسال فاکتور الکترونیکی، امضای دیجیتال CSR و استعلام کارپوشه' },
    { id: 'guild', name: 'قانون نظام صنفی و اتحادیه‌ها (ghanonsenfi.com)', desc: 'دستورالعمل‌های نرخ‌گذاری، صدور پروانه و الزامات اصناف' },
    { id: 'ecom', name: 'قوانین تجارت الکترونیکی و نماد اعتماد (اینماد)', desc: 'الزامات عودت کالا، حفاظت از داده‌های کاربران و درگاه پرداخت' },
    { id: 'kashef', name: 'الزامات امنیت اطلاعات شاپرک و کاشف', desc: 'رمزنگاری داده‌های حساس، احراز هویت دو عاملی و لاگ‌برداری' },
    { id: 'labor', name: 'قانون کار و تامین اجتماعی', desc: 'محاسبه سنوات، بیمه حقوق، مرخصی‌ها و فیش حقوقی' }
  ];

  const toggleRegulation = (regName: string) => {
    if (selectedRegulations.includes(regName)) {
      setSelectedRegulations(selectedRegulations.filter(r => r !== regName));
    } else {
      setSelectedRegulations([...selectedRegulations, regName]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `NZK-${Math.floor(100 + Math.random() * 900)}`,
      client: client.trim() || 'نامشخص',
      industry,
      startDateJalali,
      targetCompletionJalali,
      description: description.trim() || 'پروژه جدید تحلیل و استخراج نیازمندی‌های سیستم.',
      author: author.trim() || 'تحلیل‌گر ارشد'
    };

    onProjectCreated(newProject, templateType);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden text-right dir-rtl transition-colors duration-200">
      
      {/* Wizard Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/30 p-2.5 rounded-2xl border border-blue-400/30 backdrop-blur-md">
              <FolderPlus className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <span className="text-xs text-blue-300 font-bold bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
                راهنمای گام‌به‌گام
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                {isFirstProject ? 'تعریف نخستین پروژه تحلیل نیازمندی‌ها' : 'تعریف پروژه جدید'}
              </h2>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition"
            >
              انصراف
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          با تکمیل این مراحل، ساختار پایه پروژه، دامنه صنعت و استانداردهای بومی مورد نیاز خود را پیکربندی می‌کنید.
        </p>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/10">
          {[
            { num: 1, label: 'شناسنامه پروژه' },
            { num: 2, label: 'محدوده و اهداف' },
            { num: 3, label: 'الزامات قانونی' },
            { num: 4, label: 'انتخاب الگوی اولیه' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (step > s.num || (name.trim() && s.num <= step)) setStep(s.num);
              }}
              className={`flex flex-col items-center sm:items-start p-2 rounded-xl transition text-right ${
                step === s.num
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                  : step > s.num
                  ? 'bg-white/10 text-emerald-300 font-medium'
                  : 'bg-white/5 text-slate-400'
              }`}
            >
              <span className="text-[10px] font-mono opacity-80">گام ۰{s.num}</span>
              <span className="text-xs truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Content Body */}
      <form onSubmit={handleFinish} className="p-6 sm:p-8 space-y-6">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-4 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <strong className="text-blue-900 dark:text-blue-200 font-bold block">راهنمای تعیین نام و کد پروژه:</strong>
                <p>نام پروژه را شفاف و دقیق وارد کنید. کد پروژه یک شناسه یکتا برای ارجاع در اسناد رسمی PRD و جلسات استخراج است.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  نام کامل پروژه *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: سامانه مدیریت سفارشات و فاکتور فروشگاهی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  کد اختصاری پروژه
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: NZK-ERP-1405"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  نام کارفرما یا سازمان متقاضی
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: شرکت توسعه تجارت البرز"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  حوزه صنعت / رسته شغلی
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
                >
                  {industriesList.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  تحلیل‌گر مسئول / مدیر محصول
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: مهندس رضایی"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Scope & Timeline */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 p-4 rounded-2xl flex items-start gap-3">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <strong className="text-indigo-900 dark:text-indigo-200 font-bold block">محدوده پروژه و اهداف کلیدی:</strong>
                <p>توضیحی مختصر درباره اهداف اصلی، گلوگاه‌ها یا چالش‌های فعلی سیستم ارائه دهید تا در تحلیل هوشمند مصاحبه‌ها از آن استفاده شود.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  تاریخ شروع پروژه (شمسی)
                </label>
                <input
                  type="text"
                  value={startDateJalali}
                  onChange={(e) => setStartDateJalali(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  تاریخ تحویل فاز استخراج نیازمندی‌ها (شمسی)
                </label>
                <input
                  type="text"
                  value={targetCompletionJalali}
                  onChange={(e) => setTargetCompletionJalali(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  شرح اهداف، محدوده و مسئله اصلی
                </label>
                <textarea
                  rows={4}
                  placeholder="مثلاً: هدف این پروژه طراحی و استخراج کامل نیازمندی‌های سیستم اتوماسیون فروشگاهی، یکپارچه‌سازی با پایانه پرداخت و مطابقت کامل با قوانین صورتحساب الکترونیکی است..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Legal & Regulatory Context */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <strong className="text-amber-900 dark:text-amber-200 font-bold block">انطباق با قوانین بومی ایران:</strong>
                <p>قوانین و استانداردهای بومی مرتبط با این پروژه را تیک بزنید تا پایگاه دانش و چکاپ‌های حقوقی سیستم بر اساس آن تنظیم شود.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {regulationsList.map((reg) => {
                const isSelected = selectedRegulations.includes(reg.name);
                return (
                  <div
                    key={reg.id}
                    onClick={() => toggleRegulation(reg.name)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by div click
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="space-y-0.5 flex-1">
                      <span className="font-bold text-xs block">{reg.name}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{reg.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Initial Project Template Choice */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <strong className="text-emerald-900 dark:text-emerald-200 font-bold block">انتخاب ساختار اولیه پروژه:</strong>
                <p>می‌توانید پروژه را کاملاً خالی ایجاد کنید یا یک الگوی اولیه جهت شتاب‌دهی انتخاب نمایید.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Blank Option */}
              <div
                onClick={() => setTemplateType('blank')}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  templateType === 'blank'
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 ring-2 ring-blue-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {templateType === 'blank' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 absolute left-3 top-3" />
                )}
                <div className="space-y-2">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl w-fit">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    پروژه کاملاً خالی (توصیه شده)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    شروع یک پروژه تمیز از صفر بدون نیازمندی‌های نمونه پیش‌فرض. مناسب برای پروژه‌های واقعی.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/40 px-2.5 py-1 rounded-lg w-fit">
                  مخزن خالی (۰ نیازمندی)
                </span>
              </div>

              {/* Tax Template */}
              <div
                onClick={() => setTemplateType('tax')}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  templateType === 'tax'
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 ring-2 ring-blue-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {templateType === 'tax' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 absolute left-3 top-3" />
                )}
                <div className="space-y-2">
                  <div className="p-2.5 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-xl w-fit">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    الگوی نمونه سامانه مودیان
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    همراه با نمونه نیازمندی‌های پیش‌فرض قوانین مالیاتی، ماده ۲۲ و صورتحساب الکترونیکی جهت تست.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-900/40 px-2.5 py-1 rounded-lg w-fit">
                  نمونه مالیاتی آماده
                </span>
              </div>

              {/* ERP Template */}
              <div
                onClick={() => setTemplateType('erp')}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  templateType === 'erp'
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 ring-2 ring-blue-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {templateType === 'erp' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 absolute left-3 top-3" />
                )}
                <div className="space-y-2">
                  <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl w-fit">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    الگوی نمونه اتوماسیون و ERP
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    همراه با نمونه فرآیندهای انبارداری، سفارشات، ذینفعان اجرایی و دیاگرام‌های عمومی.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/40 px-2.5 py-1 rounded-lg w-fit">
                  نمونه ERP سازمانی
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>گام قبلی</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => {
                if (name.trim()) setStep(step + 1);
              }}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <span>گام بعدی</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-xs px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تایید و ایجاد پروژه</span>
            </button>
          )}
        </div>

      </form>

    </div>
  );
};
