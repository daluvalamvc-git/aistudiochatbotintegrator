import { ExtensionConfig } from "../types";

// Sanitizes strings for XML/C# inclusion
const escapeXml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const escapeCSharpString = (str: string) =>
  str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r");

export function getManifestTemplate(config: ExtensionConfig): string {
  const safeName = escapeXml(config.extensionName);
  const safeAuthor = escapeXml(config.author);
  const safeDesc = escapeXml(config.description || "Chatbot tool window for Visual Studio to connect with Google AI Studio.");
  const safeVersion = escapeXml(config.version);

  const isVs2026 = config.vsVersion === "2026";
  const versionRange = isVs2026 ? "[17.0, 20.0)" : "[17.0, 19.0)";

  return `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Id="GoogleAIStudio.ChatbotExtension.${safeAuthor.replace(/\s+/g, "")}" Version="${safeVersion}" Language="en-US" Publisher="${safeAuthor}" />
    <DisplayName>${safeName}</DisplayName>
    <Description d:Concat="true">${safeDesc}</Description>
    <Icon>Resources\\ExtensionIcon.png</Icon>
    <PreviewImage>Resources\\ExtensionPreview.png</PreviewImage>
    <Tags>ai, gemini, google, aistudio, chatbot, chat, refactor, code, helper</Tags>
  </Metadata>
  <Installation>
    <!-- Target Visual Studio 2022 (Version 17.0) and Visual Studio 2026 (Version 18.0/19.0) -->
    <InstallationTarget Id="Microsoft.VisualStudio.Community" Version="${versionRange}">
      <ProductArchitecture>amd64</ProductArchitecture>
    </InstallationTarget>
    <InstallationTarget Id="Microsoft.VisualStudio.Pro" Version="${versionRange}">
      <ProductArchitecture>amd64</ProductArchitecture>
    </InstallationTarget>
    <InstallationTarget Id="Microsoft.VisualStudio.Enterprise" Version="${versionRange}">
      <ProductArchitecture>amd64</ProductArchitecture>
    </InstallationTarget>
  </Installation>
  <Dependencies>
    <Dependency Id="Microsoft.Framework.NDP" DisplayName="Microsoft .NET Framework" d:Source="Manual" Version="[4.7.2,)" />
  </Dependencies>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.VsPackage" d:Source="Project" ProjectName="MyAIStudioExtension" Path="|MyAIStudioExtension;PkgdefProjectOutputGroup|" />
  </Assets>
</PackageManifest>`;
}

export function getCsprojTemplate(config: ExtensionConfig): string {
  const isVs2026 = config.vsVersion === "2026";
  const toolsVersion = isVs2026 ? "Current" : "15.0";
  const minVsVersion = isVs2026 ? "18.0" : "17.0";

  return `<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="${toolsVersion}" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <MinimumVisualStudioVersion>${minVsVersion}</MinimumVisualStudioVersion>
    <VSToolsPath Condition="'$(VSToolsPath)' == ''">$(MSBuildExtensionsPath32)\\Microsoft\\VisualStudio\\v$(VisualStudioVersion)</VSToolsPath>
  </PropertyGroup>
  <Import Project="$(MSBuildExtensionsPath)\\$(MSBuildToolsVersion)\\Microsoft.Common.props" Condition="Exists('$(MSBuildExtensionsPath)\\$(MSBuildToolsVersion)\\Microsoft.Common.props')" />
  <PropertyGroup>
    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
    <Platform Condition=" '$(Platform)' == '' ">AnyCPU</Platform>
    <SchemaVersion>2.0</SchemaVersion>
    <ProjectGuid>{A3D43BBE-1090-41AA-B8B7-EA3CD763A48C}</ProjectGuid>
    <ProjectTypeGuids>{82b43b9b-a2a3-4d64-ab2b-51118f6179bc};{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}</ProjectTypeGuids>
    <OutputType>Library</OutputType>
    <AppDesignerFolder>Properties</AppDesignerFolder>
    <RootNamespace>MyAIStudioExtension</RootNamespace>
    <AssemblyName>MyAIStudioExtension</AssemblyName>
    <TargetFrameworkVersion>v4.8</TargetFrameworkVersion>
    <GeneratePkgDefFile>true</GeneratePkgDefFile>
    <UseCodebase>true</UseCodebase>
    <IncludeAssemblyInVSIXContainer>true</IncludeAssemblyInVSIXContainer>
    <IncludeDebugSymbolsInVSIXContainer>false</IncludeDebugSymbolsInVSIXContainer>
    <IncludeDebugSymbolsInLocalVSIXDeployment>true</IncludeDebugSymbolsInLocalVSIXDeployment>
    <CopyBuildOutputToOutputDirectory>true</CopyBuildOutputToOutputDirectory>
    <CopyOutputSymbolsToOutputDirectory>true</CopyOutputSymbolsToOutputDirectory>
    <StartAction>Program</StartAction>
    <StartProgram Condition="'$(DevEnvDir)' != ''">$(DevEnvDir)devenv.exe</StartProgram>
    <StartArguments>/rootsuffix Exp</StartArguments>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Debug|AnyCPU' ">
    <DebugSymbols>true</DebugSymbols>
    <DebugType>full</DebugType>
    <Optimize>false</Optimize>
    <OutputPath>bin\\Debug\\</OutputPath>
    <DefineConstants>DEBUG;TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Release|AnyCPU' ">
    <DebugType>pdbonly</DebugType>
    <Optimize>true</Optimize>
    <OutputPath>bin\\Release\\</OutputPath>
    <DefineConstants>TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="Properties\\AssemblyInfo.cs" />
    <Compile Include="MyAIStudioExtensionPackage.cs" />
    <Compile Include="ChatWindow.cs" />
    <Compile Include="ChatWindowCommand.cs" />
    <Compile Include="ChatWindowControl.xaml.cs">
      <DependentUpon>ChatWindowControl.xaml</DependentUpon>
    </Compile>
  </ItemGroup>
  <ItemGroup>
    <None Include="source.extension.vsixmanifest">
      <SubType>Designer</SubType>
    </None>
  </ItemGroup>
  <ItemGroup>
    <Reference Include="Microsoft.CSharp" />
    <Reference Include="PresentationCore" />
    <Reference Include="PresentationFramework" />
    <Reference Include="System" />
    <Reference Include="System.Data" />
    <Reference Include="System.Design" />
    <Reference Include="System.Drawing" />
    <Reference Include="System.Windows.Forms" />
    <Reference Include="System.Xaml" />
    <Reference Include="System.Xml" />
    <Reference Include="WindowsBase" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.VisualStudio.SDK" Version="17.0.31902.203" />
    <PackageReference Include="Microsoft.VSSDK.BuildTools" Version="17.0.5232" />
    <PackageReference Include="Microsoft.Web.WebView2" Version="1.0.1264.42" />
  </ItemGroup>
  <ItemGroup>
    <VSCTCompile Include="MyAIStudioExtensionPackage.vsct">
      <ResourceName>Menus.ctmenu</ResourceName>
    </VSCTCompile>
    <Resource Include="Resources\\ExtensionIcon.png" />
    <Resource Include="Resources\\ExtensionPreview.png" />
  </ItemGroup>
  <ItemGroup>
    <Page Include="ChatWindowControl.xaml">
      <SubType>Designer</SubType>
      <Generator>MSBuild:Compile</Generator>
    </Page>
  </ItemGroup>
  <ItemGroup>
    <Content Include="index.html">
      <CopyToOutputDirectory>Always</CopyToOutputDirectory>
      <IncludeInVSIX>true</IncludeInVSIX>
    </Content>
  </ItemGroup>
  <Import Project="$(MSBuildToolsPath)\\Microsoft.CSharp.targets" />
  <Import Project="$(VSToolsPath)\\VSSDK\\Microsoft.VsSDK.targets" Condition="'$(VSToolsPath)' != ''" />
</Project>`;
}

export function getPackageVsctTemplate(config: ExtensionConfig): string {
  const safeName = escapeXml(config.extensionName);
  return `<?xml version="1.0" encoding="utf-8"?>
<CommandTable xmlns="http://schemas.microsoft.com/VisualStudio/2005-10-18/CommandTable" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <Extern href="stdidcmd.h"/>
  <Extern href="vsshlids.h"/>

  <Commands package="guidMyAIStudioExtensionPackage">
    <Buttons>
      <Button guid="guidMyAIStudioExtensionPackageCmdSet" id="ChatWindowCommandId" priority="0x0100" type="Button">
        <Parent guid="guidSHLMainMenu" id="IDG_VS_WNDO_OTHRWNDWS1"/>
        <Icon guid="guidImages" id="bmpPic1" />
        <Strings>
          <ButtonText>${safeName}</ButtonText>
        </Strings>
      </Button>
    </Buttons>
    <Bitmaps>
      <Bitmap guid="guidImages" href="Resources\\ChatWindowCommand.png" usedList="bmpPic1"/>
    </Bitmaps>
  </Commands>

  <Symbols>
    <GuidSymbol name="guidMyAIStudioExtensionPackage" value="{f5c6b907-8271-4688-9bb3-96b0153925fb}" />
    <GuidSymbol name="guidMyAIStudioExtensionPackageCmdSet" value="{a5db0111-e490-449e-ba6b-c744fb86576b}">
      <IDSymbol name="ChatWindowCommandId" value="0x0100" />
    </GuidSymbol>
    <GuidSymbol name="guidImages" value="{234913c3-1bf5-455b-9d41-15b744d5cf20}" >
      <IDSymbol name="bmpPic1" value="1" />
    </GuidSymbol>
  </Symbols>
</CommandTable>`;
}

export function getPackageTemplate(config: ExtensionConfig): string {
  const safeName = config.extensionName;
  return `using System;
using System.Runtime.InteropServices;
using System.Threading;
using Microsoft.VisualStudio.Shell;
using Task = System.Threading.Tasks.Task;

namespace MyAIStudioExtension
{
    [PackageRegistration(UseManagedResourcesOnly = true, AllowsBackgroundLoading = true)]
    [Guid(MyAIStudioExtensionPackage.PackageGuidString)]
    [ProvideMenuResource("Menus.ctmenu", 1)]
    [ProvideToolWindow(typeof(ChatWindow))]
    public sealed class MyAIStudioExtensionPackage : AsyncPackage
    {
        public const string PackageGuidString = "f5c6b907-8271-4688-9bb3-96b0153925fb";

        protected override async Task InitializeAsync(CancellationToken cancellationToken, IProgress<ServiceProgressData> progress)
        {
            await this.JoinableTaskFactory.SwitchToMainThreadAsync(cancellationToken);
            await ChatWindowCommand.InitializeAsync(this);
        }
    }
}`;
}

export function getChatWindowTemplate(config: ExtensionConfig): string {
  return `using System;
using System.Runtime.InteropServices;
using Microsoft.VisualStudio.Shell;

namespace MyAIStudioExtension
{
    [Guid("43b174b5-df3e-4632-a392-aa2e3cd83cc3")]
    public class ChatWindow : ToolWindowPane
    {
        public ChatWindow() : base(null)
        {
            this.Caption = "${escapeCSharpString(config.extensionName)}";
            this.Content = new ChatWindowControl();
        }
    }
}`;
}

export function getChatWindowCommandTemplate(): string {
  return `using System;
using System.ComponentModel.Design;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;
using Task = System.Threading.Tasks.Task;

namespace MyAIStudioExtension
{
    internal sealed class ChatWindowCommand
    {
        public const int CommandId = 0x0100;
        public static readonly Guid CommandSet = new Guid("a5db0111-e490-449e-ba6b-c744fb86576b");

        private readonly AsyncPackage package;

        private ChatWindowCommand(AsyncPackage package, OleMenuCommandService commandService)
        {
            this.package = package ?? throw new ArgumentNullException(nameof(package));
            commandService = commandService ?? throw new ArgumentNullException(nameof(commandService));

            var menuCommandID = new CommandID(CommandSet, CommandId);
            var menuItem = new MenuCommand(this.Execute, menuCommandID);
            commandService.AddCommand(menuItem);
        }

        public static ChatWindowCommand Instance { get; private set; }

        private IServiceProvider ServiceProvider => this.package;

        public static async Task InitializeAsync(AsyncPackage package)
        {
            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync(package.DisposalToken);
            OleMenuCommandService commandService = await package.GetServiceAsync(typeof(IMenuCommandService)) as OleMenuCommandService;
            Instance = new ChatWindowCommand(package, commandService);
        }

        private void Execute(object sender, EventArgs e)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            ToolWindowPane window = this.package.FindToolWindow(typeof(ChatWindow), 0, true);
            if ((null == window) || (null == window.Frame))
            {
                throw new NotSupportedException("Cannot create tool window");
            }

            IVsWindowFrame windowFrame = (IVsWindowFrame)window.Frame;
            Microsoft.VisualStudio.ErrorHandler.ThrowOnFailure(windowFrame.Show());
        }
    }
}`;
}

export function getChatWindowControlXamlTemplate(): string {
  return `<UserControl x:Class="MyAIStudioExtension.ChatWindowControl"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008" 
             xmlns:wv2="clr-namespace:Microsoft.Web.WebView2.Wpf;assembly=Microsoft.Web.WebView2.Wpf"
             mc:Ignorable="d" 
             d:DesignHeight="600" d:DesignWidth="350"
             Background="#1E1E1E">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>

        <!-- VS Docked Toolbar Style -->
        <Border Grid.Row="0" Background="#2D2D30" BorderThickness="0,0,0,1" BorderBrush="#3F3F46" Padding="6,4">
            <StackPanel Orientation="Horizontal">
                <Button Name="btnGetSelection" Content="Get Selected Code" Click="GetSelection_Click" Margin="2,0" Padding="8,3" Background="#3F3F46" Foreground="#F1F1F1" BorderThickness="1" BorderBrush="#555555" FontSize="11" Cursor="Hand"/>
                <Button Name="btnInsertCode" Content="Insert Code" Click="InsertCode_Click" Margin="4,0" Padding="8,3" Background="#3F3F46" Foreground="#F1F1F1" BorderThickness="1" BorderBrush="#555555" FontSize="11" Cursor="Hand"/>
            </StackPanel>
        </Border>

        <!-- Microsoft WebView2 hosting our Chat UI -->
        <wv2:WebView2 x:Name="webView" Grid.Row="1" Source="about:blank" />
    </Grid>
</UserControl>`;
}

export function getChatWindowControlCsTemplate(): string {
  return `using System;
using System.IO;
using System.Reflection;
using System.Windows;
using System.Windows.Controls;
using EnvDTE;
using EnvDTE80;
using Microsoft.VisualStudio.Shell;

namespace MyAIStudioExtension
{
    public partial class ChatWindowControl : UserControl
    {
        private DTE2 dte;

        public ChatWindowControl()
        {
            InitializeComponent();
            InitializeAsync();
        }

        private async void InitializeAsync()
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            dte = ServiceProvider.GlobalProvider.GetService(typeof(DTE)) as DTE2;

            // Initialize WebView2
            await webView.EnsureCoreWebView2Async(null);

            // Register event to listen to messages sent from the Webpage JavaScript
            webView.CoreWebView2.WebMessageReceived += WebPage_WebMessageReceived;

            // Load the embedded local index.html chatbot UI
            string assemblyDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string htmlPath = Path.Combine(assemblyDir, "index.html");
            if (File.Exists(htmlPath))
            {
                webView.CoreWebView2.Navigate(new Uri(htmlPath).AbsoluteUri);
            }
            else
            {
                webView.CoreWebView2.NavigateToString("<html><body style='color:white;font-family:sans-serif;padding:20px;'><h3>Error: index.html not found</h3><p>Verify that index.html is copied to the Output directory.</p></body></html>");
            }
        }

        // Handle buttons in WPF Window Toolbar
        private void GetSelection_Click(object sender, RoutedEventArgs e)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            string selectedText = GetActiveEditorSelection();
            if (!string.IsNullOrEmpty(selectedText))
            {
                // Send selected code to the web app inside the webview
                string escapedText = Newtonsoft.Json.JsonConvert.SerializeObject(selectedText);
                webView.CoreWebView2.PostWebMessageAsJson($\"{{\\\"type\\\":\\\"selection\\\",\\\"code\\\":{escapedText}}}\");
            }
            else
            {
                MessageBox.Show("Please select some code in the Visual Studio Editor first.", "No Selection", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }

        private void InsertCode_Click(object sender, RoutedEventArgs e)
        {
            // Ask the webview application to send back the latest generated solution
            webView.CoreWebView2.PostWebMessageAsJson(\"{\\\"type\\\":\\\"request_code\\\"}\");
        }

        // Handle scripts communicating from webview back to C# Visual Studio SDK
        private void WebPage_WebMessageReceived(object sender, Microsoft.Web.WebView2.Core.CoreWebView2WebMessageReceivedEventArgs e)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            try
            {
                string messageJson = e.TryGetWebMessageAsString();
                var msg = Newtonsoft.Json.Linq.JObject.Parse(messageJson);
                string type = msg["type"]?.ToString();

                if (type == "insert_code")
                {
                    string code = msg["code"]?.ToString();
                    if (!string.IsNullOrEmpty(code))
                    {
                        InsertTextToEditor(code);
                    }
                }
                else if (type == "get_selection_request")
                {
                    string selection = GetActiveEditorSelection();
                    string escapedText = Newtonsoft.Json.JsonConvert.SerializeObject(selection ?? "");
                    webView.CoreWebView2.PostWebMessageAsJson($\"{{\\\"type\\\":\\\"selection_response\\\",\\\"code\\\":{escapedText}}}\");
                }
                else if (type == "get_active_document_request")
                {
                    string docText = GetActiveDocumentText();
                    string docName = dte?.ActiveDocument?.Name ?? "ActiveFile.cs";
                    string escapedText = Newtonsoft.Json.JsonConvert.SerializeObject(docText ?? "");
                    webView.CoreWebView2.PostWebMessageAsJson($\"{{\\\"type\\\":\\\"active_document_response\\\",\\\"fileName\\\":\\\"{docName}\\\",\\\"code\\\":{escapedText}}}\");
                }
                else if (type == "get_solution_structure_request")
                {
                    System.Collections.Generic.List<string> fileList = new System.Collections.Generic.List<string>();
                    if (dte?.Solution != null && dte.Solution.Projects != null)
                    {
                        foreach (Project proj in dte.Solution.Projects)
                        {
                            FindProjectFiles(proj.ProjectItems, fileList);
                        }
                    }
                    string filesJson = Newtonsoft.Json.JsonConvert.SerializeObject(fileList);
                    webView.CoreWebView2.PostWebMessageAsJson($\"{{\\\"type\\\":\\\"solution_structure_response\\\",\\\"files\\\":{filesJson}}}\");
                }
                else if (type == "get_file_content_request")
                {
                    string targetFile = msg["fileName"]?.ToString();
                    string content = GetFileContent(targetFile);
                    string escapedContent = Newtonsoft.Json.JsonConvert.SerializeObject(content ?? "");
                    webView.CoreWebView2.PostWebMessageAsJson($\"{{\\\"type\\\":\\\"file_content_response\\\",\\\"fileName\\\":\\\"{targetFile}\\\",\\\"code\\\":{escapedContent}}}\");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(\"Error parsing WebView message: \" + ex.Message);
            }
        }

        // Helper to grab highlighted code from the active document window
        private string GetActiveEditorSelection()
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            if (dte?.ActiveDocument?.Selection is TextSelection selection)
            {
                return selection.Text;
            }
            return null;
        }

        // Helper to retrieve the entire text of the active file in the editor
        private string GetActiveDocumentText()
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            try
            {
                if (dte?.ActiveDocument?.Object("TextDocument") is TextDocument txtDoc)
                {
                    EditPoint start = txtDoc.StartPoint.CreateEditPoint();
                    return start.GetText(txtDoc.EndPoint);
                }
            }
            catch {}
            return null;
        }

        // Helper to find specific project item code
        private string GetFileContent(string fileName)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            try
            {
                if (dte?.Solution != null)
                {
                    foreach (Project proj in dte.Solution.Projects)
                    {
                        ProjectItem item = FindProjectItem(proj.ProjectItems, fileName);
                        if (item != null)
                        {
                            if (item.IsOpen)
                            {
                                if (item.Object("TextDocument") is TextDocument txtDoc)
                                {
                                    return txtDoc.StartPoint.CreateEditPoint().GetText(txtDoc.EndPoint);
                                }
                            }
                            else
                            {
                                string path = item.FileNames[1];
                                if (File.Exists(path))
                                {
                                    return File.ReadAllText(path);
                                }
                            }
                        }
                    }
                }
            }
            catch {}
            return null;
        }

        private ProjectItem FindProjectItem(ProjectItems items, string name)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            if (items == null) return null;
            foreach (ProjectItem item in items)
            {
                if (item.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
                {
                    return item;
                }
                var subItem = FindProjectItem(item.ProjectItems, name);
                if (subItem != null) return subItem;
            }
            return null;
        }

        // Traverses Visual Studio project items recursively to extract source files list
        private void FindProjectFiles(ProjectItems items, System.Collections.Generic.List<string> fileList)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            if (items == null) return;
            foreach (ProjectItem item in items)
            {
                if (item.ProjectItems != null && item.ProjectItems.Count > 0)
                {
                    FindProjectFiles(item.ProjectItems, fileList);
                }
                else
                {
                    string name = item.Name;
                    if (name.EndsWith(".cs") || name.EndsWith(".xaml") || name.EndsWith(".json") || name.EndsWith(".xml") || name.EndsWith(".config"))
                    {
                        fileList.Add(name);
                    }
                }
            }
        }

        // Helper to inject code back into the visual cursor position
        private void InsertTextToEditor(string text)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            if (dte?.ActiveDocument?.Selection is TextSelection selection)
            {
                selection.Insert(text, (int)vsInsertFlags.vsInsertFlagsCollapseToEnd);
            }
        }
    }
}`;
}

export function getPropertiesAssemblyInfoTemplate(config: ExtensionConfig): string {
  return `using System.Reflection;
using System.Runtime.InteropServices;

[assembly: AssemblyTitle("${escapeCSharpString(config.extensionName)}")]
[assembly: AssemblyDescription("${escapeCSharpString(config.description)}")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("${escapeCSharpString(config.author)}")]
[assembly: AssemblyProduct("${escapeCSharpString(config.extensionName)}")]
[assembly: AssemblyCopyright("Copyright © ${new Date().getFullYear()} ${escapeCSharpString(config.author)}")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]

[assembly: ComVisible(false)]
[assembly: AssemblyVersion("${escapeCSharpString(config.version)}")]
[assembly: AssemblyFileVersion("${escapeCSharpString(config.version)}")]`;
}

export function getWebviewHtmlTemplate(config: ExtensionConfig): string {
  const safeCommandsJson = JSON.stringify(config.slashCommands, null, 2);
  const safeSystemPrompt = escapeCSharpString(config.systemPrompt);
  const safeModel = config.defaultModel;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeXml(config.extensionName)} Chat</title>
  <!-- Beautiful Google Fonts and Tailwind CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #1e1e1e;
      color: #d4d4d4;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1e1e1e;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #3e3e3e;
      border-radius: 3px;
    }
    .code-block {
      font-family: 'JetBrains Mono', monospace;
      background-color: #2d2d2d;
      border: 1px solid #404040;
    }
  </style>
</head>
<body class="h-screen flex flex-col overflow-hidden">

  <!-- Header -->
  <div class="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
      <span class="text-sm font-semibold text-gray-100">${escapeXml(config.extensionName)}</span>
    </div>
    <span class="text-xs bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded">${escapeXml(config.defaultModel)}</span>
  </div>

  <!-- Main Chat Log -->
  <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
    <!-- Setup Alert if API Key is empty -->
    <div id="api-key-banner" class="bg-yellow-900 bg-opacity-30 border border-yellow-700 p-3 rounded text-xs space-y-2">
      <p class="text-yellow-200 font-semibold">⚠️ Set Up API Key</p>
      <p class="text-gray-300">To start using the chatbot, please generate a free API Key on <a href="https://aistudio.google.com" target="_blank" class="text-blue-400 underline">aistudio.google.com</a> and save it below:</p>
      <div class="flex space-x-2 mt-1">
        <input type="password" id="api-key-input" placeholder="AI Studio API Key" class="bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 flex-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
        <button id="btn-save-key" class="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 font-medium transition">Save</button>
      </div>
    </div>

    <!-- Initial Greeting -->
    <div class="flex space-x-3">
      <div class="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">AI</div>
      <div class="bg-gray-800 p-3 rounded-lg max-w-sm text-sm space-y-2">
        <p class="font-semibold text-gray-200">Hello Developer!</p>
        <p class="text-gray-300">I am connected to Google AI Studio. Select code in your Visual Studio editor and choose a command below or ask me any question:</p>
        <div id="command-buttons" class="grid grid-cols-1 gap-1.5 mt-2">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
  </div>

  <!-- Active Code Selection Area -->
  <div id="selection-banner" class="hidden bg-indigo-950 border-t border-indigo-800 px-4 py-2 text-xs flex justify-between items-center">
    <div class="flex items-center space-x-2 text-indigo-200">
      <span>📄 Code Selection captured (${"{"}selectedLinesCount${"}"} lines)</span>
    </div>
    <button id="btn-clear-selection" class="text-gray-400 hover:text-white transition">Clear</button>
  </div>

  <!-- Context Actions Toolbar -->
  <div class="px-3 py-1.5 bg-gray-900 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
    <div class="flex items-center space-x-2">
      <button id="btn-read-active" class="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 hover:text-white px-2 py-1 rounded border border-gray-700 transition">
        <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span>Read Active File</span>
      </button>
      <button id="btn-read-sol" class="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 hover:text-white px-2 py-1 rounded border border-gray-700 transition">
        <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
        <span>Read Solution Structure</span>
      </button>
    </div>
    <div id="active-context-indicator" class="text-[10px] text-indigo-300 font-mono italic max-w-xs truncate">
      No additional file context loaded.
    </div>
  </div>

  <!-- Input Console -->
  <div class="p-3 bg-gray-900 border-t border-gray-800">
    <div class="flex space-x-2">
      <textarea id="prompt-input" rows="1" placeholder="Type a prompt or slash command (e.g., /explain)..." class="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-10 custom-scrollbar"></textarea>
      <button id="btn-send" class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 flex items-center justify-center transition focus:outline-none">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </button>
    </div>
  </div>

  <script>
    // Config injected dynamically
    const COMMANDS = ${safeCommandsJson};
    const SYSTEM_PROMPT = "${safeSystemPrompt}";
    const DEFAULT_MODEL = "${safeModel}";

    let selectedCode = "";
    let activeDocumentCode = "";
    let activeDocumentName = "";
    let solutionStructure = null;
    let chatHistory = [];
    let lastGeneratedCode = "";

    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveKeyBtn = document.getElementById('btn-save-key');
    const promptInput = document.getElementById('prompt-input');
    const sendBtn = document.getElementById('btn-send');
    const selectionBanner = document.getElementById('selection-banner');
    const clearSelectionBtn = document.getElementById('btn-clear-selection');
    const commandButtonsContainer = document.getElementById('command-buttons');
    const apiKeyBanner = document.getElementById('api-key-banner');
    const btnReadActive = document.getElementById('btn-read-active');
    const btnReadSol = document.getElementById('btn-read-sol');
    const contextIndicator = document.getElementById('active-context-indicator');

    // Load saved API Key from localStorage
    let currentApiKey = localStorage.getItem('AISTUDIO_API_KEY') || "";
    if (currentApiKey) {
      apiKeyInput.value = currentApiKey;
      apiKeyBanner.classList.add('hidden');
    }

    // Save key
    saveKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        localStorage.setItem('AISTUDIO_API_KEY', key);
        currentApiKey = key;
        apiKeyBanner.innerHTML = '<p class="text-green-400 font-semibold">✓ API Key saved successfully!</p>';
        setTimeout(() => apiKeyBanner.classList.add('hidden'), 1500);
      }
    });

    // Populate quick slash commands
    COMMANDS.forEach(cmd => {
      const btn = document.createElement('button');
      btn.className = "text-left text-xs bg-gray-700 hover:bg-gray-600 text-indigo-200 px-2.5 py-1.5 rounded transition font-mono border border-gray-600 hover:border-indigo-500";
      btn.innerHTML = \`<span class="font-bold text-indigo-400">\${cmd.command}</span> \${cmd.description}\`;
      btn.addEventListener('click', () => {
        executeCommand(cmd);
      });
      commandButtonsContainer.appendChild(btn);
    });

    // Request Entire Active Document Context from C# IDE Integration
    btnReadActive.addEventListener('click', () => {
      if (window.chrome && window.chrome.webview) {
        contextIndicator.innerText = "Querying VS for active document...";
        window.chrome.webview.postMessage({ type: 'get_active_document_request' });
      } else {
        // Fallback mockup behavior for standalone browser preview
        handleActiveDocumentResponse("SortAlgorithms.cs", \`using System;

namespace CodeOptimizer
{
    public class SortAlgorithms
    {
        public int[] BubbleSort(int[] array)
        {
            int n = array.Length;
            for (int i = 0; i < n - 1; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    if (array[j] > array[j + 1])
                    {
                        int temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }
            return array;
        }
    }
}\`);
      }
    });

    // Request entire Solution file list structure from C# DTE Solution SDK APIs
    btnReadSol.addEventListener('click', () => {
      if (window.chrome && window.chrome.webview) {
        contextIndicator.innerText = "Reading Solution workspace...";
        window.chrome.webview.postMessage({ type: 'get_solution_structure_request' });
      } else {
        // Fallback mockup behavior for standalone browser preview
        handleSolutionStructureResponse(["SortAlgorithms.cs", "UserController.cs", "App.config", "MyAIStudioExtension.csproj"]);
      }
    });

    function handleActiveDocumentResponse(fileName, code) {
      if (!code) {
        contextIndicator.innerText = "Active file empty or unreadable.";
        return;
      }
      activeDocumentName = fileName;
      activeDocumentCode = code;
      contextIndicator.innerHTML = \`<span class="text-green-400 font-semibold flex items-center gap-1">● File: \${fileName} Loaded</span>\`;
      addMessage('assistant', \`📄 **Captured entire active file context (\${fileName})** into chat memory. You can now prompt me directly about this code block, ask to refactor it, or explain its behavior. I will read and respect the entire document content during generation!\`);
    }

    function handleSolutionStructureResponse(files) {
      if (!files || files.length === 0) {
        contextIndicator.innerText = "No active solution files found.";
        return;
      }
      solutionStructure = files;
      contextIndicator.innerHTML = \`<span class="text-indigo-400 font-semibold flex items-center gap-1">● Solution (\${files.length} Files) Loaded</span>\`;
      const formattedList = files.map(f => \`- \` + f).join('\\n');
      addMessage('assistant', \`📂 **Captured entire solution workspace index list!** Available files in Visual Studio Solution:\\n\\n\${formattedList}\\n\\nYou can ask questions like "Explain SortAlgorithms.cs" or ask me to write a new class integrating with these.\`);
    }

    // Handle WebView2 messages sent from C# (Visual Studio Editor selection or context)
    if (window.chrome && window.chrome.webview) {
      window.chrome.webview.addEventListener('message', event => {
        const msg = event.data;
        if (msg.type === 'selection' || msg.type === 'selection_response') {
          selectedCode = msg.code || "";
          if (selectedCode) {
            selectionBanner.classList.remove('hidden');
            const lines = selectedCode.split('\\n').length;
            selectionBanner.querySelector('span').innerText = \`📄 Code Selection captured (\${lines} lines)\`;
          } else {
            selectionBanner.classList.add('hidden');
          }
        } else if (msg.type === 'active_document_response') {
          handleActiveDocumentResponse(msg.fileName, msg.code);
        } else if (msg.type === 'solution_structure_response') {
          handleSolutionStructureResponse(msg.files);
        } else if (msg.type === 'request_code') {
          // Send back the last code generated by the model to VS
          if (lastGeneratedCode) {
            window.chrome.webview.postMessage({
              type: 'insert_code',
              code: lastGeneratedCode
            });
          } else {
            addMessage('assistant', 'I haven\\'t generated any solution yet. Ask me to refactor or write code first.');
          }
        }
      });
    }

    // Clear selection
    clearSelectionBtn.addEventListener('click', () => {
      selectedCode = "";
      selectionBanner.classList.add('hidden');
    });

    // Auto-resize textarea
    promptInput.addEventListener('input', () => {
      promptInput.style.height = 'auto';
      promptInput.style.height = (promptInput.scrollHeight > 120 ? 120 : promptInput.scrollHeight) + 'px';
    });

    // Send on Enter (shift+enter to newline)
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessageFlow();
      }
    });

    sendBtn.addEventListener('click', sendMessageFlow);

    async function sendMessageFlow() {
      const prompt = promptInput.value.trim();
      if (!prompt) return;

      promptInput.value = "";
      promptInput.style.height = '40px';

      // Check if it matches a slash command
      const foundCommand = COMMANDS.find(c => prompt.toLowerCase().startsWith(c.command.toLowerCase()));
      if (foundCommand) {
        executeCommand(foundCommand, prompt.substring(foundCommand.command.length).trim());
      } else {
        await executeChatQuery(prompt);
      }
    }

    async function executeCommand(cmd, additionalInstruction = "") {
      let promptText = cmd.systemPrompt;
      if (additionalInstruction) {
        promptText += "\\n\\nAdditional user instructions: " + additionalInstruction;
      }
      if (selectedCode) {
        promptText += "\\n\\nTarget Code Selection:\\n\`\`\`\\n" + selectedCode + "\\n\`\`\`";
      }
      if (activeDocumentCode) {
        promptText += "\\n\\nEntire active document content (" + activeDocumentName + "):\\n\`\`\`\\n" + activeDocumentCode + "\\n\`\`\`";
      }
      if (solutionStructure) {
        promptText += "\\n\\nAvailable files in Visual Studio Solution:\\n" + solutionStructure.join('\\n');
      }

      addMessage('user', \`Running command: \${cmd.command} \${additionalInstruction}\`);
      await fetchGeminiResponse(promptText, cmd.command);
    }

    async function executeChatQuery(userPrompt) {
      let promptText = userPrompt;
      if (selectedCode) {
        promptText += "\\n\\nContext Selected Code:\\n\`\`\`\\n" + selectedCode + "\\n\`\`\`";
      }
      if (activeDocumentCode) {
        promptText += "\\n\\nEntire active document content (" + activeDocumentName + "):\\n\`\`\`\\n" + activeDocumentCode + "\\n\`\`\`";
      }
      if (solutionStructure) {
        promptText += "\\n\\nAvailable files in Visual Studio Solution:\\n" + solutionStructure.join('\\n');
      }

      addMessage('user', userPrompt);
      await fetchGeminiResponse(promptText, "chat");
    }

    function addMessage(role, content) {
      const isUser = role === 'user';
      const msgDiv = document.createElement('div');
      msgDiv.className = "flex space-x-3 " + (isUser ? "justify-end" : "");

      // Simple Markdown-to-HTML parser for responses
      const formattedContent = formatMarkdown(content);

      msgDiv.innerHTML = isUser 
        ? \`
          <div class="bg-indigo-900 text-indigo-50 p-3 rounded-lg max-w-sm text-sm border border-indigo-700 shadow-sm">
            \${formattedContent}
          </div>
        \`
        : \`
          <div class="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">AI</div>
          <div class="bg-gray-800 p-3 rounded-lg max-w-sm text-sm space-y-2 text-gray-200 border border-gray-700 shadow-md">
            \${formattedContent}
          </div>
        \`;

      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Extract generated code blocks so they can be inserted back
      if (!isUser) {
        const codeBlockMatch = content.match(/\`\`\`(?:[a-zA-Z]+)?\\n([\\s\\S]*?)\`\`\`/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          lastGeneratedCode = codeBlockMatch[1];
          
          // Add inline insert button to the assistant card
          const lastCard = msgDiv.querySelector('.bg-gray-800');
          const insertBtn = document.createElement('button');
          insertBtn.className = "mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2.5 py-1.5 rounded flex items-center space-x-1 font-semibold transition shadow-sm";
          insertBtn.innerHTML = '<svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8"/></svg> Insert Code into Editor';
          insertBtn.addEventListener('click', () => {
            if (window.chrome && window.chrome.webview) {
              window.chrome.webview.postMessage({
                type: 'insert_code',
                code: lastGeneratedCode
              });
            } else {
              alert('Copied to clipboard (not running inside Visual Studio):\\n\\n' + lastGeneratedCode);
              navigator.clipboard.writeText(lastGeneratedCode);
            }
          });
          lastCard.appendChild(insertBtn);
        }
      }
    }

    async function fetchGeminiResponse(fullPrompt, commandName) {
      if (!currentApiKey) {
        apiKeyBanner.classList.remove('hidden');
        addMessage('assistant', '⚠️ Please enter and save your Google AI Studio API Key in the banner configuration at the top of the chat panel to make calls.');
        return;
      }

      const typingDiv = document.createElement('div');
      typingDiv.className = "flex space-x-3 animate-pulse";
      typingDiv.innerHTML = \`
        <div class="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">AI</div>
        <div class="bg-gray-800 p-3 rounded-lg max-w-sm text-sm text-gray-400 font-medium">
          Thinking... Gemini is analyzing your request...
        </div>
      \`;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        // Direct client-side API call from VS Extension locally to Google AI Studio APIs
        const url = \`https://generativelanguage.googleapis.com/v1beta/models/\${DEFAULT_MODEL}:generateContent?key=\${currentApiKey}\`;
        
        const contents = [
          {
            role: "user",
            parts: [{ text: fullPrompt }]
          }
        ];

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            generationConfig: {
              temperature: 0.7
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'Failed to query Gemini API');
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No output returned.";
        
        // Remove typing indicator
        typingDiv.remove();
        
        addMessage('assistant', responseText);
      } catch (err) {
        typingDiv.remove();
        addMessage('assistant', '❌ Error: ' + err.message);
      }
    }

    // Simplistic markdown-like formatting for demonstration
    function formatMarkdown(text) {
      // Escape HTML tags to prevent XSS
      let escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // Code blocks
      escaped = escaped.replace(/\\\`\\\`\\\`(.*?)\\n([\\s\\S]*?)\\\`\\\`\\\`/g, (match, lang, code) => {
        return \`<pre class="code-block text-xs p-3 rounded-md overflow-x-auto my-2 text-indigo-100"><code class="language-\${lang}">\${code.trim()}</code></pre>\`;
      });

      // Inline code
      escaped = escaped.replace(/\\\`(.*?)\\\`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-indigo-300 font-mono text-xs">$1</code>');

      // Strong / Bold
      escaped = escaped.replace(/\\\*\\\*(.*?)\\\*\\\*/g, '<strong class="font-bold text-white">$1</strong>');

      // Paragraph newlines
      escaped = escaped.replace(/\\n/g, '<br>');

      return escaped;
    }
  </script>
</body>
</html>`;
}

export function getReadmeTemplate(config: ExtensionConfig): string {
  return `# ${config.extensionName} - Visual Studio Extension Boilerplate

This extension adds a docked chatbot tool window to **Visual Studio 2022 / 2026 Community, Professional, or Enterprise** which connects to your Google AI Studio account.

## Features
- **Direct AI Studio Integration**: Securely connect using your personal Gemini API key.
- **WPF & WebView2 Hybrid Container**: Responsive UI running with Microsoft Edge Chromium rendering engine inside Visual Studio.
- **Code Highlights**: Instantly pull highlighted code from the active Visual Studio Editor.
- **Solution Injection**: Write code in the chat, click "Insert Code", and insert it directly at the cursor in your file.
- **Slash Commands**: Preconfigured commands like ${config.slashCommands.map((c) => `\`${c.command}\``).join(", ")} to automate tasks.

---

## 🛑 FIXING THE "UNSUPPORTED PROJECT" / "LOAD FAILED" ERROR

If you see an error like:
> **"This version of Visual Studio is unable to open the following projects. The project types may not be installed or this version of Visual Studio may not support them."**

This is because your Visual Studio installation is **missing the Extension SDK templates workload**. Visual Studio requires this workload to open and build \`.csproj\` files configured as VSIX packaging projects.

### How to resolve:
1. Open the **Visual Studio Installer** on your computer.
2. Click **Modify** next to your active Visual Studio installation (e.g., Visual Studio 2022 or 2026).
3. Under the **Workloads** tab, scroll down to the **Other Toolsets** section.
4. Check the box for **"Visual Studio extension development"**.
5. Click **Modify** at the bottom-right to download and install this workload.
6. Once installation completes, restart Visual Studio and open the solution (\`.sln\`) or project (\`.csproj\`) file. It will load perfectly!

---

## How to Build and Run

1. **Extract** the files from this downloaded zip package to a directory of your choice.
2. **Open the Solution**: Launch Visual Studio and open the \`MyAIStudioExtension.sln\` or \`MyAIStudioExtension.csproj\` file.
3. **Restore Packages**: Visual Studio will automatically download NuGet dependencies:
   - \`Microsoft.VisualStudio.SDK\`
   - \`Microsoft.VSSDK.BuildTools\`
   - \`Microsoft.Web.WebView2\`
   - \`Newtonsoft.Json\`
4. **Compile and Debug**:
   - Press **F5** (or click **Start** in the toolbar).
   - This opens an **Experimental Instance of Visual Studio** (which is a sandbox workspace).
5. **Open the Tool Window**:
   - In the Experimental Instance, go to the top menu: **View > Other Windows > ${config.extensionName}**.
   - The chatbot window will dock neatly on the side of your workspace!
6. **Connect your API Key**:
   - Get a free API Key on [aistudio.google.com](https://aistudio.google.com).
   - Paste it inside the extension input field and click **Save**.

---

## How to Publish & Install permanently

1. In your primary Visual Studio solution window, switch your build configuration from **Debug** to **Release**.
2. Go to **Build > Build Solution**.
3. Locate the compiled \`.vsix\` installer file at:
   \`\\bin\\Release\\MyAIStudioExtension.vsix\`
4. Double-click the \`MyAIStudioExtension.vsix\` file. This opens the VSIX Installer.
5. Choose your target IDE instance (e.g., Visual Studio 2026 Community) and click **Modify**.
6. Restart Visual Studio. The tool window will now be permanently installed in your primary IDE!
`;
}

export function getSlnTemplate(config: ExtensionConfig): string {
  const isVs2026 = config.vsVersion === "2026";
  const versionHeader = isVs2026 ? "18" : "17";
  const vsVersionStr = isVs2026 ? "18.0.35012.112" : "17.0.31903.59";
  const minVsVersionStr = isVs2026 ? "18.0.35012.112" : "17.0.31903.59";

  return `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version ${versionHeader}
VisualStudioVersion = ${vsVersionStr}
MinimumVisualStudioVersion = ${minVsVersionStr}
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "MyAIStudioExtension", "MyAIStudioExtension.csproj", "{A3D43BBE-1090-41AA-B8B7-EA3CD763A48C}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "MyAIStudioBackend", "backend\\MyAIStudioBackend.csproj", "{9A12B852-78E4-428A-851E-4E5C9E11400A}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{A3D43BBE-1090-41AA-B8B7-EA3CD763A48C}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{A3D43BBE-1090-41AA-B8B7-EA3CD763A48C}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{A3D43BBE-1090-41AA-B8B7-EA3CD763A48C}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{A3D43BBE-1090-41AA-B8B7-EA3CD763A48C}.Release|Any CPU.Build.0 = Release|Any CPU
		{9A12B852-78E4-428A-851E-4E5C9E11400A}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{9A12B852-78E4-428A-851E-4E5C9E11400A}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{9A12B852-78E4-428A-851E-4E5C9E11400A}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{9A12B852-78E4-428A-851E-4E5C9E11400A}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
EndGlobal`;
}

export function getBackendCsprojTemplate(): string {
  return `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>MyAIStudioBackend</RootNamespace>
    <AssemblyName>MyAIStudioBackend</AssemblyName>
    <UserSecretsId>aistudio-backend-secrets</UserSecretsId>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  </ItemGroup>

</Project>`;
}

export function getBackendProgramCsTemplate(): string {
  return `using MyAIStudioBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container (ASP.NET Core MVC Controllers)
builder.Services.AddControllers();

// Register HttpClient and Gemini API Service
builder.Services.AddHttpClient<IGeminiApiService, GeminiApiService>();

// Configure CORS for Visual Studio Extension and Web Clients
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Google AI Studio C# Backend API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();`;
}

export function getBackendChatControllerCsTemplate(config: ExtensionConfig): string {
  const safeModel = config.defaultModel || "gemini-3.5-flash";
  return `using Microsoft.AspNetCore.Mvc;
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
        /// Proxies prompts from Visual Studio Chatbot extension to Google AI Studio Gemini API securely.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> PostChat([FromBody] ChatRequestDto request)
        {
            if (request == null || request.Messages == null || request.Messages.Count == 0)
            {
                return BadRequest(new ChatResponseDto { Error = "Invalid request format. 'messages' array is required." });
            }

            if (string.IsNullOrEmpty(request.Model))
            {
                request.Model = "${safeModel}";
            }

            _logger.LogInformation("Processing ASP.NET Core MVC C# Chat request with model {Model}", request.Model);

            var result = await _geminiService.GenerateContentAsync(request);

            if (!string.IsNullOrEmpty(result.Error))
            {
                return StatusCode(500, result);
            }

            return Ok(result);
        }
    }
}`;
}

export function getBackendHealthControllerCsTemplate(): string {
  return `using Microsoft.AspNetCore.Mvc;

namespace MyAIStudioBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHealth()
        {
            return Ok(new
            {
                status = "ok",
                service = "Google AI Studio ASP.NET Core MVC Backend API",
                timestamp = DateTime.UtcNow,
                framework = ".NET 8.0 / C#"
            });
        }
    }
}`;
}

export function getBackendGeminiServiceCsTemplate(): string {
  return `using System.Text;
using System.Text.Json;
using MyAIStudioBackend.Models;

namespace MyAIStudioBackend.Services
{
    public interface IGeminiApiService
    {
        Task<ChatResponseDto> GenerateContentAsync(ChatRequestDto request);
    }

    public class GeminiApiService : IGeminiApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GeminiApiService> _logger;

        public GeminiApiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiApiService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<ChatResponseDto> GenerateContentAsync(ChatRequestDto request)
        {
            var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY") 
                         ?? _configuration["Gemini:ApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                return new ChatResponseDto
                {
                    Error = "Google AI Studio GEMINI_API_KEY is missing. Please configure GEMINI_API_KEY in environment variables or appsettings.json."
                };
            }

            var model = string.IsNullOrWhiteSpace(request.Model) 
                ? (_configuration["Gemini:DefaultModel"] ?? "gemini-3.5-flash") 
                : request.Model;

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            var payload = new GeminiApiPayload
            {
                Contents = request.Messages.Select(m => new GeminiContent
                {
                    Role = m.Role == "assistant" ? "model" : "user",
                    Parts = new List<GeminiPart> { new GeminiPart { Text = m.Content } }
                }).ToList(),
                SystemInstruction = !string.IsNullOrWhiteSpace(request.SystemPrompt)
                    ? new GeminiSystemInstruction
                    {
                        Parts = new List<GeminiPart> { new GeminiPart { Text = request.SystemPrompt } }
                    }
                    : null,
                GenerationConfig = new GeminiGenerationConfig { Temperature = 0.7 }
            };

            var jsonContent = JsonSerializer.Serialize(payload);
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(jsonContent, Encoding.UTF8, "application/json")
            };

            httpRequest.Headers.Add("User-Agent", "aistudio-build-csharp");

            try
            {
                var response = await _httpClient.SendAsync(httpRequest);
                var responseBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Gemini API Error Response: {ResponseBody}", responseBody);
                    return new ChatResponseDto
                    {
                        Error = $"Gemini API status code {(int)response.StatusCode}: {responseBody}"
                    };
                }

                var geminiResult = JsonSerializer.Deserialize<GeminiApiResponse>(responseBody);

                if (geminiResult?.Error != null && !string.IsNullOrEmpty(geminiResult.Error.Message))
                {
                    return new ChatResponseDto { Error = geminiResult.Error.Message };
                }

                var textResponse = geminiResult?.Candidates?.FirstOrDefault()
                    ?.Content?.Parts?.FirstOrDefault()?.Text;

                return new ChatResponseDto
                {
                    Text = textResponse ?? "No response content generated by model."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in C# GeminiApiService");
                return new ChatResponseDto
                {
                    Error = $"Internal C# Server Exception: {ex.Message}"
                };
            }
        }
    }
}`;
}

export function getBackendChatModelsCsTemplate(): string {
  return `using System.Text.Json.Serialization;

namespace MyAIStudioBackend.Models
{
    public class ChatMessageItem
    {
        [JsonPropertyName("role")]
        public string Role { get; set; } = "user";

        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;
    }

    public class ChatRequestDto
    {
        [JsonPropertyName("messages")]
        public List<ChatMessageItem> Messages { get; set; } = new();

        [JsonPropertyName("systemPrompt")]
        public string? SystemPrompt { get; set; }

        [JsonPropertyName("model")]
        public string Model { get; set; } = "gemini-3.5-flash";
    }

    public class ChatResponseDto
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;

        [JsonPropertyName("error")]
        public string? Error { get; set; }
    }

    public class GeminiPart
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }

    public class GeminiContent
    {
        [JsonPropertyName("role")]
        public string Role { get; set; } = "user";

        [JsonPropertyName("parts")]
        public List<GeminiPart> Parts { get; set; } = new();
    }

    public class GeminiSystemInstruction
    {
        [JsonPropertyName("parts")]
        public List<GeminiPart> Parts { get; set; } = new();
    }

    public class GeminiGenerationConfig
    {
        [JsonPropertyName("temperature")]
        public double Temperature { get; set; } = 0.7;
    }

    public class GeminiApiPayload
    {
        [JsonPropertyName("contents")]
        public List<GeminiContent> Contents { get; set; } = new();

        [JsonPropertyName("systemInstruction")]
        public GeminiSystemInstruction? SystemInstruction { get; set; }

        [JsonPropertyName("generationConfig")]
        public GeminiGenerationConfig GenerationConfig { get; set; } = new();
    }

    public class GeminiCandidate
    {
        [JsonPropertyName("content")]
        public GeminiContent? Content { get; set; }
    }

    public class GeminiApiResponse
    {
        [JsonPropertyName("candidates")]
        public List<GeminiCandidate>? Candidates { get; set; }

        [JsonPropertyName("error")]
        public GeminiApiError? Error { get; set; }
    }

    public class GeminiApiError
    {
        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;
    }
}`;
}

export function getBackendAppSettingsTemplate(config: ExtensionConfig): string {
  return `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Gemini": {
    "ApiKey": "",
    "DefaultModel": "${config.defaultModel || "gemini-3.5-flash"}"
  }
}`;
}


