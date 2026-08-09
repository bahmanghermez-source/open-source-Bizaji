import React, { useState } from 'react';
import { QuestionTemplate, Stakeholder, InterviewSession, Requirement } from '../types';
import { 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  Plus, 
  Play, 
  CheckCircle2, 
  FileText, 
  Send, 
  ArrowRight,
  BookOpen,
  Loader2,
  Clock,
  UserCheck
} from 'lucide-react';

interface InterviewAssistantProps {
  questionTemplates: QuestionTemplate[];
  stakeholders: Stakeholder[];
  interviews: InterviewSession[];
  onAddInterview: (session: InterviewSession) => void;
  onAddRequirements: (reqs: Requirement[]) => void;
}

export const InterviewAssistant: React.FC<InterviewAssistantProps> = ({
  questionTemplates,
  stakeholders,
  interviews,
  onAddInterview,
  onAddRequirements
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('مدیر مالی / مالیاتی');
  const [customRole, setCustomRole] = useState('');
  const [industryContext, setIndustryContext] = useState('سامانه مودیان و اتوماسیون مالی');
  
  // AI Question Generator state
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<any[]>([]);

  // Active Interview Session State
  const [activeStakeholderId, setActiveStakeholderId] = useState<string>(stakeholders[0]?.id || '');
  const [interviewTranscript, setInterviewTranscript] = useState<string>('');
  const [isExtractingRequirements, setIsExtractingRequirements] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<any[] | null>(null);

  const rolesList = [
    'مدیر مالی / مالیاتی',
    'مدیر فناوری اطلاعات (IT)',
    'مدیر محصول / کسب‌وکار',
    'مدیر حقوقی و رگولاتوری',
    'مدیر فروش و خدمات مشتریان',
    'کاربر نهایی / اپراتور سیستم'
  ];

  // Request AI suggested questions from server
  const handleGenerateAiQuestions = async () => {
    const roleToUse = customRole || selectedRole;
    setIsGeneratingQuestions(true);
    setAiGeneratedQuestions([]);

    try {
      const res = await fetch('/api/ai/suggest-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleToUse,
          industry: industryContext,
          context: 'مصاحبه کشف نیازمندی‌های سیستم و الزامات قانونی ایران'
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setAiGeneratedQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error generating questions:', err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Request AI to extract requirements from transcript
  const handleExtractRequirements = async () => {
    if (!interviewTranscript.trim()) return;

    const currentStk = stakeholders.find(s => s.id === activeStakeholderId);
    setIsExtractingRequirements(true);
    setExtractedPreview(null);

    try {
      const res = await fetch('/api/ai/extract-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: interviewTranscript,
          stakeholderName: currentStk ? currentStk.name : 'ذینفع'
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.requirements)) {
        setExtractedPreview(data.requirements);
      }
    } catch (err) {
      console.error('Error extracting requirements:', err);
    } finally {
      setIsExtractingRequirements(false);
    }
  };

  // Import previewed requirements into Project
  const handleConfirmImport = () => {
    if (!extractedPreview) return;

    const currentStk = stakeholders.find(s => s.id === activeStakeholderId);
    const nowJalali = '۱۴۰۵/۰۵/۱۸';

    const formattedReqs: Requirement[] = extractedPreview.map((item, idx) => ({
      id: `${item.type === 'NonFunctional' ? 'NFR' : 'FR'}-${Math.floor(100 + Math.random() * 900)}`,
      title: item.title,
      description: item.description,
      type: item.type === 'NonFunctional' ? 'NonFunctional' : 'Functional',
      priority: ['Must', 'Should', 'Could', 'Wont'].includes(item.priority) ? item.priority : 'Must',
      status: 'Approved',
      domain: item.domain || 'Financial',
      stakeholderId: currentStk?.id,
      stakeholderName: currentStk?.name,
      acceptanceCriteria: item.acceptanceCriteria || [],
      rationale: item.rationale || 'استخراج شده از متن مصاحبه به وسیله هوش مصنوعی',
      tags: item.tags || ['مصاحبه'],
      versionHistory: [
        { version: '1.0', updatedAt: nowJalali, author: 'استخراج هوشمند NiazKav', changeDescription: 'نسخه اولیه' }
      ],
      createdAt: nowJalali,
      updatedAt: nowJalali
    }));

    onAddRequirements(formattedReqs);

    // Also record interview session
    const newSession: InterviewSession = {
      id: `int-${Date.now()}`,
      title: `مصاحبه با ${currentStk?.name || 'ذینفع'} (${currentStk?.role || ''})`,
      stakeholderId: activeStakeholderId,
      stakeholderName: currentStk?.name || 'نامشخص',
      dateJalali: nowJalali,
      interviewer: 'تحلیلگر ارشد کسب‌وکار',
      status: 'Completed',
      keyTakeaways: formattedReqs.map(r => r.title),
      notes: [
        {
          id: `n-${Date.now()}`,
          speaker: currentStk?.name || 'ذینفع',
          timestamp: '۱۰:۰۰',
          text: interviewTranscript
        }
      ],
      transcript: interviewTranscript
    };

    onAddInterview(newSession);

    // Clear transcript & preview
    setInterviewTranscript('');
    setExtractedPreview(null);
  };

  const filteredTemplates = questionTemplates.filter(q => q.targetRole === selectedRole);

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">مصاحبه‌گر هوشمند و الگوهای پرسشگری بومی</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            راهنمای مصاحبه بر اساس فرهنگ سازمانی، کشف خودکار نیازمندی‌ها با AI و استخراج مستقیم در پروژه
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Iranian Role Question Templates & AI Prompt Assistant */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>کتابخانه الگوهای پرسشگری بومیسازی شده</span>
              </h3>
            </div>

            {/* Role Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">انتخاب نقش سازمانی ذینفع:</label>
              <div className="flex flex-wrap gap-1.5">
                {rolesList.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRole(r);
                      setCustomRole('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedRole === r && !customRole
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generator Panel for Role */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">تولید هوشمند سوالات مصاحبه (Gemini AI)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="یا تایپ نقش دلخواه..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  onClick={handleGenerateAiQuestions}
                  disabled={isGeneratingQuestions}
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition"
                >
                  {isGeneratingQuestions ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>در حال تحلیل...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تولید سوالات این نقش</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Predefined Templates List */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-800">سوالات استاندارد پیشنهادی:</p>
              
              {filteredTemplates.length === 0 && aiGeneratedQuestions.length === 0 && (
                <p className="text-xs text-slate-500 py-4 text-center">برای این نقش سوالی ثبت نشده است؛ روی دکمه "تولید سوالات این نقش" کلیک کنید.</p>
              )}

              {filteredTemplates.map((qt) => (
                <div key={qt.id} className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200">{qt.category}</span>
                    <span className="text-slate-400">الگوی استاندارد</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{qt.questionText}</p>
                  
                  {qt.contextHint && (
                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                      💡 <strong className="text-slate-800">راهنما:</strong> {qt.contextHint}
                    </p>
                  )}

                  {qt.culturalNote && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      🇮🇷 <strong className="text-amber-900">نکته بومی:</strong> {qt.culturalNote}
                    </p>
                  )}
                </div>
              ))}

              {/* Render AI generated questions */}
              {aiGeneratedQuestions.map((aiQ, idx) => (
                <div key={idx} className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>تولید شده توسط AI</span>
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{aiQ.questionText}</p>
                  {aiQ.contextHint && (
                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                      💡 <strong>راهنما:</strong> {aiQ.contextHint}
                    </p>
                  )}
                  {aiQ.culturalNote && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      🇮🇷 <strong>نکته سازمانی:</strong> {aiQ.culturalNote}
                    </p>
                  )}
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* Right Column: Live Interview Note Pad & AI Auto Requirements Extractor */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-600" />
                <span>محیط ضبط مصاحبه و استخراج هوشمند نیازمندی‌ها</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">طرف مصاحبه (ذینفع):</label>
                <select
                  value={activeStakeholderId}
                  onChange={(e) => setActiveStakeholderId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                >
                  {stakeholders.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.role} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">یادداشت‌ها و متن صحبت‌های ذینفع در جلسه:</label>
                <textarea
                  rows={8}
                  placeholder="متن گفتگوها، دغدغه‌ها یا توضیحات فرآیندی مطرح‌شده توسط ذینفع را اینجا تایپ یا پیست کنید..."
                  value={interviewTranscript}
                  onChange={(e) => setInterviewTranscript(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <button
                onClick={handleExtractRequirements}
                disabled={isExtractingRequirements || !interviewTranscript.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-200 transition"
              >
                {isExtractingRequirements ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال استخراج و شناسایی نیازمندی‌های کارکردی و غیرکارکردی...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>استخراج خودکار نیازمندی‌ها با هوش مصنوعی (Extract Requirements)</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview extracted requirements */}
            {extractedPreview && (
              <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 space-y-3 mt-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>نیازمندی‌های استخراج‌شده ({extractedPreview.length} مورد):</span>
                  </span>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pl-1">
                  {extractedPreview.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{item.title}</span>
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className={`px-2 py-0.5 rounded font-bold ${item.type === 'NonFunctional' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                            {item.type === 'NonFunctional' ? 'غیرکارکردی' : 'کارکردی'}
                          </span>
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold">
                            {item.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-[11px]">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setExtractedPreview(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>افزودن مستقیم به پروژه</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Historic Completed Interviews */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              تاریخچه جلسات مصاحبه ثبت‌شده
            </h3>

            <div className="space-y-3">
              {interviews.map((session) => (
                <div key={session.id} className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-800">{session.title}</h4>
                    <span className="text-[10px] text-slate-400">{session.dateJalali}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">طرف مصاحبه: <strong className="text-slate-800">{session.stakeholderName}</strong></p>
                  
                  {session.keyTakeaways && session.keyTakeaways.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-blue-600">نیازمندی‌های کلیدی حاصل:</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 mt-0.5">
                        {session.keyTakeaways.map((k, idx) => (
                          <li key={idx}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
