using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace api.Service
{
public class EmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
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
