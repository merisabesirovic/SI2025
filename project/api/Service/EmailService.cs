using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace api.Service
{
public class EmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger, IHttpClientFactory httpClientFactory)
    {
        _configuration = configuration;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var resendApiKey = _configuration["Resend:ApiKey"];
        if (!string.IsNullOrWhiteSpace(resendApiKey))
        {
            await SendViaResendAsync(toEmail, subject, body, resendApiKey);
            return;
        }

        await SendViaSmtpAsync(toEmail, subject, body);
    }

    private async Task SendViaResendAsync(string toEmail, string subject, string body, string resendApiKey)
    {
        var defaultFromEmail = _configuration["EmailSettings:FromEmail"] ?? _configuration["EmailSettings:Username"];
        var resendFromEmail = _configuration["Resend:FromEmail"] ?? defaultFromEmail;

        if (string.IsNullOrWhiteSpace(resendFromEmail))
        {
            throw new InvalidOperationException("Resend is configured but sender email is missing (Resend:FromEmail or EmailSettings:FromEmail).");
        }

        var payload = new
        {
            from = resendFromEmail,
            to = new[] { toEmail },
            subject,
            html = body
        };

        var client = _httpClientFactory.CreateClient();
        client.BaseAddress = new Uri("https://api.resend.com/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", resendApiKey.Trim());

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync("emails", content);
        if (response.IsSuccessStatusCode)
        {
            return;
        }

        var responseBody = await response.Content.ReadAsStringAsync();
        _logger.LogError(
            "Resend send failed. Status={StatusCode}. Response={Response}",
            (int)response.StatusCode,
            responseBody
        );
        throw new InvalidOperationException($"Email sending failed via Resend. Status code: {(int)response.StatusCode}");
    }

    private async Task SendViaSmtpAsync(string toEmail, string subject, string body)
    {
        var smtpServer = _configuration["EmailSettings:SmtpServer"];
        var port = int.TryParse(_configuration["EmailSettings:Port"], out var parsedPort) ? parsedPort : 587;
        var enableSsl = bool.TryParse(_configuration["EmailSettings:EnableSsl"], out var parsedEnableSsl) ? parsedEnableSsl : true;
        var username = _configuration["EmailSettings:Username"];
        var password = _configuration["EmailSettings:Password"];
        var fromEmail = _configuration["EmailSettings:FromEmail"] ?? username;

        if (!string.IsNullOrWhiteSpace(password))
        {
            password = password.Trim().Trim('"');
            if (!string.IsNullOrWhiteSpace(smtpServer) &&
                smtpServer.Contains("gmail.com", StringComparison.OrdinalIgnoreCase))
            {
                password = password.Replace(" ", string.Empty);
            }
        }

        if (string.IsNullOrWhiteSpace(smtpServer) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(fromEmail))
        {
            throw new InvalidOperationException("EmailSettings are not configured correctly.");
        }

        var smtpClient = new SmtpClient(smtpServer)
        {
            Port = port,
            Credentials = new NetworkCredential(username, password),
            UseDefaultCredentials = false,
            EnableSsl = enableSsl
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(fromEmail),
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(toEmail);

        try
        {
            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "SMTP send failed. Host={Host} Port={Port} SSL={EnableSsl} From={FromEmail} To={ToEmail} UsernameConfigured={HasUsername}",
                smtpServer,
                port,
                enableSsl,
                fromEmail,
                toEmail,
                !string.IsNullOrWhiteSpace(username)
            );
            throw;
        }
    }
}

}
