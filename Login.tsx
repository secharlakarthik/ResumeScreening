@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Outfit", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

/* Base resets & custom animations */
body {
  font-family: var(--font-sans);
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Glassmorphism components */
.glass-panel {
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  border-width: 1px;
  border-color: rgba(243, 244, 246, 0.6);
}

.dark .glass-panel {
  background-color: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(16px);
  border-width: 1px;
  border-color: rgba(31, 41, 55, 0.6);
}

/* Gradient effects */
.brand-gradient {
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
}

.brand-gradient-hover {
  background: linear-gradient(135deg, #059669 0%, #0891b2 100%);
}

.glow-emerald {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
}

.glow-cyan {
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
}

/* Custom scrollbars */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}
