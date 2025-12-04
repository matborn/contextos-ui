import React from 'react';

export const MarkdownRenderer: React.FC<{ content: string; className?: string }> = ({ content, className }) => {
  const lines = content.split('\n');

  return (
    <div className={className}>
      {lines.map((line, i) => {
        // Render empty lines as spacers to preserve paragraph breaks
        if (!line.trim()) return <div key={i} className="h-2" />;

        // Check for bullet points (supports '•' or '-')
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

        // Parse bold markdown: **text**
        // Uses regex splitting to isolate bold parts while keeping the text flow
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        return (
          <div key={i} className={isBullet ? "flex gap-2 pl-1" : ""}>
             {isBullet && <span className="opacity-50 select-none">•</span>}
             <span>{parts}</span>
          </div>
        );
      })}
    </div>
  );
};