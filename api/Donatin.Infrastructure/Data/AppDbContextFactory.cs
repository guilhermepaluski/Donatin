using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Donatin.Infrastructure.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        DotNetEnv.Env.TraversePath().Load();

        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DonatinDb");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("A variável 'ConnectionStrings__DonatinDb' não foi encontrada no arquivo .env!");
        }

        var builder = new DbContextOptionsBuilder<AppDbContext>();
        builder.UseNpgsql(connectionString);

        return new AppDbContext(builder.Options);
    }
}