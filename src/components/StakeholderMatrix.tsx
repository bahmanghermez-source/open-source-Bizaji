import React, { useState } from 'react';
import { Stakeholder, EngagementStrategy } from '../types';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  UserCheck, 
  Info, 
  PhoneCall, 
  Mail, 
  Building, 
  Sparkles 
} from 'lucide-react';

interface StakeholderMatrixProps {
  stakeholders: Stakeholder[];
  onAddStakeholder: (stk: Stakeholder) => void;
  onUpdateStakeholder: (stk: Stakeholder) => void;
  onDeleteStakeholder: (id: string) => void;
}

export const StakeholderMatrix: React.FC<StakeholderMatrixProps> = ({
  stakeholders,
  onAddStakeholder,
  onUpdateStakeholder,
  onDeleteStakeholder
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [power, setPower] = useState<number>(3);
  const [interest, setInterest] = useState<number>(3);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const calculateStrategy = (p: number, i: number): EngagementStrategy => {
    if (p >= 3.5 && i >= 3.5) return 'ManageClosely';
    if (p >= 3.5 && i < 3.5) return 'KeepSatisfied';
    if (p < 3.5 && i >= 3.5) return 'KeepInformed';
    return 'Monitor';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    const strategy = calculateStrategy(power, interest);

    if (selectedStakeholder) {
      onUpdateStakeholder({
        ...selectedStakeholder,
        name,
        role,
        department,
        power,
        interest,
        strategy,
        email,
        phone,
        notes
      });
    } else {
      onAddStakeholder({
        id: `stk-${Date.now()}`,
        name,
        role,
        department: department || 'بخش عمومی',
        power,
        interest,
        strategy,
        email,
        phone,
        notes
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setDepartment('');
    setPower(3);
    setInterest(3);
    setEmail('');
    setPhone('');
    setNotes('');
    setSelectedStakeholder(null);
    setShowAddModal(false);
  };

  const openEdit = (stk: Stakeholder) => {
    setSelectedStakeholder(stk);
    setName(stk.name);
    setRole(stk.role);
    setDepartment(stk.department);
    setPower(stk.power);
    setInterest(stk.interest);
    setEmail(stk.email || '');
    setPhone(stk.phone || '');
    setNotes(stk.notes || '');
    setShowAddModal(true);
  };

  const getStrategyBadge = (strat: EngagementStrategy) => {
    switch (strat) {
      case 'ManageClosely':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">مدیریت دقیق و کلیدی (Manage Closely)</span>;
      case 'KeepSatisfied':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">راضی نگه داشتن (Keep Satisfied)</span>;
      case 'KeepInformed':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">آگاه‌سازی مستمر (Keep Informed)</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">نظارت عمومی (Monitor)</span>;
    }
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">مدیریت ذینفعان و نقشه قدرت و نفوذ</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            تحلیل ساختار قدرت، میزان منافع و تعیین استراتژی تعامل با نقش‌های سازمانی بومی
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-200 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن ذینفع جدید</span>
        </button>
      </div>

      {/* Interactive Power-Interest 2D Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>ماتریس ۲ بعدی قدرت (Power) / منافع (Interest)</span>
            </h3>
            <p className="text-xs text-slate-500">جابه‌جایی مواضع بر اساس ساختار تصمیم‌گیری سازمانی</p>
          </div>
        </div>

        {/* The 2D Grid Canvas */}
        <div className="relative border-2 border-slate-200 rounded-2xl bg-slate-50/80 p-6 min-h-[420px] flex flex-col justify-between overflow-hidden">
          
          {/* Axis Labels */}
          <div className="absolute top-2 right-4 text-[11px] font-bold text-slate-700 bg-white/90 px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
            میزان قدرت / نفوذ ⬆ (Power: 1-5)
          </div>
          <div className="absolute bottom-2 left-4 text-[11px] font-bold text-slate-700 bg-white/90 px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
            میزان علاقه / منافع ⬅ (Interest: 1-5)
          </div>

          {/* Quadrant Divider Lines */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
            
            {/* Top-Right Quadrant: Manage Closely (High Power, High Interest) */}
            <div className="border-b border-l border-rose-200 bg-rose-50/30 p-3 relative">
              <span className="text-[11px] font-bold text-rose-700 bg-white/90 px-2 py-0.5 rounded border border-rose-200 shadow-xs">
                مدیریت دقیق و نزدیک (High Power, High Interest)
              </span>
            </div>

            {/* Top-Left Quadrant: Keep Satisfied (High Power, Low Interest) */}
            <div className="border-b border-amber-200 bg-amber-50/30 p-3 relative text-left">
              <span className="text-[11px] font-bold text-amber-700 bg-white/90 px-2 py-0.5 rounded border border-amber-200 shadow-xs">
                راضی نگه داشتن (High Power, Low Interest)
              </span>
            </div>

            {/* Bottom-Right Quadrant: Keep Informed (Low Power, High Interest) */}
            <div className="border-l border-blue-200 bg-blue-50/30 p-3 relative">
              <span className="text-[11px] font-bold text-blue-700 bg-white/90 px-2 py-0.5 rounded border border-blue-200 shadow-xs">
                آگاه‌سازی مستمر (Low Power, High Interest)
              </span>
            </div>

            {/* Bottom-Left Quadrant: Monitor (Low Power, Low Interest) */}
            <div className="bg-slate-100/40 p-3 relative text-left">
              <span className="text-[11px] font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                نظارت معمولی (Low Power, Low Interest)
              </span>
            </div>

          </div>

          {/* Stakeholder Cards Rendered in Grid relative positions */}
          <div className="relative w-full h-[360px] z-10">
            {stakeholders.map((stk) => {
              const leftPercent = Math.min(85, Math.max(10, ((stk.interest - 1) / 4) * 75 + 10));
              const bottomPercent = Math.min(85, Math.max(10, ((stk.power - 1) / 4) * 75 + 10));

              return (
                <div
                  key={stk.id}
                  style={{ left: `${leftPercent}%`, bottom: `${bottomPercent}%` }}
                  onClick={() => openEdit(stk)}
                  className="absolute transform -translate-x-1/2 translate-y-1/2 cursor-pointer group"
                >
                  <div className="bg-white border border-blue-300 hover:border-blue-600 hover:scale-105 shadow-md rounded-xl p-2.5 max-w-[170px] transition-all duration-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
                      <span className="font-bold text-xs text-slate-900 truncate">{stk.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 truncate">{stk.role}</p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1 border-t border-slate-100 pt-1">
                      <span>قدرت: {stk.power}/۵</span>
                      <span>منافع: {stk.interest}/۵</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Stakeholders List Directory */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
          فهرست جامع ذینفعان و استراتژی تعامل سازمانی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stakeholders.map((stk) => (
            <div
              key={stk.id}
              className="bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{stk.name}</h4>
                  <p className="text-xs text-blue-600 font-medium">{stk.role} ({stk.department})</p>
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEdit(stk)}
                    className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-blue-600 rounded-lg transition"
                    title="ویرایش"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteStakeholder(stk.id)}
                    className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-rose-600 rounded-lg transition"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>{getStrategyBadge(stk.strategy)}</div>

              {stk.notes && (
                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  {stk.notes}
                </p>
              )}

              {stk.concerns && stk.concerns.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>دغدغه‌ها و نقاط حساسیت:</span>
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {stk.concerns.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                {stk.phone && (
                  <span className="flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-blue-600" />
                    <span>{stk.phone}</span>
                  </span>
                )}
                {stk.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-600" />
                    <span>{stk.email}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Stakeholder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-right">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>{selectedStakeholder ? 'ویرایش ذینفع' : 'افزودن ذینفع جدید'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">میزان قدرت و علاقه ذینفع را جهت محاسبه خودکار استراتژی تعامل تعیین کنید.</p>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">نام و نام خانوادگی *</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: دکتر کامران رضایی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">سمت سازمانی *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: مدیر ارشد مالی"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">بخش / معاونت</label>
                  <input
                    type="text"
                    placeholder="مثلاً: معاونت مالی و اداری"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Sliders for Power and Interest */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">میزان قدرت (Power):</label>
                    <span className="text-xs font-black text-blue-600">{power} از ۵</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={power}
                    onChange={(e) => setPower(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">تأثیرگذاری در تصمیم‌گیری‌ها</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">میزان علاقه (Interest):</label>
                    <span className="text-xs font-black text-blue-600">{interest} از ۵</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={interest}
                    onChange={(e) => setInterest(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">میزان ذینفعی در موفقیت سیستم</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ایمیل</label>
                  <input
                    type="email"
                    placeholder="name@company.ir"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">شماره تماس / داخلی</label>
                  <input
                    type="text"
                    placeholder="۰۹۱۲..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">توضیحات و ملاحظات فرهنگی / سازمانی</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات رابطه سازمانی، دغدغه‌های اصلی و روش تعامل ترجیحی..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition"
                >
                  ذخیره اطلاعات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
