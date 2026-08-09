import React, { useState } from 'react';
import { Requirement, Priority, RequirementType, RequirementStatus, DomainCategory, Stakeholder } from '../types';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Sparkles, 
  FileText, 
  History, 
  Tag, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Loader2,
  Share2,
  Copy,
  ChevronLeft
} from 'lucide-react';

interface RequirementsRegistryProps {
  requirements: Requirement[];
  stakeholders: Stakeholder[];
  onAddRequirement: (req: Requirement) => void;
  onUpdateRequirement: (req: Requirement) => void;
  onDeleteRequirement: (id: string) => void;
}

export const RequirementsRegistry: React.FC<RequirementsRegistryProps> = ({
  requirements,
  stakeholders,
  onAddRequirement,
  onUpdateRequirement,
  onDeleteRequirement
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  // Modal / Drawer state
  const [showModal, setShowModal] = useState(false);
  const [editingReq, setEditingReq] = useState<Requirement | null>(null);
  const [viewingReq, setViewingReq] = useState<Requirement | null>(null);

  // AI Generators State
  const [generatedUserStory, setGeneratedUserStory] = useState<any | null>(null);
  const [isGeneratingUserStory, setIsGeneratingUserStory] = useState(false);
  const [impactAnalysisText, setImpactAnalysisText] = useState<string>('');
  const [isAnalyzingImpact, setIsAnalyzingImpact] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RequirementType>('Functional');
  const [priority, setPriority] = useState<Priority>('Must');
  const [status, setStatus] = useState<RequirementStatus>('Approved');
  const [domain, setDomain] = useState<DomainCategory>('Financial');
  const [stakeholderId, setStakeholderId] = useState('');
  const [rationale, setRationale] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string>('');
  const [tags, setTags] = useState('');

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || req.type === selectedType;
    const matchesPriority = selectedPriority === 'ALL' || req.priority === selectedPriority;
    const matchesDomain = selectedDomain === 'ALL' || req.domain === selectedDomain;

    return matchesSearch && matchesType && matchesPriority && matchesDomain;
  });

  const openNewModal = () => {
    setEditingReq(null);
    setTitle('');
    setDescription('');
    setType('Functional');
    setPriority('Must');
    setStatus('Approved');
    setDomain('Financial');
    setStakeholderId(stakeholders[0]?.id || '');
    setRationale('');
    setAcceptanceCriteria('');
    setTags('');
    setShowModal(true);
  };

  const openEditModal = (req: Requirement) => {
    setEditingReq(req);
    setTitle(req.title);
    setDescription(req.description);
    setType(req.type);
    setPriority(req.priority);
    setStatus(req.status);
    setDomain(req.domain);
    setStakeholderId(req.stakeholderId || '');
    setRationale(req.rationale || '');
    setAcceptanceCriteria(req.acceptanceCriteria.join('\n'));
    setTags(req.tags.join(', '));
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const stk = stakeholders.find(s => s.id === stakeholderId);
    const criteriaArr = acceptanceCriteria.split('\n').filter(c => c.trim().length > 0);
    const tagsArr = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const nowJalali = '۱۴۰۵/۰۵/۱۸';

    if (editingReq) {
      const updatedHistory = [
        ...editingReq.versionHistory,
        {
          version: `1.${editingReq.versionHistory.length}`,
          updatedAt: nowJalali,
          author: 'تحلیلگر ارشد',
          changeDescription: 'به‌روزرسانی جزئیات نیازمندی'
        }
      ];

      onUpdateRequirement({
        ...editingReq,
        title,
        description,
        type,
        priority,
        status,
        domain,
        stakeholderId: stk?.id,
        stakeholderName: stk?.name,
        rationale,
        acceptanceCriteria: criteriaArr,
        tags: tagsArr,
        versionHistory: updatedHistory,
        updatedAt: nowJalali
      });
    } else {
      const newId = `${type === 'NonFunctional' ? 'NFR' : 'FR'}-${Math.floor(10 + Math.random() * 90)}`;
      onAddRequirement({
        id: newId,
        title,
        description,
        type,
        priority,
        status,
        domain,
        stakeholderId: stk?.id,
        stakeholderName: stk?.name,
        rationale,
        acceptanceCriteria: criteriaArr,
        tags: tagsArr,
        versionHistory: [
          { version: '1.0', updatedAt: nowJalali, author: 'تحلیلگر ارشد', changeDescription: 'نسخه اولیه' }
        ],
        createdAt: nowJalali,
        updatedAt: nowJalali
      });
    }

    setShowModal(false);
  };

  // Generate User Story with AI
  const handleGenerateUserStory = async (req: Requirement) => {
    setIsGeneratingUserStory(true);
    setGeneratedUserStory(null);

    try {
      const res = await fetch('/api/ai/generate-user-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: req.title,
          description: req.description,
          rationale: req.rationale
        })
      });

      const data = await res.json();
      if (data.success && data.userStory) {
        setGeneratedUserStory(data.userStory);
      }
    } catch (err) {
      console.error('Error generating user story:', err);
    } finally {
      setIsGeneratingUserStory(false);
    }
  };

  // Analyze Impact with AI
  const handleAnalyzeImpact = async (req: Requirement) => {
    setIsAnalyzingImpact(true);
    setImpactAnalysisText('');

    try {
      const res = await fetch('/api/ai/analyze-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirementTitle: req.title,
          changeDescription: 'درخواست تغییر در منطق پردازش یا الزامات قانونی مرتبط با این نیازمندی',
          existingRequirementsCount: requirements.length
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setImpactAnalysisText(data.analysis);
      }
    } catch (err) {
      console.error('Error analyzing impact:', err);
    } finally {
      setIsAnalyzingImpact(false);
    }
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'Must':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Must Have (حیاتی)</span>;
      case 'Should':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Should Have (ضروری)</span>;
      case 'Could':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Could Have (ترجیحی)</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Won't Have (خارج از محدوده)</span>;
    }
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">مدیریت نیازمندی‌ها (MoSCoW & Registry)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            پایگاه جامع نیازمندی‌های کارکردی و غیرکارکردی، اولویت‌بندی، ردیابی نسخه و تولید داستان کاربر با AI
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-200 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>نیازمندی جدید</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="جستجو در عنوان، کد یا شرح..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            >
              <option value="ALL">همه انواع (کارکردی / غیرکارکردی)</option>
              <option value="Functional">نیازمندی کارکردی (Functional)</option>
              <option value="NonFunctional">نیازمندی غیرکارکردی (Non-Functional)</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            >
              <option value="ALL">همه اولویت‌ها (MoSCoW)</option>
              <option value="Must">Must Have (حیاتی)</option>
              <option value="Should">Should Have (ضروری)</option>
              <option value="Could">Could Have (ترجیحی)</option>
              <option value="Wont">Won't Have (خارج از محدوده)</option>
            </select>
          </div>

          {/* Domain Filter */}
          <div>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            >
              <option value="ALL">همه حوزه‌ها</option>
              <option value="Financial">مالی و حسابداری</option>
              <option value="Regulatory">رگولاتوری و سامانه مودیان</option>
              <option value="Security">امنیت و کاشف</option>
              <option value="UX">تجربه کاربر و سرعت</option>
              <option value="Integration">یکپارچه‌سازی و API</option>
              <option value="Workflow">فرآیند و BPMS</option>
            </select>
          </div>

        </div>
      </div>

      {/* Requirements List Cards */}
      <div className="space-y-3">
        {filteredRequirements.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2 shadow-sm">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">نیازمندی با مشخصات فیلترشده یافت نشد.</p>
            <p className="text-xs text-slate-500">می‌توانید فیلترها را پاک کرده یا نیازمندی جدیدی ایجاد کنید.</p>
          </div>
        ) : (
          filteredRequirements.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm transition space-y-3 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    req.type === 'NonFunctional' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {req.id}
                  </span>
                  <h3 className="font-extrabold text-sm md:text-base text-slate-900 group-hover:text-blue-600 transition">
                    {req.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {getPriorityBadge(req.priority)}
                  <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-bold px-2 py-0.5 rounded-md">
                    {req.domain}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {req.description}
              </p>

              {/* Rationale & Stakeholder */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-slate-800">علت و ضرورت (Rationale):</strong> {req.rationale}
                </div>
                {req.stakeholderName && (
                  <div className="text-blue-600 font-semibold">
                    ذینفع اصلی: {req.stakeholderName}
                  </div>
                )}
              </div>

              {/* Acceptance Criteria */}
              {req.acceptanceCriteria && req.acceptanceCriteria.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-800">معیارهای پذیرش (Acceptance Criteria):</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {req.acceptanceCriteria.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <History className="w-3.5 h-3.5 text-blue-600" />
                  <span>آخرین ویرایش: {req.updatedAt} (نسخه v1.{req.versionHistory.length - 1})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setViewingReq(req);
                      handleGenerateUserStory(req);
                    }}
                    className="flex items-center gap-1 text-blue-700 hover:text-blue-800 font-bold px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-200 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>تولید داستان کاربر (User Story)</span>
                  </button>

                  <button
                    onClick={() => openEditModal(req)}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition"
                    title="ویرایش"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteRequirement(req.id)}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Requirement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-right max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span>{editingReq ? `ویرایش نیازمندی ${editingReq.id}` : 'تعریف نیازمندی جدید'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">ثبت ساختاریافته نیازمندی همراه با معیارهای پذیرش و اولویت MoSCoW.</p>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">عنوان نیازمندی *</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: امضای دیجیتال فاکتور و تولید کد ۲۲ رقمی مالیاتی"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">شرح کامل نیازمندی</label>
                <textarea
                  rows={3}
                  required
                  placeholder="توضیحات دقیق عملیاتی یا فنی..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نوع نیازمندی</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as RequirementType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    <option value="Functional">کارکردی (Functional)</option>
                    <option value="NonFunctional">غیرکارکردی (Non-Functional)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">اولویت (MoSCoW)</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    <option value="Must">Must Have (حیاتی)</option>
                    <option value="Should">Should Have (ضروری)</option>
                    <option value="Could">Could Have (ترجیحی)</option>
                    <option value="Wont">Won't Have (خارج از محدوده)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">حوزه تخصصی</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as DomainCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    <option value="Financial">مالی و حسابداری</option>
                    <option value="Regulatory">رگولاتوری و سامانه مودیان</option>
                    <option value="Security">امنیت و کاشف</option>
                    <option value="UX">تجربه کاربر و سرعت</option>
                    <option value="Integration">یکپارچه‌سازی و API</option>
                    <option value="Workflow">فرآیند و BPMS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ذینفع اصلی درخواست‌کننده</label>
                  <select
                    value={stakeholderId}
                    onChange={(e) => setStakeholderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    {stakeholders.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ضرورت و علت (Rationale)</label>
                  <input
                    type="text"
                    placeholder="مثلاً: الزام ماده ۲۲ قانون مالیات بر ارزش افزوده"
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">معیارهای پذیرش (در هر خط یک مورد)</label>
                <textarea
                  rows={3}
                  placeholder="تولید کد ۲۲ کاراکتری متناظر با الگوریتم سازمان&#10;پشتیبانی از الگوریتم RSA ۲-کیلو بایت"
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">برچسب‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  placeholder="سامانه مودیان, امضای دیجیتال, کاشف"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition"
                >
                  ذخیره نیازمندی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI User Story & Impact Modal */}
      {viewingReq && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-right max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>داستان کاربر (User Story) و تحلیل اثرات - {viewingReq.id}</span>
              </h3>
              <button
                onClick={() => setViewingReq(null)}
                className="text-slate-400 hover:text-slate-800 text-xs"
              >
                بستن
              </button>
            </div>

            {/* Generated User Story */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-800">داستان کاربر استاندارد (به زبان فارسی):</p>

              {isGeneratingUserStory ? (
                <div className="flex items-center justify-center p-6 text-xs text-blue-600 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>در حال تولید داستان کاربر و سناریوی Gherkin با AI...</span>
                </div>
              ) : generatedUserStory ? (
                <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 space-y-3 text-xs leading-relaxed">
                  <p className="font-bold text-blue-900 bg-blue-100/60 p-2.5 rounded-lg border border-blue-200">
                    {generatedUserStory.fullText}
                  </p>

                  <div className="space-y-1 text-slate-700">
                    <p>🎭 <strong>نقش (Role):</strong> {generatedUserStory.role}</p>
                    <p>⚡ <strong>عمل (Action):</strong> {generatedUserStory.action}</p>
                    <p>🎯 <strong>هدف (Benefit):</strong> {generatedUserStory.benefit}</p>
                  </div>

                  {generatedUserStory.acceptanceCriteria && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="font-bold text-slate-800 mb-1">سناریوهای پذیرش (Gherkin):</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        {generatedUserStory.acceptanceCriteria.map((ac: string, idx: number) => (
                          <li key={idx}>{ac}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Impact Analysis Trigger */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <button
                onClick={() => handleAnalyzeImpact(viewingReq)}
                disabled={isAnalyzingImpact}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl border border-slate-200 transition"
              >
                {isAnalyzingImpact ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال ارزیابی قوانین مالیاتی و تکنولوژی...</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>تحلیل اثرات تغییر (Impact Analysis)</span>
                  </>
                )}
              </button>

              {impactAnalysisText && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 space-y-2 leading-relaxed">
                  <p className="font-bold text-amber-800">ارزیابی اثرات سیستم و رگولاتوری:</p>
                  <p className="whitespace-pre-line text-slate-800">{impactAnalysisText}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
