import React, { useState } from "react";
import { SlashCommand, ExtensionConfig } from "../types";
import { 
  Download, Plus, Trash2, Settings, Sliders, Sparkles, 
  Code, Info, ChevronRight, HelpCircle, AlertTriangle 
} from "lucide-react";
import JSZip from "jszip";
import { 
  getManifestTemplate, getCsprojTemplate, getPackageVsctTemplate, 
  getPackageTemplate, getChatWindowTemplate, getChatWindowCommandTemplate, 
  getChatWindowControlXamlTemplate, getChatWindowControlCsTemplate, 
  getPropertiesAssemblyInfoTemplate, getWebviewHtmlTemplate, getReadmeTemplate,
  getSlnTemplate, getBackendCsprojTemplate, getBackendProgramCsTemplate,
  getBackendChatControllerCsTemplate, getBackendHealthControllerCsTemplate,
  getBackendGeminiServiceCsTemplate, getBackendChatModelsCsTemplate,
  getBackendAppSettingsTemplate, getGitignoreTemplate
} from "../utils/extensionTemplates";

interface Props {
  config: ExtensionConfig;
  onChange: (newConfig: ExtensionConfig) => void;
}

export default function ExtensionConfigurator({ config, onChange }: Props) {
  const [newCommand, setNewCommand] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleMetaChange = (key: keyof ExtensionConfig, value: string) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  const addSlashCommand = () => {
    if (!newCommand || !newPrompt) return;
    const formattedCommand = newCommand.startsWith("/") ? newCommand : `/${newCommand}`;
    
    const commandObj: SlashCommand = {
      id: Math.random().toString(36).substring(7),
      command: formattedCommand.toLowerCase(),
      description: newDesc || `Run ${formattedCommand} action`,
      systemPrompt: newPrompt
    };

    onChange({
      ...config,
      slashCommands: [...config.slashCommands, commandObj]
    });

    setNewCommand("");
    setNewDesc("");
    setNewPrompt("");
  };

  const removeSlashCommand = (id: string) => {
    onChange({
      ...config,
      slashCommands: config.slashCommands.filter(c => c.id !== id)
    });
  };

  // Triggers client-side zipping of complete C# Visual Studio SDK package
  const triggerPackageDownload = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      // Folder structure creation
      zip.file(".gitignore", getGitignoreTemplate());
      zip.file("aistudiochatbotintegrator.sln", getSlnTemplate(config, "aistudiochatbotintegrator", "aistudiochatbotintegrator.csproj"));
      zip.file("source.extension.vsixmanifest", getManifestTemplate(config, "aistudiochatbotintegrator"));
      zip.file("aistudiochatbotintegrator.csproj", getCsprojTemplate(config, "aistudiochatbotintegrator"));
      zip.file("MyAIStudioExtensionPackage.vsct", getPackageVsctTemplate(config));
      zip.file("MyAIStudioExtensionPackage.cs", getPackageTemplate(config));
      zip.file("ChatWindow.cs", getChatWindowTemplate(config));
      zip.file("ChatWindowCommand.cs", getChatWindowCommandTemplate());
      zip.file("ChatWindowControl.xaml", getChatWindowControlXamlTemplate());
      zip.file("ChatWindowControl.xaml.cs", getChatWindowControlCsTemplate());
      zip.file("index.html", getWebviewHtmlTemplate(config));
      zip.file("README.md", getReadmeTemplate(config));

      // C# ASP.NET Core MVC Backend Folder
      const backendFolder = zip.folder("backend");
      if (backendFolder) {
        backendFolder.file("MyAIStudioBackend.csproj", getBackendCsprojTemplate());
        backendFolder.file("Program.cs", getBackendProgramCsTemplate());
        backendFolder.file("appsettings.json", getBackendAppSettingsTemplate(config));
        
        const controllersFolder = backendFolder.folder("Controllers");
        if (controllersFolder) {
          controllersFolder.file("ChatController.cs", getBackendChatControllerCsTemplate(config));
          controllersFolder.file("HealthController.cs", getBackendHealthControllerCsTemplate());
        }

        const servicesFolder = backendFolder.folder("Services");
        if (servicesFolder) {
          servicesFolder.file("GeminiApiService.cs", getBackendGeminiServiceCsTemplate());
        }

        const modelsFolder = backendFolder.folder("Models");
        if (modelsFolder) {
          modelsFolder.file("ChatModels.cs", getBackendChatModelsCsTemplate());
        }
      }

      // Assembly Properties folder
      const propertiesFolder = zip.folder("Properties");
      if (propertiesFolder) {
        propertiesFolder.file("AssemblyInfo.cs", getPropertiesAssemblyInfoTemplate(config));
      }

      // Resources folder (empty folders or placeholder files)
      const resourcesFolder = zip.folder("Resources");
      if (resourcesFolder) {
        // We will write an empty text file inside to represent placeholders, or create empty folders
        resourcesFolder.file("placeholder.txt", "This folder contains your VS extension icons: ExtensionIcon.png and ExtensionPreview.png.");
      }

      // Generate the zip binary content
      const content = await zip.generateAsync({ type: "blob" });
      
      // Save trigger
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${config.extensionName.replace(/\s+/g, "")}-VSIX-Boilerplate.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate extension zip file:", err);
      alert("Error generating download package. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full" id="configurator-panel">
      {/* Tab Header */}
      <div className="bg-gray-950 px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-gray-100 text-base">VSIX Plugin Creator</h2>
        </div>
        <span className="text-xs font-mono text-gray-500">Visual Studio 2026 V3</span>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {/* Section 1: Visual Studio Manifest details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 border-b border-gray-800 pb-2">
            <Sliders className="w-4 h-4" />
            <h3 className="text-sm font-semibold tracking-wide uppercase">VSIX Metadata</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center">
                Extension Display Name
                <HelpCircle 
                  className="w-3.5 h-3.5 ml-1 text-gray-500 hover:text-gray-300 cursor-help"
                  onMouseEnter={() => setShowTooltip("name")}
                  onMouseLeave={() => setShowTooltip(null)}
                />
              </label>
              {showTooltip === "name" && (
                <div className="absolute z-10 bg-gray-950 border border-gray-800 p-2 rounded text-xs text-gray-300 max-w-xs mt-1 shadow-lg">
                  The name that appears under Extensions menu and VSIX installer inside Visual Studio.
                </div>
              )}
              <input
                type="text"
                value={config.extensionName}
                onChange={(e) => handleMetaChange("extensionName", e.target.value)}
                className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Author / Publisher</label>
              <input
                type="text"
                value={config.author}
                onChange={(e) => handleMetaChange("author", e.target.value)}
                className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Version Number</label>
              <input
                type="text"
                value={config.version}
                onChange={(e) => handleMetaChange("version", e.target.value)}
                className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target IDE Version</label>
              <select
                value={config.vsVersion || "2026"}
                onChange={(e) => handleMetaChange("vsVersion", e.target.value as "2022" | "2026")}
                className="w-full bg-gray-950 text-indigo-400 font-semibold border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="2026">Visual Studio 2026 (v18.0 / v19.0)</option>
                <option value="2022">Visual Studio 2022 (v17.0)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target Model Alias</label>
              <select
                value={config.defaultModel}
                onChange={(e) => handleMetaChange("defaultModel", e.target.value)}
                className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Heavy Reasoning)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Plugin Description</label>
            <textarea
              rows={2}
              value={config.description}
              onChange={(e) => handleMetaChange("description", e.target.value)}
              className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Section 2: AI Core Config */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 border-b border-gray-800 pb-2">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-sm font-semibold tracking-wide uppercase">Core System Prompt</h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">System Instructions</label>
            <textarea
              rows={3}
              value={config.systemPrompt}
              onChange={(e) => handleMetaChange("systemPrompt", e.target.value)}
              className="w-full bg-gray-950 text-gray-100 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none font-mono text-xs text-indigo-200"
            />
            <p className="text-[10px] text-gray-500 mt-1">This context enforces how Gemini responds to any coding requests within your Visual Studio panels.</p>
          </div>
        </div>

        {/* Section 3: Custom Slash Commands */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 border-b border-gray-800 pb-2">
            <Code className="w-4 h-4" />
            <h3 className="text-sm font-semibold tracking-wide uppercase">Custom Slash Commands</h3>
          </div>

          {/* List of current commands */}
          <div className="space-y-2">
            {config.slashCommands.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No custom commands added yet. Add commands to let developers run shortcuts.</p>
            ) : (
              config.slashCommands.map((cmd) => (
                <div key={cmd.id} className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex items-start justify-between group">
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded">
                        {cmd.command}
                      </span>
                      <span className="text-xs text-gray-300 font-medium">{cmd.description}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono max-h-12 overflow-y-auto custom-scrollbar">
                      {cmd.systemPrompt}
                    </p>
                  </div>
                  <button
                    onClick={() => removeSlashCommand(cmd.id)}
                    className="text-gray-500 hover:text-red-400 transition p-1 rounded hover:bg-red-950 hover:bg-opacity-30 self-center"
                    title="Delete command"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add command inputs */}
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-200">Add Custom Command</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="/refactor"
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                  className="w-full bg-gray-900 text-gray-100 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Optimizes the selected code block"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-gray-900 text-gray-100 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <textarea
                rows={2}
                placeholder="Enforce prompt: 'Rewrite the following code in C# using standard DRY and async-await patterns...'"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="w-full bg-gray-900 text-gray-100 border border-gray-800 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 font-mono resize-none"
              />
            </div>

            <button
              onClick={addSlashCommand}
              disabled={!newCommand || !newPrompt}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-xs font-medium py-1.5 rounded transition flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Command to Package</span>
            </button>
          </div>
        </div>

        {/* Section 4: C# Project Architecture Summary */}
        <div className="bg-gray-950 bg-opacity-40 border border-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 text-gray-300">
            <Info className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold">Visual Studio Solution (.sln) &amp; C# ASP.NET MVC Architecture</span>
          </div>
          <div className="font-mono text-[10px] text-gray-400 space-y-1 pl-2 border-l-2 border-indigo-900">
            <div>📦 <span className="text-indigo-300 font-semibold">MyAIStudioExtension.sln</span> (Multi-Project Visual Studio Solution)</div>
            <div className="pl-3">├── 🛠️ <span className="text-purple-300 font-semibold">MyAIStudioExtension.csproj</span> (Visual Studio VSIX Client)</div>
            <div className="pl-6">├── 📄 source.extension.vsixmanifest (VS Targeting &amp; Identity)</div>
            <div className="pl-6">├── 📄 MyAIStudioExtensionPackage.cs (Package Entry Thread)</div>
            <div className="pl-6">├── 📄 ChatWindowControl.xaml / .cs (WPF WebView2 Host)</div>
            <div className="pl-6">└── 📄 index.html (Embedded Chat Runtime)</div>
            <div className="pl-3">└── 🌐 <span className="text-green-300 font-semibold">backend / MyAIStudioBackend.csproj</span> (ASP.NET Core MVC C# Web API)</div>
            <div className="pl-6">├── 📄 Program.cs (ASP.NET Core WebHost Bootstrapper)</div>
            <div className="pl-6">├── 📄 Controllers / ChatController.cs (ASP.NET MVC API)</div>
            <div className="pl-6">├── 📄 Controllers / HealthController.cs (Health endpoint)</div>
            <div className="pl-6">├── 📄 Services / GeminiApiService.cs (C# Gemini Proxy Service)</div>
            <div className="pl-6">└── 📄 Models / ChatModels.cs (Request / Response DTOs)</div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-950 p-4 border-t border-gray-800 flex flex-col gap-3 shrink-0">
        {/* Warning Callout for VS "Unsupported/Load Failed" issues */}
        <div className="bg-amber-950 bg-opacity-30 border border-amber-900 rounded-lg p-3 text-xs space-y-1 text-amber-200">
          <div className="flex items-center space-x-1.5 font-semibold text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-500" />
            <span className="text-xs">Unsupported Project / Load Failed?</span>
          </div>
          <p className="text-[10px] leading-relaxed text-amber-300">
            By default, Visual Studio doesn't install the extension tooling. If you see the error: <code className="bg-black bg-opacity-40 px-1 py-0.5 rounded text-[10px] font-mono text-amber-200">"The application which this project type is based on was not found"</code>, follow this quick fix:
          </p>
          <ol className="list-decimal list-inside text-[10px] space-y-0.5 text-gray-300 pl-1">
            <li>Open the <strong className="text-white">Visual Studio Installer</strong> on your PC.</li>
            <li>Click <strong className="text-white">Modify</strong> next to your installation (VS 2022 or 2026).</li>
            <li>Under Workloads, check the box for <strong className="text-white">"Visual Studio extension development"</strong>.</li>
            <li>Click Modify. Once installed, reopen <code className="bg-black bg-opacity-40 px-1 py-0.5 rounded text-[9px] font-mono text-indigo-300">MyAIStudioExtension.sln</code>.</li>
          </ol>
        </div>

        <button
          onClick={triggerPackageDownload}
          disabled={isDownloading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg text-sm transition shadow-lg flex items-center justify-center space-x-2 border border-indigo-700 animate-pulse hover:animate-none"
        >
          <Download className="w-5 h-5" />
          <span>
            {isDownloading ? "Zipping C# Boilerplate..." : "Download C# Extension Source Package"}
          </span>
        </button>
        <p className="text-[10px] text-gray-500 text-center">
          Generates buildable C# solution. Target environments: MS Visual Studio 2022 / 2026.
        </p>
      </div>
    </div>
  );
}
