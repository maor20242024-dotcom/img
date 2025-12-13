'use client';

import { useState } from 'react';
import LuxuryButton from '@/components/ui/LuxuryButton';

type Props = {
  project: any;
  locale?: 'ar' | 'en';
};

type CalculationResult = {
  roi: number;
  monthlyReturn: number;
  yearlyReturn: number;
  totalReturn: number;
  aiRecommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
};

export default function ROICalculator({ project, locale = 'en' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  // حدد سعر البدء من minPriceAED أو price سواءً كان رقماً أو نصاً
  const initialPrice =
    typeof project?.minPriceAED === 'number'
      ? String(project.minPriceAED)
      : typeof project?.price === 'number'
      ? String(project.price)
      : typeof project?.price === 'string'
      ? project.price.replace(/[^\d]/g, '')
      : '';
  const [purchasePrice, setPurchasePrice] = useState(initialPrice);
  const [annualRent, setAnnualRent] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('5');
  const [downPayment, setDownPayment] = useState('25');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const projectTitle = project?.projectName?.en || project?.projectName?.ar || project?.slug || 'Project';
  const onClose = () => setIsOpen(false);

  const texts = {
    ar: {
      title: 'حاسبة العائد على الاستثمار',
      subtitle: 'احسب العائد المتوقع لاستثمارك',
      purchasePrice: 'سعر الشراء (درهم)',
      annualRent: 'الإيجار السنوي (درهم)',
      investmentPeriod: 'فترة الاستثمار (سنوات)',
      downPayment: 'الدفعة المقدمة (%)',
      calculate: 'احسب العائد',
      calculating: 'جاري الحساب...',
      results: 'نتائج الحساب',
      roi: 'العائد على الاستثمار',
      monthlyReturn: 'العائد الشهري',
      yearlyReturn: 'العائد السنوي',
      totalReturn: 'إجمالي العائد',
      aiRecommendation: 'توصية الذكاء الاصطناعي',
      riskLevel: 'مستوى المخاطرة',
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      recalculate: 'إعادة حساب',
      close: 'إغلاق',
      triggerButton: 'حاسبة العائد على الاستثمار'
    },
    en: {
      title: 'ROI Calculator',
      subtitle: 'Calculate your expected investment return',
      purchasePrice: 'Purchase Price (AED)',
      annualRent: 'Annual Rent (AED)',
      investmentPeriod: 'Investment Period (Years)',
      downPayment: 'Down Payment (%)',
      calculate: 'Calculate ROI',
      calculating: 'Calculating...',
      results: 'Calculation Results',
      roi: 'Return on Investment',
      monthlyReturn: 'Monthly Return',
      yearlyReturn: 'Yearly Return',
      totalReturn: 'Total Return',
      aiRecommendation: 'AI Recommendation',
      riskLevel: 'Risk Level',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      recalculate: 'Recalculate',
      close: 'Close',
      triggerButton: 'ROI Calculator'
    }
  };

  const t = texts[locale];

  const calculateROI = () => {
    if (!purchasePrice || !annualRent) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const price = parseFloat(purchasePrice);
      const rent = parseFloat(annualRent);
      const years = parseInt(investmentPeriod);
      const downPercent = parseFloat(downPayment);
      
      const downPaymentAmount = (price * downPercent) / 100;
      const yearlyReturn = rent;
      const monthlyReturn = rent / 12;
      const totalReturn = rent * years;
      const roi = ((totalReturn - downPaymentAmount) / downPaymentAmount) * 100;

      let riskLevel: 'low' | 'medium' | 'high' = 'medium';
      let aiRecommendation = '';

      if (roi > 15) {
        riskLevel = 'low';
        aiRecommendation = locale === 'ar' 
          ? 'استثمار ممتاز! العائد المتوقع مرتفع والمخاطر منخفضة. ننصح بالمتابعة مع هذا الاستثمار.'
          : 'Excellent investment! High expected return with low risk. We recommend proceeding with this investment.';
      } else if (roi > 8) {
        riskLevel = 'medium';
        aiRecommendation = locale === 'ar'
          ? 'استثمار جيد بعائد معقول. تأكد من دراسة السوق والموقع بعناية قبل اتخاذ القرار.'
          : 'Good investment with reasonable return. Make sure to study the market and location carefully before deciding.';
      } else {
        riskLevel = 'high';
        aiRecommendation = locale === 'ar'
          ? 'العائد منخفض نسبياً. ننصح بمراجعة الأسعار أو البحث عن فرص استثمارية أخرى.'
          : 'Relatively low return. We recommend reviewing prices or looking for other investment opportunities.';
      }

      setResult({
        roi,
        monthlyReturn,
        yearlyReturn,
        totalReturn,
        aiRecommendation,
        riskLevel
      });
      setIsCalculating(false);
    }, 1500);
  };

  const resetCalculator = () => {
    setResult(null);
    const resetPrice =
      typeof project?.minPriceAED === 'number'
        ? String(project.minPriceAED)
        : typeof project?.price === 'number'
        ? String(project.price)
        : typeof project?.price === 'string'
        ? project.price.replace(/[^\d]/g, '')
        : '';
    setPurchasePrice(resetPrice);
    setAnnualRent('');
    setInvestmentPeriod('5');
    setDownPayment('25');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* Trigger Button */}
      <LuxuryButton
        variant="primary"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="w-full py-4 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <div className="flex items-center justify-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {t.triggerButton}
        </div>
      </LuxuryButton>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg liquid-glass rounded-2xl border border-yellow-400/30 p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold gold-gradient">{t.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{projectTitle}</p>
              </div>
              <LuxuryButton
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 min-w-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </LuxuryButton>
            </div>

            {!result ? (
              <div className="space-y-6">
                <p className="text-gray-300 text-center">{t.subtitle}</p>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t.purchasePrice}</label>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                      placeholder="1,500,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t.annualRent}</label>
                    <input
                      type="number"
                      value={annualRent}
                      onChange={(e) => setAnnualRent(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                      placeholder="120,000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t.investmentPeriod}</label>
                      <select
                        value={investmentPeriod}
                        onChange={(e) => setInvestmentPeriod(e.target.value)}
                        className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                      >
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t.downPayment}</label>
                      <select
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                      >
                        <option value="10">10%</option>
                        <option value="20">20%</option>
                        <option value="25">25%</option>
                        <option value="30">30%</option>
                        <option value="50">50%</option>
                        <option value="100">100%</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Calculate Button */}
                <LuxuryButton
                  variant="primary"
                  size="lg"
                  onClick={calculateROI}
                  disabled={!purchasePrice || !annualRent || isCalculating}
                  className="w-full py-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? t.calculating : t.calculate}
                </LuxuryButton>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center gold-gradient">{t.results}</h3>

                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold gold-gradient">{result.roi.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">{t.roi}</div>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(result.monthlyReturn)}</div>
                    <div className="text-sm text-gray-400">{t.monthlyReturn}</div>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-blue-400">{formatCurrency(result.yearlyReturn)}</div>
                    <div className="text-sm text-gray-400">{t.yearlyReturn}</div>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-purple-400">{formatCurrency(result.totalReturn)}</div>
                    <div className="text-sm text-gray-400">{t.totalReturn}</div>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-400">{t.riskLevel}:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    result.riskLevel === 'low' ? 'bg-green-400/20 text-green-400' :
                    result.riskLevel === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-red-400/20 text-red-400'
                  }`}>
                    {t[result.riskLevel]}
                  </span>
                </div>

                {/* AI Recommendation */}
                <div className="p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
                  <h4 className="text-yellow-400 font-semibold mb-2">{t.aiRecommendation}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.aiRecommendation}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <LuxuryButton
                    variant="outline"
                    size="md"
                    onClick={resetCalculator}
                    className="flex-1 py-3"
                  >
                    {t.recalculate}
                  </LuxuryButton>
                  <LuxuryButton
                    variant="primary"
                    size="md"
                    onClick={onClose}
                    className="flex-1 py-3 font-semibold"
                  >
                    {t.close}
                  </LuxuryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
