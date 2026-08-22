import React, { useState, useMemo } from 'react';
import { QuestionTemplate, Stakeholder, InterviewSession, Requirement } from '../types';
import { 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  Loader2, 
  Play, 
  CheckCircle2, 
  Search, 
  Copy, 
  Check, 
  PlusCircle, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  Layers,
  FileText
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
  const [selectedRole, setSelectedRole] = useState<string>('همه نقش‌ها');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه دسته‌ها');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [industryContext, setIndustryContext] = useState<string>('سامانه مودیان و اتوماسیون مالی');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // AI Question Generator state
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<any[]>([]);

  // Active Interview Session State
  const [activeStakeholderId, setActiveStakeholderId] = useState<string>(stakeholders[0]?.id || '');
  const [interviewTranscript, setInterviewTranscript] = useState<string>('');
  const [isExtractingRequirements, setIsExtractingRequirements] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<any[] | null>(null);
  
  // Copy Feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const rolesList = [
    'همه نقش‌ها',
    'مدیر مالی / مالیاتی',
    'مدیر فناوری اطلاعات (IT)',
    'مدیر محصول / کسب‌وکار',
    'مدیر حقوقی و رگولاتوری',
    'مدیر فروش و خدمات مشتریان',
    'مدیر زنجیره تامین و انبار',
    'مدیر منابع انسانی (HR)',
    'مدیر کیفیت و مدیریت ریسک (QA/Risk)',
    'مدیر خدمات پس از فروش و پشتیبانی'
  ];

  // Dynamically compute available categories based on current role
  const availableCategories = useMemo(() => {
    const categories = questionTemplates
      .filter(q => selectedRole === 'همه نقش‌ها' || q.targetRole === selectedRole)
      .map(q => q.category);
    return ['همه دسته‌ها', ...Array.from(new Set(categories))];
  }, [questionTemplates, selectedRole]);

  // Filter templates based on Role, Category, and Search Term
  const filteredTemplates = useMemo(() => {
    return questionTemplates.filter(q => {
      const matchesRole = selectedRole === 'همه نقش‌ها' || q.targetRole === selectedRole;
      const matchesCategory = selectedCategory === 'همه دسته‌ها' || q.category === selectedCategory;
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = !searchLower || 
        q.questionText.toLowerCase().includes(searchLower) ||
        q.category.toLowerCase().includes(searchLower) ||
        q.contextHint.toLowerCase().includes(searchLower) ||
        q.targetRole.toLowerCase().includes(searchLower) ||
        (q.culturalNote && q.culturalNote.toLowerCase().includes(searchLower));
      return matchesRole && matchesCategory && matchesSearch;
    });
  }, [questionTemplates, selectedRole, selectedCategory, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage) || 1;
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, currentPage]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setSelectedCategory('همه دسته‌ها');
    setCurrentPage(1);
    setCustomRole('');
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAppendQuestionToTranscript = (questionText: string) => {
    setInterviewTranscript(prev => {
      if (!prev.trim()) {
        return `سوال: ${questionText}\nپاسخ: `;
      }
      return `${prev}\n\nسوال: ${questionText}\nپاسخ: `;
    });
  };

  // Request AI suggested questions from server
  const handleGenerateAiQuestions = async () => {
    const roleToUse = customRole || (selectedRole === 'همه نقش‌ها' ? 'مدیر مالی / مالیاتی' : selectedRole);
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

    const formattedReqs: Requirement[] = extractedPreview.map((item) => ({
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

    // Record interview session
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

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              مصاحبه‌گر هوشمند و بانک ۲۰۰ سوال تخصصی مصاحبه تحلیلگران کسب‌وکار
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مجموعه ۲۰۰ سوال کاربردی و بومی‌سازی‌شده برگرفته از مصاحبه‌های واقعی صنایع مختلف در ایران همراه با استخراج خودکار نیازمندی‌ها
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>۲۰۰ سوال ثبت‌شده در ۹ حوزه تخصصی</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: 200 Real-World Question Templates Library */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>کتابخانه کامل ۲۰۰ سوال تخصصی مصاحبه</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                یافته‌ها: {filteredTemplates.length} مورد
              </span>
            </div>

            {/* Role Selectors */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                فیلتر بر اساس نقش سازمانی ذینفع:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pl-1">
                {rolesList.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedRole === r
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجو در متن سوال، نکات بومی یا دسته‌بندی..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI Custom Generator Panel */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 rounded-xl p-3.5 border border-blue-200 dark:border-blue-900 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    تولید سوالات افزوده اختصاصی با Gemini AI
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="تایپ نقش خاص یا عنوان موضوع..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
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
                      <span>تولید سوالات اختصاصی</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Render AI generated questions if any */}
            {aiGeneratedQuestions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>سوالات تولید شده توسط هوش مصنوعی:</span>
                </p>
                {aiGeneratedQuestions.map((aiQ, idx) => (
                  <div key={idx} className="bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 space-y-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{aiQ.questionText}</p>
                    {aiQ.contextHint && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                        💡 <strong>راهنما:</strong> {aiQ.contextHint}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleAppendQuestionToTranscript(aiQ.questionText)}
                        className="flex items-center gap-1 text-[11px] bg-blue-600 text-white font-bold px-2.5 py-1 rounded-lg hover:bg-blue-700 transition"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>افزودن به یادداشت مصاحبه</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Templates List with Pagination */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>فهرست سوالات پیشنهادی ({filteredTemplates.length} مورد):</span>
                {totalPages > 1 && (
                  <span className="text-[11px] text-slate-500 font-normal">
                    صفحه {currentPage} از {totalPages}
                  </span>
                )}
              </div>
              
              {paginatedTemplates.length === 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center space-y-2">
                  <Search className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    هیچ سوالی متناسب با فیلترها و عبارت جستجوی عبارت «{searchTerm}» پیدا نشد.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedRole('همه نقش‌ها');
                      setSelectedCategory('همه دسته‌ها');
                    }}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    پاکسازی همه فیلترها
                  </button>
                </div>
              )}

              {paginatedTemplates.map((qt) => (
                <div 
                  key={qt.id} 
                  className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 space-y-2.5 transition hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                        {qt.category}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium px-2 py-0.5 rounded-md">
                        {qt.targetRole}
                      </span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px]">{qt.id}</span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                    {qt.questionText}
                  </p>
                  
                  {qt.contextHint && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
                      💡 <strong className="text-slate-800 dark:text-slate-200">راهنمای تحلیلگر:</strong> {qt.contextHint}
                    </p>
                  )}

                  {qt.culturalNote && (
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-900 leading-relaxed">
                      🇮🇷 <strong className="text-amber-900 dark:text-amber-200">نکته بومی/سازمانی:</strong> {qt.culturalNote}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => handleCopyQuestion(qt.id, qt.questionText)}
                      className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="کپی متن سوال"
                    >
                      {copiedId === qt.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>کپی سوال</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleAppendQuestionToTranscript(qt.questionText)}
                      className="flex items-center gap-1 text-[11px] bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-bold px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 transition"
                      title="درج مستقیم در کادر یادداشت‌های جلسه"
                    >
                      <PlusCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>افزودن به کادر مصاحبه</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Page Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:text-blue-600 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>صفحه قبلی</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show first, last, and pages around current
                      if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        Math.abs(pageNum - currentPage) <= 1
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        (pageNum === 2 && currentPage > 3) ||
                        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return <span key={pageNum} className="text-slate-400 text-xs px-1">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:text-blue-600 transition"
                  >
                    <span>صفحه بعدی</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Right Column: Live Interview Note Pad & AI Auto Requirements Extractor */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>محیط ضبط مصاحبه و استخراج هوشمند نیازمندی‌ها</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  طرف مصاحبه (ذینفع):
                </label>
                <select
                  value={activeStakeholderId}
                  onChange={(e) => setActiveStakeholderId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
                >
                  {stakeholders.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.role} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    یادداشت‌ها و متن صحبت‌های ذینفع در جلسه:
                  </label>
                  {interviewTranscript && (
                    <button
                      onClick={() => setInterviewTranscript('')}
                      className="text-[11px] text-rose-600 hover:underline font-semibold"
                    >
                      پاکسازی کادر
                    </button>
                  )}
                </div>
                <textarea
                  rows={9}
                  placeholder="متن گفتگوها، دغدغه‌ها یا توضیحات فرآیندی مطرح‌شده توسط ذینفع را اینجا تایپ یا پیست کنید... (می‌توانید با دکمه «افزودن به کادر مصاحبه» سوالات بالا را مستقیماً وارد کنید)"
                  value={interviewTranscript}
                  onChange={(e) => setInterviewTranscript(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <button
                onClick={handleExtractRequirements}
                disabled={isExtractingRequirements || !interviewTranscript.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition"
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
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-3 mt-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>نیازمندی‌های استخراج‌شده ({extractedPreview.length} مورد):</span>
                  </span>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pl-1">
                  {extractedPreview.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs space-y-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-100">{item.title}</span>
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className={`px-2 py-0.5 rounded font-bold ${item.type === 'NonFunctional' ? 'bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' : 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'}`}>
                            {item.type === 'NonFunctional' ? 'غیرکارکردی' : 'کارکردی'}
                          </span>
                          <span className="bg-rose-50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded font-bold">
                            {item.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setExtractedPreview(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              تاریخچه جلسات مصاحبه ثبت‌شده
            </h3>

            <div className="space-y-3">
              {interviews.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                  هنوز جلسه مصاحبه‌ای ثبت نشده است.
                </p>
              )}

              {interviews.map((session) => (
                <div key={session.id} className="bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{session.title}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{session.dateJalali}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    طرف مصاحبه: <strong className="text-slate-800 dark:text-slate-200">{session.stakeholderName}</strong>
                  </p>
                  
                  {session.keyTakeaways && session.keyTakeaways.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">نیازمندی‌های کلیدی حاصل:</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 mt-0.5">
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
