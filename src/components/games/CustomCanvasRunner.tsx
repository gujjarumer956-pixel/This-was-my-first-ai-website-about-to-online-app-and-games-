import React, { useMemo, useState } from 'react';
import { RotateCcw, Maximize2 } from 'lucide-react';

interface CustomCanvasRunnerProps {
  code: string;
  title: string;
}

export const CustomCanvasRunner: React.FC<CustomCanvasRunnerProps> = ({ code, title }) => {
  const [key, setKey] = useState(0);

  // Wrap user code in a complete self-contained HTML document
  const srcDoc = useMemo(() => {
    // If it's already a full HTML document, use it
    if (code.includes('<!DOCTYPE') || code.includes('<html')) {
      return code;
    }

    // Otherwise, wrap JavaScript/Canvas script in a dark game canvas container
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #090b14;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    canvas {
      display: block;
      background: #000;
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="800" height="500"></canvas>
  <script>
    try {
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas ? canvas.getContext('2d') : null;
      ${code}
    } catch (err) {
      document.body.innerHTML = '<div style="color:#ef4444;padding:20px;font-family:monospace;font-size:13px;"><strong>Execution Error:</strong><br>' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
  }, [code, title, key]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center">
      <div className="w-full flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
        <span className="font-medium text-slate-200">Interactive AI Sandbox Player</span>
        <button
          onClick={() => setKey(k => k + 1)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restart Code
        </button>
      </div>

      <div className="w-full aspect-[4/3] max-h-[520px] bg-black">
        <iframe
          key={key}
          title={title}
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-modals"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};
