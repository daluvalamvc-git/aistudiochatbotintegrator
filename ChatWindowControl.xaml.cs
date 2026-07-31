using System;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using Microsoft.Web.WebView2.Core;

namespace MyAIStudioExtension
{
    public partial class ChatWindowControl : UserControl
    {
        public ChatWindowControl()
        {
            InitializeComponent();
            _ = InitializeWebViewAsync();
        }

        private async System.Threading.Tasks.Task InitializeWebViewAsync()
        {
            try
            {
                // Set default background color to dark zinc (#18181b) to avoid white or black blank flash
                webView.DefaultBackgroundColor = System.Drawing.Color.FromArgb(255, 24, 24, 27);

                // Create custom UserDataFolder in LocalAppData so WebView2 has write permissions when running inside Visual Studio (devenv.exe)
                string userDataFolder = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "AIStudioChatbot",
                    "WebView2Data"
                );
                Directory.CreateDirectory(userDataFolder);

                CoreWebView2Environment env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
                
                // Wire navigation events before initialization
                webView.CoreWebView2InitializationCompleted += WebView_CoreWebView2InitializationCompleted;
                await webView.EnsureCoreWebView2Async(env);

                string assemblyFolder = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                
                // Look for chatbot.html first, then fallback to index.html
                string htmlPath = Path.Combine(assemblyFolder, "chatbot.html");
                if (!File.Exists(htmlPath))
                {
                    htmlPath = Path.Combine(assemblyFolder, "index.html");
                }

                if (File.Exists(htmlPath))
                {
                    string targetFileName = Path.GetFileName(htmlPath);
                    webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        "aistudio.local",
                        assemblyFolder,
                        CoreWebView2HostResourceAccessKind.Allow
                    );

                    webView.CoreWebView2.NavigationCompleted += (s, e) =>
                    {
                        if (e.IsSuccess)
                        {
                            if (txtError != null) txtError.Visibility = Visibility.Collapsed;
                            webView.Visibility = Visibility.Visible;
                        }
                        else
                        {
                            ShowError($"Failed to load web content. Error status: {e.WebErrorStatus}");
                        }
                    };

                    webView.CoreWebView2.Navigate($"https://aistudio.local/{targetFileName}");
                }
                else
                {
                    webView.CoreWebView2.NavigateToString(@"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <style>
        body { background: #18181b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; text-align: center; }
        h2 { color: #38bdf8; margin-top: 0; }
        p { color: #a1a1aa; line-height: 1.5; }
    </style>
</head>
<body>
    <h2>AI Studio Chatbot</h2>
    <p>chatbot.html or index.html not found in extension output directory.</p>
</body>
</html>");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"WebView2 initialization failed: {ex}");
                ShowError($"Failed to initialize WebView2:\n\n{ex.Message}\n\nPlease ensure Microsoft Edge WebView2 Runtime is installed.");
            }
        }

        private void WebView_CoreWebView2InitializationCompleted(object sender, CoreWebView2InitializationCompletedEventArgs e)
        {
            if (!e.IsSuccess)
            {
                ShowError($"WebView2 Core Initialization Error:\n\n{e.InitializationException?.Message}");
            }
        }

        private void ShowError(string message)
        {
            if (txtError != null)
            {
                txtError.Text = message;
                txtError.Visibility = Visibility.Visible;
            }
            webView.Visibility = Visibility.Collapsed;
        }
    }
}

