import { jsPDF } from 'jspdf';

export type PDFTemplate =
  | 'executive'
  | 'minimal'
  | 'agency'
  | 'classic'
  | 'tech'
  | 'elegant'
  | 'startup'
  | 'legal';

export interface PDFTemplateInfo {
  id: PDFTemplate;
  name: string;
  description: string;
  preview: string; // emoji representing style
}

export const PDF_TEMPLATES: PDFTemplateInfo[] = [
  { id: 'executive',  name: 'Executive Dark',    description: 'Dark header, teal sidebar, bold sections',     preview: '🖤' },
  { id: 'minimal',    name: 'Modern Minimal',     description: 'Clean white, subtle accents, lots of space',   preview: '⬜' },
  { id: 'agency',     name: 'Bold Agency',        description: 'Strong colors, creative layout, standout',     preview: '🎨' },
  { id: 'classic',    name: 'Classic Business',   description: 'Traditional letter format, timeless look',     preview: '📄' },
  { id: 'tech',       name: 'Tech Professional',  description: 'Clean lines, monospace accents, modern',       preview: '💻' },
  { id: 'elegant',    name: 'Elegant Premium',    description: 'Gold accents, bordered frame, sophisticated',  preview: '✨' },
  { id: 'startup',    name: 'Startup Fresh',      description: 'Colorful gradient, friendly, modern',         preview: '🚀' },
  { id: 'legal',      name: 'Legal Formal',       description: 'Traditional formal, numbered sections, serif', preview: '⚖️' },
];

interface PDFOptions {
  title: string;
  content: string;
  filename: string;
  template?: PDFTemplate;
}

// ── Shared helpers ─────────────────────────────────────────────────────────────
function cleanContent(content: string): string {
  return content
    .replace(/[═─]+/g, '---DIV---')
    .replace(/[✓]/g, '[YES]')
    .replace(/[✗]/g, '[NO]')
    .replace(/[•]/g, '-')
    .replace(/[^\x00-\xFF]/g, '');
}

interface ParsedLine {
  text: string;
  type: 'empty' | 'divider' | 'heading' | 'keyval' | 'bullet' | 'body';
  key?: string;
  val?: string;
}

function parseLines(content: string): ParsedLine[] {
  return cleanContent(content).split('\n').map((line) => {
    const t = line.trim();
    if (!t) return { text: t, type: 'empty' };
    if (t === '---DIV---') return { text: t, type: 'divider' };
    const isHeading = t === t.toUpperCase() && t.length > 3 && t.length < 55
      && /[A-Z]/.test(t) && !t.includes(':') && !t.startsWith('-') && !t.startsWith('[');
    if (isHeading) return { text: t, type: 'heading' };
    const ci = t.indexOf(':');
    if (ci > 0 && ci < 25 && !t.startsWith('-')) {
      return { text: t, type: 'keyval', key: t.substring(0, ci + 1), val: t.substring(ci + 1).trim() };
    }
    if (t.startsWith('-') || t.startsWith('*')) return { text: t, type: 'bullet' };
    return { text: t, type: 'body' };
  });
}

// ── TEMPLATE: Executive Dark ──────────────────────────────────────────────────
function renderExecutive(doc: jsPDF, title: string, lines: ParsedLine[]): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 25, cw = pw - ml - 25;
  let page = 1;

  function frame() {
    doc.setFillColor(252, 252, 253); doc.rect(0, 0, pw, ph, 'F');
    doc.setFillColor(13, 148, 136); doc.rect(0, 0, 8, ph, 'F');
    doc.setFillColor(17, 24, 39); doc.rect(8, 0, pw - 8, 28, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(16); doc.setFont('helvetica','bold');
    doc.text('FreelanceKit', 16, 14);
    doc.setFontSize(7.5); doc.setFont('helvetica','normal'); doc.setTextColor(156,163,175);
    doc.text('AI-POWERED FREELANCE TOOLKIT', 16, 21);
    const d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    doc.setFillColor(13,148,136); doc.roundedRect(pw-70,8,45,12,2,2,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    doc.text(d, pw-47.5, 15.5, {align:'center'});
    doc.setFillColor(17,24,39); doc.rect(8, ph-16, pw-8, 16, 'F');
    doc.setTextColor(156,163,175); doc.setFontSize(7); doc.setFont('helvetica','normal');
    doc.text('freelancekit-zeta.vercel.app', 16, ph-5);
    doc.setFillColor(13,148,136); doc.rect(pw-40, ph-16, 40, 16, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text(`Page ${page}`, pw-20, ph-7, {align:'center'});
  }

  frame();
  doc.setFillColor(240,253,250); doc.roundedRect(ml,33,cw,18,2,2,'F');
  doc.setDrawColor(13,148,136); doc.setLineWidth(1); doc.line(ml,33,ml,51);
  doc.setTextColor(13,148,136); doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.text('DOCUMENT', ml+4, 40);
  doc.setTextColor(17,24,39); doc.setFontSize(16); doc.setFont('helvetica','bold');
  doc.text(title.length>55?title.substring(0,55)+'...':title, ml+4, 49);

  let y = 62; const lh=5.8, bot=ph-20;

  for (const item of lines) {
    if (y>bot){page++;doc.addPage();frame();y=35;}
    if (item.type==='empty'){y+=2;continue;}
    if (item.type==='divider'){
      doc.setDrawColor(209,213,219);doc.setLineWidth(0.2);doc.line(ml,y,pw-25,y);
      doc.setFillColor(13,148,136);doc.circle(ml+cw/2,y,0.8,'F');
      doc.circle(ml+cw/2-6,y,0.5,'F');doc.circle(ml+cw/2+6,y,0.5,'F');
      y+=5;continue;
    }
    if (item.type==='heading'){
      y+=2;if(y>bot-12){page++;doc.addPage();frame();y=35;}
      doc.setFillColor(17,24,39);doc.roundedRect(ml,y-4,cw,9,1.5,1.5,'F');
      doc.setFillColor(13,148,136);doc.roundedRect(ml,y-4,3,9,1,1,'F');
      doc.setTextColor(255,255,255);doc.setFontSize(8.5);doc.setFont('helvetica','bold');
      doc.text(item.text,ml+6,y+2);y+=12;continue;
    }
    if (item.type==='keyval'){
      doc.setTextColor(13,148,136);doc.setFontSize(8.5);doc.setFont('helvetica','bold');
      doc.text(item.key||'',ml+2,y);
      doc.setTextColor(55,65,81);doc.setFont('helvetica','normal');
      const vl=doc.splitTextToSize(item.val||'',cw-45);
      doc.text(vl[0],ml+48,y);
      for(let vi=1;vi<vl.length;vi++){y+=lh;if(y>bot){page++;doc.addPage();frame();y=35;}doc.text(vl[vi],ml+48,y);}
      y+=lh;continue;
    }
    if (item.type==='bullet'){
      doc.setFillColor(13,148,136);doc.circle(ml+3,y-1.2,1,'F');
      doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
      const wl=doc.splitTextToSize(item.text.replace(/^[-*]\s*/,''),cw-8);
      for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=35;}doc.text(w,ml+7,y);y+=lh;}
      continue;
    }
    doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
    const wl=doc.splitTextToSize(item.text,cw);
    for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=35;}doc.text(w,ml,y);y+=lh;}
  }
}

// ── TEMPLATE: Modern Minimal ──────────────────────────────────────────────────
function renderMinimal(doc: jsPDF, title: string, lines: ParsedLine[]): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 28, cw = pw - ml - 28;
  let page = 1;

  function frame() {
    doc.setFillColor(255,255,255); doc.rect(0,0,pw,ph,'F');
    doc.setDrawColor(229,231,235); doc.setLineWidth(0.3);
    doc.rect(10,10,pw-20,ph-20,'S');
    doc.setFillColor(249,250,251); doc.rect(10,10,pw-20,20,'F');
    doc.setTextColor(17,24,39); doc.setFontSize(11); doc.setFont('helvetica','bold');
    doc.text('FreelanceKit', ml, 23);
    doc.setTextColor(107,114,128); doc.setFontSize(7); doc.setFont('helvetica','normal');
    doc.text(new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), pw-ml, 23, {align:'right'});
    doc.setDrawColor(13,148,136); doc.setLineWidth(1.5);
    doc.line(ml, 30, ml+30, 30);
    doc.setTextColor(156,163,175); doc.setFontSize(7); doc.setFont('helvetica','normal');
    doc.text(`Page ${page}`, pw-ml, ph-14, {align:'right'});
    doc.text('freelancekit-zeta.vercel.app', ml, ph-14);
  }

  frame();
  doc.setTextColor(17,24,39); doc.setFontSize(20); doc.setFont('helvetica','bold');
  doc.text(title.length>50?title.substring(0,50)+'...':title, ml, 50);
  doc.setDrawColor(13,148,136); doc.setLineWidth(0.5); doc.line(ml, 53, pw-ml, 53);

  let y=62; const lh=5.8, bot=ph-22;

  for (const item of lines) {
    if(y>bot){page++;doc.addPage();frame();y=38;}
    if(item.type==='empty'){y+=2;continue;}
    if(item.type==='divider'){
      doc.setDrawColor(229,231,235);doc.setLineWidth(0.2);doc.line(ml,y,pw-ml,y);y+=5;continue;
    }
    if(item.type==='heading'){
      y+=3;if(y>bot-10){page++;doc.addPage();frame();y=38;}
      doc.setTextColor(13,148,136);doc.setFontSize(8);doc.setFont('helvetica','bold');
      doc.text(item.text,ml,y);
      doc.setDrawColor(13,148,136);doc.setLineWidth(0.2);doc.line(ml,y+1.5,pw-ml,y+1.5);
      y+=8;continue;
    }
    if(item.type==='keyval'){
      doc.setTextColor(107,114,128);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text(item.key||'',ml,y);
      doc.setTextColor(17,24,39);doc.setFont('helvetica','normal');
      const vl=doc.splitTextToSize(item.val||'',cw-42);
      doc.text(vl[0],ml+42,y);
      for(let vi=1;vi<vl.length;vi++){y+=lh;if(y>bot){page++;doc.addPage();frame();y=38;}doc.text(vl[vi],ml+42,y);}
      y+=lh;continue;
    }
    if(item.type==='bullet'){
      doc.setDrawColor(13,148,136);doc.setLineWidth(0.8);doc.line(ml,y-1,ml+2,y-1);
      doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
      const wl=doc.splitTextToSize(item.text.replace(/^[-*]\s*/,''),cw-6);
      for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=38;}doc.text(w,ml+5,y);y+=lh;}
      continue;
    }
    doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
    const wl=doc.splitTextToSize(item.text,cw);
    for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=38;}doc.text(w,ml,y);y+=lh;}
  }
}

// ── TEMPLATE: Bold Agency ─────────────────────────────────────────────────────
function renderAgency(doc: jsPDF, title: string, lines: ParsedLine[]): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 22, cw = pw - ml - 22;
  let page = 1;

  function frame() {
    doc.setFillColor(255,255,255); doc.rect(0,0,pw,ph,'F');
    doc.setFillColor(13,148,136); doc.rect(0,0,pw,35,'F');
    doc.setFillColor(10,110,100); doc.rect(0,30,pw,5,'F');
    doc.setFillColor(6,78,59); doc.rect(0,35,pw,2,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(18); doc.setFont('helvetica','bold');
    doc.text('FREELANCEKIT', ml, 20);
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(167,243,208);
    doc.text('AI-POWERED FREELANCE TOOLKIT', ml, 27);
    const d=new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
    doc.setTextColor(255,255,255); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text(d, pw-ml, 20, {align:'right'});
    doc.text(`P.${page}`, pw-ml, 28, {align:'right'});
    doc.setFillColor(17,24,39); doc.rect(0,ph-14,pw,14,'F');
    doc.setTextColor(107,114,128); doc.setFontSize(7); doc.setFont('helvetica','normal');
    doc.text('freelancekit-zeta.vercel.app', ml, ph-6);
    doc.setTextColor(13,148,136); doc.setFont('helvetica','bold');
    doc.text('CONFIDENTIAL', pw-ml, ph-6, {align:'right'});
  }

  frame();
  doc.setFillColor(240,253,250); doc.rect(0,37,6,30,'F');
  doc.setTextColor(17,24,39); doc.setFontSize(19); doc.setFont('helvetica','bold');
  const tWords = (title.length>40?title.substring(0,40)+'...':title).toUpperCase();
  doc.text(tWords, ml, 52);
  doc.setFillColor(13,148,136); doc.rect(ml, 55, 40, 2, 'F');
  doc.setFillColor(6,78,59); doc.rect(ml+42, 55, 20, 2, 'F');

  let y=66; const lh=5.8, bot=ph-18;

  for (const item of lines) {
    if(y>bot){page++;doc.addPage();frame();y=42;}
    if(item.type==='empty'){y+=2;continue;}
    if(item.type==='divider'){
      doc.setFillColor(13,148,136);doc.rect(ml,y-1,cw,1,'F');y+=5;continue;
    }
    if(item.type==='heading'){
      y+=3;if(y>bot-12){page++;doc.addPage();frame();y=42;}
      doc.setFillColor(13,148,136);doc.rect(ml,y-5,cw,10,'F');
      doc.setFillColor(6,78,59);doc.rect(ml,y-5,4,10,'F');
      doc.setTextColor(255,255,255);doc.setFontSize(9);doc.setFont('helvetica','bold');
      doc.text(item.text,ml+7,y+1);y+=13;continue;
    }
    if(item.type==='keyval'){
      doc.setFillColor(240,253,250);doc.rect(ml,y-4,cw,lh+1,'F');
      doc.setTextColor(13,148,136);doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.text(item.key||'',ml+2,y);
      doc.setTextColor(17,24,39);doc.setFont('helvetica','normal');
      const vl=doc.splitTextToSize(item.val||'',cw-45);
      doc.text(vl[0],ml+48,y);
      for(let vi=1;vi<vl.length;vi++){y+=lh;if(y>bot){page++;doc.addPage();frame();y=42;}doc.text(vl[vi],ml+48,y);}
      y+=lh;continue;
    }
    if(item.type==='bullet'){
      doc.setFillColor(13,148,136);doc.rect(ml,y-3,3,3,'F');
      doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
      const wl=doc.splitTextToSize(item.text.replace(/^[-*]\s*/,''),cw-8);
      for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=42;}doc.text(w,ml+7,y);y+=lh;}
      continue;
    }
    doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
    const wl=doc.splitTextToSize(item.text,cw);
    for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=42;}doc.text(w,ml,y);y+=lh;}
  }
}

// ── TEMPLATE: Classic Business ────────────────────────────────────────────────
function renderClassic(doc: jsPDF, title: string, lines: ParsedLine[]): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 30, cw = pw - ml - 30;
  let page = 1;

  function frame() {
    doc.setFillColor(255,255,255); doc.rect(0,0,pw,ph,'F');
    doc.setDrawColor(17,24,39); doc.setLineWidth(1.5);
    doc.rect(15,15,pw-30,ph-30,'S');
    doc.setDrawColor(17,24,39); doc.setLineWidth(0.3);
    doc.rect(18,18,pw-36,ph-36,'S');
    doc.setTextColor(17,24,39); doc.setFontSize(14); doc.setFont('helvetica','bold');
    doc.text('FreelanceKit', pw/2, 28, {align:'center'});
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(107,114,128);
    doc.text('AI-Powered Freelance Toolkit', pw/2, 34, {align:'center'});
    doc.setDrawColor(17,24,39); doc.setLineWidth(0.5);
    doc.line(ml, 38, pw-ml, 38);
    doc.line(ml, 40, pw-ml, 40);
    doc.setTextColor(107,114,128); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    doc.text(`Page ${page} | freelancekit-zeta.vercel.app`, pw/2, ph-20, {align:'center'});
    doc.setDrawColor(17,24,39); doc.setLineWidth(0.5);
    doc.line(ml, ph-24, pw-ml, ph-24);
    doc.line(ml, ph-22, pw-ml, ph-22);
  }

  frame();
  doc.setTextColor(17,24,39); doc.setFontSize(16); doc.setFont('helvetica','bold');
  doc.text(title.length>50?title.substring(0,50)+'...':title, pw/2, 54, {align:'center'});
  doc.setDrawColor(107,114,128); doc.setLineWidth(0.3); doc.line(ml+20, 57, pw-ml-20, 57);
  doc.setTextColor(107,114,128); doc.setFontSize(8); doc.setFont('helvetica','italic');
  doc.text(new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), pw/2, 63, {align:'center'});

  let y=72; const lh=5.8, bot=ph-28;

  for (const item of lines) {
    if(y>bot){page++;doc.addPage();frame();y=46;}
    if(item.type==='empty'){y+=2;continue;}
    if(item.type==='divider'){
      doc.setDrawColor(17,24,39);doc.setLineWidth(0.3);doc.line(ml,y,pw-ml,y);
      doc.line(ml,y+1.5,pw-ml,y+1.5);y+=6;continue;
    }
    if(item.type==='heading'){
      y+=3;if(y>bot-10){page++;doc.addPage();frame();y=46;}
      doc.setTextColor(17,24,39);doc.setFontSize(9);doc.setFont('helvetica','bold');
      doc.text(item.text,pw/2,y,{align:'center'});
      doc.setDrawColor(17,24,39);doc.setLineWidth(0.2);doc.line(ml+20,y+2,pw-ml-20,y+2);
      y+=9;continue;
    }
    if(item.type==='keyval'){
      doc.setTextColor(17,24,39);doc.setFontSize(9);doc.setFont('helvetica','bold');doc.text(item.key||'',ml,y);
      doc.setFont('helvetica','normal');
      const vl=doc.splitTextToSize(item.val||'',cw-40);
      doc.text(vl[0],ml+42,y);
      for(let vi=1;vi<vl.length;vi++){y+=lh;if(y>bot){page++;doc.addPage();frame();y=46;}doc.text(vl[vi],ml+42,y);}
      y+=lh;continue;
    }
    if(item.type==='bullet'){
      doc.setTextColor(17,24,39);doc.setFontSize(9);doc.setFont('helvetica','normal');
      const wl=doc.splitTextToSize(item.text.replace(/^[-*]\s*/,''),cw-6);
      for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=46;}doc.text('- '+w,ml+3,y);y+=lh;}
      continue;
    }
    doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
    const wl=doc.splitTextToSize(item.text,cw);
    for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=46;}doc.text(w,ml,y);y+=lh;}
  }
}

// ── TEMPLATE: Tech Professional ───────────────────────────────────────────────
function renderTech(doc: jsPDF, title: string, lines: ParsedLine[]): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 24, cw = pw - ml - 24;
  let page = 1;

  function frame() {
    doc.setFillColor(15,23,42); doc.rect(0,0,pw,ph,'F');
    doc.setFillColor(30,41,59); doc.rect(8,8,pw-16,ph-16,'F');
    doc.setFillColor(13,148,136); doc.rect(8,8,pw-16,1,'F');
    doc.setFillColor(13,148,136); doc.rect(8,8,1,ph-16,'F');
    doc.setFillColor(13,148,136); doc.rect(8,ph-9,pw-16,1,'F');
    doc.setFillColor(13,148,136); doc.rect(pw-9,8,1,ph-16,'F');
    doc.setFillColor(30,41,59); doc.rect(8,8,pw-16,26,'F');
    doc.setFillColor(13,148,136); doc.rect(8,34,pw-16,1,'F');
    doc.setTextColor(13,148,136); doc.setFontSize(11); doc.setFont('courier','bold');
    doc.text('[ FreelanceKit ]', ml+2, 22);
    doc.setFontSize(7); doc.setFont('courier','normal'); doc.setTextColor(51,65,85);
    doc.text('// AI-POWERED FREELANCE TOOLKIT', ml+2, 29);
    const d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'2-digit',day:'2-digit'});
    doc.setTextColor(13,148,136); doc.setFontSize(8); doc.setFont('courier','bold');
    doc.text(`date: ${d}`, pw-ml, 22, {align:'right'});
    doc.text(`page: ${page}`, pw-ml, 29, {align:'right'});
    doc.setFillColor(30,41,59); doc.rect(8,ph-22,pw-16,13,'F');
    doc.setTextColor(51,65,85); doc.setFontSize(7); doc.setFont('courier','normal');
    doc.text('// freelancekit-zeta.vercel.app', ml+2, ph-13);
    doc.setTextColor(13,148,136);
    doc.text('/* CONFIDENTIAL */', pw-ml, ph-13, {align:'right'});
  }

  frame();
  doc.setFillColor(15,23,42); doc.roundedRect(ml,39,cw,18,2,2,'F');
  doc.setDrawColor(13,148,136); doc.setLineWidth(0.3); doc.roundedRect(ml,39,cw,18,2,2,'S');
  doc.setTextColor(51,65,85); doc.setFontSize(7.5); doc.setFont('courier','normal');
  doc.text('const document = {', ml+3, 46);
  doc.setTextColor(13,148,136); doc.setFontSize(9); doc.setFont('courier','bold');
  const st = (title.length>45?title.substring(0,45)+'...':title);
  doc.text(`  title: "${st}"`, ml+3, 53);

  let y=66; const lh=5.8, bot=ph-26;

  for (const item of lines) {
    if(y>bot){page++;doc.addPage();frame();y=42;}
    if(item.type==='empty'){y+=2;continue;}
    if(item.type==='divider'){
      doc.setTextColor(51,65,85);doc.setFontSize(8);doc.setFont('courier','normal');
      doc.text('// ────────────────────────────',ml,y);y+=5;continue;
    }
    if(item.type==='heading'){
      y+=2;if(y>bot-12){page++;doc.addPage();frame();y=42;}
      doc.setFillColor(15,23,42);doc.roundedRect(ml,y-4,cw,9,1,1,'F');
      doc.setDrawColor(13,148,136);doc.setLineWidth(0.2);doc.roundedRect(ml,y-4,cw,9,1,1,'S');
      doc.setTextColor(13,148,136);doc.setFontSize(8.5);doc.setFont('courier','bold');
      doc.text('// '+item.text,ml+4,y+2);y+=12;continue;
    }
    if(item.type==='keyval'){
      doc.setTextColor(51,65,85);doc.setFontSize(8.5);doc.setFont('courier','normal');
      doc.text(item.key||'',ml+2,y);
      doc.setTextColor(167,243,208);doc.setFont('courier','normal');
      const vl=doc.splitTextToSize(item.val||'',cw-45);
      doc.text(vl[0],ml+48,y);
      for(let vi=1;vi<vl.length;vi++){y+=lh;if(y>bot){page++;doc.addPage();frame();y=42;}doc.text(vl[vi],ml+48,y);}
      y+=lh;continue;
    }
    if(item.type==='bullet'){
      doc.setTextColor(13,148,136);doc.setFontSize(9);doc.setFont('courier','normal');
      doc.text('>',ml+2,y);
      doc.setTextColor(167,243,208);
      const wl=doc.splitTextToSize(item.text.replace(/^[-*]\s*/,''),cw-8);
      for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=42;}doc.text(w,ml+7,y);y+=lh;}
      continue;
    }
    doc.setTextColor(203,213,225);doc.setFontSize(9);doc.setFont('courier','normal');
    const wl=doc.splitTextToSize(item.text,cw);
    for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=42;}doc.text(w,ml,y);y+=lh;}
  }
}

// ── TEMPLATE: Elegant Premium ─────────────────────────────────────────────────
function renderElegant(doc: jsPDF, title: string, lines: ParsedLine[]): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 28, cw = pw - ml - 28;
  let page = 1;

  function frame() {
    doc.setFillColor(255,253,245); doc.rect(0,0,pw,ph,'F');
    // Gold border
    doc.setDrawColor(180,150,80); doc.setLineWidth(1.5); doc.rect(10,10,pw-20,ph-20,'S');
    doc.setDrawColor(180,150,80); doc.setLineWidth(0.4); doc.rect(13,13,pw-26,ph-26,'S');
    // Corner ornaments
    const co=(x:number,y:number)=>{
      doc.setFillColor(180,150,80);
      doc.circle(x,y,1.5,'F'); doc.circle(x,y,2.5,'S');
    };
    co(10,10);co(pw-10,10);co(10,ph-10);co(pw-10,ph-10);
    // Header
    doc.setFillColor(250,247,235); doc.rect(10,10,pw-20,32,'F');
    doc.setDrawColor(180,150,80); doc.setLineWidth(0.4); doc.line(10,42,pw-10,42);
    doc.setTextColor(120,90,30); doc.setFontSize(14); doc.setFont('helvetica','bold');
    doc.text('FreelanceKit', pw/2, 24, {align:'center'});
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(160,130,70);
    doc.text('~ AI-Powered Freelance Toolkit ~', pw/2, 30, {align:'center'});
    const d=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    doc.setFontSize(7.5); doc.setTextColor(160,130,70); doc.text(d, pw/2, 38, {align:'center'});
    // Footer
    doc.setFillColor(250,247,235); doc.rect(10,ph-22,pw-20,12,'F');
    doc.setDrawColor(180,150,80); doc.setLineWidth(0.4); doc.line(10,ph-22,pw-10,ph-22);
    doc.setTextColor(160,130,70); doc.setFontSize(7.5); doc.setFont('helvetica','italic');
    doc.text(`Page ${page} | freelancekit-zeta.vercel.app`, pw/2, ph-14, {align:'center'});
  }

  frame();
  doc.setTextColor(120,90,30); doc.setFontSize(18); doc.setFont('helvetica','bold');
  doc.text(title.length>48?title.substring(0,48)+'...':title, pw/2, 58, {align:'center'});
  doc.setDrawColor(180,150,80); doc.setLineWidth(0.5);
  doc.line(ml+10, 61, pw-ml-10, 61);

  let y=70; const lh=5.8, bot=ph-26;

  for (const item of lines) {
    if(y>bot){page++;doc.addPage();frame();y=48;}
    if(item.type==='empty'){y+=2;continue;}
    if(item.type==='divider'){
      doc.setDrawColor(180,150,80);doc.setLineWidth(0.2);
      doc.line(ml+5,y,pw-ml-5,y);
      doc.setFillColor(180,150,80);doc.circle(pw/2,y,1,'F');
      y+=5;continue;
    }
    if(item.type==='heading'){
      y+=3;if(y>bot-10){page++;doc.addPage();frame();y=48;}
      doc.setTextColor(120,90,30);doc.setFontSize(9.5);doc.setFont('helvetica','bold');
      doc.text(item.text,pw/2,y,{align:'center'});
      doc.setDrawColor(180,150,80);doc.setLineWidth(0.2);
      doc.line(ml+15,y+2,pw-ml-15,y+2);y+=10;continue;
    }
    if(item.type==='keyval'){
      doc.setTextColor(120,90,30);doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.text(item.key||'',ml,y);
      doc.setTextColor(55,65,81);doc.setFont('helvetica','normal');
      const vl=doc.splitTextToSize(item.val||'',cw-42);
      doc.text(vl[0],ml+44,y);
      for(let vi=1;vi<vl.length;vi++){y+=lh;if(y>bot){page++;doc.addPage();frame();y=48;}doc.text(vl[vi],ml+44,y);}
      y+=lh;continue;
    }
    if(item.type==='bullet'){
      doc.setTextColor(160,130,70);doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text('*',ml+2,y);
      doc.setTextColor(55,65,81);doc.setFontSize(9);
      const wl=doc.splitTextToSize(item.text.replace(/^[-*]\s*/,''),cw-8);
      for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=48;}doc.text(w,ml+7,y);y+=lh;}
      continue;
    }
    doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
    const wl=doc.splitTextToSize(item.text,cw);
    for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=48;}doc.text(w,ml,y);y+=lh;}
  }
}

// ── TEMPLATE: Startup Fresh ───────────────────────────────────────────────────
function renderStartup(doc: jsPDF, title: string, lines: ParsedLine[]): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 24, cw = pw - ml - 24;
  let page = 1;

  function frame() {
    doc.setFillColor(255,255,255); doc.rect(0,0,pw,ph,'F');
    // Gradient-like header using layered rects
    doc.setFillColor(5,150,105); doc.rect(0,0,pw,36,'F');
    doc.setFillColor(4,120,87); doc.rect(0,28,pw,8,'F');
    // Diagonal accent
    doc.setFillColor(16,185,129);
    doc.triangle(0,0,40,0,0,36,'F');
    doc.setFillColor(6,95,70);
    doc.triangle(pw-50,0,pw,0,pw,36,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(13); doc.setFont('helvetica','bold');
    doc.text('FreelanceKit', pw/2, 17, {align:'center'});
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(167,243,208);
    doc.text('AI-Powered Freelance Toolkit', pw/2, 24, {align:'center'});
    const d=new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
    doc.setFontSize(7.5); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold');
    doc.text(d, pw-ml, 17, {align:'right'});
    doc.text(`Page ${page}`, pw-ml, 24, {align:'right'});
    // Footer
    doc.setFillColor(240,253,250); doc.rect(0,ph-14,pw,14,'F');
    doc.setDrawColor(5,150,105); doc.setLineWidth(2); doc.line(0,ph-14,pw,ph-14);
    doc.setTextColor(5,150,105); doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    doc.text('freelancekit-zeta.vercel.app', ml, ph-6);
    doc.setTextColor(156,163,175); doc.setFont('helvetica','normal');
    doc.text('Made with FreelanceKit', pw-ml, ph-6, {align:'right'});
  }

  frame();
  doc.setFillColor(240,253,250); doc.roundedRect(ml,40,cw,20,3,3,'F');
  doc.setDrawColor(5,150,105); doc.setLineWidth(0.4); doc.roundedRect(ml,40,cw,20,3,3,'S');
  doc.setTextColor(5,150,105); doc.setFontSize(8); doc.setFont('helvetica','bold');
  doc.text('DOCUMENT TITLE', ml+4, 48);
  doc.setTextColor(17,24,39); doc.setFontSize(14); doc.setFont('helvetica','bold');
  doc.text(title.length>50?title.substring(0,50)+'...':title, ml+4, 57);

  let y=70; const lh=5.8, bot=ph-18;

  for (const item of lines) {
    if(y>bot){page++;doc.addPage();frame();y=45;}
    if(item.type==='empty'){y+=2;continue;}
    if(item.type==='divider'){
      doc.setDrawColor(5,150,105);doc.setLineWidth(0.3);doc.line(ml,y,pw-ml,y);y+=4;continue;
    }
    if(item.type==='heading'){
      y+=2;if(y>bot-12){page++;doc.addPage();frame();y=45;}
      doc.setFillColor(5,150,105);doc.roundedRect(ml,y-4,cw,9,2,2,'F');
      doc.setTextColor(255,255,255);doc.setFontSize(8.5);doc.setFont('helvetica','bold');
      doc.text(item.text,ml+5,y+2);y+=12;continue;
    }
    if(item.type==='keyval'){
      doc.setFillColor(249,250,251);doc.roundedRect(ml,y-4,cw,lh+1,1,1,'F');
      doc.setTextColor(5,150,105);doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.text(item.key||'',ml+3,y);
      doc.setTextColor(17,24,39);doc.setFont('helvetica','normal');
      const vl=doc.splitTextToSize(item.val||'',cw-46);
      doc.text(vl[0],ml+48,y);
      for(let vi=1;vi<vl.length;vi++){y+=lh;if(y>bot){page++;doc.addPage();frame();y=45;}doc.text(vl[vi],ml+48,y);}
      y+=lh;continue;
    }
    if(item.type==='bullet'){
      doc.setFillColor(5,150,105);doc.circle(ml+3,y-1.2,1.2,'F');
      doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
      const wl=doc.splitTextToSize(item.text.replace(/^[-*]\s*/,''),cw-8);
      for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=45;}doc.text(w,ml+7,y);y+=lh;}
      continue;
    }
    doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
    const wl=doc.splitTextToSize(item.text,cw);
    for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=45;}doc.text(w,ml,y);y+=lh;}
  }
}

// ── TEMPLATE: Legal Formal ────────────────────────────────────────────────────
function renderLegal(doc: jsPDF, title: string, lines: ParsedLine[]): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const ml = 30, cw = pw - ml - 30;
  let page = 1; let sectionNum = 0;

  function frame() {
    doc.setFillColor(255,255,255); doc.rect(0,0,pw,ph,'F');
    doc.setDrawColor(17,24,39); doc.setLineWidth(0.8); doc.line(ml-5,20,pw-ml+5,20);
    doc.setTextColor(17,24,39); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('FREELANCEKIT', ml-5, 17);
    doc.setFont('helvetica','normal'); doc.setFontSize(8);
    doc.setTextColor(107,114,128);
    doc.text(`Ref: FL-${Date.now().toString().slice(-6)}`, pw-ml+5, 17, {align:'right'});
    doc.setLineWidth(0.3); doc.line(ml-5,21,pw-ml+5,21);
    doc.setLineWidth(0.8); doc.line(ml-5,ph-20,pw-ml+5,ph-20);
    doc.setLineWidth(0.3); doc.line(ml-5,ph-19,pw-ml+5,ph-19);
    doc.setTextColor(107,114,128); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    doc.text(`Page ${page} of — | Confidential | freelancekit-zeta.vercel.app`, pw/2, ph-14, {align:'center'});
  }

  frame();
  doc.setTextColor(17,24,39); doc.setFontSize(14); doc.setFont('helvetica','bold');
  doc.text(title.toUpperCase().length>50?title.toUpperCase().substring(0,50)+'...':title.toUpperCase(), pw/2, 36, {align:'center'});
  doc.setDrawColor(17,24,39); doc.setLineWidth(0.4); doc.line(ml+10,39,pw-ml-10,39);
  doc.setTextColor(107,114,128); doc.setFontSize(8); doc.setFont('helvetica','italic');
  doc.text(`Prepared by FreelanceKit | ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}`, pw/2, 46, {align:'center'});
  doc.setDrawColor(17,24,39); doc.setLineWidth(0.4); doc.line(ml+10,49,pw-ml-10,49);

  let y=60; const lh=5.8, bot=ph-25;

  for (const item of lines) {
    if(y>bot){page++;doc.addPage();frame();y=30;}
    if(item.type==='empty'){y+=2;continue;}
    if(item.type==='divider'){
      doc.setDrawColor(17,24,39);doc.setLineWidth(0.3);doc.line(ml,y,pw-ml,y);y+=4;continue;
    }
    if(item.type==='heading'){
      sectionNum++;y+=3;
      if(y>bot-10){page++;doc.addPage();frame();y=30;}
      doc.setTextColor(17,24,39);doc.setFontSize(9.5);doc.setFont('helvetica','bold');
      doc.text(`${sectionNum}. ${item.text}`,ml,y);
      doc.setDrawColor(17,24,39);doc.setLineWidth(0.2);doc.line(ml,y+2,pw-ml,y+2);
      y+=9;continue;
    }
    if(item.type==='keyval'){
      doc.setTextColor(17,24,39);doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.text(item.key||'',ml,y);
      doc.setFont('helvetica','normal');
      const vl=doc.splitTextToSize(item.val||'',cw-42);
      doc.text(vl[0],ml+44,y);
      for(let vi=1;vi<vl.length;vi++){y+=lh;if(y>bot){page++;doc.addPage();frame();y=30;}doc.text(vl[vi],ml+44,y);}
      y+=lh;continue;
    }
    if(item.type==='bullet'){
      doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
      const wl=doc.splitTextToSize(item.text.replace(/^[-*]\s*/,''),cw-8);
      for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=30;}doc.text('(i) '+w,ml+3,y);y+=lh;}
      continue;
    }
    doc.setTextColor(55,65,81);doc.setFontSize(9);doc.setFont('helvetica','normal');
    const wl=doc.splitTextToSize(item.text,cw);
    for(const w of wl){if(y>bot){page++;doc.addPage();frame();y=30;}doc.text(w,ml,y);y+=lh;}
  }
}

// ── Main export function ───────────────────────────────────────────────────────
export function exportToPDF({ title, content, filename, template = 'executive' }: PDFOptions): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const lines = parseLines(content);

  switch (template) {
    case 'minimal':   renderMinimal(doc, title, lines); break;
    case 'agency':    renderAgency(doc, title, lines); break;
    case 'classic':   renderClassic(doc, title, lines); break;
    case 'tech':      renderTech(doc, title, lines); break;
    case 'elegant':   renderElegant(doc, title, lines); break;
    case 'startup':   renderStartup(doc, title, lines); break;
    case 'legal':     renderLegal(doc, title, lines); break;
    default:          renderExecutive(doc, title, lines); break;
  }

  doc.save(filename.replace(/\.(txt|pdf)$/, '') + '.pdf');
}
