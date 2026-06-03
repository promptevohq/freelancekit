import { useState } from 'react';
import { X, FileDown, Check } from 'lucide-react';
import { PDF_TEMPLATES, exportToPDF, type PDFTemplate } from '../utils/pdfExport';
import { useApp } from '../context/AppContext';

interface PDFPickerProps {
  content: string;
  title: string;
  filename: string;
  onClose: () => void;
}

export function PDFTemplatePicker({ content, title, filename, onClose }: PDFPickerProps) {
  const { addToast } = useApp();
  const [selected, setSelected] = useState<PDFTemplate>('executive');
  const [downloading, setDownloading] = useState(false);

  function handleDownload() {
    setDownloading(true);
    try {
      exportToPDF({ title, content, filename, template: selected });
      addToast('PDF downloaded!', 'success');
      onClose();
    } catch {
      addToast('PDF export failed.', 'error');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-panel w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-display text-[15px] font-700 text-gray-900">Choose PDF Template</h2>
              <p className="text-xs text-gray-500 mt-0.5">Select a style for your downloaded PDF</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Templates grid */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-2 gap-3">
              {PDF_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelected(tpl.id)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                    selected === tpl.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {selected === tpl.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className="text-2xl mb-2">{tpl.preview}</div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{tpl.name}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50">
            <p className="text-xs text-gray-500">
              Selected: <span className="font-semibold text-gray-700">
                {PDF_TEMPLATES.find(t => t.id === selected)?.name}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
              >
                <FileDown size={14} />
                {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
