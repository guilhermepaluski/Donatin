using Donatin.Domain.Entities;

namespace Donatin.Domain.Interfaces.Repositories;

public interface IUserRepository
{
  Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
  Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
  Task<User?> GetByCpfCnpjAsync(string cpfCnpj, CancellationToken cancellationToken = default);
  Task AddAsync(User user, CancellationToken cancellationToken = default);
  Task UpdateAsync(User user, CancellationToken cancellationToken = default);
}