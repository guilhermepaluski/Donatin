using Donatin.Domain.Entities;
using Donatin.Domain.Enums;

namespace Donatin.Api.DTOs.DonationDTOs;

public class DonationResponseDTO
{
  public Guid Id { get; set; }
  public decimal Quantity { get; set; }
  public string? Notes { get; set; }
  public DateTime DonatedAt { get; set; }
  public DonationStatus Status { get; set; }    // enum 
  public Guid UserId { get; set; }
  public string? DonorName { get; set; }       // só vem preenchido se o User foi carregado (Include)
  public Guid CampaignId { get; set; }
  public string? CampaignTitle { get; set; }   // só vem preenchido se a Campaign foi carregada (Include)
  
  public string? OwnerName { get; set; }
  public string? OwnerPhone { get; set; }
  public string? OwnerAddress { get; set; }

  static string? BuildAddress(User? u) => u is null ? null : string.Join(" - ", new[]
  {
    string.Join(", ", new[] { u.Street, u.Number }.Where(s => !string.IsNullOrWhiteSpace(s))),
    u.Complement, u.Neighborhood, $"{u.City}/{u.Uf}"
  }.Where(s => !string.IsNullOrWhiteSpace(s)));

  public static DonationResponseDTO FromEntity(Donation donation)
  {
    // validação de retorno enquanto a doação está pendente (só aparece se o status for Pendente)
    var owner = donation.Status == DonationStatus.Pendente
      ?
      donation.Campaign?.User
      :
      null;

    // é o que volta (retorno) no POSTMAN ao dar GET
    return new DonationResponseDTO
    {
      Id = donation.Id,
      Quantity = donation.Quantity,
      Notes = donation.Notes,
      DonatedAt = donation.DonatedAt,
      Status = donation.Status,
      UserId = donation.UserId,
      DonorName = donation.User?.Name,
      CampaignId = donation.CampaignId,
      CampaignTitle = donation.Campaign?.Title,
      
      OwnerName = owner?.Name,
      OwnerPhone = owner?.Phone,
      OwnerAddress = BuildAddress(owner)
    };
  }
}