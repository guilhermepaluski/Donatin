using System.ComponentModel.DataAnnotations;

namespace Donatin.Api.DTOs;

public record RegisterRequest (
  [Required(ErrorMessage = "O nome é obrigatório.")]
  [StringLength(100, ErrorMessage = "O nome não deve ter mais de 100 caracteres.")]
  string Name,

  [Required(ErrorMessage = "O CPF ou CNPJ é obrigatório.")]
  [MaxLength(14, ErrorMessage = "O CNPJ deve ter no máximo 14 dígitos.")]
  string CpfCnpj,

  [Required(ErrorMessage = "A data de nascimento/fundação é obrigatória.")]
  DateOnly BirthDate,

  [Required(ErrorMessage = "O telefone é obrigatório.")]
  [RegularExpression(@"^\(\d{2}\) \d{5}-\d{4}$", ErrorMessage = "O telefone deve estar no formato (XX) XXXXX-XXXX")]
  string Phone,

  [Required(ErrorMessage = "O CEP é obrigatório.")]
  [StringLength(8, MinimumLength = 8, ErrorMessage = "O CEP deve conter exatamente 8 dígitos.")]
  string Cep,

  [Required(ErrorMessage = "A rua é obrigatória.")]
  string Street,
  
  [Required(ErrorMessage = "O bairro é obrigatório.")]
  string Neighborhood,
  
  [Required(ErrorMessage = "O número é obrigatório.")]
  string Number,

  string? Complement,

  [Required(ErrorMessage = "A cidade é obrigatória.")]
  string City,

  [Required(ErrorMessage = "A UF (estado) é obrigatória.")]
  [StringLength(2, MinimumLength = 2, ErrorMessage = "A UF deve conter exatamente 2 letras (ex.: SC).")]
  string Uf,

  [Required(ErrorMessage = "O e-mail é obrigatório.")]
  [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
  string Email,

  [Required(ErrorMessage = "A senha é obrigatória.")]
  [MinLength(8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres.")]
  [RegularExpression(@"^(?=.*[A-Z])(?=.*[!@#$%^&*(),.? ""':{}|<>]).*$", ErrorMessage = "A senha deve conter pelo menos uma letra maiúscula e um caractere especial.")]
  string Password
);