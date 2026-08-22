import React, { useState, useMemo } from 'react';
import { 
  BpmnDiagram, 
  BpmnNode, 
  BpmnFlow, 
  BpmnElementType, 
  Requirement, 
  ProcessArchRuleCheck 
} from '../types';
import { exportToBizagiBpmnXml, checkProcessArchitectureRules } from '../utils/bpmnXmlExporter';
import { 
  Workflow, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Play, 
  Clock, 
  User, 
  Database, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Layers, 
  FileSpreadsheet,
  Check,
  Zap,
  ShieldCheck,
  ChevronDown,
  Printer
} from 'lucide-react';

interface BizagiModelerCanvasProps {
  diagrams: BpmnDiagram[];
  requirements: Requirement[];
  onSaveDiagram: (diagram: BpmnDiagram) => void;
  onDeleteDiagram: (diagramId: string) => void;
}

const ELEMENT_TYPES: { type: BpmnElementType; namePersian: string; category: 'Event' | 'Task' | 'Gateway' | 'Data'; icon: string }[] = [
  { type: 'startEvent', namePersian: 'رویداد شروع (Start)', category: 'Event', icon: '🟢' },
  { type: 'endEvent', namePersian: 'رویداد پایان (End)', category: 'Event', icon: '🔴' },
  { type: 'endEventMessage', namePersian: 'پایان پیام/پیامک (Message End)', category: 'Event', icon: '✉️' },
  { type: 'userTask', namePersian: 'وظیفه کاربر (User Task)', category: 'Task', icon: '👤' },
  { type: 'serviceTask', namePersian: 'وظیفه سیستمی (Service Task)', category: 'Task', icon: '⚙️' },
  { type: 'businessRuleTask', namePersian: 'قانون کسب‌وکار (Business Rule)', category: 'Task', icon: '📋' },
  { type: 'sendTask', namePersian: 'وظیفه ارسال (Send Task)', category: 'Task', icon: '📤' },
  { type: 'receiveTask', namePersian: 'وظیفه دریافت (Receive Task)', category: 'Task', icon: '📥' },
  { type: 'exclusiveGateway', namePersian: 'درگاه تصمیم‌گیری (XOR Gateway)', category: 'Gateway', icon: '🔶' },
  { type: 'parallelGateway', namePersian: 'درگاه همزمان (AND Gateway)', category: 'Gateway', icon: '➕' },
  { type: 'inclusiveGateway', namePersian: 'درگاه ترکیبی (OR Gateway)', category: 'Gateway', icon: '⭕' },
  { type: 'dataObject', namePersian: 'داده / سند (Data Object)', category: 'Data', icon: '📄' },
  { type: 'dataStore', namePersian: 'پایگاه داده (Data Store)', category: 'Data', icon: '🗄️' }
];

export const BizagiModelerCanvas: React.FC<BizagiModelerCanvasProps> = ({
  diagrams,
  requirements,
  onSaveDiagram,
  onDeleteDiagram
}) => {
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>(diagrams[0]?.id || '');
  const activeDiagram = useMemo(() => {
    return diagrams.find((d) => d.id === selectedDiagramId) || diagrams[0];
  }, [diagrams, selectedDiagramId]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'generator' | 'rules' | 'specification'>('canvas');

  // Generator State
  const [processPrompt, setProcessPrompt] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('tax');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Inspector State for node editing
  const selectedNode = useMemo(() => {
    if (!activeDiagram) return null;
    return activeDiagram.nodes.find((n) => n.id === selectedNodeId) || null;
  }, [activeDiagram, selectedNodeId]);

  // Architectural rule checks
  const ruleChecks = useMemo(() => {
    if (!activeDiagram) return [];
    return checkProcessArchitectureRules(activeDiagram);
  }, [activeDiagram]);

  const complianceScore = useMemo(() => {
    if (ruleChecks.length === 0) return 100;
    const passed = ruleChecks.filter((r) => r.passed).length;
    return Math.round((passed / ruleChecks.length) * 100);
  }, [ruleChecks]);

  // Handler: Select active diagram
  const handleSelectDiagram = (id: string) => {
    setSelectedDiagramId(id);
    setSelectedNodeId(null);
    setConnectSourceId(null);
  };

  // Handler: Add new node to active diagram
  const handleAddNode = (type: BpmnElementType) => {
    if (!activeDiagram) return;
    const firstPool = activeDiagram.pools[0];
    const firstLane = firstPool?.lanes[0];
    if (!firstPool || !firstLane) return;

    const newNode: BpmnNode = {
      id: `node-${Date.now()}`,
      type,
      name: ELEMENT_TYPES.find((t) => t.type === type)?.namePersian || 'گام جدید',
      poolId: firstPool.id,
      laneId: firstLane.id,
      x: 200 + Math.floor(Math.random() * 200),
      y: 50,
      slaHours: type === 'userTask' ? 1 : 0.1
    };

    const updatedDiagram: BpmnDiagram = {
      ...activeDiagram,
      nodes: [...activeDiagram.nodes, newNode],
      updatedAt: new Date().toLocaleDateString('fa-IR')
    };

    onSaveDiagram(updatedDiagram);
    setSelectedNodeId(newNode.id);
  };

  // Handler: Update node details
  const handleUpdateNode = (updatedFields: Partial<BpmnNode>) => {
    if (!activeDiagram || !selectedNode) return;
    const updatedNodes = activeDiagram.nodes.map((n) =>
      n.id === selectedNode.id ? { ...n, ...updatedFields } : n
    );
    onSaveDiagram({ ...activeDiagram, nodes: updatedNodes, updatedAt: new Date().toLocaleDateString('fa-IR') });
  };

  // Handler: Delete Node
  const handleDeleteNode = (nodeId: string) => {
    if (!activeDiagram) return;
    const updatedNodes = activeDiagram.nodes.filter((n) => n.id !== nodeId);
    const updatedFlows = activeDiagram.flows.filter((f) => f.sourceRef !== nodeId && f.targetRef !== nodeId);
    onSaveDiagram({ ...activeDiagram, nodes: updatedNodes, flows: updatedFlows });
    setSelectedNodeId(null);
  };

  // Handler: Flow creation
  const handleNodeClick = (nodeId: string) => {
    if (connectSourceId) {
      if (connectSourceId !== nodeId) {
        // Create flow
        const srcNode = activeDiagram.nodes.find((n) => n.id === connectSourceId);
        const tgtNode = activeDiagram.nodes.find((n) => n.id === nodeId);
        const isCrossPool = srcNode && tgtNode && srcNode.poolId !== tgtNode.poolId;

        const newFlow: BpmnFlow = {
          id: `flow-${Date.now()}`,
          sourceRef: connectSourceId,
          targetRef: nodeId,
          type: isCrossPool ? 'message' : 'sequence',
          name: isCrossPool ? 'ارسال پیام / داده' : ''
        };

        onSaveDiagram({
          ...activeDiagram,
          flows: [...activeDiagram.flows, newFlow]
        });
      }
      setConnectSourceId(null);
    } else {
      setSelectedNodeId(nodeId);
    }
  };

  // Handler: Export Bizagi BPMN XML
  const handleExportBizagiXml = () => {
    if (!activeDiagram) return;
    const xml = exportToBizagiBpmnXml(activeDiagram);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDiagram.code || 'Bizagi-Process'}_${activeDiagram.title.slice(0, 20)}.bpmn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handler: AI Generate BPMN Diagram
  const handleAIGenerateDiagram = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-bpmn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processDescription: processPrompt,
          templatePreset: selectedPreset,
          requirements: requirements.slice(0, 5)
        })
      });
      const data = await res.json();
      if (data.success && data.diagram) {
        onSaveDiagram(data.diagram);
        setSelectedDiagramId(data.diagram.id);
        setActiveTab('canvas');
      } else {
        alert('خطا در تولید دیاگرام: ' + (data.error || 'ناشناخته'));
      }
    } catch (err: any) {
      alert('خطا در ارتباط با سرور: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!activeDiagram) {
    return (
      <div className="p-8 text-center text-slate-500">
        هیچ دیاگرام بیزاجی یافت نشد. لطفاً یک دیاگرام جدید ایجاد کنید.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">{activeDiagram.title}</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono bg-slate-100 text-slate-600 rounded-md font-semibold border border-slate-200">
                {activeDiagram.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{activeDiagram.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Select Diagram Dropdown */}
          <select
            value={selectedDiagramId}
            onChange={(e) => handleSelectDiagram(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
          >
            {diagrams.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.title}
              </option>
            ))}
          </select>

          {/* Export to Bizagi Modeler BPMN XML */}
          <button
            onClick={handleExportBizagiXml}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            title="خروجی مستقیم قابل باز شدن در نرم‌افزار Bizagi Modeler Desktop"
          >
            <Download className="w-4 h-4" />
            <span>خروجی XML بیزاجی (.bpmn)</span>
          </button>

          {/* Print Specification PDF */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-3 gap-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all ${
            activeTab === 'canvas'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>بوم مدلسازی فرآیند (Bizagi Canvas)</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all ${
            activeTab === 'generator'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>تولید هوشمند فرآیند با AI</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all ${
            activeTab === 'rules'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>تحلیل اصول مهندسی فرآیند</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              complianceScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {complianceScore}%
          </span>
        </button>

        <button
          onClick={() => setActiveTab('specification')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all ${
            activeTab === 'specification'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>شناسنامه فرآیند و جدول RACI</span>
        </button>
      </div>

      {/* Tab 1: Bizagi Modeler Interactive Canvas */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Elements Palette & Controls (Left sidebar in RTL) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Bizagi Modeler Palette */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>پالت عناصر استاندارد Bizagi</span>
              </h3>

              <div className="space-y-2">
                <p className="text-[11px] text-slate-500">برای افزودن گام به بوم، روی عنصر کلیک کنید:</p>
                <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
                  {ELEMENT_TYPES.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleAddNode(item.type)}
                      className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-900 rounded-xl text-xs text-right transition-colors"
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="font-medium text-[11px]">{item.namePersian}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Element Inspector */}
            {selectedNode ? (
              <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تنظیمات عنصر انتخاب‌شده</span>
                  </h4>
                  <button
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                    title="حذف عنصر"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">عنوان گام:</label>
                    <input
                      type="text"
                      value={selectedNode.name}
                      onChange={(e) => handleUpdateNode({ name: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">مجری / نقش (Performer):</label>
                    <input
                      type="text"
                      value={selectedNode.performer || ''}
                      onChange={(e) => handleUpdateNode({ performer: e.target.value })}
                      placeholder="مانند: مدیر مالی / سیستم"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">زمان استاندارد (SLA ساعت):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedNode.slaHours || 0}
                      onChange={(e) => handleUpdateNode({ slaHours: parseFloat(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">توضیحات و مستندات:</label>
                    <textarea
                      rows={2}
                      value={selectedNode.documentation || ''}
                      onChange={(e) => handleUpdateNode({ documentation: e.target.value })}
                      placeholder="دستورالعمل اجرای گام..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setConnectSourceId(selectedNode.id)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
                        connectSourceId === selectedNode.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>
                        {connectSourceId === selectedNode.id ? 'روی گام مقصد کلیک کنید...' : 'ایجاد فلش جریان به گام دیگر'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                برای مشاهده و ویرایش جزئیات هر گام، روی آن در بوم کلیک کنید.
              </div>
            )}
          </div>

          {/* Visual Canvas Diagram View */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm overflow-x-auto min-h-[520px]">
            <div className="space-y-2 mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">بوم شناورهای Bizagi Modeler (Swimlanes & Pools)</span>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> رویداد شروع</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> فعالیت انسانی</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> درگاه تصمیم</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> رویداد پایان</span>
              </div>
            </div>

            {/* Pools SVG Canvas Container */}
            <div className="relative border border-slate-300 rounded-xl overflow-hidden bg-slate-50/50 min-w-[900px]">
              {activeDiagram.pools.map((pool, poolIndex) => (
                <div key={pool.id} className="border-b-2 border-slate-400 last:border-b-0">
                  {/* Pool Header */}
                  <div className="bg-slate-800 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
                    <span>استخر سازمانی (Pool): {pool.name}</span>
                    <span className="text-[10px] text-slate-300 font-normal">استاندارد ISO/IEC 19510</span>
                  </div>

                  {/* Lanes */}
                  {pool.lanes.map((lane, laneIndex) => (
                    <div
                      key={lane.id}
                      className="relative border-b border-slate-200 last:border-b-0 bg-white"
                      style={{ height: `${lane.height || 160}px` }}
                    >
                      {/* Lane Label Header */}
                      <div className="absolute right-0 top-0 bottom-0 w-32 bg-slate-100 border-l border-slate-200 p-2 flex flex-col justify-center text-right z-10 shadow-sm">
                        <span className="text-xs font-bold text-slate-800">{lane.name}</span>
                        {lane.role && <span className="text-[10px] text-emerald-700 font-medium">{lane.role}</span>}
                      </div>

                      {/* Render Nodes belonging to this lane */}
                      <div className="pr-36 pl-4 pt-4 h-full relative">
                        {activeDiagram.nodes
                          .filter((n) => n.laneId === lane.id)
                          .map((node) => {
                            const isSelected = selectedNodeId === node.id;
                            const isConnectSrc = connectSourceId === node.id;

                            return (
                              <div
                                key={node.id}
                                onClick={() => handleNodeClick(node.id)}
                                style={{ left: `${node.x}px`, top: '20px' }}
                                className={`absolute cursor-pointer select-none transition-all ${
                                  node.type.includes('startEvent') || node.type.includes('endEvent')
                                    ? 'w-12 h-12 rounded-full flex items-center justify-center'
                                    : node.type.includes('Gateway')
                                    ? 'w-12 h-12 rotate-45 flex items-center justify-center'
                                    : 'w-44 p-2.5 rounded-xl text-right text-xs shadow-sm border'
                                } ${
                                  node.type.includes('startEvent')
                                    ? 'bg-emerald-100 border-2 border-emerald-600 text-emerald-900 hover:scale-105'
                                    : node.type.includes('endEvent')
                                    ? 'bg-rose-100 border-2 border-rose-600 text-rose-900 hover:scale-105'
                                    : node.type.includes('Gateway')
                                    ? 'bg-amber-100 border-2 border-amber-500 text-amber-900 hover:scale-105'
                                    : 'bg-white border-slate-300 hover:border-emerald-500 text-slate-800'
                                } ${
                                  isSelected ? 'ring-2 ring-emerald-600 ring-offset-2 border-emerald-600 shadow-md' : ''
                                } ${isConnectSrc ? 'ring-2 ring-amber-500 animate-pulse' : ''}`}
                              >
                                {node.type.includes('Gateway') ? (
                                  <div className="-rotate-45 font-bold text-sm text-center">
                                    {node.type === 'parallelGateway' ? '+' : node.type === 'inclusiveGateway' ? 'O' : 'X'}
                                  </div>
                                ) : node.type.includes('Event') ? (
                                  <div className="text-center font-bold text-xs px-1">
                                    {node.type.includes('start') ? '▶' : '🛑'}
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                                      <span>
                                        {node.type === 'userTask'
                                          ? '👤 User Task'
                                          : node.type === 'serviceTask'
                                          ? '⚙️ Service'
                                          : node.type === 'businessRuleTask'
                                          ? '📋 Business Rule'
                                          : '✉️ Task'}
                                      </span>
                                      {node.slaHours && <span>{node.slaHours}h SLA</span>}
                                    </div>
                                    <div className="font-bold text-slate-800 line-clamp-2 leading-tight">
                                      {node.name}
                                    </div>
                                    {node.performer && (
                                      <div className="text-[10px] text-emerald-700 mt-1 font-medium">
                                        مجری: {node.performer}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Flows & Connections Summary */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 mb-2">اتصالات و جریان‌های ترتیبی (Sequence & Message Flows)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {activeDiagram.flows.map((flow) => {
                  const src = activeDiagram.nodes.find((n) => n.id === flow.sourceRef);
                  const tgt = activeDiagram.nodes.find((n) => n.id === flow.targetRef);
                  return (
                    <div
                      key={flow.id}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <span>{src?.name || 'گام مبدا'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 rotate-180" />
                        <span>{tgt?.name || 'گام مقصد'}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          flow.type === 'message'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {flow.type === 'message' ? 'Message Flow (خط چین)' : 'Sequence Flow'}
                        {flow.name ? ` (${flow.name})` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Process Generator */}
      {activeTab === 'generator' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>تولید خودکار دیاگرام Bizagi بر اساس نیازمندی‌ها و سناریو</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              با استفاده از هوش مصنوعی، توصیف فرآیند کاری یا سناریوی عملیاتی را وارد کنید تا دیاگرام کامل BPMN 2.0 منطبق با استانداردهای Bizagi Modeler شامل Pools، Swimlanes، Gateways و SLAها به‌صورت خودکار تولید شود.
            </p>
          </div>

          {/* Preset Template Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">الگوهای آماده فرآیندهای سازمانی ایران (Presets):</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedPreset('tax')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  selectedPreset === 'tax'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold mb-1">فرآیند ارسال فاکتور سامانه مودیان</div>
                <div className="text-[11px] text-slate-500">ماده ۲۲، امضای CSR، استعلام کارپوشه</div>
              </button>

              <button
                onClick={() => setSelectedPreset('warehouse')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  selectedPreset === 'warehouse'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold mb-1">فرآیند خروج کالا و تحویل انبار</div>
                <div className="text-[11px] text-slate-500">حواله انبار، تایید انباردار و بارگیری</div>
              </button>

              <button
                onClick={() => setSelectedPreset('procurement')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  selectedPreset === 'procurement'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold mb-1">فرآیند خرید و پرداخت فاکتور مالی</div>
                <div className="text-[11px] text-slate-500">پیش‌فاکتور، استعلام قیمت، تایید مالی</div>
              </button>
            </div>
          </div>

          {/* Custom Description Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              توضیحات اختصاصی فرآیند (یا بر اساس نیازمندی‌های پروژه):
            </label>
            <textarea
              rows={4}
              value={processPrompt}
              onChange={(e) => setProcessPrompt(e.target.value)}
              placeholder="مثال: فرآیند ثبت درخواست مرخصی کارکنان با سه لایه تایید سرپرست مستقیم، مدیر منابع انسانی و ثبت خودکار در سیستم کارکرد..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleAIGenerateDiagram}
              disabled={isGenerating}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال ساخت و معماری دیاگرام بیزاجی...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تولید دیاگرام استاندارد Bizagi</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Process Architecture Rules Checker */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>ارزیابی مطابقت با اصول استاندارد مهندسی فرآیند (BPMN 2.0 / Bizagi)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                بررسی خودکار قواعد معماری فرآیند، نقاط بن‌بست، رویدادهای آغاز و پایان، و زمانبندی SLA
              </p>
            </div>

            <div className="text-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-2xl font-black text-emerald-600">{complianceScore}%</div>
              <div className="text-[10px] text-slate-500 font-medium">امتیاز استاندارد</div>
            </div>
          </div>

          <div className="space-y-3">
            {ruleChecks.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  rule.passed
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : rule.severity === 'Error'
                    ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                    : 'bg-amber-50/50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="mt-0.5">
                  {rule.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : rule.severity === 'Error' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  ) : (
                    <Info className="w-5 h-5 text-amber-600" />
                  )}
                </div>

                <div className="space-y-1 text-xs flex-1">
                  <div className="font-bold text-sm">{rule.ruleTitle}</div>
                  <p className="text-slate-700 leading-relaxed">{rule.message}</p>
                  {!rule.passed && (
                    <div className="text-[11px] font-medium text-slate-600 mt-2 bg-white/80 p-2 rounded-lg border border-slate-200">
                      💡 راهکار پیشنهادی: {rule.recommendation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Process Specification & RACI Matrix */}
      {activeTab === 'specification' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none">
          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-slate-800">شناسنامه کامل فرآیند (Process Specification Sheet)</h3>
            <p className="text-xs text-slate-500 mt-1">
              مستند رسمی گام‌ها، نقش‌ها، زمان‌بندی SLA و ماتریس مسئولیت‌ها جهت ارائه در مستندات PRD و ممیزی فرآیند
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-2.5 border border-slate-200">شناسه گام</th>
                  <th className="p-2.5 border border-slate-200">نوع گام</th>
                  <th className="p-2.5 border border-slate-200">عنوان فعالیت</th>
                  <th className="p-2.5 border border-slate-200">واحد / استخر</th>
                  <th className="p-2.5 border border-slate-200">مجری (Performer)</th>
                  <th className="p-2.5 border border-slate-200">زمان SLA</th>
                  <th className="p-2.5 border border-slate-200">توضیحات و الزامات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {activeDiagram.nodes.map((node) => (
                  <tr key={node.id} className="hover:bg-slate-50">
                    <td className="p-2.5 border border-slate-200 font-mono text-[11px]">{node.id}</td>
                    <td className="p-2.5 border border-slate-200 font-semibold">{node.type}</td>
                    <td className="p-2.5 border border-slate-200 font-bold text-slate-900">{node.name}</td>
                    <td className="p-2.5 border border-slate-200">
                      {activeDiagram.pools.find((p) => p.id === node.poolId)?.name || '-'}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-emerald-800 font-medium">
                      {node.performer || 'سیستم / خودکار'}
                    </td>
                    <td className="p-2.5 border border-slate-200 font-mono">{node.slaHours ? `${node.slaHours} ساعت` : '-'}</td>
                    <td className="p-2.5 border border-slate-200 text-slate-500">{node.documentation || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
