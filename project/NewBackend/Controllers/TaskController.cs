using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewBackend.Data;
using NewBackend.Dtos;
using NewBackend.Models;

namespace NewBackend.Controllers;

[ApiController]
[Authorize]
[Route("api/tasks")]
public class TaskController : ControllerBase
{
    private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "todo",
        "in_progress",
        "review",
        "done"
    };

    private readonly ApplicationDbContext _context;

    public TaskController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetMyTasks()
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var tasks = await _context.Tasks
            .AsNoTracking()
            .Where(t => t.UserId == userId.Value)
            .OrderByDescending(t => t.CreatedAtUtc)
            .Select(t => ToResponse(t))
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TaskResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskResponse>> GetById(int id)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var task = await _context.Tasks
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);

        if (task is null)
        {
            return NotFound();
        }

        return Ok(ToResponse(task));
    }

    [HttpPost]
    [ProducesResponseType(typeof(TaskResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TaskResponse>> Create([FromBody] CreateTaskRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!TryNormalizeStatus(request.Status, out var normalizedStatus))
        {
            return BadRequest(new { message = "Invalid status." });
        }

        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var task = new TaskItem
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Comment = request.Comment.Trim(),
            Status = normalizedStatus,
            DueDateUtc = request.DueDateUtc,
            UserId = userId.Value,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, ToResponse(task));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(TaskResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskResponse>> Update(int id, [FromBody] UpdateTaskRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!TryNormalizeStatus(request.Status, out var normalizedStatus))
        {
            return BadRequest(new { message = "Invalid status. Allowed: todo, in_progress, review, done." });
        }

        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);
        if (task is null)
        {
            return NotFound();
        }

        task.Title = request.Title.Trim();
        task.Description = request.Description.Trim();
        task.Comment = request.Comment.Trim();
        task.Status = normalizedStatus;
        task.DueDateUtc = request.DueDateUtc;

        await _context.SaveChangesAsync();
        return Ok(ToResponse(task));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);
        if (task is null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private int? GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return int.TryParse(sub, out var userId) ? userId : null;
    }

    private static bool TryNormalizeStatus(string? rawStatus, out string normalizedStatus)
    {
        normalizedStatus = (rawStatus ?? string.Empty).Trim().ToLowerInvariant();
        return AllowedStatuses.Contains(normalizedStatus);
    }

    private static TaskResponse ToResponse(TaskItem task)
    {
        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Comment = task.Comment,
            Status = task.Status,
            CreatedAtUtc = task.CreatedAtUtc,
            DueDateUtc = task.DueDateUtc
        };
    }
}
