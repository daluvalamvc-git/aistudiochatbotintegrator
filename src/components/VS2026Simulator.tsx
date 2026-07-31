import React, { useState, useRef, useEffect } from "react";
import { 
  ExtensionConfig, ChatMessage, EditorFile 
} from "../types";
import { 
  Play, Save, Search, Folder, FileCode, User, 
  ChevronRight, ChevronDown, Send, Code2, Sparkles, 
  Check, RefreshCw, X, Eraser, Info, ArrowUpRight,
  Terminal, AlertCircle
} from "lucide-react";

interface Props {
  config: ExtensionConfig;
}

const DEFAULT_EDITOR_FILES: EditorFile[] = [
  {
    name: "ChatController.cs",
    language: "csharp",
    content: `using Microsoft.AspNetCore.Mvc;
using MyAIStudioBackend.Models;
using MyAIStudioBackend.Services;

namespace MyAIStudioBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IGeminiApiService _geminiService;
        private readonly ILogger<ChatController> _logger;

        public ChatController(IGeminiApiService geminiService, ILogger<ChatController> logger)
        {
            _geminiService = geminiService;
            _logger = logger;
        }

        /// <summary>
        /// ASP.NET Core MVC API Endpoint proxying prompts to Google AI Studio Gemini model
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> PostChat([FromBody] ChatRequestDto request)
        {
            if (request == null || request.Messages == null || request.Messages.Count == 0)
            {
                return BadRequest(new ChatResponseDto { Error = "Invalid 'messages' format." });
            }

            _logger.LogInformation("C# ASP.NET MVC ChatController processing request");

            var result = await _geminiService.GenerateContentAsync(request);

            if (!string.IsNullOrEmpty(result.Error))
            {
                return StatusCode(500, result);
            }

            return Ok(result);
        }
    }
}`
  },
  {
    name: "SortAlgorithms.cs",
    language: "csharp",
    content: `using System;

namespace CodeOptimizer
{
    public class SortAlgorithms
    {
        // BUG: This bubble sort algorithm is highly inefficient and contains
        // an index boundary bug which throws an IndexOutOfRangeException.
        // Highlight this block of code and click "/fix" or "/explain"!
        public int[] BubbleSort(int[] array)
        {
            int n = array.Length;
            for (int i = 0; i < n - 1; i++)
            {
                for (int j = 0; j < n; j++) // <-- Index range issue
                {
                    if (array[j] > array[j + 1])
                    {
                        // Swap array elements
                        int temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }
            return array;
        }
    }
}`
  },
  {
    name: "UserController.cs",
    language: "csharp",
    content: `using System;
using System.Threading.Tasks;

namespace MyApp.Controllers
{
    public class UserController
    {
        // TASK: Convert this synchronous null-unsafe method 
        // to an asynchronous null-safe operation with proper validation.
        public User GetUserRecord(string id)
        {
            User user = Database.LoadById(id);
            Console.WriteLine("User details: " + user.Name);
            return user;
        }
    }
}`
  }
];

export default function VS2026Simulator({ config }: Props) {
  const [files, setFiles] = useState<EditorFile[]>(DEFAULT_EDITOR_FILES);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [selection, setSelection] = useState({ start: 0, end: 0, text: "" });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "greet",
      role: "assistant",
      content: "Hello! I am connected to Google AI Studio. Select code in the editor on the left and type a prompt, or click one of the slash command buttons below to test my capabilities!",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chatbot" | "explorer" | "output">("chatbot");
  const [isCsharpExpanded, setIsCsharpExpanded] = useState(true);
  const [selectedInEditor, setSelectedInEditor] = useState(false);
  const [simulatedSelectedText, setSimulatedSelectedText] = useState("");
  const [lastGeneratedCode, setLastGeneratedCode] = useState("");
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [loadedActiveFile, setLoadedActiveFile] = useState(false);
  const [loadedSolutionStructure, setLoadedSolutionStructure] = useState(false);

  // Simulated MSBuild Engine States
  const [showBottomPane, setShowBottomPane] = useState(false);
  const [bottomPaneTab, setBottomPaneTab] = useState<"output" | "errors" | "troubleshoot">("output");
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLog, setBuildLog] = useState<string[]>([]);
  const [buildSuccess, setBuildSuccess] = useState<boolean | null>(null);

  const handleBuildSolution = () => {
    if (isBuilding) return;
    setIsBuilding(true);
    setShowBottomPane(true);
    setBottomPaneTab("output");
    setBuildSuccess(null);
    setBuildLog([]);

    const isVs2026 = config.vsVersion === "2026";
    const vsName = isVs2026 ? "Visual Studio 2026 Community Edition" : "Visual Studio 2022";
    const minVsVersion = isVs2026 ? "18.0" : "17.0";
    const toolsVersion = isVs2026 ? "Current" : "15.0";

    const logSteps = [
      `1>------ Build started: Project: MyAIStudioExtension, Configuration: Debug Any CPU, IDE Target: ${vsName} ------`,
      `1>Validating Project Assets...`,
      `1>Loaded MSBuild tools version "${toolsVersion}" from upgraded development environment.`,
      `1>Detected installed workload: "Visual Studio extension development" -> OK.`,
      `1>Restoring NuGet packages...`,
      `1>NuGet package restore finished in 320ms.`,
      `1>  Installed package Microsoft.VisualStudio.SDK (v${isVs2026 ? "18.0.35012" : "17.0.31902"}) -> OK`,
      `1>  Installed package Microsoft.VSSDK.BuildTools (v17.0.5232) -> OK`,
      `1>  Installed package Microsoft.Web.WebView2 (v1.0.1264.42) -> OK`,
      `1>VSCTCompiling: MyAIStudioExtensionPackage.vsct -> Menus.ctmenu`,
      `1>Compiling classes in namespace "MyAIStudioExtension"...`,
      `1>  SortAlgorithms.cs -> compiled successfully.`,
      `1>  UserController.cs -> compiled successfully.`,
      `1>  MyAIStudioExtensionPackage.cs -> initialized AsyncPackage.`,
      `1>  ChatWindow.cs -> generated Tool Window Pane with GUID f5c6b907-8271-4688-9bb3-96b0153925fb.`,
      `1>  ChatWindowCommand.cs -> mapped Command ID 0x0100.`,
      `1>  ChatWindowControl.xaml.cs -> compiled WPF markup.`,
      `1>Packaging assets into VSIX container...`,
      `1>  Embedding 'index.html' (Web Chat Frontend)...`,
      `1>Validating VSIX Manifest ('source.extension.vsixmanifest')...`,
      `1>  Detected target architecture: amd64 (Required for 64-bit IDE)`,
      `1>MyAIStudioExtension -> C:\\Workspace\\bin\\Debug\\MyAIStudioExtension.dll`,
      `1>Successfully packaged VSIX archive: MyAIStudioExtension.vsix`,
      `2>------ Build started: Project: MyAIStudioBackend (ASP.NET Core MVC), Configuration: Debug Any CPU ------`,
      `2>Restoring NuGet packages for MyAIStudioBackend.csproj...`,
      `2>  Installed package Swashbuckle.AspNetCore (v6.6.2) -> OK`,
      `2>Compiling C# ASP.NET Core MVC Controllers and Services...`,
      `2>  Program.cs -> WebHost built successfully.`,
      `2>  Controllers\\ChatController.cs -> ASP.NET MVC Controller compiled successfully.`,
      `2>  Controllers\\HealthController.cs -> ASP.NET MVC Controller compiled successfully.`,
      `2>  Services\\GeminiApiService.cs -> HttpClient Service compiled successfully.`,
      `2>  Models\\ChatModels.cs -> DTOs compiled successfully.`,
      `2>MyAIStudioBackend -> C:\\Workspace\\backend\\bin\\Debug\\net8.0\\MyAIStudioBackend.dll`,
      `========== Build: 2 succeeded, 0 failed, 0 up-to-date, 0 skipped ==========`
    ];

    let currentStep = 0;
    
    // Add first line instantly
    setBuildLog([logSteps[0]]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < logSteps.length) {
        setBuildLog(prev => [...prev, logSteps[currentStep]]);
      } else {
        clearInterval(interval);
        setIsBuilding(false);
        setBuildSuccess(true);
      }
    }, 120); // Fast log stream simulation
  };

  // Automatically trigger an initial rebuild of the solution on mount/version switch to show it's now fully compatible!
  useEffect(() => {
    const timer = setTimeout(() => {
      handleBuildSolution();
    }, 400);
    return () => clearTimeout(timer);
  }, [config.vsVersion]);

  const handleReadActiveFile = () => {
    const isNowLoaded = !loadedActiveFile;
    setLoadedActiveFile(isNowLoaded);
    if (isNowLoaded) {
      setLoadedSolutionStructure(false); // clear other
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: `📄 **Captured entire active file context (${files[activeFileIndex].name})** into chat memory. You can now prompt me directly about this code block, ask to refactor it, or explain its behavior. I will read and respect the entire document content during generation!`,
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleReadSolutionStructure = () => {
    const isNowLoaded = !loadedSolutionStructure;
    setLoadedSolutionStructure(isNowLoaded);
    if (isNowLoaded) {
      setLoadedActiveFile(false); // clear other
      const formattedList = files.map(f => `- \`${f.name}\``).join('\n');
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: `📂 **Captured entire solution workspace index list!** Available files in Visual Studio Solution:\n\n${formattedList}\n\nYou can ask questions like "Explain UserController.cs" or ask me to write a new class integrating with these.`,
          timestamp: new Date()
        }
      ]);
    }
  };

  const textEditorRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isLoading]);

  // Handle code highlighting/selection within the editor
  const handleEditorSelection = () => {
    const textarea = textEditorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value.substring(start, end);

    if (text.trim().length > 0) {
      setSelection({ start, end, text });
      setSimulatedSelectedText(text);
      setSelectedInEditor(true);
    } else {
      setSelectedInEditor(false);
    }
  };

  // Reset file content
  const resetActiveFile = () => {
    const updated = [...files];
    updated[activeFileIndex] = { ...DEFAULT_EDITOR_FILES[activeFileIndex] };
    setFiles(updated);
    setSimulatedSelectedText("");
    setSelectedInEditor(false);
    setSelection({ start: 0, end: 0, text: "" });
  };

  // Send request to server-side Gemini Proxy `/api/chat`
  const executeChatRequest = async (promptToSend: string, isCommand = false) => {
    if (isLoading) return;
    setIsLoading(true);

    const userMsgId = Math.random().toString(36).substring(7);
    const updatedMessages: ChatMessage[] = [
      ...chatMessages,
      {
        id: userMsgId,
        role: "user",
        content: promptToSend,
        timestamp: new Date(),
        isCommand
      }
    ];

    setChatMessages(updatedMessages);
    setUserInput("");

    try {
      // Build proper full-context prompt with selection if present
      let finalPrompt = promptToSend;
      if (simulatedSelectedText) {
        finalPrompt += `\n\nTarget Selection from Code Editor:\n\`\`\`csharp\n${simulatedSelectedText}\n\`\`\``;
      }
      if (loadedActiveFile) {
        finalPrompt += `\n\nEntire active document content (${files[activeFileIndex].name}):\n\`\`\`csharp\n${files[activeFileIndex].content}\n\`\`\``;
      }
      if (loadedSolutionStructure) {
        finalPrompt += `\n\nAvailable files in Visual Studio Solution:\n${files.map(f => `- ${f.name}`).join('\n')}`;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: finalPrompt }],
          systemPrompt: config.systemPrompt,
          model: config.defaultModel
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Communication failed.");
      }

      const data = await response.json();
      
      // Look for code blocks inside the response to allow C# injection
      const codeBlockMatch = data.text.match(/```(?:csharp|cs|json|javascript)?\n([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        setLastGeneratedCode(codeBlockMatch[1]);
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: data.text,
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: `❌ Error querying Gemini: ${err.message || "Failed to communicate with proxy API."}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!userInput.trim()) return;
    executeChatRequest(userInput, false);
  };

  const handleSlashCommand = (cmd: string, systemPrompt: string) => {
    const textPrompt = `Running command ${cmd}: ${systemPrompt}`;
    executeChatRequest(textPrompt, true);
  };

  // Injects the last generated AI solution back into the simulated C# code editor
  const insertGeneratedCode = () => {
    if (!lastGeneratedCode) return;
    
    const textarea = textEditorRef.current;
    if (!textarea) return;

    const file = files[activeFileIndex];
    let newContent = "";

    // If there is an active text selection, replace it. Otherwise append/replace all
    if (selection.start !== selection.end) {
      newContent = 
        file.content.substring(0, selection.start) + 
        lastGeneratedCode + 
        file.content.substring(selection.end);
    } else {
      // Replace the entire bubble sort method with the solution for demo
      if (activeFileIndex === 0) {
        newContent = file.content.replace(/\/\/ BUG:[\s\S]*?return array;\s*\}/, lastGeneratedCode);
      } else {
        newContent = lastGeneratedCode;
      }
    }

    const updated = [...files];
    updated[activeFileIndex] = { ...file, content: newContent };
    setFiles(updated);

    // Notify success
    setInsertSuccess(true);
    setTimeout(() => setInsertSuccess(false), 3000);
  };

  // Simple formatter to colorize keywords in the simulator log
  const renderMessageContent = (text: string) => {
    // Escapes HTML tags to prevent XSS
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks formatting
    escaped = escaped.replace(/```(?:[a-zA-Z]+)?\n([\s\S]*?)```/g, (match, code) => {
      return `<pre class="bg-gray-950 p-3 rounded border border-gray-800 font-mono text-xs overflow-x-auto text-indigo-100 my-2 shadow-inner leading-relaxed"><code>${code.trim()}</code></pre>`;
    });

    // Inline code formatting
    escaped = escaped.replace(/`(.*?)`/g, '<code class="bg-gray-950 border border-gray-800 px-1 py-0.5 rounded text-indigo-300 font-mono text-xs font-medium">$1</code>');

    // Bold formatting
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

    // Handle line breaks
    escaped = escaped.replace(/\n/g, "<br/>");

    return <div dangerouslySetInnerHTML={{ __html: escaped }} />;
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: "greet",
        role: "assistant",
        content: "Chat log cleared. Select code or type a question to begin.",
        timestamp: new Date()
      }
    ]);
    setLastGeneratedCode("");
  };

  return (
    <div className="bg-[#2D2D30] border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full text-gray-300 text-xs">
      {/* VS Title Bar */}
      <div className="bg-[#1E1E1E] px-4 py-2 flex items-center justify-between border-b border-[#333]">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-gray-200">
            MyAIStudioExtension (Debugging) - Microsoft Visual Studio 2026 (Experimental Instance)
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-gray-500">
          <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span>Live Dev Host</span>
          </span>
          <span>daluvalanokia@gmail.com</span>
        </div>
      </div>

      {/* VS Menu Bar */}
      <div className="bg-[#2D2D30] border-b border-[#222] px-3 py-1 flex items-center space-x-4 text-gray-400 text-[11px] font-medium">
        <span className="hover:text-white cursor-pointer transition">File</span>
        <span className="hover:text-white cursor-pointer transition">Edit</span>
        <span className="hover:text-white cursor-pointer transition">View</span>
        <span className="hover:text-white cursor-pointer transition">Project</span>
        <button 
          onClick={handleBuildSolution}
          className="hover:text-white hover:bg-gray-800 px-1 py-0.5 rounded cursor-pointer transition text-indigo-300 font-semibold flex items-center space-x-1"
          title="Compile extension package for selected Target VS version"
        >
          <span>Build</span>
        </button>
        <span className="hover:text-white cursor-pointer transition">Debug</span>
        <span className="hover:text-white cursor-pointer bg-[#333] px-2 py-0.5 text-gray-100 rounded">Extensions</span>
        <span className="hover:text-white cursor-pointer transition">Help</span>
      </div>

      {/* VS Toolbar */}
      <div className="bg-[#2D2D30] border-b border-[#3F3F46] px-3 py-1.5 flex items-center space-x-3 text-gray-400">
        <button 
          onClick={handleBuildSolution}
          disabled={isBuilding}
          className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#3F3F46] text-[#F1F1F1] px-2.5 py-1 rounded transition border border-indigo-700 shadow-md"
          title="Compile Solution"
        >
          <Code2 className="w-3 h-3 text-indigo-200" />
          <span className="font-semibold text-[10px]">{isBuilding ? "Building..." : "Build Solution"}</span>
        </button>

        <button 
          onClick={() => {
            setShowBottomPane(!showBottomPane);
            if (!showBottomPane) setBottomPaneTab("output");
          }}
          className={`flex items-center space-x-1 px-2 py-1 rounded transition border text-[10px] ${showBottomPane ? "bg-indigo-950 text-indigo-300 border-indigo-900" : "bg-[#3F3F46] hover:bg-[#505050] text-[#F1F1F1] border-[#555]"}`}
          title="Toggle Build Output Pane"
        >
          <Terminal className="w-3 h-3 text-indigo-400" />
          <span>Output Window</span>
        </button>

        <button className="flex items-center space-x-1 bg-[#3F3F46] hover:bg-[#505050] text-[#F1F1F1] px-2 py-1 rounded transition border border-[#555] shadow-sm">
          <Play className="w-3 h-3 text-green-500 fill-green-500" />
          <span className="font-semibold text-[10px]">Start Debug</span>
        </button>

        <span className="text-[#3F3F46] border-l h-5"></span>
        <div className="flex items-center space-x-1 bg-[#1E1E1E] border border-[#3F3F46] rounded px-2 py-0.5 text-[11px] text-gray-400 w-44">
          <Search className="w-3 h-3" />
          <input 
            type="text" 
            placeholder="Search Quick Actions (Ctrl+Q)" 
            className="bg-transparent border-none outline-none text-xs w-full py-0.5"
            disabled
          />
        </div>
        <span className="text-xs italic text-gray-500 pl-2">Simulator connected to Google AI Studio</span>
      </div>

      {/* IDE Layout Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Sub-Sidebars Tab Icons */}
        <div className="w-10 bg-[#252526] border-r border-[#3F3F46] flex flex-col items-center py-2 space-y-4 text-gray-400">
          <button 
            onClick={() => setActiveTab("chatbot")}
            className={`p-2 rounded transition relative ${activeTab === "chatbot" ? "bg-[#2D2D30] text-indigo-400 border-l-2 border-indigo-500" : "hover:bg-[#2D2D30] hover:text-white"}`}
            title="AI Studio Chatbot Extension"
          >
            <Sparkles className="w-5 h-5" />
            <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-indigo-500"></span>
          </button>
          
          <button 
            onClick={() => setActiveTab("explorer")}
            className={`p-2 rounded transition ${activeTab === "explorer" ? "bg-[#2D2D30] text-indigo-400 border-l-2 border-indigo-500" : "hover:bg-[#2D2D30] hover:text-white"}`}
            title="Solution Explorer"
          >
            <Folder className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Sidebar Pane (Solution Explorer) */}
        {activeTab === "explorer" && (
          <div className="w-64 bg-[#252526] border-r border-[#3F3F46] flex flex-col h-full">
            <div className="bg-[#2D2D30] p-2 font-semibold text-gray-200 border-b border-[#3F3F46] flex justify-between items-center">
              <span>Solution Explorer</span>
              <Folder className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 select-none custom-scrollbar text-[11px]">
              <div className="flex items-center space-x-1 text-gray-200 font-semibold">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>MyAIStudioExtension.sln</span>
              </div>
              <div className="pl-4 space-y-2 text-gray-400">
                {/* VSIX Extension Project */}
                <div className="flex items-center space-x-1 text-gray-200">
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>MyAIStudioExtension (VSIX Client)</span>
                </div>
                <div className="pl-4 space-y-1">
                  <div className="flex items-center space-x-1 hover:text-white cursor-pointer" onClick={() => setIsCsharpExpanded(!isCsharpExpanded)}>
                    {isCsharpExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <Folder className="w-3 h-3 text-yellow-600" />
                    <span>Source Files</span>
                  </div>
                  {isCsharpExpanded && (
                    <div className="pl-4 space-y-1 text-[10px]">
                      {files.map((f, idx) => (
                        <div 
                          key={f.name} 
                          onClick={() => {
                            setActiveFileIndex(idx);
                            setSelectedInEditor(false);
                            setSimulatedSelectedText("");
                          }}
                          className={`flex items-center space-x-1 cursor-pointer py-0.5 px-1 rounded ${activeFileIndex === idx ? "bg-indigo-950 text-indigo-200" : "hover:text-white"}`}
                        >
                          <FileCode className="w-3 h-3 text-purple-400" />
                          <span>{f.name}</span>
                        </div>
                      ))}
                      <div className="flex items-center space-x-1 opacity-60">
                        <FileCode className="w-3 h-3 text-blue-400" />
                        <span>ChatWindow.cs</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 opacity-60">
                    <Folder className="w-3 h-3 text-yellow-600" />
                    <span>Resources</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-indigo-950 bg-opacity-20 text-indigo-300 py-0.5 px-1 rounded">
                    <FileCode className="w-3 h-3 text-amber-500" />
                    <span>index.html (WebView)</span>
                  </div>
                </div>

                {/* ASP.NET Core MVC Backend Project */}
                <div className="flex items-center space-x-1 text-green-300 font-semibold pt-1">
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>MyAIStudioBackend (ASP.NET Core MVC)</span>
                </div>
                <div className="pl-4 space-y-1 text-[10px]">
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Folder className="w-3 h-3" />
                    <span>Controllers</span>
                  </div>
                  <div className="pl-4 space-y-0.5">
                    <div 
                      onClick={() => {
                        const chatIdx = files.findIndex(f => f.name === "ChatController.cs");
                        if (chatIdx !== -1) {
                          setActiveFileIndex(chatIdx);
                          setSelectedInEditor(false);
                          setSimulatedSelectedText("");
                        }
                      }}
                      className="flex items-center space-x-1 text-green-400 hover:text-white cursor-pointer py-0.5 px-1 rounded hover:bg-green-950"
                    >
                      <FileCode className="w-3 h-3 text-green-400" />
                      <span>ChatController.cs</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <FileCode className="w-3 h-3" />
                      <span>HealthController.cs</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Folder className="w-3 h-3" />
                    <span>Services</span>
                  </div>
                  <div className="pl-4 text-gray-500">
                    <FileCode className="w-3 h-3 inline mr-1" />
                    <span>GeminiApiService.cs</span>
                  </div>
                  <div className="flex items-center space-x-1 text-indigo-300">
                    <FileCode className="w-3 h-3 text-blue-400" />
                    <span>Program.cs</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <FileCode className="w-3 h-3 text-amber-400" />
                    <span>appsettings.json</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center Code Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1E1E1E] overflow-hidden min-w-0">
          {/* Editor Tabs Row */}
          <div className="bg-[#2D2D30] border-b border-[#1E1E1E] flex items-center justify-between text-[11px]">
            <div className="flex">
              {files.map((file, idx) => (
                <div 
                  key={file.name}
                  onClick={() => {
                    setActiveFileIndex(idx);
                    setSelectedInEditor(false);
                    setSimulatedSelectedText("");
                  }}
                  className={`px-4 py-1.5 border-r border-[#1E1E1E] cursor-pointer flex items-center space-x-2 transition ${activeFileIndex === idx ? "bg-[#1E1E1E] text-white border-t-2 border-indigo-500" : "text-gray-400 hover:bg-[#252526] hover:text-white"}`}
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-400" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={resetActiveFile}
              className="px-3 py-1 text-gray-500 hover:text-gray-300 transition flex items-center space-x-1 hover:bg-[#252526]"
              title="Reset file content"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="text-[10px]">Reset</span>
            </button>
          </div>

          {/* Code Selection Info Banner */}
          {selectedInEditor && (
            <div className="bg-indigo-950 px-4 py-1.5 text-indigo-200 border-b border-indigo-900 flex justify-between items-center text-[10px]">
              <div className="flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>Selected code range captured. Select slash command on the right to optimize!</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedInEditor(false);
                  setSimulatedSelectedText("");
                }}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Interactive Code Editor (TextArea wrapper with C# styling) */}
          <div className="flex-1 relative flex overflow-hidden">
            {/* Mock Line Numbers */}
            <div className="w-10 bg-[#1E1E1E] border-r border-[#2d2d2d] flex flex-col items-end pr-2.5 pt-4 text-gray-600 font-mono text-xs select-none space-y-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable Text Area */}
            <textarea
              ref={textEditorRef}
              value={files[activeFileIndex].content}
              onChange={(e) => {
                const updated = [...files];
                updated[activeFileIndex].content = e.target.value;
                setFiles(updated);
              }}
              onSelect={handleEditorSelection}
              className="flex-1 bg-transparent text-gray-300 font-mono text-xs p-4 focus:outline-none resize-none overflow-y-auto custom-scrollbar h-full leading-relaxed tracking-wide select-text selection:bg-indigo-900 selection:text-white"
              spellCheck="false"
            />
          </div>

          {/* Simulated Bottom Pane (Output / Errors / Troubleshoot) */}
          {showBottomPane && (
            <div className="h-48 border-t border-[#3F3F46] bg-[#1E1E1E] flex flex-col overflow-hidden shrink-0">
              {/* Bottom Pane Headers */}
              <div className="bg-[#2D2D30] border-b border-[#3F3F46] px-3 py-1.5 flex items-center justify-between text-gray-400 select-none shrink-0">
                <div className="flex space-x-4 text-[11px] font-medium items-center">
                  <button 
                    onClick={() => setBottomPaneTab("output")}
                    className={`pb-1 transition px-1 ${bottomPaneTab === "output" ? "text-indigo-400 border-b-2 border-indigo-500 font-semibold" : "hover:text-white"}`}
                  >
                    Output
                  </button>
                  <button 
                    onClick={() => setBottomPaneTab("errors")}
                    className={`pb-1 transition px-1 relative ${bottomPaneTab === "errors" ? "text-indigo-400 border-b-2 border-indigo-500 font-semibold" : "hover:text-white"}`}
                  >
                    <span>Error List</span>
                    <span className="ml-1 px-1 bg-gray-800 text-[9px] text-gray-400 rounded">0</span>
                  </button>
                  <button 
                    onClick={() => setBottomPaneTab("troubleshoot")}
                    className={`pb-1 transition px-1.5 py-0.5 rounded flex items-center space-x-1 ${bottomPaneTab === "troubleshoot" ? "text-amber-400 border-b-2 border-amber-500 font-bold bg-amber-950 bg-opacity-20" : "hover:text-amber-300 text-amber-500 font-semibold bg-amber-950 bg-opacity-10"}`}
                  >
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span>Fix Local "Unsupported" Error 🛠️</span>
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowBottomPane(false)}
                  className="hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Pane Content */}
              <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] leading-relaxed bg-[#111] text-gray-300 custom-scrollbar">
                {bottomPaneTab === "output" ? (
                  buildLog.length === 0 ? (
                    <div className="text-gray-500 italic">No output generated yet. Click "Build Solution" to compile.</div>
                  ) : (
                    <div className="space-y-0.5">
                      {buildLog.map((line, idx) => (
                        <div 
                          key={idx} 
                          className={
                            line.includes("succeeded") 
                              ? "text-green-400 font-bold" 
                              : line.includes("started") 
                              ? "text-indigo-400 font-bold" 
                              : "text-gray-400"
                          }
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  )
                ) : bottomPaneTab === "errors" ? (
                  <div className="space-y-2 font-sans">
                    <div className="flex items-center space-x-1.5 text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="font-semibold text-xs">No active compilation or analyzer errors!</span>
                    </div>
                    <p className="text-gray-400 text-[10px] max-w-xl">
                      Your solution files (<code className="bg-gray-950 px-1 py-0.5 rounded text-indigo-300 font-mono">source.extension.vsixmanifest</code>, <code className="bg-gray-950 px-1 py-0.5 rounded text-indigo-300 font-mono">MyAIStudioExtension.csproj</code>, and solution classes) are fully syntax-valid and targeted correctly.
                    </p>
                    <div className="bg-yellow-950 bg-opacity-35 border border-yellow-900 rounded p-2.5 text-[10px] text-yellow-300 max-w-xl leading-relaxed">
                      <strong className="text-yellow-400 block mb-1">⚠️ Local Unsupported Project / Load Failed Solution</strong>
                      If you download the source package and open it locally on your PC, and Visual Studio displays an <code className="bg-black bg-opacity-40 px-1 py-0.5 rounded text-[10px] text-yellow-200 font-mono">"Unsupported"</code> or load failed message, follow this 1-minute fix:
                      <ol className="list-decimal list-inside mt-1.5 space-y-0.5 text-[10px] text-gray-300 pl-1">
                        <li>Open the <strong className="text-white">Visual Studio Installer</strong> on your computer.</li>
                        <li>Find your installation and click <strong className="text-white">Modify</strong>.</li>
                        <li>Under the <strong className="text-white">Workloads</strong> tab, check <strong className="text-white">"Visual Studio extension development"</strong>.</li>
                        <li>Click <strong className="text-white">Modify</strong>. After installing, re-open the <code className="bg-black bg-opacity-40 px-1 py-0.5 rounded text-indigo-300 font-mono">.sln</code> and it will load perfectly!</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-1 font-sans">
                    <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>How to Resolve: "Unsupported / Unable to open project" in Visual Studio</span>
                    </div>
                    
                    <p className="text-gray-300 text-[11px] leading-relaxed max-w-3xl">
                      If you download this extension code and see an error saying <span className="text-amber-300 font-bold">"This version of Visual Studio is unable to open the following projects... MyAIStudioExtension.csproj"</span>, it means the necessary <strong className="text-indigo-300">Visual Studio Extension development workload</strong> is missing from your computer.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mt-1.5">
                      <div className="bg-gray-950 bg-opacity-65 border border-gray-800 p-3 rounded-lg shadow-inner">
                        <span className="text-amber-400 font-bold text-xs block mb-1.5">🛠️ The 3-Step Resolution:</span>
                        <ol className="list-decimal list-inside space-y-1.5 text-gray-300 text-[10.5px] leading-relaxed">
                          <li>Open the <strong className="text-white font-semibold">Visual Studio Installer</strong> on your computer.</li>
                          <li>Find your installation (VS 2022 or VS 2026) and click <strong className="text-white font-semibold">Modify</strong>.</li>
                          <li>Under the <strong className="text-white font-semibold">Workloads</strong> tab, check <strong className="text-amber-400 font-bold">"Visual Studio extension development"</strong> (in the "Other Toolsets" section).</li>
                          <li>Click <strong className="text-indigo-400 font-bold">Modify</strong> in the bottom-right corner to download and install.</li>
                          <li>Restart Visual Studio and load <code className="bg-black px-1.5 py-0.5 text-indigo-300 font-mono text-[9px] rounded">MyAIStudioExtension.sln</code> — it will load and compile perfectly!</li>
                        </ol>
                      </div>

                      <div className="bg-gray-950 bg-opacity-65 border border-gray-800 p-3 rounded-lg flex flex-col justify-between">
                        <div>
                          <span className="text-indigo-400 font-bold block mb-1.5">💡 Why is this workload required?</span>
                          <p className="text-gray-400 text-[10px] leading-relaxed">
                            VSIX packages are structured as special extensibility projects that rely on Microsoft's MSBuild extension targets (like <code className="text-indigo-300 font-mono text-[9px] bg-black px-1 py-0.5 rounded">Microsoft.VSSDK.BuildTools</code>) and custom project GUIDs. Without this development workload installed, your IDE cannot parse the project file and reports it as "Unsupported".
                          </p>
                        </div>
                        <div className="bg-amber-950 bg-opacity-20 border border-amber-900/60 rounded-md p-2 text-[9.5px] text-amber-300/90 mt-2.5 leading-normal">
                          <strong>💡 Pro Tip:</strong> You can also install the workload via Command Line with:
                          <code className="block mt-1 font-mono text-[9px] text-white bg-black bg-opacity-50 px-1.5 py-0.5 rounded select-all">vs_installer.exe --add Microsoft.VisualStudio.Workload.VisualStudioExtension</code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Sidebar Pane (Right Docked Chatbot Tool Window) */}
        {activeTab === "chatbot" && (
          <div className="w-80 bg-[#1E1E1E] border-l border-[#3F3F46] flex flex-col h-full min-w-0">
            {/* Tool Window Header */}
            <div className="bg-[#2D2D30] px-3 py-2 border-b border-[#3F3F46] flex items-center justify-between text-gray-200">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">{config.extensionName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={clearChat} className="text-gray-500 hover:text-gray-300 p-0.5 rounded" title="Clear Chat Log">
                  <Eraser className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-900">
                  {config.defaultModel}
                </span>
              </div>
            </div>

            {/* Active Extension Selection Context Indicator */}
            {selectedInEditor ? (
              <div className="bg-[#252526] px-3 py-1.5 border-b border-[#3F3F46] text-[10px] flex items-center justify-between">
                <span className="text-green-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>Active code selection captured</span>
                </span>
                <button 
                  onClick={() => {
                    setSelectedInEditor(false);
                    setSimulatedSelectedText("");
                  }}
                  className="text-gray-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="bg-yellow-950 bg-opacity-30 px-3 py-1.5 border-b border-yellow-900 text-[10px] text-yellow-300 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                <span>Tip: Highlight code in SortAlgorithms.cs first!</span>
              </div>
            )}

            {/* Chatbot Message Log */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex space-x-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                      VS
                    </div>
                  )}
                  <div className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${msg.role === "user" ? "bg-indigo-950 text-indigo-100 border border-indigo-900 text-[11px]" : "bg-[#2D2D30] text-gray-200 border border-[#3F3F46]"}`}>
                    {msg.isCommand && (
                      <div className="text-[10px] text-indigo-400 font-mono font-semibold mb-1">
                        ⚡ RUNNING EXTENSION COMMAND
                      </div>
                    )}
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              ))}

              {/* Typing Loader Indicator */}
              {isLoading && (
                <div className="flex space-x-2 animate-pulse">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    VS
                  </div>
                  <div className="bg-[#2D2D30] p-3 rounded-lg text-gray-400 border border-[#3F3F46] text-[11px]">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      <span>Gemini is generating code solution...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={chatBottomRef} />
            </div>

            {/* Slash Command Buttons list */}
            {config.slashCommands.length > 0 && (
              <div className="px-3 py-2 bg-[#252526] border-t border-[#3F3F46] space-y-1">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Slash Shortcuts:
                </div>
                <div className="flex flex-wrap gap-1">
                  {config.slashCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSlashCommand(cmd.command, cmd.systemPrompt)}
                      disabled={isLoading}
                      className="bg-[#2D2D30] hover:bg-indigo-950 hover:text-indigo-200 border border-[#3F3F46] hover:border-indigo-900 text-gray-300 font-mono text-[10px] px-2 py-1 rounded transition flex items-center space-x-1 disabled:opacity-50"
                      title={cmd.description}
                    >
                      <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                      <span>{cmd.command}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Insert/Apply Solution Button in sidebar if latest solution generated */}
            {lastGeneratedCode && (
              <div className="bg-indigo-950 p-2.5 border-t border-indigo-900 flex flex-col space-y-1.5 animate-fade-in">
                <div className="text-[10px] text-indigo-200 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>AI solution compiled successfully.</span>
                </div>
                <button
                  onClick={insertGeneratedCode}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 rounded transition text-xs flex items-center justify-center space-x-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Insert Solution at Cursor</span>
                </button>
                {insertSuccess && (
                  <p className="text-[10px] text-green-400 text-center font-bold">✓ Code replaced in active window!</p>
                )}
              </div>
            )}

            {/* Context Actions Toolbar */}
            <div className="px-3 py-1.5 bg-[#252526] border-t border-[#3F3F46] flex items-center justify-between text-[11px] text-gray-400">
              <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1.5">
                <button
                  onClick={handleReadActiveFile}
                  className={`flex items-center space-x-1 px-1.5 py-0.5 rounded border transition text-[10px] ${
                    loadedActiveFile 
                      ? "bg-green-950 text-green-300 border-green-800 font-semibold" 
                      : "bg-[#2D2D30] hover:bg-gray-700 text-gray-300 border-[#3F3F46]"
                  }`}
                  title="Read the entire active file's content into Gemini prompt context"
                >
                  <FileCode className="w-3 h-3 text-indigo-400" />
                  <span>Read Active File</span>
                </button>
                <button
                  onClick={handleReadSolutionStructure}
                  className={`flex items-center space-x-1 px-1.5 py-0.5 rounded border transition text-[10px] ${
                    loadedSolutionStructure 
                      ? "bg-indigo-950 text-indigo-300 border-indigo-800 font-semibold" 
                      : "bg-[#2D2D30] hover:bg-gray-700 text-gray-300 border-[#3F3F46]"
                  }`}
                  title="Read all project files in the Solution into Gemini workspace index context"
                >
                  <Folder className="w-3 h-3 text-indigo-400" />
                  <span>Read Solution</span>
                </button>
              </div>
              <div className="text-[9px] text-gray-500 font-mono truncate max-w-[100px] italic">
                {loadedActiveFile ? `File: ${files[activeFileIndex].name}` : loadedSolutionStructure ? `${files.length} Files Loaded` : "No extra context"}
              </div>
            </div>

            {/* Input Panel */}
            <div className="p-3 bg-[#2D2D30] border-t border-[#3F3F46]">
              <div className="flex space-x-1.5">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  placeholder={selectedInEditor ? "Selected code captured. Type a prompt..." : "Ask Gemini anything or highlight code..."}
                  rows={1}
                  className="flex-1 bg-[#1E1E1E] border border-[#3F3F46] rounded px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 resize-none max-h-16 custom-scrollbar"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !userInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#3F3F46] text-white rounded px-3 py-1.5 flex items-center justify-center transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[9px] text-gray-500 mt-1.5 text-center">
                Uses the AI Studio REST API securely over development proxy.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* VS Status Bar */}
      <div className="bg-[#007ACC] text-white px-3 py-1 flex items-center justify-between text-[10px]">
        <div className="flex items-center space-x-3">
          <span className="font-bold">Ready</span>
          <span>Ln 14, Col 25</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Google AI Studio Session: OK</span>
          <span className="bg-blue-800 px-1 rounded">100%</span>
        </div>
      </div>
    </div>
  );
}
