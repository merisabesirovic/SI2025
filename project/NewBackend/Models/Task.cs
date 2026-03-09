using System.ComponentModel.DataAnnotations;

namespace NewBackend.Models;

public class TaskItem
{
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Status { get; set; } = "todo";

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? DueDateUtc { get; set; }

    public int UserId { get; set; }
    
    public User? User { get; set; }
}
