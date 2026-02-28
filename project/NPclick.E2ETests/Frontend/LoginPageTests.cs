using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace NPclick.E2ETests.Frontend;

public class LoginPageTests
{
    [Trait("Category", "Frontend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public void LoginPage_ShouldRenderRequiredElements()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/login");

        var title = wait.Until(d =>
            d.FindElement(By.XPath("//p[contains(@class,'form-title') and contains(normalize-space(),'Ulogujte se')]")));

        var usernameInput = driver.FindElement(By.XPath("//input[contains(@placeholder,'korisni')]"));
        var passwordInput = driver.FindElement(By.XPath("//input[contains(@placeholder,'lozinku')]"));
        var submitButton = driver.FindElement(By.CssSelector("button.submit"));

        Assert.True(title.Displayed);
        Assert.True(usernameInput.Displayed);
        Assert.True(passwordInput.Displayed);
        Assert.True(submitButton.Displayed);
        Assert.Equal("submit", submitButton.Text.Trim().ToLowerInvariant());
    }

    [Trait("Category", "Frontend")]
    [Trait("Category", "Auth")]
    [Fact]
    public void LoginPage_ForgotPasswordLink_ShouldNavigateToForgotPasswordPage()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/login");

        var forgotPasswordLink = wait.Until(d =>
            d.FindElement(By.XPath("//p[contains(@class,'signup-link') and contains(normalize-space(),'Zaboravili ste lozinku')]")));

        forgotPasswordLink.Click();

        wait.Until(d => d.Url.Contains("/forgot_password", StringComparison.OrdinalIgnoreCase));
        Assert.Contains("/forgot_password", driver.Url, StringComparison.OrdinalIgnoreCase);
    }

    [Trait("Category", "Frontend")]
    [Trait("Category", "Auth")]
    [Fact]
    public void ResetPasswordPage_ShouldPrefillEmailAndTokenFromQueryString()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        const string email = "test@example.com";
        const string token = "my-test-token";
        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/reset_password?email={email}&token={token}");

        var emailInput = wait.Until(d => d.FindElement(By.CssSelector("input[type='email']")));
        var tokenInput = driver.FindElement(By.XPath("//input[contains(@placeholder,'kod')]"));

        Assert.Equal(email, emailInput.GetAttribute("value"));
        Assert.Equal(token, tokenInput.GetAttribute("value"));
    }

    [Trait("Category", "Frontend")]
    [Trait("Category", "Smoke")]
    [Fact]
    public void ExplorePage_ShouldRenderCategoryCards()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/explore");

        wait.Until(d => d.FindElements(By.CssSelector(".category-card")).Count > 0);
        var categoryCards = driver.FindElements(By.CssSelector(".category-card"));

        Assert.True(categoryCards.Count >= 6);
    }
}
