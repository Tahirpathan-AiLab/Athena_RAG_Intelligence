import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const STYLES = {
  success: { icon: CheckCircle2, className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  info: { icon: Info, className: 'border-accent-500/30 bg-accent-600/10 text-accent-400' },
  error: { icon: AlertTriangle, className: 'border-red-500/30 bg-red-500/10 text-red-400' },
};

export default function Toast() {
  const { toast } = useChat();
  if (!toast) return null;
  const style = STYLES[toast.kind] || STYLES.success;
  const Icon = style.icon;

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0">
      <div
        className={`animate-slide-up flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium shadow-2xl backdrop-blur bg-surface-200/95 ${style.className}`}
      >
        <Icon size={16} />
        {toast.message}
      </div>
    </div>
  );
}
