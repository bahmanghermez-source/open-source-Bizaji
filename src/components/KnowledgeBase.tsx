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
  HelpCircle
} from 'lucide-react';

interface KnowledgeBaseProps {
  regulations: RegulationItem[];
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ regulations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = regulations.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.referenceCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const glossaryItems = [
    { term: 'سامانه مودیان (Moadian System)', def: 'سامانه ملی جمع‌آوری و پردازش صورتحساب‌های الکترونیکی تحت نظارت سازمان امور مالیاتی کشور.' },
    { term: 'کد یکتای حافظه مالیاتی (Tax ID)', def: 'شناسه ۲۲ کاراکتری منحصربه‌فرد برای هر صورتحساب الکترونیکی با ترکیب شناسه شرکت، تاریخ و شماره سریال.' },
    { term: 'مرکز کاشف (Kashaf Security)', def: 'مرکز مدیریت امداد و هماهنگی عملیات رخدادهای رایانه‌ای در شبکه بانکی و زیرساخت‌های مالی کشور.' },
    { term: 'شرکت‌های معتمد (TSP)', def: 'شرکت‌های ارائه دهنده خدمات مالیاتی مجوزدار جهت ارسال و پشتیبانی صورتحساب مودیان.' },
    { term: 'امضای دیجیتال (Digital Signature / CSR)', def: 'استفاده از الگوریتم‌های رمزنگاری asymmetric (RSA/ECC) جهت تضمین عدم انکار اسناد مالی.' }
  ];

  return (
    <div className="space-y-6 text-right">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">پایگاه دانش قوانین، مقررات و اصطلاحات بومی کسب‌وکار ایران</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مرجع قوانین مالیاتی، سامانه مودیان، الزامات کاشف و استانداردهای اتوماسیون اداری برای تحلیلگران
          </p>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="جستجو در قوانین مالیاتی، مودیان، کاشف یا کدهای مرجع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            >
              <option value="ALL">همه دسته‌بندی‌ها</option>
              <option value="Tax">مالیاتی و سامانه مودیان</option>
              <option value="Cybersecurity">امنیت و کاشف</option>
              <option value="BPMS">یکپارچه‌سازی و BPMS بومی</option>
            </select>
          </div>

        </div>
      </div>

      {/* Regulations List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>دستورالعمل‌ها و قوانین الزامی کسب‌وکار</span>
          </h3>

          <div className="space-y-4">
            {filtered.map((reg) => (
              <div key={reg.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-200">
                      {reg.referenceCode}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900">{reg.title}</h4>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{reg.summary}</p>

                {/* Directives list */}
                <div className="space-y-1 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-900">دستورالعمل‌های کلیدی:</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                    {reg.keyDirectives.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>

                {/* Impact on IT */}
                <div className="text-[11px] text-blue-900 bg-blue-50/60 p-2.5 rounded-xl border border-blue-200">
                  ⚙️ <strong>تأثیر بر توسعه نرم‌افزار (IT Impact):</strong> {reg.impactOnIT}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glossary Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>واژه‌نامه اصطلاحات تخصصی کسب‌وکار</span>
          </h3>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            {glossaryItems.map((g, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-3 last:border-b-0 space-y-1">
                <h5 className="font-bold text-xs text-blue-700">{g.term}</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">{g.def}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
