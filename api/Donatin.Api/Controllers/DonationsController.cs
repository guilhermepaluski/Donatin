using Donatin.Api.DTOs.DonationDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Domain.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Donatin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DonationsController : ControllerBase
{
  private readonly IDonationRepository _donationRepository;
  private readonly ICampaignRepository _campaignRepository;

  public DonationsController(IDonationRepository donationRepository, ICampaignRepository campaignRepository)
  {
    _donationRepository = donationRepository;
    _campaignRepository = campaignRepository;
  }

  // extrai o id do usuário logado do token JWT
  private bool TryGetUserId(out Guid userId)
  {
    var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    return Guid.TryParse(claim, out userId);
  }

  [HttpGet("mine")] // GET histórico do doador (RF24)
  public async Task<ActionResult<IEnumerable<DonationResponseDTO>>> GetMine()
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var donations = await _donationRepository.GetDonationByUserIdAsync(userId);
    return Ok(donations.Select(d => DonationResponseDTO.FromEntity(d, userId)));
  }

  [HttpGet("campaign/{campaignId:guid}")] // GET doações recebidas por uma campanha (só o dono)
  public async Task<ActionResult<IEnumerable<DonationResponseDTO>>> GetByCampaign(Guid campaignId)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var campaign = await _campaignRepository.GetCampaignByIdAsync(campaignId);
    if (campaign == null)
      return NotFound(new { message = "Campanha não encontrada." });

    if (campaign.UserId != userId)
      return StatusCode(403, new { message = "Você não tem permissão para ver as doações desta campanha." });

    var donations = await _donationRepository.GetDonationByCampaignIdAsync(campaignId);
    return Ok(donations.Select(d => DonationResponseDTO.FromEntity(d, userId)));
  }

  [HttpGet("{id:guid}")] // GET detalhe da doação (só para quem tem motivo para vê-la: o doador que a fez ou o dono da campanha que a recebe)
  public async Task<ActionResult<DonationResponseDTO>> GetById(Guid id)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var donation = await _donationRepository.GetDonationByIdAsync(id);
    if (donation == null)
      return NotFound(new { message = "Doação não encontrada." });

    if (donation.UserId != userId && donation.Campaign!.UserId != userId)
      return StatusCode(403, new { message = "Você não tem permissão para ver esta doação." });

    return Ok(DonationResponseDTO.FromEntity(donation, userId));
  }

  [HttpPost] // POST (registra uma doação para uma campanha)
  public async Task<ActionResult<DonationResponseDTO>> Create([FromBody] DonationCreateDTO dto)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    if (dto.CampaignId == Guid.Empty)
      return BadRequest(new { message = "A campanha é obrigatória." });

    var campaign = await _campaignRepository.GetCampaignByIdAsync(dto.CampaignId);
    if (campaign == null)
      return NotFound(new { message = "Campanha não encontrada." });

    if (!campaign.IsActive || campaign.HasExpired)
      return BadRequest(new { message = "Esta campanha não está mais recebendo doações." });

    if (campaign.UserId == userId)
      return BadRequest(new { message = "Você não pode doar para a sua própria campanha." });

    DonationMethod method;
    switch (campaign.ReceiveOption)
    {
      case ReceiveOption.Entrega:
        method = DonationMethod.Entrega;
        break;
      case ReceiveOption.Coleta:
        method = DonationMethod.Coleta;
        break;
      case ReceiveOption.ColetaOuEntrega:
        if (dto.DonationMethod == null)
        {
          return BadRequest(new { message = "Selecione o método da doação: Coleta ou Entrega." });
        }
        method = dto.DonationMethod.Value;
        break;

      default:
        throw new ArgumentOutOfRangeException(nameof(campaign.ReceiveOption));
    }

    if (dto.IsAnonymous && method == DonationMethod.Coleta)
      return BadRequest(new { message = "Em doações com coleta é necessário se identificar." });

    try
    {
      var donation = new Donation(
        dto.Quantity,
        dto.Notes,
        method,
        dto.DonorCep,
        dto.DonorStreet,
        dto.DonorNeighborhood,
        dto.DonorNumber,
        dto.DonorComplement,
        userId,
        campaign.Id,
        dto.IsAnonymous);
      await _donationRepository.AddAsync(donation);

      return CreatedAtAction(nameof(GetById), new { id = donation.Id }, DonationResponseDTO.FromEntity(donation, userId));
    }
    catch (ArgumentException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/confirm")] // POST confirma o recebimento (só o dono da campanha) — RF20
  public async Task<ActionResult<DonationResponseDTO>> ConfirmReceipt(Guid id)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var donation = await _donationRepository.GetDonationByIdAsync(id);
    if (donation == null)
      return NotFound(new { message = "Doação não encontrada." });

    if (donation.Campaign!.UserId != userId)
      return StatusCode(403, new { message = "Apenas quem criou a campanha pode confirmar o recebimento." });

    try
    {
      donation.ConfirmDonation();
      donation.Campaign.AddDonation(donation.Quantity); // atualiza o CurrentAmount da campanha

      await _donationRepository.SaveChangesAsync();

      return Ok(DonationResponseDTO.FromEntity(donation, userId));
    }
    catch (InvalidOperationException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
    catch (ArgumentException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/cancel")] // Cancela (doador ou dono da campanha, enquanto Pendente)
  public async Task<ActionResult<DonationResponseDTO>> Cancel(Guid id)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var donation = await _donationRepository.GetDonationByIdAsync(id);
    if (donation == null)
      return NotFound(new { message = "Doação não encontrada." });

    if (donation.UserId != userId && donation.Campaign!.UserId != userId)
      return StatusCode(403, new { message = "Você não tem permissão para cancelar esta doação." });

    try
    {
      donation.CancelDonation();
      await _donationRepository.SaveChangesAsync();
      return Ok(DonationResponseDTO.FromEntity(donation, userId));
    }
    catch (InvalidOperationException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }
}