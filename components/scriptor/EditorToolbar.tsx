

import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ChevronLeft, CheckCircle, Lock } from '../icons/Icons';
import { ScriptorDoc } from '../../types';

interface EditorToolbarProps {
  doc: ScriptorDoc;
  projectName?: string;
  onBack: () => void;
  onShare?: () => void;
  onApprove?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ doc, projectName, onBack, onShare, onApprove }) => {
  const statusVariant = doc.status === 'approved' ? 'success' : 'neutral';

  return (
    <div className="h-14 border-b border-slate-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mr-2 flex items-center gap-1 text-xs font-medium transition-colors">
                <ChevronLeft size={14}/> {projectName || 'Project'}
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <h1 className="text-sm font-semibold text-slate-900">{doc.title}</h1>
            <Badge status={statusVariant} className="text-[10px] ml-2">
                {doc.status}
            </Badge>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1">
                <CheckCircle size={12}/> Saved
            </span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <Button size="sm" variant="secondary" leftIcon={<Lock size={14} />} onClick={onShare}>Share</Button>
            <Button size="sm" variant="primary" onClick={onApprove}>Approve</Button>
        </div>
    </div>
  );
};