using Microsoft.EntityFrameworkCore;
using NewBackend.Models;

namespace NewBackend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Username).HasMaxLength(50);
            entity.Property(u => u.Email).HasMaxLength(255);
            entity.Property(u => u.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.Property(t => t.Title).HasMaxLength(120).IsRequired();
            entity.Property(t => t.Description).HasMaxLength(2000);
            entity.Property(t => t.Comment).HasMaxLength(1000);
            entity.Property(t => t.Status).HasMaxLength(20).IsRequired();
            entity.HasIndex(t => new { t.UserId, t.Status });
            entity
                .HasOne(t => t.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
