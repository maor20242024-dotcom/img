"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LuxuryButton from "@/components/ui/LuxuryButton";
import LazyPDF from "./LazyPDF";

interface InternalPDFViewerProps {
  pdfUrl: string;
  projectName?: string;
  onClose: () => void;
}

export default function InternalPDFViewer({ pdfUrl, projectName = "البروشور", onClose }: InternalPDFViewerProps) {
  const params = useParams();
  const locale = params?.locale || 'ar';
  const isRtl = locale === 'ar';
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) {
          nextPage();
        } else {
          prevPage();
        }
      } else if (e.key === 'ArrowRight') {
        if (isRtl) {
          prevPage();
        } else {
          nextPage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isRtl]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${projectName}-brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate PDF viewer URL with page parameter
  const getPDFViewerUrl = () => {
    // Using PDF.js viewer with custom parameters
    return `${pdfUrl}#page=${currentPage}&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0`;
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm border-b border-gold/20">
        <div className="flex items-center gap-4">
          <h2 className={`text-xl font-bold gold-gradient ${isRtl ? 'font-arabic' : 'font-sans'}`}>
            {isRtl ? `بروشور ${projectName}` : `${projectName} Brochure`}
          </h2>
          <div className={`text-sm text-white/60 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
            {isRtl ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Button */}
          <LuxuryButton
            variant="primary"
            size="sm"
            onClick={downloadPDF}
            className={`rounded-lg ${isRtl ? 'font-arabic' : 'font-sans'}`}
            title={isRtl ? 'تحميل البروشور' : 'Download Brochure'}
          >
            📥 {isRtl ? 'تحميل' : 'Download'}
          </LuxuryButton>

          {/* Close Button */}
          <LuxuryButton
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:text-gold p-0 min-w-0"
            title={isRtl ? 'إغلاق' : 'Close'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </LuxuryButton>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
              <p className={`text-white ${isRtl ? 'font-arabic' : 'font-sans'}`}>
                {isRtl ? 'جاري تحميل البروشور...' : 'Loading brochure...'}
              </p>
            </div>
          </div>
        )}

        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-white mb-2 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
                {isRtl ? 'خطأ في تحميل البروشور' : 'Error Loading Brochure'}
              </h3>
              <p className={`text-gray-400 mb-4 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
                {isRtl ? 'لا يمكن عرض البروشور في الوقت الحالي' : 'Unable to display the brochure at this time'}
              </p>
              <LuxuryButton
                variant="primary"
                size="md"
                onClick={downloadPDF}
                className={`rounded-lg ${isRtl ? 'font-arabic' : 'font-sans'}`}
              >
                {isRtl ? 'تحميل البروشور' : 'Download Brochure'}
              </LuxuryButton>
            </div>
          </div>
        ) : (
          <LazyPDF
            src={getPDFViewerUrl()}
            title={`${projectName} Brochure`}
            className="w-full h-full"
            showDownload={false}
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 p-4 bg-black/80 backdrop-blur-sm border-t border-gold/20">
        <LuxuryButton
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={currentPage <= 1}
          className={`rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${isRtl ? 'font-arabic' : 'font-sans'}`}
        >
          {isRtl ? '→ التالي' : '← Previous'}
        </LuxuryButton>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
            className="w-16 px-2 py-1 bg-black/60 border border-gold/30 rounded text-center text-white focus:border-gold focus:outline-none"
          />
          <span className={`text-white/60 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
            / {totalPages}
          </span>
        </div>

        <LuxuryButton
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className={`rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${isRtl ? 'font-arabic' : 'font-sans'}`}
        >
          {isRtl ? '← السابق' : 'Next →'}
        </LuxuryButton>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <p className={`text-white/40 text-sm ${isRtl ? 'font-arabic' : 'font-sans'}`}>
          {isRtl ? 'استخدم الأسهم للتنقل • ESC للخروج' : 'Use arrow keys to navigate • ESC to close'}
        </p>
      </div>
    </div>
  );
}