import { Copy, Download, RotateCcw, CheckCheck, FileDown } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard, downloadText } from '../utils/helpers';
import { PDFTemplatePicker } from './PDFTemplatePicker';
import { useApp } from '../context/AppContext';

interface OutputPreviewProps {
  content: string;
  filename?: string;
  title?: string;
  onReset?: () => void;
  children?: React.ReactNode;
}

export function OutputPreview({
  content,
  filename = 'output.txt',
  title = 'Document',
  onReset,
  children,
}: OutputPreviewProps) {
  const { addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [showPDFPicker, setShowPDFPicker] = useState(false);

  async function handleCopy() {
    try {
      await copyToClipboard(content);
      setCopied(true);
      addToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Failed to copy.', 'error');
    }
  }

  function handleDownloadTxt() {
    downloadText(filename, content);
    addToast('Text file downloaded!', 'success');
  }

  return (
    <>
      <div className="space-y-4">
        {/* Action bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">{children}</div>
          <div className="flex items-center gap-2">
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RotateCcw size={13} />
                Start Over
              </button>
            )}
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors shadow-card"
            >
              <Download size={13} />
              .txt
            </button>
            <button
              onClick={() => setShowPDFPicker(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 border border-rose-500 px-3 py-1.5 rounded-lg transition-colors shadow-card"
            >
              <FileDown size={13} />
              PDF ▾
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg transition-all shadow-card ${
                copied
                  ? 'bg-teal-500 text-white border border-teal-500'
                  : 'bg-teal-600 text-white border border-teal-600 hover:bg-teal-700'
              }`}
            >
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Document preview */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-card overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-300" />
              <span className="w-3 h-3 rounded-full bg-amber-300" />
              <span className="w-3 h-3 rounded-full bg-green-300" />
            </div>
            <span className="text-xs text-gray-400 font-mono ml-2">{filename}</span>
          </div>
          <pre className="p-6 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[500px] overflow-y-auto">
            {content}
          </pre>
        </div>
      </div>

      {/* PDF Template Picker Modal */}
      {showPDFPicker && (
        <PDFTemplatePicker
          content={content}
          title={title}
          filename={filename}
          onClose={() => setShowPDFPicker(false)}
        />
      )}
    </>
  );
}
