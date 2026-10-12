using System.ComponentModel.DataAnnotations;

namespace Donatin.Api.DTOs.AuthDTOs;

public record LoginRequest(
    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
    string Email,

    [Required(ErrorMessage = "A senha é obrigatória.")]
    string Password
);