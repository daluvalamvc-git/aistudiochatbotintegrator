using MyAIStudioBackend.Models;

namespace MyAIStudioBackend.Services
{
    public interface IGeminiApiService
    {
        Task<ChatResponseDto> GenerateContentAsync(ChatRequestDto request);
    }
}
