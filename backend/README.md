# Google AI Studio C# ASP.NET Core MVC Backend

This repository contains the converted **ASP.NET Core MVC C# Web API Backend** that proxies requests from the Visual Studio 2022/2026 Chatbot Extension to Google AI Studio Gemini API securely server-side.

## Project Structure

```
backend/
├── MyAIStudioBackend.sln         # Visual Studio Solution File
├── MyAIStudioBackend.csproj      # ASP.NET Core MVC SDK C# Project File
├── Program.cs                     # ASP.NET Core WebHost Bootstrapper & CORS Configuration
├── appsettings.json              # Configuration file (GEMINI_API_KEY settings)
├── Controllers/
│   ├── ChatController.cs         # ASP.NET MVC Controller handling /api/chat requests
│   └── HealthController.cs       # Health check API controller
├── Services/
│   ├── IGeminiApiService.cs      # Service interface for Google AI Studio API calls
│   └── GeminiApiService.cs        # C# HttpClient service calling Gemini v1beta REST API
└── Models/
    └── ChatModels.cs             # C# DTOs and Google AI Studio request/response models
```

## How to Run in Visual Studio 2022 / 2026

1. **Open Solution**:
   Double click `MyAIStudioBackend.sln` to launch Visual Studio.

2. **Configure API Key**:
   - Set environment variable `GEMINI_API_KEY` on your machine, OR
   - Edit `appsettings.json` and set `"ApiKey": "YOUR_GEMINI_API_KEY"`.

3. **Restore & Run**:
   - Press **F5** or click **Start (MyAIStudioBackend)** in the top toolbar.
   - Visual Studio will compile the C# code and launch Swagger UI at `https://localhost:7123/swagger`.

4. **API Endpoints**:
   - `POST /api/chat` : Securely sends conversation prompts and code selections to Google AI Studio.
   - `GET /api/health` : Returns backend service health status.
