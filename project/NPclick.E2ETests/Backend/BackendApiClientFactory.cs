using System.Net;

namespace NPclick.E2ETests.Backend;

public static class BackendApiClientFactory
{
    public static string ApiBaseUrl =>
        Environment.GetEnvironmentVariable("E2E_API_BASE_URL") ?? "http://localhost:5241";

    public static HttpClient Create()
    {
        var handler = new HttpClientHandler { AllowAutoRedirect = false };
        return new HttpClient(handler) { BaseAddress = new Uri(ApiBaseUrl) };
    }

    public static bool IsRedirect(HttpStatusCode statusCode) =>
        statusCode is HttpStatusCode.MovedPermanently
            or HttpStatusCode.Redirect
            or HttpStatusCode.TemporaryRedirect
            or HttpStatusCode.PermanentRedirect;
}
