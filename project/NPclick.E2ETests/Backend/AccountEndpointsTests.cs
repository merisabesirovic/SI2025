using System.Net;
using System.Net.Http.Json;

namespace NPclick.E2ETests.Backend;

public class AccountEndpointsTests
{
    [Trait("Category", "Backend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public async Task ResetPasswordPage_ShouldBeReachable()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/account/reset-password?email=test@example.com&token=test-token");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.IsSuccessStatusCode || isRedirect);

        if (response.IsSuccessStatusCode)
        {
            Assert.Equal("text/html", response.Content.Headers.ContentType?.MediaType);
            var html = await response.Content.ReadAsStringAsync();
            Assert.Contains("reset_password", html, StringComparison.OrdinalIgnoreCase);
        }
        else
        {
            Assert.NotNull(response.Headers.Location);
        }
    }

    [Trait("Category", "Backend")]
    [Trait("Category", "Auth")]
    [Fact]
    public async Task Login_WithInvalidPayload_ShouldReturnBadRequestOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.PostAsJsonAsync("/api/account/login", new { });
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || isRedirect);
    }
}
