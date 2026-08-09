import React, { useState } from 'react';
import { WorkshopNote, ConflictItem } from '../types';
import { 
  UserCheck, 
  Plus, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw,
  FileCheck2,
  Tag
} from 'lucide-react';

export const WorkshopCanvas: React.FC = () => {
  // Workshop Timer
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Workshop Post-it Notes
  const [notes, setNotes] = useState<WorkshopNote[]>([
    {
      id: 'wn-1',
      title: 'صدور خودکار فاکتور پس از تحویل کالا',
      category: 'JTBD',
      content: 'به عنوان مدیر فروش، می‌خواهم بلافاصله پس از ثبت خروج انبار، صورتحساب صادر شود تا مشتری معطل نماند.',
      author: 'الهام عباسی',
      color: 'bg-amber-950/60 border-amber-700/80'
    },
    {
      id: 'wn-2',
      title: 'رویداد: استعلام موفق از کارپوشه',
      category: 'EventStorming',
      content: 'رویداد زمانی رخ می‌دهد که سازمان امور مالیاتی کد رهگیری واکنش را به API ما برگرداند.',
      author: 'آرش علوی',
      color: 'bg-emerald-950/60 border-emerald-700/80'
    },
    {
      id: 'wn-3',
      title: 'ریسک: قطعی سامانه مودیان در ساعات پیک',
      category: 'Risk',
      content: 'در تاریخ‌های ۱۵ام هر ماه ترافیک سازمان بالاست و احتمال تاخیر در دریافت استعلام وجود دارد.',
      author: 'مهندس طاهری',
      color: 'bg-rose-950/60 border-rose-700/80'
    }
  ]);

  // Conflicts list
  const [conflicts, setConflicts] = useState<ConflictItem[]>([
    {
      id: 'c-1',
      topic: 'سرعت صدور حضوری فاکتور در برابر الزام امضای دیجیتال',
      stakeholderA: 'الهام عباسی (فروش)',
      viewpointA: 'امضای دیجیتال نباید بیش از ۰٫۵ ثانیه زمان ببرد یا فروش معطل شود.',
      stakeholderB: 'دکتر رضایی (مالی)',
      viewpointB: 'حتما باید پیش از تحویل فاکتور به مشتری، کد ۲۲ رقمی مالیاتی امضا شده درج شود.',
      resolution: 'توافق شد سیستم فاکتور را امضا کرده و در صورت قطعی اینترنت در صف ارسال آفلاین قرار دهد.',
      status: 'Resolved'
    }
  ]);

  // New Note Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState<'JTBD' | 'EventStorming' | 'UserStory' | 'Risk'>('JTBD');
  const [noteContent, setNoteContent] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');

  // New Conflict Form
  const [conflictTopic, setConflictTopic] = useState('');
  const [stakeholderA, setStakeholderA] = useState('');
  const [viewpointA, setViewpointA] = useState('');
  const [stakeholderB, setStakeholderB] = useState('');
  const [viewpointB, setViewpointB] = useState('');

  // Timer Control
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    let color = 'bg-slate-50 border-slate-200';
    if (noteCategory === 'JTBD') color = 'bg-amber-50/80 border-amber-200';
    if (noteCategory === 'EventStorming') color = 'bg-emerald-50/80 border-emerald-200';
    if (noteCategory === 'UserStory') color = 'bg-blue-50/80 border-blue-200';
    if (noteCategory === 'Risk') color = 'bg-rose-50/80 border-rose-200';

    const newNote: WorkshopNote = {
      id: `wn-${Date.now()}`,
      title: noteTitle,
      category: noteCategory,
      content: noteContent,
      author: noteAuthor || 'شرکت‌کننده کارگاه',
      color
    };

    setNotes([...notes, newNote]);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleAddConflict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conflictTopic.trim()) return;

    const newC: ConflictItem = {
      id: `c-${Date.now()}`,
      topic: conflictTopic,
      stakeholderA,
      viewpointA,
      stakeholderB,
      viewpointB,
      status: 'Open'
    };

    setConflicts([...conflicts, newC]);
    setConflictTopic('');
    setStakeholderA('');
    setViewpointA('');
    setStakeholderB('');
    setViewpointB('');
  };

  const handleResolveConflict = (id: string, resolutionText: string) => {
    setConflicts(conflicts.map(c => {
      if (c.id === id) {
        return { ...c, resolution: resolutionText, status: 'Resolved' };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header Bar & Timer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">کارگاه تعاملی کشف نیازمندی‌ها (Discovery Workshop)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            طراحی همزمان سناریوها (JTBD / Event Storming)، مدیریت اختلافات ذینفعان و زمان‌بندی زنده کارگاه
          </p>
        </div>

        {/* Live Workshop Timer Badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl shrink-0">
          <Clock className="w-5 h-5 text-blue-600" />
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-bold">زمان سپری‌شده کارگاه</span>
            <span className="text-lg font-mono font-black text-blue-600">{formatTimer(seconds)}</span>
          </div>
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setSeconds(0);
              }}
              className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Workshop Post-it Canvas & Input Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form: Add Post-it Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>ثبت کارت سناریو / ایده در کارگاه</span>
          </h3>

          <form onSubmit={handleAddNote} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">دسته‌بندی کارت</label>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              >
                <option value="JTBD">وظیفه کاربر (Jobs To Be Done - JTBD)</option>
                <option value="EventStorming">طوفان رویداد (Event Storming)</option>
                <option value="UserStory">داستان کاربر (User Story)</option>
                <option value="Risk">ریسک و چالش عملیاتی (Risk)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">عنوان کارت *</label>
              <input
                type="text"
                required
                placeholder="عنوان سناریو یا رویداد..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شرح سناریو / دیدگاه</label>
              <textarea
                rows={3}
                placeholder="توضیحات مفصل برای ارائه در کارگاه..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نام ارائه‌دهنده (ذینفع)</label>
              <input
                type="text"
                placeholder="مثلاً: الهام عباسی"
                value={noteAuthor}
                onChange={(e) => setNoteAuthor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-blue-200 transition"
            >
              افزودن کارت به بوم کارگاه
            </button>
          </form>
        </div>

        {/* Right Canvas: Sticky Notes Grid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>بوم تعاملی کارگاه ({notes.length} کارت فعال)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[260px]">
            {notes.map((n) => (
              <div
                key={n.id}
                className={`border rounded-2xl p-4 shadow-xs space-y-2 relative group transition-all duration-200 ${n.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                    {n.category}
                  </span>
                  <button
                    onClick={() => setNotes(notes.filter(x => x.id !== n.id))}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{n.content}</p>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span>ارائه‌دهنده: <strong className="text-slate-800">{n.author}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Decision & Conflict Resolver Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>ماتریس حل تضادها و تصمیم‌گیری‌های کارگاه (Conflict Matrix)</span>
            </h3>
            <p className="text-xs text-slate-500">ثبت مواضع متفاوت ذینفعان و توافقات حاصل‌شده در کارگاه</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* New Conflict Input Form */}
          <form onSubmit={handleAddConflict} className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl space-y-3">
            <p className="text-xs font-bold text-amber-900">ثبت تضاد یا اختلاف دیدگاه جدید:</p>
            
            <input
              type="text"
              required
              placeholder="موضوع مورد اختلاف..."
              value={conflictTopic}
              onChange={(e) => setConflictTopic(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="ذینفع اول (مثلاً: فروش)"
                value={stakeholderA}
                onChange={(e) => setStakeholderA(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="دیدگاه اول..."
                value={viewpointA}
                onChange={(e) => setViewpointA(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="ذینفع دوم (مثلاً: مالی)"
                value={stakeholderB}
                onChange={(e) => setStakeholderB(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="دیدگاه دوم..."
                value={viewpointB}
                onChange={(e) => setViewpointB(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-lg transition"
            >
              ثبت مورد اختلاف
            </button>
          </form>

          {/* Conflicts List & Resolution Input */}
          <div className="space-y-3 max-h-80 overflow-y-auto pl-1">
            {conflicts.map((c) => (
              <div key={c.id} className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800">{c.topic}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c.status === 'Resolved' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {c.status === 'Resolved' ? 'حل‌شده' : 'در حال مذاکره'}
                  </span>
                </div>

                <div className="text-[11px] space-y-1 text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  <p>👤 <strong>{c.stakeholderA}:</strong> {c.viewpointA}</p>
                  <p>👤 <strong>{c.stakeholderB}:</strong> {c.viewpointB}</p>
                </div>

                {c.resolution ? (
                  <p className="text-[11px] text-blue-900 bg-blue-50/70 p-2 rounded-lg border border-blue-200">
                    ✅ <strong>توافق حاصله:</strong> {c.resolution}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="تایپ صورت توافق نهایی کارگاه..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleResolveConflict(c.id, (e.target as HTMLInputElement).value);
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
