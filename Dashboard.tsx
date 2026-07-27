import React from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/20";
      case "error":
        return "border-red-500/20 bg-red-50/90 dark:bg-red-950/20";
      case "warning":
        return "border-amber-500/20 bg-amber-50/90 dark:bg-amber-950/20";
      default:
        return "border-sky-500/20 bg-sky-50/90 dark:bg-sky-950/20";
    }
  };

  return (
    <div id="toast-container" className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border glass-panel shadow-lg ${getBg(toast.type)}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
              {toast.message}
            </div>
            <button
              id={`dismiss-toast-${toast.id}`}
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
