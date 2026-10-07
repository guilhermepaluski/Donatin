using System.ComponentModel.DataAnnotations;
using Donatin.Api.Validation;

namespace Donatin.Api.DTOs;

public record RegisterRequest (
  [Required(ErrorMessage = "O nome é obrigatório.")]
  [StringLength(100, ErrorMessage = "O nome não deve ter mais de 100 caracteres.")]
  string Name,

  [RegularExpression(@"^\d{14}$", ErrorMessage = "Informe apenas os dígitos do CNPJ (14).")]
  string? CpfCnpj,

  DateOnly? BirthDate,

  [Required(ErrorMessage = "O telefone é obrigatório.")]
  [RegularExpression(@"^\(\d{2}\) \d{5}-\d{4}$", ErrorMessage = "O telefone deve estar no formato (XX) XXXXX-XXXX")]
  string Phone,

  [StringLength(8, MinimumLength = 8, ErrorMessage = "O CEP deve conter exatamente 8 dígitos.")]
  [RegularExpression(@"^\d{8}$", ErrorMessage = "O CEP deve conter apenas números.")]
  string? Cep,

  string? Street,
  
  string? Neighborhood,
  
  string? Number,

  string? Complement,

  [Required(ErrorMessage = "A cidade é obrigatória.")]
  string City,

  [Required(ErrorMessage = "A UF (estado) é obrigatória.")]
  [StringLength(2, MinimumLength = 2, ErrorMessage = "A UF deve conter exatamente 2 letras (ex.: SC).")]
  string Uf,

  [StringLength(2000, ErrorMessage = "A descrição não deve exceder 2000 caracteres.")]
  string? AboutMe,

  [OptionalUrl]
  string? ProfilePhotoUrl,

  [Required(ErrorMessage = "O e-mail é obrigatório.")]
  [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
  string Email,

  [Required(ErrorMessage = "A senha é obrigatória.")]
  [MinLength(8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres.")]
  [RegularExpression(@"^(?=.*[A-Z])(?=.*[!@#$%^&*(),.? ""':{}|<>]).*$", ErrorMessage = "A senha deve conter pelo menos uma letra maiúscula e um caractere especial.")]
  string Password
);