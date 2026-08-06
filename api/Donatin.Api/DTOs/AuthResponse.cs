namespace Donatin.Api.DTOs;

public record AuthResponse (
  string Token,
  Guid UserId,
  string Name,
  string Email
);