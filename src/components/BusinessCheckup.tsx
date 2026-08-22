import React, { useState, useMemo } from 'react';
import {
  StrategicCheckupData,
  CheckupInitialProblem,
  CheckupDesiredStateItem,
  CheckupFunnelStage,
  CheckupEconomicMetric,
  CheckupRootCauseChain,
  CheckupHealthScoreItem,
  CheckupHeatmapArea,
  CheckupPrioritizedIssue,
  CheckupHypothesis,
  StrategicDecisionPath
} from '../types';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Edit3,
  FileSpreadsheet,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  Maximize2,
  PieChart,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Zap
} from 'lucide-react';

interface BusinessCheckupProps {
  checkupData: StrategicCheckupData;
  onSaveCheckupData: (updated: StrategicCheckupData) => void;
}

export const BusinessCheckup: React.FC<BusinessCheckupProps> = ({
  checkupData,
  onSaveCheckupData
}) => {
  const [data, setData] = useState<StrategicCheckupData>(checkupData);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'steps' | 'canvas' | 'bmc_mapping' | 'ai_assistant'>('roadmap');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Auto calculate total health score
  const totalHealthScore = useMemo(() => {
    return data.healthScores.reduce((acc, curr) => acc + curr.score, 0);
  }, [data.healthScores]);

  const maxHealthScore = useMemo(() => data.healthScores.length * 5, [data.healthScores]);

  const healthInterpretation = useMemo(() => {
    const ratio = totalHealthScore / maxHealthScore;
    if (ratio >= 0.8) return { label: 'مدل نسبتاً سالم؛ تمرکز بر رشد و مقیاس‌پذیری', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (ratio >= 0.6) return { label: 'مدل دارای ظرفیت رشد، همراه با چند شکاف مهم', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (ratio >= 0.4) return { label: 'نیازمند بازطراحی جدی چند بخش از بیزینس‌مدل', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'مدل شکننده؛ ابتدا باید مسائل بنیادی حل شوند', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }, [totalHealthScore, maxHealthScore]);

  // Handler for state updates
  const handleUpdateData = (updated: Partial<StrategicCheckupData>) => {
    const newData = { ...data, ...updated, updatedAt: new Date().toLocaleDateString('fa-IR') };
    setData(newData);
    onSaveCheckupData(newData);
  };

  // Handler for initial problem
  const handleUpdateInitialProblem = (field: keyof CheckupInitialProblem, value: string) => {
    const updatedProblem = { ...data.initialProblem, [field]: value };
    handleUpdateData({ initialProblem: updatedProblem });
  };

  // Handler for Health Score change
  const handleHealthScoreChange = (id: string, score: number) => {
    const updatedScores = data.healthScores.map((item) =>
      item.id === id ? { ...item, score } : item
    );
    handleUpdateData({ healthScores: updatedScores });
  };

  // Handler for Add Root Cause Chain
  const handleAddRootCause = () => {
    const newRC: CheckupRootCauseChain = {
      id: `rc-${Date.now()}`,
      symptom: 'عنوان نشانه مشاهده شده',
      evidence: 'شواهد پشتیبان',
      why1: 'چرا؟ (سطح ۱)',
      why2: 'چرا؟ (سطح ۲)',
      why3: 'چرا؟ (سطح ۳)',
      systemOrDecision: 'تصمیم یا سیستم پشت آن',
      bmcSection: 'بخش مربوطه در کانواس',
      probableRootCause: 'علت ریشه‌ای احتمالی'
    };
    handleUpdateData({ rootCauses: [...data.rootCauses, newRC] });
  };

  const handleRemoveRootCause = (id: string) => {
    handleUpdateData({ rootCauses: data.rootCauses.filter((rc) => rc.id !== id) });
  };

  // AI Diagnostic Assistance
  const handleAiDiagnose = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `شما یک مشاور ارشد استراتژی و عارضه‌یابی کسب‌وکار هستید. بر اساس اطلاعات زیر، ۵ علت ریشه‌ای احتمالی، نقشه حرارتی عارضه‌ها و پیشنهاد تصمیم استراتژیک را به فارسی تحلیل و ارائه کنید:\n\nمسئله اولیه: ${data.initialProblem.perceivedProblem}\nشواهد: ${data.initialProblem.evidence}\nوضعیت فعلی: ${data.currentModelOneLiner}`
            }
          ]
        })
      });
      const resData = await res.json();
      if (resData.response) {
        alert('تحلیل هوشمند انجام شد! پاسخ مشاور استراتژیک به همراه پیشنهادات آماده مشاهده است.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 dir-rtl text-right" dir="rtl">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/30">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>چکاپ و عارضه‌یابی استراتژیک کسب‌وکار (پیش از طراحی کانواس)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            ابزار عارضه‌یابی استراتژیک و تشخیص مسئله واقعی
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            کشف گلوگاه‌های پنهان، تفکیک نشانه از علت ریشه‌ای، نمره‌دهی سلامت ۱۷‌گانه و تعیین تصمیم استراتژیک پیش از ورود به بوم مدل کسب‌وکار.
          </p>
        </div>

        {/* Health Score Summary Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4 w-full lg:w-auto">
          <div className="text-center border-l border-white/20 pl-4">
            <div className="text-3xl font-black text-amber-400">
              {totalHealthScore} <span className="text-xs font-normal text-slate-300">/ {maxHealthScore}</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium mt-0.5">امتیاز سلامت استراتژیک</div>
          </div>

          <div className="space-y-1">
            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${healthInterpretation.color}`}>
              {healthInterpretation.label}
            </div>
            <div className="text-[10px] text-slate-300">
              مسیر پیشنهادی: <span className="font-bold text-white">{data.strategicDecision.selectedPath}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 pt-3 gap-2 text-xs font-medium shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>داشبورد و وضعیت کلی سلامت</span>
        </button>

        <button
          onClick={() => setActiveTab('steps')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeTab === 'steps'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>گام‌های ۱۷‌گانه عارضه‌یابی</span>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-mono text-[10px] rounded-full">
            گام {activeStep} از ۱۷
          </span>
        </button>

        <button
          onClick={() => setActiveTab('canvas')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeTab === 'canvas'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>کانواس یک‌صفحه‌ای عارضه‌یابی</span>
        </button>

        <button
          onClick={() => setActiveTab('bmc_mapping')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeTab === 'bmc_mapping'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>انتقال یافته‌ها به کانواس بیزینس مدل</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeTab === 'ai_assistant'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>مشاور هوشمند عارضه‌یابی (AI)</span>
        </button>
      </div>

      {/* Tab 1: Dashboard & Overall Health Summary */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="text-[11px] font-bold text-slate-500">مسئله اعلام‌شده اولیه</div>
              <div className="text-xs font-bold text-slate-800 line-clamp-2">
                {data.initialProblem.perceivedProblem}
              </div>
              <div className="text-[10px] text-amber-600 font-semibold mt-2">
                ⚠️ ممکن است نشانه باشد، نه علت ریشه‌ای
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="text-[11px] font-bold text-slate-500">تعداد تحلیل علت ریشه‌ای (5-Whys)</div>
              <div className="text-xl font-black text-indigo-600">{data.rootCauses.length} زنجیره</div>
              <div className="text-[10px] text-slate-500">تفکیک نشانه از علت واقعی</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="text-[11px] font-bold text-slate-500">مجموع عارضه‌های اولویت‌دار</div>
              <div className="text-xl font-black text-rose-600">{data.prioritizedIssues.length} عارضه حاد</div>
              <div className="text-[10px] text-rose-500 font-semibold">ارزیابی شده با شدت و فوریت</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="text-[11px] font-bold text-slate-500">تصمیم استراتژیک پیشنهادی</div>
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                {data.strategicDecision.selectedPath === 'AmendSections' && 'اصلاح چند بخش از بیزینس مدل'}
                {data.strategicDecision.selectedPath === 'OptimizeCurrent' && 'بهینه‌سازی مدل فعلی'}
                {data.strategicDecision.selectedPath === 'MajorRedesign' && 'بازطراحی اساسی بیزینس مدل'}
                {data.strategicDecision.selectedPath === 'DualModel' && 'ساخت مدل جدید در کنار مدل فعلی'}
                {data.strategicDecision.selectedPath === 'DownsizeExit' && 'کوچک‌سازی یا خروج'}
              </div>
            </div>
          </div>

          {/* Heatmap & Health Scores Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heatmap Areas */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <PieChart className="w-4 h-4 text-indigo-600" />
                <span>نقشه حرارتی سالمت کسب‌وکار (Heatmap)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.heatmap.map((area) => (
                  <div
                    key={area.areaKey}
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      area.status === 'Green'
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : area.status === 'Yellow'
                        ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                        : area.status === 'Red'
                        ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{area.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          area.status === 'Green'
                            ? 'bg-emerald-200 text-emerald-900'
                            : area.status === 'Yellow'
                            ? 'bg-amber-200 text-amber-900'
                            : area.status === 'Red'
                            ? 'bg-rose-200 text-rose-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {area.status === 'Green' && 'سبز (سالم)'}
                        {area.status === 'Yellow' && 'زرد (نیازمند اصلاح)'}
                        {area.status === 'Red' && 'قرمز (عارضه جدی)'}
                        {area.status === 'Gray' && 'خاکستری (مجهول)'}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80 leading-snug">{area.keyFinding}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Scores Spider/List */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>امتیازدهی سلامت ۱۷‌گانه (۱ تا ۵)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-indigo-600">
                  {totalHealthScore} / {maxHealthScore}
                </span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {data.healthScores.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl">
                    <span className="font-medium text-slate-700">{item.title}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleHealthScoreChange(item.id, star)}
                          className={`w-5 h-5 rounded-md text-[10px] font-bold transition-all ${
                            star <= item.score
                              ? item.score >= 4
                                ? 'bg-emerald-600 text-white'
                                : item.score === 3
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-600 text-white'
                              : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                          }`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive 17 Steps Wizard */}
      {activeTab === 'steps' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Steps List Menu */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2 max-h-[600px] overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b pb-2">
              مراحل ۱۷‌گانه عارضه‌یابی
            </h3>
            {[
              { num: 1, title: 'تعریف درخواست و مسئله اولیه' },
              { num: 2, title: 'تعیین وضعیت مطلوب و شاخص‌ها' },
              { num: 3, title: 'تصویربرداری سریع از مدل فعلی' },
              { num: 4, title: 'بررسی سلامت بازار و مشتری' },
              { num: 5, title: 'بررسی ارزش پیشنهادی و تمایز' },
              { num: 6, title: 'ارزیابی کانال جذب و قیف فروش' },
              { num: 7, title: 'بررسی موتور اقتصادی کسب‌وکار' },
              { num: 8, title: 'بررسی عملیات و تحویل ارزش' },
              { num: 9, title: 'منابع، قابلیت‌ها و وابستگی‌ها' },
              { num: 10, title: 'رقابت و جایگاه استراتژیک' },
              { num: 11, title: 'مدیریت، ساختار و تصمیم‌گیری' },
              { num: 12, title: 'تفکیک نشانه از علت ریشه‌ای' },
              { num: 13, title: 'امتیازدهی سلامت استراتژیک' },
              { num: 14, title: 'ساخت نقشه حرارتی عارضه‌ها' },
              { num: 15, title: 'اولویت‌بندی عارضه‌ها' },
              { num: 16, title: 'تبدیل به فرضیه‌های قابل بررسی' },
              { num: 17, title: 'تعیین تصمیم استراتژیک نهایی' }
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`w-full text-right p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  activeStep === step.num
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-50 hover:bg-indigo-50 text-slate-700'
                }`}
              >
                <span>مرحله {step.num}: {step.title}</span>
                {activeStep === step.num && <ArrowRight className="w-3.5 h-3.5 rotate-180" />}
              </button>
            ))}
          </div>

          {/* Active Step Content Panel */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            {/* Step 1 */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800">مرحله اول: تعریف درخواست و مسئله اولیه شرکت</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ثبت دقیق مسئله احساس‌شده توسط مدیران (این مرحله صرفاً ثبت ادعا است و هنوز به عنوان علت اصلی پذیرفته نمی‌شود).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">مسئله‌ای که احساس می‌کنید چیست؟</label>
                    <textarea
                      rows={2}
                      value={data.initialProblem.perceivedProblem}
                      onChange={(e) => handleUpdateInitialProblem('perceivedProblem', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">چه شواهدی وجود دارد؟</label>
                    <textarea
                      rows={2}
                      value={data.initialProblem.evidence}
                      onChange={(e) => handleUpdateInitialProblem('evidence', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">اقدامات قبلی و نتیجه آن‌ها؟</label>
                    <textarea
                      rows={2}
                      value={data.initialProblem.pastActions}
                      onChange={(e) => handleUpdateInitialProblem('pastActions', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">اگر حل نشود چه اتفاقی می‌افتد؟</label>
                    <textarea
                      rows={2}
                      value={data.initialProblem.ifNotSolved}
                      onChange={(e) => handleUpdateInitialProblem('ifNotSolved', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-indigo-900">جمله استاندارد مسئله اولیه:</div>
                  <p className="text-slate-800 leading-relaxed font-mono">
                    {data.initialProblem.problemStatementSentence}
                  </p>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800">مرحله دوم: تعیین وضعیت مطلوب و شاخص‌ها</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    تعریف شفاف اهداف کمی و کیفی تا عارضه‌یابی به جمع‌آوری فهرستی از مشکلات تبدیل نشود.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-slate-700">
                        <th className="p-2 border border-slate-200">مؤلفه / شاخص</th>
                        <th className="p-2 border border-slate-200">وضعیت فعلی</th>
                        <th className="p-2 border border-slate-200">وضعیت مطلوب</th>
                        <th className="p-2 border border-slate-200">موعد رسیدن</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {data.desiredStates.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 border border-slate-200 font-bold text-slate-800">{item.metric}</td>
                          <td className="p-2 border border-slate-200 font-mono">{item.currentValue}</td>
                          <td className="p-2 border border-slate-200 font-mono text-emerald-700 font-bold">{item.desiredValue}</td>
                          <td className="p-2 border border-slate-200 text-slate-500">{item.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800">مرحله سوم: تصویربرداری سریع از مدل فعلی</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    شناخت خلاصه منطق کسب‌وکار در یک جمله جامع پیش از ورود به جزئیات.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">جمله مدل فعلی کسب‌وکار:</label>
                  <textarea
                    rows={3}
                    value={data.currentModelOneLiner}
                    onChange={(e) => handleUpdateData({ currentModelOneLiner: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Funnel */}
            {activeStep === 6 && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800">مرحله ششم: بررسی کانال جذب، فروش و قیف تبدیل</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    شناسایی دقیق محل ریزش مشتریان از آگاهی تا خرید مجدد.
                  </p>
                </div>

                <div className="space-y-2">
                  {data.funnelStages.map((stage, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>مرحله {idx + 1}: {stage.stage}</span>
                        <span className="font-mono text-indigo-700">{stage.currentCountOrRate}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600 mt-1">
                        <div><strong className="text-rose-600">مشکل:</strong> {stage.issue}</div>
                        <div><strong className="text-amber-600">علت احتمالی:</strong> {stage.probableCause}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 12: 5-Whys Root Cause Analysis */}
            {activeStep === 12 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">مرحله دوازدهم: تفکیک نشانه از علت ریشه‌ای (۵ چرا؟)</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      بررسی زنجیره علت‌ها جهت جلوکیری از حل کردن نشانه به جای مسئله اصلی.
                    </p>
                  </div>
                  <button
                    onClick={handleAddRootCause}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن زنجیره جدید</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.rootCauses.map((rc, idx) => (
                    <div key={rc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                      <div className="flex items-center justify-between font-bold border-b pb-2 text-slate-800">
                        <span>زنجیره عارضه #{idx + 1}: {rc.symptom}</span>
                        <button onClick={() => handleRemoveRootCause(rc.id)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2 bg-white rounded-lg border border-slate-200"><strong>سطح ۱:</strong> {rc.why1}</div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200"><strong>سطح ۲:</strong> {rc.why2}</div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200"><strong>سطح ۳:</strong> {rc.why3}</div>
                      </div>

                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 font-medium">
                        <strong>🎯 علت ریشه‌ای احتمالی:</strong> {rc.probableRootCause}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 17: Strategic Decision */}
            {activeStep === 17 && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800">مرحله هفدهم: تعیین تصمیم استراتژیک و مسیر ۵‌گانه</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    انتخاب یکی از ۵ مسیر استراتژیک برای بیزینس‌مدل بر اساس شواهد عارضه‌یابی.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    { path: 'OptimizeCurrent', title: 'مسیر ۱: حفظ و بهینه‌سازی مدل فعلی', desc: 'منطق مدل سالم است؛ مشکل در اجرای فرآیندهاست.' },
                    { path: 'AmendSections', title: 'مسیر ۲: اصلاح چند بخش از بیزینس‌مدل', desc: 'یک یا چند بخش مانند کانال یا ارزش پیشنهادی نیازمند تغییر است.' },
                    { path: 'MajorRedesign', title: 'مسیر ۳: بازطراحی اساسی بیزینس‌مدل', desc: 'بخش‌های مدل ناسازگارند و منطق اقتصادی ضعیف شده.' },
                    { path: 'DualModel', title: 'مسیر ۴: ساخت مدل جدید در کنار مدل فعلی', desc: 'فرصت جدیدی نیازمند بیزینس مدل متفاوت است.' },
                    { path: 'DownsizeExit', title: 'مسیر ۵: کوچک‌سازی، خروج یا توقف', desc: 'ادامه فعالیت منابع بیشتری را نابود می‌کند.' }
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() =>
                        handleUpdateData({
                          strategicDecision: {
                            ...data.strategicDecision,
                            selectedPath: item.path as StrategicDecisionPath
                          }
                        })
                      }
                      className={`p-3 rounded-xl border text-right transition-all ${
                        data.strategicDecision.selectedPath === item.path
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-amber-900">سؤال استراتژیک پایانی جلسه:</div>
                  <p className="text-slate-800">
                    اگر فقط اجازه داشته باشیم یک مسئله را حل کنیم که بیشترین اثر را بر کل کسب‌وکار داشته باشد، آن مسئله کدام است؟
                  </p>
                  <p className="font-bold text-indigo-800 mt-1">{data.strategicDecision.focusQuestionAnswer}</p>
                </div>
              </div>
            )}

            {/* Default step view placeholder for other steps */}
            {![1, 2, 3, 6, 12, 17].includes(activeStep) && (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <Info className="w-8 h-8 text-indigo-400 mx-auto" />
                <div className="font-bold text-slate-700">مرحله {activeStep} فعال است.</div>
                <p>اطلاعات این مرحله در فرم عارضه‌یابی ثبت شده و قابل ویرایش می‌باشد.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: One-Page Strategic Diagnosis Canvas */}
      {activeTab === 'canvas' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">کانواس یک‌صفحه‌ای عارضه‌یابی استراتژیک</h2>
              <p className="text-xs text-slate-500 mt-0.5">مستند جامع جمع‌بندی پیش از طراحی بوم مدل کسب‌وکار</p>
            </div>
            <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              <span>چاپ کانواس</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-700">مسئله اعلام‌شده شرکت:</span>
              <p className="text-slate-800">{data.onePageCanvas.announcedProblem}</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900">وضعیت مطلوب:</span>
              <p className="text-emerald-950 font-semibold">{data.onePageCanvas.desiredOutcome}</p>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
              <span className="font-bold text-indigo-900">مدل فعلی در یک جمله:</span>
              <p className="text-indigo-950">{data.onePageCanvas.currentModelOneLiner}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-emerald-700 border-b pb-1">مهم‌ترین نقاط قوت:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {data.onePageCanvas.topStrengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-rose-700 border-b pb-1">علت‌های ریشه‌ای احتمالی:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {data.onePageCanvas.probableRootCauses.map((rc, i) => <li key={i}>{rc}</li>)}
              </ul>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-700 border-b pb-1">وابستگی‌های خطرناک:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {data.onePageCanvas.dangerousDependencies.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: BMC Mapping */}
      {activeTab === 'bmc_mapping' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-slate-800">ارتباط یافته‌های عارضه‌یابی با بلوک‌های کانواس مدل کسب‌وکار</h2>
            <p className="text-xs text-slate-500 mt-1">
              انتقال مستقیم عارضه‌ها به ۹ بلوک اصلی کانواس جهت طراحی دقیق‌تر نسخه جدید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { block: 'بخش مشتریان (Customer Segments)', finding: 'مشتریان سودآور مشخص نیستند', question: 'کدام مشتری باید در اولویت قرار گیرد؟' },
              { block: 'ارزش پیشنهادی (Value Proposition)', finding: 'مشتری تفاوتی با رقبا احساس نمی‌کند', question: 'چه ارزش متمایزی باید ایجاد شود؟' },
              { block: 'کانال‌ها (Channels)', finding: 'وابستگی بالا به کانال‌های غیرمالکیتی', question: 'چه کانال‌های مالکیتی باید ایجاد شوند؟' },
              { block: 'ارتباط با مشتری (Relationships)', finding: 'خرید مجدد و تمدید پایین است', question: 'چه نظامی برای حفظ مشتری لازم است؟' },
              { block: 'جریان درآمدی (Revenue Streams)', finding: 'فروش بالا اما سود پایین است', question: 'قیمت‌گذاری چگونه تغییر کند؟' },
              { block: 'فعالیت‌های کلیدی (Key Activities)', finding: 'تحویل با تأخیر انجام می‌شود', question: 'کدام فرآیند باید بازطراحی شود؟' },
              { block: 'منابع کلیدی (Key Resources)', finding: 'موفقیت کاملاً به مدیر وابسته است', question: 'چه سیستم و قابلیتی باید ساخته شود؟' },
              { block: 'شرکای کلیدی (Key Partners)', finding: 'تأمین‌کننده انحصاری است', question: 'چگونه ریسک شریک کاهش یابد؟' },
              { block: 'ساختار هزینه (Cost Structure)', finding: 'هزینه ثابت بالا است', question: 'چه هزینه‌ای حذف یا برونسپاری شود؟' }
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="font-bold text-indigo-900 border-b border-slate-200 pb-1">{item.block}</div>
                <div className="text-[11px] text-rose-700"><strong>یافته عارضه:</strong> {item.finding}</div>
                <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                  <strong>سؤال طراحی:</strong> {item.question}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: AI Assistant */}
      {activeTab === 'ai_assistant' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>مشاور هوشمند عارضه‌یابی استراتژیک (NiazKav AI Diagnostic)</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              تحلیل خودکار داده‌های عارضه‌یابی با الگوریتم‌های پیشرفته برای تفکیک نشانه از علت ریشه‌ای و پیشنهاد تصمیم استراتژیک.
            </p>
          </div>

          <button
            onClick={handleAiDiagnose}
            disabled={isAiLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50 transition-all"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>در حال تحلیل استراتژیک داده‌ها...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>اجرای عارضه‌یابی خودکار با AI</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
