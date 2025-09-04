import React, { useState, useEffect } from 'react';
import { Send, Copy, Download, Edit } from 'lucide-react';
import { ThreeDot } from 'react-loading-indicators';
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import Markdown from "react-markdown";
import axios from 'axios';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";
// explicitly load javascript + jsx
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
// optional: theme
import "prismjs/themes/prism-tomorrow.css";

const DisplayPageComponent = () => {
  const [code, setCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [theme, setTheme] = useState('cyber');
  const [loading, setLoading] = useState(false);


  const themes = [
    { value: 'dark', label: 'Dark', bg: 'from-gray-900 via-gray-800 to-gray-700' },
    { value: 'nord', label: 'Nord', bg: 'from-blue-900 via-cyan-900 to-slate-800' }
  ];

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const getCurrentTheme = () => themes.find(t => t.value === theme) || themes[0];
  
  const handleSendCodeForReview = async () => {
    try {
      setLoading(true);
      if (!code.trim()) {
        setCodeOutput("Please enter code to review.");
        setLoading(false);
        return;
      }
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setCodeOutput(response.data);
    } catch (error) {
      console.error("Error sending code for review:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };
  
  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.js';
    a.click();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().bg} relative overflow-hidden`}>
      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 px-6 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                  PAI Code Studio
                </h1>
                <p className="text-white text-sm">Where ideas become reality</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 space-x-4">
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm font-medium">Experience:</span>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-lg text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-300"
              >
                {themes.map(th => (
                  <option key={th.value} value={th.value} className="bg-gray-900 text-white">
                    {th.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className='flex relative z-10 h-[calc(100vh-64px)]'>
        {/* Left Panel - Code Editor */}
        <div className="flex-1 flex flex-col h-full backdrop-blur-xl bg-black/30 border-r border-white/10 overflow-hidden">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <p className='text-white font-semibold'>Input</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => { setCode(''); setCodeOutput(''); }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
              >Reset</button>
              <button 
                onClick={copyCode}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white/80 hover:text-white hover:scale-110"
              >
                <Copy className="text-sm" />
              </button>
              <button 
                onClick={downloadCode}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white/80 hover:text-white hover:scale-110"
              >
                <Download className="text-sm" />
              </button>
            </div>
          </div>
          
          {/* Editor Container - Fixed for scrolling */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) => Prism.highlight(code, Prism.languages.jsx, "jsx")}
                padding={20}
                className="w-full font-mono text-xl bg-transparent text-white focus:outline-none rounded"
                style={{ minHeight: '100%' }}
              />
            </div>
          </div>
          
          {/* Send Button */}
          <div className="absolute bottom-8 right-8">
            <button 
              onClick={handleSendCodeForReview}
              className="group relative p-3 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 shadow-2xl shadow-purple-500/25 transform transition-all duration-300 hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Send className="text-white" />
              <div className="absolute -top-12 right-0 bg-black/80 backdrop-blur-lg text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/20">
                Send
              </div>
            </button>
          </div>
        </div>
        
        {/* Right Panel - Output */}
        <div className="flex-1 flex flex-col backdrop-blur-xl bg-black/20 min-w-0">
          {/* Output Header */}
          <div className="flex items-center justify-between px-6 py-3 backdrop-blur-lg bg-white/5 border-b border-white/10">
            <p className="font-semibold text-white/90">Output</p>
          </div>
          <div className="text-lg font-mono p-5 overflow-y-auto custom-scrollbar break-words">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <ThreeDot variant="bob" color="#8f8f8f" size="small" text="" textColor="" />
              </div>
            ) : (
              <div className="text-white break-words">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {codeOutput}
                </Markdown>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
    `}</style>

    </div>
  );
};

export default DisplayPageComponent;