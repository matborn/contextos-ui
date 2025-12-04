
import React from 'react';
import { PageHeader, PageHeaderProps } from './PageHeader';
import { cn } from '../../utils';

interface PageLayoutProps extends Partial<PageHeaderProps> {
  children: React.ReactNode;
  /** 
   * If true (default), the page handles scrolling for the content.
   * If false, the content area is fixed height (flex-1) and children must handle scrolling.
   * Use false for maps, split-panes, or complex dashboards.
   */
  isScrollable?: boolean;
  maxWidth?: '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  contentClassName?: string;
  hideHeader?: boolean; // New prop to optionally hide the header
  subHeader?: React.ReactNode; // New prop for the secondary header row
  headerActions?: React.ReactNode; // Actions to be placed inside the main PageHeader (right side)
  headerTabs?: React.ReactNode; // Tabs to be placed inside the main PageHeader (bottom row)
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  isScrollable = true,
  maxWidth = '6xl',
  contentClassName,
  className, // PageHeader className
  hideHeader = false,
  subHeader,
  headerActions,
  headerTabs,
  title,
  ...headerProps
}) => {
  
  const maxWClass = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'w-full',
  }[maxWidth];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden font-sans">
      {!hideHeader && title && (
        <PageHeader title={title} className={className} tabBar={headerTabs} {...headerProps}>
            {headerActions}
        </PageHeader>
      )}

      {/* Render the SubHeader if provided */}
      {subHeader}
      
      {isScrollable ? (
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className={cn(
            "mx-auto p-6 md:p-8 space-y-8", 
            maxWClass,
            contentClassName
          )}>
            {children}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
