using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces;
using Donatin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Infrastructure.Respositories;

public class UserRepository : IUserRepository
{
  private readonly AppDbContext _context;

  public UserRepository(AppDbContext context)
  {
    _context = context;
  }

  public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
  {
    return await _context.Users
      .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
  }

  public async Task AddAsync(User user, CancellationToken cancellationToken = default)
  {
    await _context.Users.AddAsync(user, cancellationToken);
    await _context.SaveChangesAsync(cancellationToken);
  }
}