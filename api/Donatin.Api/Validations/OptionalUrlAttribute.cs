using System.ComponentModel.DataAnnotations;

namespace Donatin.Api.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Parameter)]
public class OptionalUrlAttribute : ValidationAttribute
{
  protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
  {
    // ausente ou vazio: campo opcional, então é válido
    if (value is null) return ValidationResult.Success;

    if (value is string text)
    {
      if (string.IsNullOrWhiteSpace(text)) return ValidationResult.Success;

      // só aceita URL absoluta com http ou https
      if (Uri.TryCreate(text.Trim(), UriKind.Absolute, out var uri) &&
          (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
      {
        return ValidationResult.Success;
      }
    }

    return new ValidationResult(ErrorMessage ?? "A URL deve começar com http:// ou https://.");
  }
}