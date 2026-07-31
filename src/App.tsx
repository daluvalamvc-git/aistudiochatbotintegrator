import React, { useState } from "react";
import { ExtensionConfig } from "./types";
import ExtensionConfigurator from "./components/ExtensionConfigurator";
import VS2026Simulator from "./components/VS2026Simulator";
import { 
  Sparkles, Code, Download, Terminal, Settings, 
  HelpCircle, ChevronRight, BookOpen, Layers, Play 
} from "lucide-react";

export default function App() {
  const [config, setConfig] = useState<ExtensionConfig>({
    extensionName: "Google AI Studio Chatbot",
    author: "DevTools LLC",
    version: "1.0.0",
    description: "Connects Visual Studio 2026 securely to Google AI Studio to run custom coding commands, prompts, and inject code solutions.",
    defaultModel: "gemini-2.5-flash",
    systemPrompt: "You are an elite coding assistant inside a Visual Studio chatbot tool window. Give concise, well-annotated C# or visual solutions. Do not include verbose introductory explanations.",
    vsVersion: "2026",
    slashCommands: [
      {
        id: "cmd-explain",
        command: "/explain",
        description: "Analyze and explain the selected code step-by-step",
        systemPrompt: "Analyze the selected code block. Explain exactly how it works, what inputs it takes, what outputs it yields, and highlight any potential vulnerabilities or logical fallacies."
      },
      {
        id: "cmd-refactor",
        command: "/refactor",
        description: "Rewrite code to follow async, DRY, and clean patterns",
        systemPrompt: "Refactor the following code. Focus heavily on clean design patterns, optimal time complexity, proper naming conventions, error safety, and async-await standards."
      },
      {
        id: "cmd-fix",
        command: "/fix",
        description: "Analyze code for index boundary bugs and output a fix",
        systemPrompt: "Examine the selected code for semantic mistakes, index/boundary errors, memory leaks, and performance bottlenecks. Output a fully corrected code snippet inside a standard markdown code block."
      }
    ]
  });

  const [activeStepTab, setActiveStepTab] = useState<"prerequisites" | "compile" | "install">("prerequisites");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Premium Header */}
      <header className="bg-gray-950 border-b border-gray-900 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              Visual Studio Chatbot Extension Creator
              <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-900 px-1.5 py-0.5 rounded">VS 2026 Compatible</span>
            </h1>
            <p className="text-xs text-gray-400">Configure, simulate, and download custom AI assistant extensions for your IDE.</p>
          </div>
        </div>

        {/* Info Links */}
        <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium">
          <a href="#quick-start-guide" className="hover:text-indigo-400 transition flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>Developer Guide</span>
          </a>
          <span className="text-gray-800">|</span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Gemini API Connected</span>
          </span>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 overflow-hidden min-h-0">
        {/* Left Configurator Column */}
        <div className="xl:col-span-5 h-full flex flex-col min-h-0">
          <ExtensionConfigurator config={config} onChange={setConfig} />
        </div>

        {/* Right VS 2026 Simulator Column */}
        <div className="xl:col-span-7 h-full flex flex-col min-h-0">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
            {/* Header tab for simulator */}
            <div className="bg-gray-950 px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-gray-100 text-base">Live IDE Extension Simulator</h3>
              </div>
              <span className="text-xs font-mono text-gray-500">Full-Fidelity Active Test Workspace</span>
            </div>

            {/* Quick Helper Tip */}
            <div className="bg-indigo-950 bg-opacity-30 border-b border-indigo-900 p-3 text-xs text-indigo-200 flex items-center space-x-2">
              <span className="bg-indigo-900 text-indigo-300 font-bold px-1.5 py-0.5 rounded text-[10px]">INSTRUCTIONS</span>
              <span>Select code inside the file editor below (e.g., highlight the BubbleSort buggy code), and click one of your custom commands on the right!</span>
            </div>

            {/* The actual high fidelity simulator component */}
            <div className="flex-1 min-h-0 p-4 bg-gray-950">
              <VS2026Simulator config={config} />
            </div>
          </div>
        </div>
      </main>

      {/* Quick Start & Installation Guide */}
      <section className="bg-gray-900 border-t border-gray-800 p-8 shrink-0" id="quick-start-guide">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center space-x-2 text-indigo-400">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">How to Open and Compile Your Downloaded VSIX Solution</h3>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            The downloadable package generated by this builder is a fully modular, production-ready Visual Studio VSIX package project structured in standard C# and WPF (Windows Presentation Foundation) with Microsoft's official WebView2 SDK bindings. Here is how to use it:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3 relative overflow-hidden group hover:border-indigo-500 transition">
              <div className="absolute top-0 right-0 bg-red-950 bg-opacity-50 text-red-400 font-mono text-[9px] px-2 py-0.5 border-l border-b border-red-900 font-semibold">
                TROUBLESHOOTING
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 font-mono">STEP 01</span>
                <Settings className="w-4 h-4 text-gray-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-200">Extract ZIP &amp; Workloads</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Extract the downloaded ZIP completely before opening. Both <code>MyAIStudioExtension.csproj</code> and <code>aistudiochatbotintegrator.csproj</code> are included so Visual Studio finds all project files without path errors.
              </p>
              <div className="bg-indigo-950 bg-opacity-40 border border-indigo-900 rounded p-2 text-[11px] text-indigo-300">
                <strong>If "Load Failed":</strong> Open <em>Visual Studio Installer</em>, click <strong>Modify</strong>, and check <strong>"Visual Studio extension development"</strong> under Workloads.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3 hover:border-indigo-500 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 font-mono">STEP 02</span>
                <Play className="w-4 h-4 text-gray-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-200">Compile &amp; Sandbox Run</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Extract the downloaded ZIP. Double-click the <strong>MyAIStudioExtension.sln</strong> solution file. Press <strong>F5</strong> to launch an <strong>"Experimental Instance"</strong> sandbox window of Visual Studio. Find your docked chatbot window under <strong>View &gt; Other Windows</strong>!
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 font-mono">STEP 03</span>
                <Download className="w-4 h-4 text-gray-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-200">Where to Find .VSIX Installer</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                When you click <strong>Build Solution</strong> in Visual Studio, MSBuild compiles the C# DLLs and automatically packages the installer at <code>\bin\Debug\MyAIStudioExtension.vsix</code> (or <code>\bin\Release\MyAIStudioExtension.vsix</code>).
              </p>
              <div className="bg-emerald-950 bg-opacity-40 border border-emerald-900 rounded p-2 text-[11px] text-emerald-300">
                <strong>VSIX Packaging Enabled:</strong> The <code>&lt;CreateVsixContainer&gt;true&lt;/CreateVsixContainer&gt;</code> property in the <code>.csproj</code> forces MSBuild to output the <code>.vsix</code> installer file into <code>bin\Debug\</code> or <code>bin\Release\</code> during build. Double-click the <code>.vsix</code> file to install it into Visual Studio!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-900 py-6 px-8 text-center text-xs text-gray-500 shrink-0">
        <p>© 2026 Google AI Studio Coding Workspace. Visual Studio, WPF, and VSIX are trademarks of Microsoft Corporation.</p>
        <p className="mt-1 text-gray-600">The Gemini API is integrated securely server-side inside the interactive IDE simulator.</p>
      </footer>
    </div>
  );
}
