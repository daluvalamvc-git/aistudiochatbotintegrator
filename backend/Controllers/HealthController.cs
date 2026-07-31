using Microsoft.AspNetCore.Mvc;

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
}
