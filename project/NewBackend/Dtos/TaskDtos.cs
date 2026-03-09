using System.ComponentModel.DataAnnotations;

namespace NewBackend.Dtos;

public class CreateTaskRequest
{
    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Status { get; set; } = "todo";

    public DateTime? DueDateUtc { get; set; }
}

public class UpdateTaskRequest
{
    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Status { get; set; } = "todo";

    public DateTime? DueDateUtc { get; set; }
}

public class TaskResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? DueDateUtc { get; set; }
}
