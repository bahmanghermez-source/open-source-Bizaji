import React, { useState } from 'react';
import { Project } from '../types';
import { 
  Building2, 
  X, 
  Save, 
  Trash2, 
  Calendar, 
  User, 
  FileText, 
  Layers,
  AlertTriangle,
  FolderEdit
} from 'lucide-react';

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: Project) => void;
  onDelete?: (projectId: string) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(project.name);
  const [code, setCode] = useState(project.code);
  const [client, setClient] = useState(project.client);
  const [industry, setIndustry] = useState(project.industry);
  const [startDateJalali, setStartDateJalali] = useState(project.startDateJalali);
  const [targetCompletionJalali, setTargetCompletionJalali] = useState(project.targetCompletionJalali);
  const [description, setDescription] = useState(project.description);
  const [author, setAuthor] = useState(project.author);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedProject: Project = {
      ...project,
      name: name.trim(),
      code: code.trim(),
      client: client.trim(),
      industry,
      startDateJalali,
      targetCompletionJalali,
      description: description.trim(),
      author: author.trim()
    };

    onSave(updatedProject);
    onClose();
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(project.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto text-right dir-rtl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <FolderEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">ویرایش شناسنامه پروژه</h3>
              <p className="text-xs text-slate-400">{project.name} ({project.code})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                نام پروژه *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                کد اختصاری پروژه
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                سازمان / کارفرما
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                حوزه صنعت
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
                تحلیل‌گر ارشد / مسئول پروژه
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                تاریخ شروع (شمسی)
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
                تاریخ تحویل هدف (شمسی)
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
                شرح اهداف و محدوده پروژه
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition leading-relaxed"
              />
            </div>

          </div>

          {/* Danger Zone: Delete Option */}
          {onDelete && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              {!showConfirmDelete ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-bold hover:bg-red-50 dark:hover:bg-red-950/40 px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف کامل این پروژه</span>
                </button>
              ) : (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>آیا از حذف کامل «{project.name}» و تمام نیازمندی‌های آن اطمینان دارید؟</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      بله، حذف شود
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
