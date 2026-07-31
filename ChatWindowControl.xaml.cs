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
                // Create custom UserDataFolder in LocalAppData so WebView2 has write permissions when running inside Visual Studio (devenv.exe)
                string userDataFolder = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "AIStudioChatbot",
                    "WebView2Data"
                );
                Directory.CreateDirectory(userDataFolder);

                CoreWebView2Environment env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
                await webView.EnsureCoreWebView2Async(env);

                string assemblyFolder = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                string htmlPath = Path.Combine(assemblyFolder, "index.html");

                if (File.Exists(htmlPath))
                {
                    webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        "aistudio.local",
                        assemblyFolder,
                        CoreWebView2HostResourceAccessKind.Allow
                    );
                    webView.CoreWebView2.Navigate("https://aistudio.local/index.html");
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
    <p>index.html not found in output folder. Ensure index.html is copied to the extension output directory.</p>
</body>
</html>");
                }

                if (txtError != null)
                {
                    txtError.Visibility = Visibility.Collapsed;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"WebView2 initialization failed: {ex}");
                
                if (txtError != null)
                {
                    txtError.Text = $"Failed to initialize WebView2:\n\n{ex.Message}\n\nPlease ensure Microsoft Edge WebView2 Runtime is installed.";
                    txtError.Visibility = Visibility.Visible;
                }
            }
        }
    }
}
