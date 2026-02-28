using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace NPclick.E2ETests.Frontend;

public class AuthPagesTests
{
    [Trait("Category", "Frontend")]
    [Trait("Category", "Auth")]
    [Fact]
    public void ForgotPasswordPage_ShouldRenderEmailInputAndSubmitButton()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/forgot_password");

        var emailInput = wait.Until(d => d.FindElement(By.CssSelector("input[type='email']")));
        var submitButton = driver.FindElement(By.CssSelector("button[type='submit']"));

        Assert.True(emailInput.Displayed);
        Assert.True(submitButton.Displayed);
    }

    [Trait("Category", "Frontend")]
    [Trait("Category", "Auth")]
    [Fact]
    public void ResetPasswordPage_ShouldRenderAllRequiredInputs()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/reset_password");

        var emailInput = wait.Until(d => d.FindElement(By.CssSelector("input[type='email']")));
        var passwordInput = driver.FindElement(By.CssSelector("input[type='password']"));
        var tokenInput = driver.FindElement(By.XPath("//input[contains(@placeholder,'kod')]"));
        var submitButton = driver.FindElement(By.CssSelector("button[type='submit']"));

        Assert.True(emailInput.Displayed);
        Assert.True(passwordInput.Displayed);
        Assert.True(tokenInput.Displayed);
        Assert.True(submitButton.Displayed);
    }

    [Trait("Category", "Frontend")]
    [Trait("Category", "Auth")]
    [Fact]
    public void LoginPage_RegisterLink_ShouldNavigateToRegisterUser()
    {
        using var driver = SeleniumDriverFactory.Create();
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        driver.Navigate().GoToUrl($"{SeleniumTestConfig.AppBaseUrl}/login");

        var registerLink = wait.Until(d => d.FindElement(By.CssSelector("a[href='/register_user']")));
        registerLink.Click();

        wait.Until(d => d.Url.Contains("/register_user", StringComparison.OrdinalIgnoreCase));
        Assert.Contains("/register_user", driver.Url, StringComparison.OrdinalIgnoreCase);
    }
}
