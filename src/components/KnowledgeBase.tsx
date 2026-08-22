import React, { useState } from 'react';
import { RegulationItem } from '../types';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Bookmark, 
  Sparkles,
  Building,
  HelpCircle,
  AlertTriangle,
  CheckSquare,
  Globe,
  Scale,
  CreditCard,
  Briefcase,
  Layers,
  Cpu,
  X,
  CheckCircle2
} from 'lucide-react';

interface KnowledgeBaseProps {
  regulations: RegulationItem[];
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ regulations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [glossarySearch, setGlossarySearch] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeModalReg, setActiveModalReg] = useState<RegulationItem | null>(null);
  const [completedChecklistItems, setCompletedChecklistItems] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleChecklist = (itemKey: string) => {
    setCompletedChecklistItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const filtered = regulations.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.keyDirectives.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = [
    { key: 'ALL', label: 'همه دسته‌ها', icon: BookOpen, color: 'bg-slate-100 text-slate-700' },
    { key: 'Tax', label: 'قوانین مالیاتی و مودیان', icon: Scale, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'ECommerce', label: 'کسب‌وکارهای اینترنتی', icon: Globe, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'Guild', label: 'قوانین اصناف (ghanonsenfi.com)', icon: Building, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { key: 'Banking', label: 'درگاه بانکی و شاپرک', icon: CreditCard, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { key: 'Labor', label: 'قوانین کار و بیمه', icon: Briefcase, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'IP', label: 'مالکیت فکری و برند', icon: Layers, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { key: 'Cybersecurity', label: 'امنیت و کاشف', icon: ShieldCheck, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { key: 'BPMS', label: 'اتوماسیون و یکپارچه‌سازی', icon: Cpu, color: 'bg-slate-100 text-slate-800 border-slate-300' },
  ];

  const glossaryItems = [
    { 
      term: 'سامانه مودیان (Moadian System)', 
      cat: 'مالیاتی',
      def: 'سامانه ملی جمع‌آوری و پردازش صورتحساب‌های الکترونیکی تحت نظارت سازمان امور مالیاتی کشور بر اساس قانون پایانه‌های فروشگاهی.' 
    },
    { 
      term: 'کد یکتای حافظه مالیاتی (Tax Unique ID)', 
      cat: 'مالیاتی',
      def: 'شناسه ۲۲ کاراکتری منحصربه‌فرد برای هر صورتحساب الکترونیکی با ترکیب شناسه حافظه مالیاتی، تاریخ و شماره سریال.' 
    },
    { 
      term: 'حد مجاز فروش ماده ۶', 
      cat: 'مالیاتی',
      def: 'سقف فروش مجاز صادرکننده فاکتور الکترونیکی که معادل ۵ برابر فروش معاف/مشمول ابرازی دوره مشابه سال قبل است.' 
    },
    { 
      term: 'پروانه کسب و رسته شغلی', 
      cat: 'اصناف',
      def: 'مجوز قانونی فعالیت واحدهای صنفی حضوری و آنلاین صادرشده از اتحادیه‌های صنفی مرجع (بر اساس قانون نظام صنفی ghanonsenfi.com).' 
    },
    { 
      term: 'عدم تداخل صنفی', 
      cat: 'اصناف',
      def: 'ممنوعیت قانونی عرضه خدمات یا کالاهای خارج از رسته شغلی تعیین‌شده در پروانه کسب، طبق مصوبات هیئت عالی نظارت اصناف.' 
    },
    { 
      term: 'ای‌نماد (Enamad - نماد اعتماد)', 
      cat: 'کسب‌وکار اینترنتی',
      def: 'مجوز هویت‌سنجی کسب‌وکارهای آنلاین صادرشده از مرکز توسعه تجارت الکترونیکی وزارت صمت، الزامی برای دریافت درگاه پرداخت.' 
    },
    { 
      term: 'نماد سازمان نظام صنفی رایانه‌ای (نصر)', 
      cat: 'کسب‌وکار اینترنتی',
      def: 'پروانه فعالیت شرکت‌های نرم‌افزاری و استارتاپ‌های فناوری اطلاعات تحت نظارت سازمان نصر استان‌ها.' 
    },
    { 
      term: 'حق انصراف ۷ روزه (Refund Policy)', 
      cat: 'تجارت الکترونیکی',
      def: 'حق قانونی خریدار آنلاین جهت فسخ معامله و دریافت کامل وجه ظرف ۷ روز کاری بدون تحمل جریمه (ماده ۳۷ قانون تجارت الکترونیکی).' 
    },
    { 
      term: 'کد مالیاتی درگاه پرداخت (IPG Tax ID)', 
      cat: 'بانکی',
      def: 'کد مالیاتی متصل به پایانه فروشگاهی/درگاه اینترنتی صادرشده از شبکه شاپرک که بدون آن اختصاص درگاه بانکی ممنوع است.' 
    },
    { 
      term: 'حساب تجاری بانکی', 
      cat: 'بانکی',
      def: 'شماره حساب بانکی حقوقی یا حقیقی معین‌شده که واریزی‌های آن مستقیماً درآمد مشمول مالیات تلقی می‌شود.' 
    },
    { 
      term: 'تسهیم آنلاین (Split Payment)', 
      cat: 'بانکی',
      def: 'توزیع خودکار وجوه خریداران پلتفرم‌های مارکت‌پلیس بین تامین‌کنندگان و کارمزد سایت در شبکه شاپرک.' 
    },
    { 
      term: 'مفاصاحساب ماده ۳۸ تامین اجتماعی', 
      cat: 'کار و بیمه',
      def: 'گواهی تسویه‌حساب بیمه‌ای قراردادهای پیمانکاری/نرم‌افزاری که آزادسازی ۵٪ سپرده بیمه نزد کارفرما منوط به صدور آن است.' 
    },
    { 
      term: 'بیمه اجباری ماده ۱۴۸ قانون کار', 
      cat: 'کار و بیمه',
      def: 'الزام کارفرما به پرداخت حق بیمه ۳۰ درصدی کلیه پرسنل از روز اول شروع به کار، صرف‌نظر از متن قرارداد کتبی.' 
    },
    { 
      term: 'شرکت‌های معتمد مالیاتی (TSP)', 
      cat: 'مالیاتی',
      def: 'شرکت‌های دارای مجوز رسمی از سازمان امور مالیاتی جهت ارائه خدمات ارسال صورتحساب الکترونیکی و پشتیبانی فنی moadian.' 
    },
    { 
      term: 'مرکز کاشف (Kashaf Security)', 
      cat: 'امنیت',
      def: 'مرکز مدیریت امداد و هماهنگی عملیات رخدادهای رایانه‌ای شبکه بانکی و مالی کشور تحت نظارت بانک مرکزی.' 
    },
    { 
      term: 'کلید امضای دیجیتال (CSR / Private Key)', 
      cat: 'امنیت',
      def: 'زوج کلید رمزنگاری asymmetric جهت امضای دیجیتال اسناد مالیاتی و تضمین عدم انکار و تمامیت اسناد.' 
    }
  ];

  const filteredGlossary = glossaryItems.filter(g => 
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.def.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.cat.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right dir-rtl font-sans">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-l from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پایگاه دانش جامع و مرجع تحلیلی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              پایگاه دانش قوانین، مقررات و اصطلاحات بومی کسب‌وکار ایران
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              مرجع تخصصی الزامات قانونی اصناف (ghanonsenfi.com)، سامانه مودیان، قوانین کسب‌وکارهای اینترنتی، درگاه‌های بانکی، شاپرک، بیمه تامین اجتماعی و مالکیت فکری برای معماران نرم‌افزار و تحلیلگران سیستم.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <span className="block text-2xl font-black text-blue-300">{regulations.length}</span>
              <span className="text-[11px] text-slate-300">ماده و دستورالعمل الزامی</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <span className="block text-2xl font-black text-amber-300">{bookmarkedIds.length}</span>
              <span className="text-[11px] text-slate-300">قوانین نشان‌شده شما</span>
            </div>
          </div>
        </div>

        {/* Quick Links Row */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="font-bold text-white text-xs ml-2">مراجع رسمی استعلام:</span>
          <a 
            href="https://ghanonsenfi.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-xl border border-amber-400/30 transition text-xs font-bold"
          >
            <Building className="w-3.5 h-3.5 text-amber-300" />
            <span>قوانین اصناف (ghanonsenfi.com)</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <a 
            href="https://intamedia.ir/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-xl border border-emerald-400/30 transition text-xs font-bold"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-300" />
            <span>درگاه مودیان مالیاتی</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <a 
            href="https://enamad.ir/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl border border-blue-400/30 transition text-xs font-bold"
          >
            <Globe className="w-3.5 h-3.5 text-blue-300" />
            <span>پورتال ای‌نماد</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <a 
            href="https://shaparak.ir/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-xl border border-indigo-400/30 transition text-xs font-bold"
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-300" />
            <span>شبکه پرداخت شاپرک</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
          <input
            type="text"
            placeholder="جستجو بر اساس عنوان قانون، کد مرجع، جریمه‌ها، شاپرک، اصناف، سامانه مودیان..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-12 pl-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition shadow-inner"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              پاک کردن
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            const count = cat.key === 'ALL' 
              ? regulations.length 
              : regulations.filter(r => r.category === cat.key).length;

            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Content Layout: Regulations Grid + Glossary Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Regulations Cards */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>دستورالعمل‌ها و مقررات الزامی کسب‌وکار ({filtered.length} مورد)</span>
            </h3>

            {bookmarkedIds.length > 0 && (
              <button 
                onClick={() => {
                  if (selectedCategory === 'BOOKMARKED') {
                    setSelectedCategory('ALL');
                  } else {
                    setSelectedCategory('ALL');
                  }
                }}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                {bookmarkedIds.length} قانون نشان‌شده
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">هیچ قانون یا دستورالعملی با این مشخصات یافت نشد.</p>
              <p className="text-xs text-slate-500">لطفاً عبارات دیگری را جستجو کرده یا فیلتر دسته‌بندی را تغییر دهید.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((reg) => {
                const isBookmarked = bookmarkedIds.includes(reg.id);

                return (
                  <div 
                    key={reg.id} 
                    className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4 relative group"
                  >
                    {/* Top Bar */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-blue-50 text-blue-700 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-200">
                            {reg.referenceCode}
                          </span>
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {reg.category === 'Tax' && '⚖️ مالیاتی و مودیان'}
                            {reg.category === 'ECommerce' && '🌐 تجارت الکترونیکی و ای‌نماد'}
                            {reg.category === 'Guild' && '🏛️ اصناف (ghanonsenfi.com)'}
                            {reg.category === 'Banking' && '💳 درگاه بانکی و شاپرک'}
                            {reg.category === 'Labor' && '💼 کار و تامین اجتماعی'}
                            {reg.category === 'IP' && '📑 مالکیت فکری و علامت تجاری'}
                            {reg.category === 'Cybersecurity' && '🛡️ امنیت و کاشف'}
                            {reg.category === 'BPMS' && '⚙️ اتوماسیون اداری'}
                          </span>
                        </div>
                        <h4 className="font-black text-base text-slate-900 leading-snug">{reg.title}</h4>
                      </div>

                      <button
                        onClick={(e) => toggleBookmark(reg.id, e)}
                        title={isBookmarked ? 'حذف از نشان‌شده‌ها' : 'نشان کردن قانون'}
                        className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                          isBookmarked 
                            ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                            : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{reg.summary}</p>

                    {/* Key Directives */}
                    <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>دستورالعمل‌های کلیدی:</span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-800 space-y-1 pr-1">
                        {reg.keyDirectives.map((directive, idx) => (
                          <li key={idx} className="leading-relaxed">{directive}</li>
                        ))}
                      </ul>
                    </div>

                    {/* IT Impact */}
                    <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200/80 text-xs text-blue-950 space-y-1">
                      <span className="font-extrabold text-blue-900 block">⚙️ تأثیر بر توسعه نرم‌افزار و معماری IT:</span>
                      <p className="leading-relaxed text-slate-800">{reg.impactOnIT}</p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      {reg.penalties && (
                        <div className="flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-xs">تبعات عدم رعایت: {reg.penalties}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mr-auto">
                        {reg.sourceUrl && (
                          <a 
                            href={reg.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
                          >
                            <span>مرجع اصلی</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <button
                          onClick={() => setActiveModalReg(reg)}
                          className="inline-flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 font-bold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer"
                        >
                          <span>جزئیات و چک‌لیست انطباق</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column: Glossary of Local Business Terms */}
        <div className="space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 sticky top-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-sm">واژه‌نامه اصطلاحات تخصصی بومی</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                {glossaryItems.length} واژه
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              تعاریف کلیدی مفاهیم مالیاتی، نظام صنفی، حقوقی، درگاه‌های بانکی و بیمه‌ای کشور جهت تحلیل شفاف سیستم‌ها.
            </p>

            {/* Glossary Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="جستجو در اصطلاحات بومی..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Glossary List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredGlossary.map((g, idx) => (
                <div key={idx} className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 p-3 rounded-2xl transition space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-xs text-blue-800">{g.term}</h5>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-md">
                      {g.cat}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-normal">{g.def}</p>
                </div>
              ))}
              {filteredGlossary.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">اصطلاحی با این عنوان یافت نشد.</p>
              )}
            </div>

            {/* Direct link to GhanonSenfi */}
            <div className="pt-2 border-t border-slate-100">
              <a 
                href="https://ghanonsenfi.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs py-2.5 px-3 rounded-xl transition text-center"
              >
                <Building className="w-4 h-4 text-amber-700" />
                <span>مشاهده متن کامل قوانین اصناف (ghanonsenfi.com)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Regulation Detail & Compliance Checklist Modal */}
      {activeModalReg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto text-right dir-rtl">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="bg-blue-50 text-blue-700 font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-blue-200">
                  {activeModalReg.referenceCode}
                </span>
                <h3 className="font-black text-lg sm:text-xl text-slate-900 mt-2">{activeModalReg.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalReg(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">خلاصه الزام قانونی</h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {activeModalReg.summary}
              </p>
            </div>

            {/* Directives List */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-amber-900">دستورالعمل‌های کلیدی مراجع دولتی / قضایی:</h4>
              <ul className="space-y-2">
                {activeModalReg.keyDirectives.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Penalties if any */}
            {activeModalReg.penalties && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1 text-xs">
                <span className="font-black text-rose-800 block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  تبعات و جریمه‌های عدم انطباق:
                </span>
                <p className="text-rose-950 leading-relaxed font-bold">{activeModalReg.penalties}</p>
              </div>
            )}

            {/* IT Impact */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-1 text-xs text-blue-950">
              <span className="font-black text-blue-900 block">⚙️ الزامات فنی و نرم‌افزاری (IT Impact):</span>
              <p className="leading-relaxed text-slate-800">{activeModalReg.impactOnIT}</p>
            </div>

            {/* Interactive Compliance Checklist */}
            {activeModalReg.complianceChecklist && activeModalReg.complianceChecklist.length > 0 && (
              <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-black text-xs text-slate-900">چک‌لیست عملیاتی انطباق محصول با این قانون:</h4>
                </div>

                <div className="space-y-2">
                  {activeModalReg.complianceChecklist.map((checkItem, idx) => {
                    const itemKey = `${activeModalReg.id}-${idx}`;
                    const isChecked = !!completedChecklistItems[itemKey];

                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleChecklist(itemKey)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs font-bold leading-relaxed ${isChecked ? 'line-through text-emerald-800' : ''}`}>
                          {checkItem}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {activeModalReg.sourceUrl ? (
                <a 
                  href={activeModalReg.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 transition"
                >
                  <span>مشاهده متن کامل قانون در سایت مرجع</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span />
              )}

              <button
                onClick={() => setActiveModalReg(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                بستن
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
