using Donatin.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Infrastructure.Data;

public class AppDbContext : DbContext
{
    // Construtor que repassa as opções de conexão (PostgreSQL) para a classe pai DbContext
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Representa as tabelas dentro do banco de dados PostgreSQL
    public DbSet<User> Users => Set<User>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<Schedule> Schedules => Set<Schedule>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // modelBuilder de User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id); // Define Id como chave primária
            entity.HasIndex(u => u.Email).IsUnique(); // Garante que e-mails não se repitam
            entity.HasIndex(u => u.CpfCnpj).IsUnique();
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.City).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Uf).IsRequired().HasMaxLength(2);
            entity.Property(u => u.CpfCnpj).HasMaxLength(14);
            entity.Property(u => u.AboutMe).HasMaxLength(2000);
            entity.Property(u => u.ProfilePhotoUrl).HasMaxLength(500);
        });

        // modelBuilder de Campaign
        modelBuilder.Entity<Campaign>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Title).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Description).IsRequired().HasMaxLength(2000);
            entity.Property(c => c.Category).IsRequired().HasConversion<string>();
            entity.Property(c => c.Product).IsRequired().HasMaxLength(50);
            entity.Property(c => c.GoalAmount).IsRequired();
            entity.Property(c => c.ReceiveOption).IsRequired().HasConversion<string>();
            entity.Property(c => c.ConclusionDate).IsRequired();

            entity.HasOne(c => c.User)
                  .WithMany()
                  .HasForeignKey(c => c.UserId) // FK
                  .OnDelete(DeleteBehavior.Restrict);  // restrict é para anonimizar, ao invés de excluir do banco
        });

        // modelBuilder de Donation
        modelBuilder.Entity<Donation>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Quantity).IsRequired();
            entity.Property(d => d.Notes).HasMaxLength(400);
            entity.Property(d => d.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(d => d.DonationMethod).HasConversion<string>().HasMaxLength(7);

            entity.HasOne(d => d.User)
                  .WithMany()
                  .HasForeignKey(d => d.UserId) // FK
                  .OnDelete(DeleteBehavior.Restrict); // restrict é para anonimizar, ao invés de excluir do banco

            entity.HasOne(d => d.Campaign)
                  .WithMany()
                  .HasForeignKey(d => d.CampaignId) // FK
                  .OnDelete(DeleteBehavior.Restrict); // restrict é para anonimizar, ao invés de excluir do banco
        });

        // modelBuilder de Schedule
        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(s => s.CancellationReason).HasMaxLength(400);

            entity.HasOne(s => s.Donation)
                    .WithOne()
                    .HasForeignKey<Schedule>(s => s.DonationId)
                    .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(s => s.DonationId).IsUnique(); // RN05
        });

        // modelBuilder de Notification
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.Property(n => n.Type).HasConversion<string>().HasMaxLength(30);
            entity.Property(n => n.Content).IsRequired().HasMaxLength(600);

            entity.HasOne(n => n.User)
                  .WithMany()
                  .HasForeignKey(n => n.UserId) // FK UserId
                  .OnDelete(DeleteBehavior.Cascade); // user notifications are deleted if the user is deleted too

            entity.HasOne(n => n.Donation)
                  .WithMany()
                  .HasForeignKey(n => n.DonationId) // FK DonationId
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(n => new { n.UserId, n.CreatedAt });
        });
    }
}