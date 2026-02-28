using System.Net;
using System.Net.Http.Json;

namespace NPclick.E2ETests.Backend;

public class AuthorizationEndpointsTests
{
    [Trait("Category", "Backend")]
    [Trait("Category", "Auth")]
    [Fact]
    public async Task UsersEndpoint_WithoutToken_ShouldReturnUnauthorizedOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/users");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized || isRedirect);
    }

    [Trait("Category", "Backend")]
    [Trait("Category", "Auth")]
    [Fact]
    public async Task PortfolioEndpoint_WithoutToken_ShouldReturnUnauthorizedOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/portfolio");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized || isRedirect);
    }

    [Trait("Category", "Backend")]
    [Trait("Category", "Auth")]
    [Fact]
    public async Task PortfolioAdd_WithoutToken_ShouldReturnUnauthorizedOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.PostAsync("/api/portfolio?name=SomeAttraction", content: null);
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized || isRedirect);
    }

    [Trait("Category", "Backend")]
    [Trait("Category", "Auth")]
    [Fact]
    public async Task ReviewsCreate_WithoutToken_ShouldReturnUnauthorizedOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.PostAsJsonAsync("/api/comment/1", new { rating = 5, comment = "Odlicno" });
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized || isRedirect);
    }
}
