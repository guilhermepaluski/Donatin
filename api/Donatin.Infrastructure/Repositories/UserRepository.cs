using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
  private readonly AppDbContext _context; // Armazena a referência do DbContext

  public UserRepository(AppDbContext context)
  {
    _context = context;
  }

  // Busca um usuário no PostgreSQL usando o e-mail digitado no Login/Cadastro
  public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
  {
    return await _context.Users
      .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
  }

  // Adiciona o novo usuário na tabela e salva no banco de dados de forma assíncrona
  public async Task AddAsync(User user, CancellationToken cancellationToken = default)
  {
    await _context.Users.AddAsync(user, cancellationToken); // Adiciona na memória do EF
    await _context.SaveChangesAsync(cancellationToken);     // Executa o SQL "INSERT INTO Users..."
  }
}