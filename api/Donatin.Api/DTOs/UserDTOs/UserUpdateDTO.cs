using System.ComponentModel.DataAnnotations;
using Donatin.Api.Validation;

namespace Donatin.Api.DTOs.UserDTOs;

public record UserUpdateDTO
{
  [Required(ErrorMessage = "O nome é obrigatório.")]
  [StringLength(100, ErrorMessage = "O nome não deve ter mais de 100 caracteres.")]
  public string Name { get; set; } = string.Empty;

  [Required(ErrorMessage = "O telefone é obrigatório.")]
  [RegularExpression(@"^\(\d{2}\) \d{5}-\d{4}$", ErrorMessage = "O telefone deve estar no formato (XX) XXXXX-XXXX")]
  public string Phone { get; set; } = string.Empty;

  [StringLength(8, MinimumLength = 8, ErrorMessage = "O CEP deve conter exatamente 8 dígitos.")]
  [RegularExpression(@"^\d{8}$", ErrorMessage = "O CEP deve conter apenas números.")]
  public string? Cep { get; set; }

  public string? Street { get; set; }

  public string? Neighborhood { get; set; }

  public string? Number { get; set; }

  public string? Complement { get; set; }

  [Required(ErrorMessage = "A cidade é obrigatória.")]
  public string City { get; set; } = string.Empty;

  [Required(ErrorMessage = "A UF (estado) é obrigatória.")]
  [StringLength(2, MinimumLength = 2, ErrorMessage = "A UF deve conter exatamente 2 letras (ex.: SC).")]
  public string Uf { get; set; } = string.Empty;

  [StringLength(2000, ErrorMessage = "Esta seção não deve exceder 2000 caracteres.")]
  public string AboutMe { get; set; } = string.Empty;

  [OptionalUrl]
  public string? ProfilePhotoUrl { get; set; } = string.Empty;
}