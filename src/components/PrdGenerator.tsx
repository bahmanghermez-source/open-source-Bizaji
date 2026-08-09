import React, { useState } from 'react';
import { Project, Requirement, Stakeholder, InterviewSession, RegulationItem } from '../types';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Download, 
  FileCheck2, 
  Loader2, 
  Building, 
  Calendar,
  Users
} from 'lucide-react';

interface PrdGeneratorProps {
  project: Project;
  requirements: Requirement[];
  stakeholders: Stakeholder[];
  interviews: InterviewSession[];
  regulations: RegulationItem[];
}

export const PrdGenerator: React.FC<PrdGeneratorProps> = ({
  project,
  requirements,
  stakeholders,
  interviews,
  regulations
}) => {
  const [docType, setDocType] = useState<'PRD' | 'BRD' | 'USER_STORIES'>('PRD');
  const [includeStakeholders, setIncludeStakeholders] = useState(true);
  const [includeFunctional, setIncludeFunctional] = useState(true);
  const [includeNonFunctional, setIncludeNonFunctional] = useState(true);
  const [includeRegulations, setIncludeRegulations] = useState(true);

  // AI Executive Draft
  const [aiDraftSection, setAiDraftSection] = useState<string>('');
  const [isDraftingAi, setIsDraftingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDraftWithAi = async () => {
    setIsDraftingAi(true);
    try {
      const res = await fetch('/api/ai/draft-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          requirements,
          stakeholders
        })
      });

      const data = await res.json();
      if (data.success && data.draftText) {
        setAiDraftSection(data.draftText);
      }
    } catch (err) {
      console.error('Error drafting PRD with AI:', err);
    } finally {
      setIsDraftingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const element = document.getElementById('prd-printable-document');
    if (element) {
      navigator.clipboard.writeText(element.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const functionalReqs = requirements.filter(r => r.type === 'Functional');
  const nonFunctionalReqs = requirements.filter(r => r.type === 'NonFunctional');

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner & Control Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">تولیدگر خودکار مستندات نیازمندی‌ها (PRD / BRD)</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            خروجی‌گیری استاندارد با فرمت بومیسازی شده جهت ارائه به تیم توسعه، پیمانکاران و مدیران ارشد
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDraftWithAi}
            disabled={isDraftingAi}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            {isDraftingAi ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>در حال تدوین خلاصه اجرایی با AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>تدوین خودکار مقدمه با AI</span>
              </>
            )}
          </button>

          {/* Dedicated Save as PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 transition cursor-pointer"
            title="خروجی گرفتن و ذخیره سند با فرمت PDF استاندارد A4"
          >
            <Download className="w-4 h-4 text-white" />
            <span>ذخیره به عنوان PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer"
            title="ارسال مستقیم به پرینتر"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>چاپ مستقیم</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{copied ? 'کپی شد!' : 'کپی متن'}</span>
          </button>
        </div>
      </div>

      {/* Helper Banner for PDF Saving */}
      <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
        <Download className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>راهنمای خروجی PDF:</strong> هنگام کلیک بر روی دکمه <strong className="text-emerald-700 dark:text-emerald-400 font-bold">«ذخیره به عنوان PDF»</strong>، در پنجره باز شده چاپ مرورگر، گزینه مقصد (Destination) را روی حالت <span className="underline font-bold">Save as PDF</span> قرار دهید تا فایل سند استاندارد A4 دانلود شود.
        </p>
      </div>

      {/* Options Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          
          <div className="flex items-center gap-2">
            <span>نوع سند:</span>
            <button
              onClick={() => setDocType('PRD')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${docType === 'PRD' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              PRD (سند نیازمندی محصول)
            </button>
            <button
              onClick={() => setDocType('BRD')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${docType === 'BRD' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              BRD (سند نیازمندی کسب‌وکار)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeStakeholders}
                onChange={(e) => setIncludeStakeholders(e.target.checked)}
                className="accent-blue-600 rounded cursor-pointer"
              />
              <span>بخش ذینفعان</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeFunctional}
                onChange={(e) => setIncludeFunctional(e.target.checked)}
                className="accent-blue-600 rounded cursor-pointer"
              />
              <span>نیازمندی‌های کارکردی</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNonFunctional}
                onChange={(e) => setIncludeNonFunctional(e.target.checked)}
                className="accent-blue-600 rounded cursor-pointer"
              />
              <span>نیازمندی‌های غیرکارکردی</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeRegulations}
                onChange={(e) => setIncludeRegulations(e.target.checked)}
                className="accent-blue-600 rounded cursor-pointer"
              />
              <span>الزامات قانونی ایران</span>
            </label>
          </div>

        </div>
      </div>

      {/* The Printable Live Document Sheet */}
      <div
        id="prd-printable-document"
        className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm text-slate-800 font-sans space-y-8 leading-relaxed max-w-4xl mx-auto border-t-8 border-t-blue-600"
      >
        
        {/* Document Title Header */}
        <div className="border-b-2 border-slate-100 pb-6 space-y-3 text-center md:text-right">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
            <span>سامانه نیازکاو (NiazKav) - سند رسمی پروژه</span>
            <span>تاریخ صدور: شنبه ۱۸ مرداد ۱۴۰۵</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight pt-2">
            {docType === 'PRD' ? 'سند نیازمندی‌های محصول (Product Requirements Document - PRD)' : 'سند نیازمندی‌های کسب‌وکار (BRD)'}
          </h1>
          
          <h2 className="text-lg font-bold text-blue-600">
            {project.name} ({project.code})
          </h2>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 pt-2">
            <span>سازمان / کارفرما: <strong>{project.client}</strong></span>
            <span>|</span>
            <span>تدوین‌کننده: <strong>{project.author}</strong></span>
            <span>|</span>
            <span>بازه‌زمانی تحویل: <strong>{project.startDateJalali} الی {project.targetCompletionJalali}</strong></span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-blue-900 border-r-4 border-blue-600 pr-3">
            ۱. خلاصه اجرایی و چشم‌انداز پروژه (Executive Summary)
          </h3>
          
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            {project.description}
          </p>

          {aiDraftSection && (
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl text-xs text-slate-800 space-y-2 mt-3 leading-relaxed">
              <span className="text-[10px] font-bold text-blue-700 block">تدوین هوشمند خلاصه اجرایی (Gemini AI):</span>
              <p className="whitespace-pre-line">{aiDraftSection}</p>
            </div>
          )}
        </div>

        {/* Section 2: Stakeholders Matrix */}
        {includeStakeholders && (
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-blue-900 border-r-4 border-blue-600 pr-3">
              ۲. فهرست ذینفعان کلیدی و نقش‌های سازمانی
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-bold">
                    <th className="border border-slate-200 p-2.5">نام و نام خانوادگی</th>
                    <th className="border border-slate-200 p-2.5">سمت سازمانی</th>
                    <th className="border border-slate-200 p-2.5">بخش</th>
                    <th className="border border-slate-200 p-2.5">قدرت / منافع</th>
                  </tr>
                </thead>
                <tbody>
                  {stakeholders.map((s) => (
                    <tr key={s.id} className="border border-slate-200">
                      <td className="border border-slate-200 p-2.5 font-bold text-slate-900">{s.name}</td>
                      <td className="border border-slate-200 p-2.5 text-slate-700">{s.role}</td>
                      <td className="border border-slate-200 p-2.5 text-slate-600">{s.department}</td>
                      <td className="border border-slate-200 p-2.5 text-blue-700 font-mono">P:{s.power} / I:{s.interest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Functional Requirements */}
        {includeFunctional && (
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-blue-900 border-r-4 border-blue-600 pr-3">
              ۳. نیازمندی‌های کارکردی (Functional Requirements)
            </h3>

            <div className="space-y-3">
              {functionalReqs.map((req) => (
                <div key={req.id} className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{req.id}: {req.title}</span>
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded text-[10px]">
                      {req.priority}
                    </span>
                  </div>
                  <p className="text-slate-700">{req.description}</p>
                  
                  {req.acceptanceCriteria && req.acceptanceCriteria.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                      <strong className="text-slate-800">معیارهای پذیرش:</strong>
                      <ul className="list-disc list-inside space-y-0.5 mt-1 text-slate-700">
                        {req.acceptanceCriteria.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Non-Functional Requirements */}
        {includeNonFunctional && (
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-blue-900 border-r-4 border-blue-600 pr-3">
              ۴. نیازمندی‌های غیرکارکردی، کیفیت و کارایی (Non-Functional Requirements)
            </h3>

            <div className="space-y-3">
              {nonFunctionalReqs.map((req) => (
                <div key={req.id} className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{req.id}: {req.title}</span>
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded text-[10px]">
                      {req.priority}
                    </span>
                  </div>
                  <p className="text-slate-700">{req.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Iranian Regulations */}
        {includeRegulations && (
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-blue-900 border-r-4 border-blue-600 pr-3">
              ۵. الزامات قانونی، بومیسازی و قوانین رگولاتوری ایران
            </h3>

            <div className="space-y-2 text-xs text-slate-700">
              {regulations.map((reg) => (
                <div key={reg.id} className="bg-slate-50/60 border border-slate-200 rounded-xl p-3 space-y-1">
                  <span className="font-bold text-blue-700">{reg.title} ({reg.referenceCode}):</span>
                  <p className="text-slate-600 text-[11px]">{reg.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Footer Signature Sheet */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-center text-slate-500">
          <div>
            <p className="font-bold text-slate-800 mb-8">تأییدکننده تحلیل نیازمندی‌ها (تحلیلگر ارشد):</p>
            <p className="text-slate-600">{project.author}</p>
          </div>
          <div>
            <p className="font-bold text-slate-800 mb-8">تأییدکننده کارفرما / مدیر ارشد محصول:</p>
            <p className="text-slate-600">{stakeholders[0]?.name || 'دکتر کامران رضایی'}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
