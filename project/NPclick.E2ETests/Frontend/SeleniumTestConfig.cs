namespace NPclick.E2ETests.Frontend;

public static class SeleniumTestConfig
{
    public static string AppBaseUrl =>
        Environment.GetEnvironmentVariable("E2E_BASE_URL") ?? "http://localhost:3000";
}
