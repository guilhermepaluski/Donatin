namespace Donatin.Domain.Interfaces;

public interface IUserRepository
{
  Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
  Task AddAsync(User user, CancellationToken cancellationToken = default);
}