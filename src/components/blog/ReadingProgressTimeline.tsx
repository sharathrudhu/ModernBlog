import { useEffect, useRef } from 'react';
import { Clock, BookOpen, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useReadingProgress } from '@/hooks/useReadingProgress';

interface ReadingProgressTimelineProps {
  readingTime: number;
}

export function ReadingProgressTimeline({ readingTime }: ReadingProgressTimelineProps) {
  const { sections, currentSection, overallProgress } = useReadingProgress();
  const timelineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline to current section
  useEffect(() => {
    if (currentSection && timelineRef.current) {
      const currentElement = timelineRef.current.querySelector(`[data-section="${currentSection}"]`);
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSection]);

  const scrollToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.element) {
      section.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const estimatedTimeRemaining = Math.max(0, readingTime - (readingTime * overallProgress / 100));

  return (
    <Card className="sticky top-24 w-80 p-6 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-2">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Reading Progress
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {Math.round(overallProgress)}%
              </div>
            </div>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <Progress value={overallProgress} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{Math.round(estimatedTimeRemaining)} min left</span>
              </div>
              <span>{readingTime} min total</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Article Sections
          </h4>
          
          <ScrollArea className="h-[400px] pr-4" ref={timelineRef}>
            <div className="space-y-1">
              {sections.map((section, index) => {
                const isActive = section.id === currentSection;
                const isCompleted = section.progress >= 80;
                
                return (
                  <div
                    key={section.id}
                    data-section={section.id}
                    className={`relative group cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 border-l-2 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <div className="flex items-start gap-3 p-3 rounded-r-md">
                      {/* Timeline Dot */}
                      <div className="relative flex-shrink-0 mt-1">
                        <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500' 
                            : isActive 
                              ? 'bg-primary border-primary' 
                              : 'bg-background border-muted-foreground/30'
                        }`}>
                          {isCompleted && (
                            <CheckCircle className="w-3 h-3 text-white -mt-[1px] -ml-[1px]" />
                          )}
                        </div>
                        
                        {/* Connecting Line */}
                        {index < sections.length - 1 && (
                          <div className={`absolute top-4 left-1/2 w-0.5 h-8 -translate-x-1/2 ${
                            isCompleted ? 'bg-green-200' : 'bg-border'
                          }`} />
                        )}
                      </div>

                      {/* Section Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium leading-snug transition-colors ${
                          isActive ? 'text-primary' : 'text-foreground'
                        }`}>
                          {section.title}
                        </div>
                        
                        {/* Section Progress */}
                        {(isActive || section.progress > 0) && (
                          <div className="mt-2 space-y-1">
                            <Progress 
                              value={section.progress} 
                              className="h-1"
                            />
                            <div className="text-xs text-muted-foreground">
                              {Math.round(section.progress)}% complete
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Reading Stats */}
        <div className="pt-4 border-t space-y-2">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">
                {sections.filter(s => s.progress >= 80).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Sections Read
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">
                {sections.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Total Sections
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}