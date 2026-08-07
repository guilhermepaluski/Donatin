using System.ComponentModel.DataAnnotations;

namespace Donatin.API.DTOs;

public record RegisterRequest (
  [Required(ErrorMessage = "O nome é obrigatório.")]
  [StringLength(100, ErrorMessage = "O nome não deve ter mais de 100 caracteres.")]
  string Name,

  [Required(ErrorMessage = "O e-mail é obrigatório.")]
  [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
  string Email,

  [Required(ErrorMessage = "A senha é obrigatória.")]
  [MinLength(8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres.")]
  [RegularExpression(@"^(?=.*[A-Z])(?=.*[!@#$%^&*(),.? ""':{}|<>]).*$", ErrorMessage = "A senha deve conter pelo menos uma letra maiúscula e um caractere especial.")]
  string Password
);