'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Eye, X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import LuxuryButton from '@/components/ui/LuxuryButton';
import { useLocale } from '@/lib/i18n-client';

type Props = {
  brochureUrl?: string;
  galleryImages?: string[];
  projectName?: string;
};

export default function DocsBlock({ brochureUrl, galleryImages = [], projectName = 'Project' }: Props) {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const locale = useLocale();
  const isAr = locale === 'ar';

  const hasDocs = brochureUrl || galleryImages.length > 0;

  if (!hasDocs) return null;

  // Create proxy URL for PDF to avoid CORS issues
  const getProxyPdfUrl = (url: string) => {
    if (!url) return '';
    // Use our internal proxy
    return `/api/proxy/pdf?url=${encodeURIComponent(url)}`;
  };

  // Use Google Docs viewer as fallback
  const getGoogleDocsUrl = (url: string) => {
    if (!url) return '';
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-[var(--gold)]" />
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-amber-300">
          {isAr ? 'المستندات' : 'Documents'}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {brochureUrl && (
          <div className="bg-gradient-to-br from-zinc-900 to-[#0a0f1a] border border-[var(--gold)]/30 rounded-lg p-6 hover:border-[var(--gold)] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[var(--gold)]" />
              <h3 className="text-xl font-semibold text-gray-200">
                {isAr ? 'الكتيب' : 'Brochure'}
              </h3>
            </div>
            <div className="flex gap-3">
              <LuxuryButton
                onClick={() => {
                  setPdfError(false);
                  setShowPDF(true);
                }}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                {isAr ? 'عرض' : 'View'}
              </LuxuryButton>
              <LuxuryButton
                variant="outline"
                onClick={() => window.open(brochureUrl, '_blank')}
                className="flex items-center justify-center gap-2 px-4"
                title={isAr ? 'تحميل' : 'Download'}
              >
                <Download className="w-5 h-5" />
              </LuxuryButton>
            </div>
          </div>
        )}

        {galleryImages.length > 0 && (
          <div className="bg-gradient-to-br from-zinc-900 to-[#0a0f1a] border border-[var(--gold)]/30 rounded-lg p-6 hover:border-[var(--gold)] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-[var(--gold)]" />
              <h3 className="text-xl font-semibold text-gray-200">
                {isAr ? 'الصور' : 'Images'}
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {galleryImages.length} {isAr ? 'صورة' : 'images'}
            </p>
          </div>
        )}
      </div>

      {/* PDF Modal Viewer */}
      {showPDF && brochureUrl && (
        <div className="fixed inset-0 z-[9999] bg-[#0a0f1a] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-gold/30">
            <h3 className="text-lg font-semibold text-gold truncate flex-1">{projectName} - {isAr ? 'الكتيب' : 'Brochure'}</h3>
            <div className="flex items-center gap-2">
              <LuxuryButton
                variant="outline"
                size="sm"
                onClick={() => setShowPDF(false)}
                className="!w-10 !h-10 !p-0 rounded-full"
              >
                <X className="w-5 h-5" />
              </LuxuryButton>
            </div>
          </div>
          
          {/* PDF Viewer Container */}
          <div className="flex-1 w-full bg-zinc-800 relative">
            {!pdfError ? (
              <iframe
                src={getGoogleDocsUrl(brochureUrl)}
                className="w-full h-full border-0"
                style={{ minHeight: 'calc(100vh - 60px)' }}
                onError={() => setPdfError(true)}
                title={`${projectName} Brochure`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FileText className="w-16 h-16 text-gold/50 mb-4" />
                <p className="text-gray-400 mb-4">
                  {isAr ? 'لا يمكن عرض الملف في المتصفح' : 'Unable to display PDF in browser'}
                </p>
                <LuxuryButton
                  onClick={() => window.open(brochureUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  {isAr ? 'تحميل الملف' : 'Download PDF'}
                </LuxuryButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
