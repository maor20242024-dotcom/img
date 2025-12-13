"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LuxuryButton from '@/components/ui/LuxuryButton';

interface SectionNavProps {
  project?: any;
  locale?: string;
}

export default function SectionNav({ project, locale = 'ar' }: SectionNavProps) {
  const router = useRouter();
  const [availableSections, setAvailableSections] = useState<{ label: string; hash: string }[]>([]);
  const isRtl = locale === 'ar';

  useEffect(() => {
    const sections = [];

    // Helper function to safely check if element exists
    const elementExists = (selector: string): boolean => {
      try {
        return document.querySelector(selector) !== null;
      } catch (error) {
        console.warn(`SectionNav: Error checking selector ${selector}:`, error);
        return false;
      }
    };

    // Check if sections exist on the page
    if (elementExists('#overview')) {
      sections.push({ 
        label: isRtl ? "نظرة عامة" : "Overview", 
        hash: "#overview" 
      });
    }

    if (elementExists('#gallery')) {
      sections.push({ 
        label: isRtl ? "معرض الصور" : "Gallery", 
        hash: "#gallery" 
      });
    }

    if (elementExists('#tour3d')) {
      sections.push({ 
        label: isRtl ? "جولة ثلاثية الأبعاد" : "3D Tour", 
        hash: "#tour3d" 
      });
    }

    if (elementExists('#map')) {
      sections.push({ 
        label: isRtl ? "الموقع" : "Location", 
        hash: "#map" 
      });
    }

    if (elementExists('#amenities')) {
      sections.push({ 
        label: isRtl ? "المرافق" : "Amenities", 
        hash: "#amenities" 
      });
    }

    if (elementExists('#payment')) {
      sections.push({ 
        label: isRtl ? "خطة الدفع" : "Payment Plan", 
        hash: "#payment" 
      });
    }

    if (elementExists('#contact')) {
      sections.push({ 
        label: isRtl ? "اتصل بنا" : "Contact", 
        hash: "#contact" 
      });
    }

    if (elementExists('#related')) {
      sections.push({ 
        label: isRtl ? "مشاريع مشابهة" : "Related Projects", 
        hash: "#related" 
      });
    }

    setAvailableSections(sections);
  }, [isRtl]);

  const handleClick = (hash: string) => {
    // Scroll smoothly and update URL hash to reflect section navigation
    const element = document.querySelector(hash);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Update the hash in the URL so deep links work again
      try {
        const clean = hash.startsWith('#') ? hash.slice(1) : hash;
        window.location.hash = clean;
      } catch (e) {
        // ignore
      }
    } else {
      console.warn(`SectionNav: target element '${hash}' not found; attempting to set hash anyway.`);
      try {
        const clean = hash.startsWith('#') ? hash.slice(1) : hash;
        window.location.hash = clean;
      } catch (e) {
        // ignore
      }
    }
  };

  if (availableSections.length === 0) {
    return null;
  }

  return (
    <div className="section-nav">
      {availableSections.map((item) => (
        <LuxuryButton
          key={item.hash}
          variant="outline"
          size="sm"
          onClick={() => handleClick(item.hash)}
          className="text-xs"
        >
          {item.label}
        </LuxuryButton>
      ))}
    </div>
  );
}
