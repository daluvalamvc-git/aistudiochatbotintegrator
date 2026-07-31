using System;
using System.Runtime.InteropServices;
using Microsoft.VisualStudio.Shell;

namespace MyAIStudioExtension
{
    [Guid("d6e4f3a2-1111-2222-3333-444455556666")]
    public class ChatWindow : ToolWindowPane
    {
        public ChatWindow() : base(null)
        {
            this.Caption = "AI Studio Chatbot";
            this.Content = new ChatWindowControl();
        }
    }
}
