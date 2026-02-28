using System.Net;

namespace NPclick.E2ETests.Backend;

public class ReviewsEndpointsTests
{
    [Trait("Category", "Backend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public async Task Reviews_GetAll_ShouldReturnSuccessOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/comment");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.IsSuccessStatusCode || isRedirect);
    }

    [Trait("Category", "Backend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public async Task Reviews_GetByInvalidId_ShouldReturnNotFoundOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/comment/2147483647");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.NotFound || isRedirect);
    }

    [Trait("Category", "Backend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public async Task Reviews_DeleteInvalidId_ShouldReturnNotFoundOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.DeleteAsync("/api/comment/2147483647");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.NotFound || isRedirect);
    }
}
