using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace NPclick.E2ETests.Frontend;

public class RegisterPageTests
{
    [Trait("Category", "Frontend")]
    [Trait("Category", "Auth")]
    [Fact]
    public void RegisterUserPage_SubmitShouldBeDisabledUntilFormIsValid()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/register_user");

        var usernameInput = wait.Until(d => d.FindElement(By.XPath("//input[contains(@placeholder,'Korisni')]")));
        var emailInput = driver.FindElement(By.CssSelector("input[type='email']"));
        var passwordInput = driver.FindElement(By.XPath("//input[contains(@placeholder,'lozinku')]"));
        var submitButton = driver.FindElement(By.CssSelector("button.submit"));

        Assert.True(submitButton.GetAttribute("disabled") is not null);

        usernameInput.SendKeys("testuser");
        emailInput.SendKeys("test.user@example.com");
        passwordInput.SendKeys("Password1!");

        wait.Until(_ => submitButton.GetAttribute("disabled") is null);
        Assert.True(submitButton.Enabled);
    }

    [Trait("Category", "Frontend")]
    [Trait("Category", "Auth")]
    [Fact]
    public void RegisterCompanyPage_SubmitShouldBeDisabledUntilFormIsValid()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/register_company");

        var usernameInput = wait.Until(d => d.FindElement(By.XPath("//input[contains(@placeholder,'korisni')]")));
        var emailInput = driver.FindElement(By.XPath("//input[contains(@placeholder,'poslovni email')]"));
        var passwordInput = driver.FindElement(By.XPath("//input[contains(@placeholder,'ifru')]"));
        var submitButton = driver.FindElement(By.CssSelector("button.submit"));

        Assert.True(submitButton.GetAttribute("disabled") is not null);

        usernameInput.SendKeys("companyuser");
        emailInput.SendKeys("company@example.com");
        passwordInput.SendKeys("Password1!");

        wait.Until(_ => submitButton.GetAttribute("disabled") is null);
        Assert.True(submitButton.Enabled);
    }

    [Trait("Category", "Frontend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public void ExplorePage_CategoryCardClick_ShouldNavigateToAttractions()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/explore");

        wait.Until(d => d.FindElements(By.CssSelector(".category-card")).Count > 0);
        var firstCategoryCard = driver.FindElements(By.CssSelector(".category-card")).First();

        firstCategoryCard.Click();

        wait.Until(d => d.Url.Contains("/attractions?category=", StringComparison.OrdinalIgnoreCase));
        Assert.Contains("/attractions?category=", driver.Url, StringComparison.OrdinalIgnoreCase);
    }
}
