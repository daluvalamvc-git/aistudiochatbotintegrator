using Microsoft.AspNetCore.Mvc;
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

            _logger.LogInformation("Processing C# ASP.NET MVC Chat request with model {Model}", request.Model);

            var result = await _geminiService.GenerateContentAsync(request);

            if (!string.IsNullOrEmpty(result.Error))
            {
                return StatusCode(500, result);
            }

            return Ok(result);
        }
    }
}
