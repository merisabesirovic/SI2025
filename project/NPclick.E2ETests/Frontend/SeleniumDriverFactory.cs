using OpenQA.Selenium.Chrome;

namespace NPclick.E2ETests.Frontend;

public static class SeleniumDriverFactory
{
    public static ChromeDriver Create()
    {
        var chromeOptions = new ChromeOptions();

        // Headless by default; set E2E_HEADLESS=false to see the browser.
        var headless = Environment.GetEnvironmentVariable("E2E_HEADLESS");
        if (!string.Equals(headless, "false", StringComparison.OrdinalIgnoreCase))
        {
            chromeOptions.AddArgument("--headless=new");
        }

        chromeOptions.AddArgument("--window-size=1920,1080");
        return new ChromeDriver(chromeOptions);
    }
}
