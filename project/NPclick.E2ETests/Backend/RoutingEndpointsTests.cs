using System.Net;

namespace NPclick.E2ETests.Backend;

public class RoutingEndpointsTests
{
    [Trait("Category", "Backend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public async Task UnknownApiRoute_ShouldReturnNotFoundOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/this-route-does-not-exist");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.NotFound || isRedirect);
    }
}
