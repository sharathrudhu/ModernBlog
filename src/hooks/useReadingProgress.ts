import { useState, useEffect, useCallback } from 'react';
import type { ReadingProgressSection } from '@/types/blog';

export function useReadingProgress() {
  const [sections, setSections] = useState<ReadingProgressSection[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [overallProgress, setOverallProgress] = useState(0);

  const initializeSections = useCallback(() => {
    const headings = document.querySelectorAll('h1, h2, h3');
    const newSections: ReadingProgressSection[] = Array.from(headings).map((heading, index) => ({
      id: `section-${index}`,
      title: heading.textContent || '',
      progress: 0,
      element: heading
    }));
    
    setSections(newSections);
  }, []);

  const updateProgress = useCallback(() => {
    if (sections.length === 0) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const overallProg = Math.min((scrollTop / docHeight) * 100, 100);
    setOverallProgress(overallProg);

    // Find current section based on scroll position
    let currentSectionId = '';
    const updatedSections = sections.map((section) => {
      if (!section.element) return section;

      const rect = section.element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      const elementHeight = rect.height;
      
      // Check if section is in viewport
      if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
        currentSectionId = section.id;
      }

      // Calculate progress for this section
      const sectionProgress = Math.max(0, Math.min(100, 
        ((scrollTop - elementTop + window.innerHeight / 2) / elementHeight) * 100
      ));

      return {
        ...section,
        progress: sectionProgress
      };
    });

    setSections(updatedSections);
    setCurrentSection(currentSectionId);
  }, [sections]);

  useEffect(() => {
    // Initialize sections after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeSections, 100);
    return () => clearTimeout(timer);
  }, [initializeSections]);

  useEffect(() => {
    if (sections.length === 0) return;

    const handleScroll = () => updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateProgress, sections.length]);

  return {
    sections,
    currentSection,
    overallProgress,
    initializeSections
  };
}