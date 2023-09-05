using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace work_01
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst(ClaimTypes.Email)?.Value;
        }
    }
}
