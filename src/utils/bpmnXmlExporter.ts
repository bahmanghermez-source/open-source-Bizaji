import { BpmnDiagram, ProcessArchRuleCheck } from '../types';

/**
 * Converts a NiazKav BpmnDiagram into standard BPMN 2.0 XML compatible with Bizagi Modeler, Camunda, Signavio & Enterprise Architect.
 */
export function exportToBizagiBpmnXml(diagram: BpmnDiagram): string {
  const definitionsId = `Definitions_${diagram.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const collaborationId = `Collaboration_${diagram.id.replace(/[^a-zA-Z0-9]/g, '_')}`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions 
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
  xmlns:bizagi="http://www.bizagi.com/bpmn/20100524/MODEL"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  id="${definitionsId}" 
  targetNamespace="http://bpmn.io/schema/bpmn" 
  exporter="NiazKav Bizagi Modeler Generator" 
  exporterVersion="1.0">
  
  <bpmn:collaboration id="${collaborationId}">
`;

  // 1. Add Participants (Pools)
  diagram.pools.forEach((pool) => {
    const processRef = `Process_${pool.id}`;
    xml += `    <bpmn:participant id="Participant_${pool.id}" name="${escapeXml(pool.name)}" processRef="${processRef}" />\n`;
  });

  // Message flows between different pools
  diagram.flows
    .filter((f) => f.type === 'message')
    .forEach((flow) => {
      xml += `    <bpmn:messageFlow id="${flow.id}" name="${escapeXml(flow.name || '')}" sourceRef="${flow.sourceRef}" targetRef="${flow.targetRef}" />\n`;
    });

  xml += `  </bpmn:collaboration>\n\n`;

  // 2. Add Processes for each Pool
  diagram.pools.forEach((pool) => {
    const processId = `Process_${pool.id}`;
    xml += `  <bpmn:process id="${processId}" name="${escapeXml(pool.name)}" isExecutable="true">\n`;

    // Laneset
    xml += `    <bpmn:laneSet id="LaneSet_${pool.id}">\n`;
    pool.lanes.forEach((lane) => {
      const laneNodes = diagram.nodes.filter((n) => n.laneId === lane.id);
      xml += `      <bpmn:lane id="${lane.id}" name="${escapeXml(lane.name)}">\n`;
      laneNodes.forEach((node) => {
        xml += `        <bpmn:flowNodeRef>${node.id}</bpmn:flowNodeRef>\n`;
      });
      xml += `      </bpmn:lane>\n`;
    });
    xml += `    </bpmn:laneSet>\n\n`;

    // Nodes in this pool
    const poolNodes = diagram.nodes.filter((n) => n.poolId === pool.id);
    poolNodes.forEach((node) => {
      const nodeXmlTag = getBpmnTagForType(node.type);
      xml += `    <${nodeXmlTag} id="${node.id}" name="${escapeXml(node.name)}">\n`;
      
      if (node.documentation) {
        xml += `      <bpmn:documentation>${escapeXml(node.documentation)}</bpmn:documentation>\n`;
      }

      // Incoming & Outgoing flows
      const incoming = diagram.flows.filter((f) => f.targetRef === node.id && f.type !== 'message');
      const outgoing = diagram.flows.filter((f) => f.sourceRef === node.id && f.type !== 'message');

      incoming.forEach((f) => {
        xml += `      <bpmn:incoming>${f.id}</bpmn:incoming>\n`;
      });
      outgoing.forEach((f) => {
        xml += `      <bpmn:outgoing>${f.id}</bpmn:outgoing>\n`;
      });

      xml += `    </${nodeXmlTag}>\n`;
    });

    // Sequence Flows in this pool
    const poolNodeIds = new Set(poolNodes.map((n) => n.id));
    diagram.flows
      .filter((f) => f.type !== 'message' && poolNodeIds.has(f.sourceRef))
      .forEach((flow) => {
        xml += `    <bpmn:sequenceFlow id="${flow.id}" name="${escapeXml(flow.name || '')}" sourceRef="${flow.sourceRef}" targetRef="${flow.targetRef}" />\n`;
      });

    xml += `  </bpmn:process>\n\n`;
  });

  // 3. Add Diagram Layout Visuals (BPMNDiagram / BPMNPlane)
  xml += `  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n`;
  xml += `    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${collaborationId}">\n`;

  // Render Pool and Lane visual shapes
  let currentY = 50;
  diagram.pools.forEach((pool) => {
    let poolHeight = pool.lanes.reduce((acc, l) => acc + (l.height || 160), 0);
    xml += `      <bpmndi:BPMNShape id="Participant_${pool.id}_di" bpmnElement="Participant_${pool.id}" isHorizontal="true">\n`;
    xml += `        <dc:Bounds x="20" y="${currentY}" width="1200" height="${poolHeight}" />\n`;
    xml += `      </bpmndi:BPMNShape>\n`;

    let laneY = currentY;
    pool.lanes.forEach((lane) => {
      const h = lane.height || 160;
      xml += `        <bpmndi:BPMNShape id="${lane.id}_di" bpmnElement="${lane.id}" isHorizontal="true">\n`;
      xml += `          <dc:Bounds x="50" y="${laneY}" width="1170" height="${h}" />\n`;
      xml += `        </bpmndi:BPMNShape>\n`;
      laneY += h;
    });

    currentY += poolHeight + 40;
  });

  // Render Node visual shapes
  diagram.nodes.forEach((node) => {
    const isGateway = node.type.includes('Gateway');
    const isEvent = node.type.includes('Event');
    const w = isGateway ? 50 : isEvent ? 40 : 120;
    const h = isGateway ? 50 : isEvent ? 40 : 80;

    xml += `      <bpmndi:BPMNShape id="${node.id}_di" bpmnElement="${node.id}">\n`;
    xml += `        <dc:Bounds x="${node.x}" y="${node.y}" width="${w}" height="${h}" />\n`;
    xml += `      </bpmndi:BPMNShape>\n`;
  });

  // Render Edge connections
  diagram.flows.forEach((flow) => {
    const srcNode = diagram.nodes.find((n) => n.id === flow.sourceRef);
    const tgtNode = diagram.nodes.find((n) => n.id === flow.targetRef);
    if (srcNode && tgtNode) {
      xml += `      <bpmndi:BPMNEdge id="${flow.id}_di" bpmnElement="${flow.id}">\n`;
      xml += `        <di:waypoint x="${srcNode.x + 60}" y="${srcNode.y + 35}" />\n`;
      xml += `        <di:waypoint x="${tgtNode.x}" y="${tgtNode.y + 35}" />\n`;
      xml += `      </bpmndi:BPMNEdge>\n`;
    }
  });

  xml += `    </bpmndi:BPMNPlane>\n`;
  xml += `  </bpmndi:BPMNDiagram>\n`;
  xml += `</bpmn:definitions>`;

  return xml;
}

function getBpmnTagForType(type: string): string {
  switch (type) {
    case 'startEvent':
    case 'startEventMessage':
    case 'startEventTimer':
      return 'bpmn:startEvent';
    case 'endEvent':
    case 'endEventMessage':
    case 'endEventTerminate':
      return 'bpmn:endEvent';
    case 'userTask':
      return 'bpmn:userTask';
    case 'serviceTask':
      return 'bpmn:serviceTask';
    case 'scriptTask':
      return 'bpmn:scriptTask';
    case 'businessRuleTask':
      return 'bpmn:businessRuleTask';
    case 'sendTask':
      return 'bpmn:sendTask';
    case 'receiveTask':
      return 'bpmn:receiveTask';
    case 'exclusiveGateway':
      return 'bpmn:exclusiveGateway';
    case 'parallelGateway':
      return 'bpmn:parallelGateway';
    case 'inclusiveGateway':
      return 'bpmn:inclusiveGateway';
    case 'subProcess':
      return 'bpmn:subProcess';
    case 'dataObject':
      return 'bpmn:dataObject';
    case 'dataStore':
      return 'bpmn:dataStore';
    default:
      return 'bpmn:task';
  }
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Checks Process Engineering and Architectural Compliance according to BPMN 2.0 / Bizagi Modeler Rules.
 */
export function checkProcessArchitectureRules(diagram: BpmnDiagram): ProcessArchRuleCheck[] {
  const checks: ProcessArchRuleCheck[] = [];

  // Rule 1: Every process/pool must have at least one Start Event
  const startEvents = diagram.nodes.filter((n) => n.type.startsWith('startEvent'));
  checks.push({
    id: 'rule-start-event',
    ruleTitle: 'تعریف رویداد شروع (Start Event)',
    severity: startEvents.length > 0 ? 'Info' : 'Error',
    passed: startEvents.length > 0,
    message: startEvents.length > 0
      ? `تعداد ${startEvents.length} رویداد شروع در فرآیند شناسایی شد.`
      : 'هیچ رویداد شروعی (Start Event) در فرآیند یافت نشد. بر اساس استاندارد Bizagi هر فرآیند باید حداقل یک نقطه آغاز داشته باشد.',
    recommendation: 'یک Start Event در اولین لاین فرآیند قرار دهید.'
  });

  // Rule 2: Every process/pool must have at least one End Event
  const endEvents = diagram.nodes.filter((n) => n.type.startsWith('endEvent'));
  checks.push({
    id: 'rule-end-event',
    ruleTitle: 'تعریف رویداد پایان (End Event)',
    severity: endEvents.length > 0 ? 'Info' : 'Error',
    passed: endEvents.length > 0,
    message: endEvents.length > 0
      ? `تعداد ${endEvents.length} رویداد پایان در فرآیند تعریف شده است.`
      : 'فرآیند فاقد رویداد خروجی پایان (End Event) است. تمامی شاخه‌های فرآیند باید به رویداد پایان منتهی شوند.',
    recommendation: 'برای هر مسیری که به انتهای جریان کار می‌رسد یک End Event اضافه کنید.'
  });

  // Rule 3: Check for disconnected/isolated tasks
  const isolatedNodes = diagram.nodes.filter((node) => {
    if (node.type.startsWith('startEvent') || node.type.startsWith('endEvent')) return false;
    const hasIncoming = diagram.flows.some((f) => f.targetRef === node.id);
    const hasOutgoing = diagram.flows.some((f) => f.sourceRef === node.id);
    return !hasIncoming || !hasOutgoing;
  });

  checks.push({
    id: 'rule-isolated-tasks',
    ruleTitle: 'عدم وجود گام‌های ایزوله و بن‌بست (Unconnected Nodes)',
    severity: isolatedNodes.length === 0 ? 'Info' : 'Warning',
    passed: isolatedNodes.length === 0,
    message: isolatedNodes.length === 0
      ? 'تمامی گام‌های فرآیند دارای ورودی و خروجی جریان کار می‌باشند.'
      : `تعداد ${isolatedNodes.length} گام ایزوله یا فاقد ورودی/خروجی کامل شناسایی شد: (${isolatedNodes.map((n) => n.name).join('، ')})`,
    recommendation: 'مطمئن شوید تمامی فعالیت‌ها به جریان اصلی متصل شده‌اند.'
  });

  // Rule 4: Cross-Pool sequence flow rule (Use Message Flow between different Pools)
  let invalidCrossPoolFlows: string[] = [];
  diagram.flows.forEach((flow) => {
    const srcNode = diagram.nodes.find((n) => n.id === flow.sourceRef);
    const tgtNode = diagram.nodes.find((n) => n.id === flow.targetRef);
    if (srcNode && tgtNode && srcNode.poolId !== tgtNode.poolId) {
      if (flow.type !== 'message') {
        invalidCrossPoolFlows.push(`جریان بین ${srcNode.name} و ${tgtNode.name}`);
      }
    }
  });

  checks.push({
    id: 'rule-crosspool-flow',
    ruleTitle: 'ارتباط بین استخرها (Message Flow between Pools)',
    severity: invalidCrossPoolFlows.length === 0 ? 'Info' : 'Warning',
    passed: invalidCrossPoolFlows.length === 0,
    message: invalidCrossPoolFlows.length === 0
      ? 'قاعده ارتباط بین استخرها رعایت شده است (استفاده از Message Flow بین Poolهای مجزا).'
      : `در استاندارد Bizagi/BPMN، ارتباط بین دو استخر مجزا باید از نوع Message Flow (خط چین) باشد، اما ${invalidCrossPoolFlows.length} جریان متصل مستقیم یافت شد.`,
    recommendation: 'نوع جریان بین استخرها را به Message Flow تغییر دهید.'
  });

  // Rule 5: SLA and Performer completeness for User Tasks
  const userTasks = diagram.nodes.filter((n) => n.type === 'userTask');
  const missingSla = userTasks.filter((n) => !n.performer || !n.slaHours);
  checks.push({
    id: 'rule-sla-completeness',
    ruleTitle: 'شناسنامه و زمانبندی (SLA & Performer) فعالیت‌های انسانی',
    severity: missingSla.length === 0 ? 'Info' : 'Warning',
    passed: missingSla.length === 0,
    message: missingSla.length === 0
      ? 'تمامی فعالیت‌های کاربر (User Tasks) دارای مجری مشخص و زمان SLA ثبت‌شده هستند.'
      : `تعداد ${missingSla.length} وظیفه کاربر فاقد مجری یا زمان استاندارد SLA می‌باشد.`,
    recommendation: 'برای شبیه‌سازی و تحلیل زمانی فرآیند در Bizagi Modeler، زمان SLA را بر حسب ساعت مشخص کنید.'
  });

  return checks;
}
