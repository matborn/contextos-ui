import React from 'react';
import { DataSource } from '../../types';
import { Database, LinkIcon, FileText, MessageSquare, Check, AlertCircle, Loader2, FilePlus } from '../icons/Icons';
import { cn } from '../../utils';
import { Button } from './Button';

interface ConnectorsProps {
  dataSources: DataSource[];
  onAddSource?: () => void;
}

export const Connectors: React.FC<ConnectorsProps> = ({ dataSources, onAddSource }) => {
  const getIcon = (type: DataSource['type']) => {
    switch(type) {
      case 'confluence': return <FileText size={16} />;
      case 'slack': return <MessageSquare size={16} />;
      case 'gdrive': return <Database size={16} />;
      case 'web': return <LinkIcon size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch(status) {
      case 'synced': return 'text-green-500 bg-green-50';
      case 'syncing': return 'text-blue-500 bg-blue-50';
      case 'error': return 'text-red-500 bg-red-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            Signal Sources
            <span className="bg-slate-100 text-slate-600 py-0.5 px-1.5 rounded-full text-[10px]">{dataSources.length}</span>
        </h3>
      </div>
      
      <div className="space-y-2">
        {dataSources.map((source) => (
          <div key={source.id} className="group flex items-center p-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer">
            <div className={cn("w-8 h-8 rounded-md flex items-center justify-center mr-3 shrink-0", 
              source.type === 'slack' ? 'bg-[#4A154B]/10 text-[#4A154B]' : 
              source.type === 'confluence' ? 'bg-[#0052CC]/10 text-[#0052CC]' :
              source.type === 'gdrive' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-600'
            )}>
              {getIcon(source.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{source.name}</p>
              <div className="flex items-center gap-2">
                  <p className="text-[10px] text-slate-500">
                    {source.status === 'syncing' ? 'Indexing...' : `Last sync: ${source.lastSync}`}
                  </p>
              </div>
            </div>

            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", getStatusColor(source.status))}>
               {source.status === 'synced' && <Check size={12} />}
               {source.status === 'syncing' && <Loader2 size={12} className="animate-spin"/>}
               {source.status === 'error' && <AlertCircle size={12} />}
            </div>
          </div>
        ))}
        
        <Button 
            variant="secondary" 
            className="w-full mt-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-300 hover:text-blue-600"
            size="sm"
            onClick={onAddSource}
            leftIcon={<FilePlus size={14} />}
        >
            Connect Data Source
        </Button>
      </div>
    </div>
  );
};
