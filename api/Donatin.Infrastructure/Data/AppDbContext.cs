using Donatin.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Infrastructure.Data;

public class AppDbContext : DbContext
{
    // Construtor que repassa as opções de conexão (PostgreSQL) para a classe pai DbContext
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Representa a tabela "Users" dentro do banco de dados PostgreSQL
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Mapeamento explícito da entidade para o banco de dados
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id); // Define Id como chave primária
            entity.HasIndex(u => u.Email).IsUnique(); // Garante que e-mails não se repitam
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.City).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Uf).IsRequired().HasMaxLength(2);
        });
    }
}