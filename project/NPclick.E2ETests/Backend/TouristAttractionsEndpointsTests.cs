using System.Net;

namespace NPclick.E2ETests.Backend;

public class TouristAttractionsEndpointsTests
{
    [Trait("Category", "Backend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public async Task TouristAttractions_GetAll_ShouldReturnSuccessOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/tourist_attractions");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.IsSuccessStatusCode || isRedirect);
    }

    [Trait("Category", "Backend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public async Task TouristAttractions_GetByInvalidId_ShouldReturnNotFoundOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/tourist_attractions/2147483647");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.NotFound || isRedirect);
    }

    [Trait("Category", "Backend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public async Task TouristAttractions_CheckCreated_WithoutExistingUser_ShouldReturnNotFoundOrRedirect()
    {
        using var client = BackendApiClientFactory.Create();

        var response = await client.GetAsync("/api/tourist_attractions/checkCreated/non-existent-user-id");
        var isRedirect = BackendApiClientFactory.IsRedirect(response.StatusCode);

        Assert.True(response.StatusCode == HttpStatusCode.NotFound || isRedirect);
    }
}
