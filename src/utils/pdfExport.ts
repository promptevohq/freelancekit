import { jsPDF } from 'jspdf';

interface PDFOptions {
  title: string;
  content: string;
  filename: string;
}

export function exportToPDF({ title, content, filename }: PDFOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 22;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = 1;

  function drawPageFrame() {
    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Teal header bar
    doc.setFillColor(13, 148, 136);
    doc.rect(0, 0, pageWidth, 22, 'F');

    // Left accent stripe
    doc.setFillColor(10, 110, 100);
    doc.rect(0, 0, 5, pageHeight, 'F');

    // Header: Logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('FreelanceKit', 12, 14);

    // Header: tagline
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(204, 240, 235);
    doc.text('AI-Powered Freelance Toolkit', 12, 19.5);

    // Header: date (right)
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(dateStr, pageWidth - margin, 15, { align: 'right' });

    // Footer bar
    doc.setFillColor(248, 250, 250);
    doc.rect(0, pageHeight - 14, pageWidth, 14, 'F');

    // Footer top border
    doc.setDrawColor(13, 148, 136);
    doc.setLineWidth(0.5);
    doc.line(5, pageHeight - 14, pageWidth, pageHeight - 14);

    // Footer text
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('freelancekit-zeta.vercel.app', 12, pageHeight - 6);
    doc.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  // ── Page 1 ──────────────────────────────────────────────────────────────────
  drawPageFrame();

  // Document title box
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(margin - 2, 27, contentWidth + 4, 14, 2, 2, 'F');
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin - 2, 27, contentWidth + 4, 14, 2, 2, 'S');

  doc.setTextColor(13, 148, 136);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 2, 37);

  // Content area
  let y = 50;
  const lineHeight = 5.2;
  const bottomLimit = pageHeight - 18;

  // Clean up content — remove ═ and ─ lines, replace with proper styling
  const rawLines = content.split('\n');
  const processedLines: Array<{ text: string; type: 'heading' | 'body' | 'divider' | 'bullet' | 'empty' }> = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      processedLines.push({ text: '', type: 'empty' });
    } else if (/^[═─=\-]{4,}$/.test(trimmed)) {
      processedLines.push({ text: trimmed, type: 'divider' });
    } else if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 3 &&
      trimmed.length < 50 &&
      /[A-Z]/.test(trimmed)
    ) {
      processedLines.push({ text: trimmed, type: 'heading' });
    } else if (/^[•\-✓✗]/.test(trimmed)) {
      processedLines.push({ text: trimmed, type: 'bullet' });
    } else {
      processedLines.push({ text: line, type: 'body' });
    }
  }

  for (const item of processedLines) {
    // Check page overflow
    if (y > bottomLimit) {
      currentPage++;
      doc.addPage();
      drawPageFrame();
      y = 32;
    }

    if (item.type === 'empty') {
      y += 2.5;
      continue;
    }

    if (item.type === 'divider') {
      // Draw a clean teal line instead of ═══ characters
      doc.setDrawColor(13, 148, 136);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4;
      continue;
    }

    if (item.type === 'heading') {
      // Section heading with background
      doc.setFillColor(240, 253, 250);
      doc.rect(margin - 2, y - 4, contentWidth + 4, 7, 'F');
      doc.setTextColor(15, 118, 110);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(item.text, margin, y);
      y += 8;
      continue;
    }

    if (item.type === 'bullet') {
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const wrapped = doc.splitTextToSize(item.text, contentWidth - 4);
      for (const wl of wrapped) {
        if (y > bottomLimit) {
          currentPage++;
          doc.addPage();
          drawPageFrame();
          y = 32;
        }
        doc.text(wl, margin + 2, y);
        y += lineHeight;
      }
      continue;
    }

    // Regular body text
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const wrapped = doc.splitTextToSize(item.text, contentWidth);
    for (const wl of wrapped) {
      if (y > bottomLimit) {
        currentPage++;
        doc.addPage();
        drawPageFrame();
        y = 32;
      }
      doc.text(wl, margin, y);
      y += lineHeight;
    }
  }

  // Save
  doc.save(filename.replace('.txt', '').replace('.pdf', '') + '.pdf');
}
