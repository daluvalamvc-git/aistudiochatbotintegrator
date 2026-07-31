using System;
using System.IO;
using System.Windows.Controls;
using Microsoft.Web.WebView2.Core;

namespace MyAIStudioExtension
{
    public partial class ChatWindowControl : UserControl
    {
        public ChatWindowControl()
        {
            InitializeComponent();
            InitializeWebViewAsync();
        }

        private async void InitializeWebViewAsync()
        {
            try
            {
                await webView.EnsureCoreWebView2Async(null);
                
                string assemblyFolder = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                string htmlPath = Path.Combine(assemblyFolder, "index.html");

                if (File.Exists(htmlPath))
                {
                    webView.CoreWebView2.Navigate(new Uri(htmlPath).AbsoluteUri);
                }
                else
                {
                    webView.CoreWebView2.NavigateToString("<html><body style='background:#121212;color:#fff;font-family:sans-serif;'><h3>AI Studio Chatbot</h3><p>index.html asset not found in output folder.</p></body></html>");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"WebView2 initialization failed: {ex.Message}");
            }
        }
    }
}
