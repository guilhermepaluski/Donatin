namespace Donatin.Api.DTOs;

// Dados devolvidos pela API ao frontend (depois de um login bem-sucedido)
public record AuthResponse (
  string Token,
  Guid UserId,
  string Name,
  string Email
);