using Donatin.Api.DTOs.CampaignDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Donatin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignsController : ControllerBase
{
  private readonly ICampaignRepository _campaignRepository;

  public CampaignsController(ICampaignRepository campaignRepository)
  {
    _campaignRepository = campaignRepository;
  }

  [HttpGet] // GET All (pega todas as campanhas ativas (e se baseia na categoria de cada uma))
  public async Task<ActionResult<IEnumerable<CampaignResponseDTO>>> GetActive([FromQuery] CampaignCategory? category, [FromQuery] string? keyword)
  {
    var campaigns = await _campaignRepository.SearchActiveAsync(category, keyword);
    var response = campaigns.Select(CampaignResponseDTO.FromEntity);
    return Ok(response);
  }

  [HttpGet("{id}")] // GET campanha pelo id
  public async Task<ActionResult<IEnumerable<CampaignResponseDTO>>> GetCampaignById([FromRoute] Guid id)
  {
    var campaignsId = await _campaignRepository.GetCampaignByIdAsync(id);

    if (campaignsId == null)
    {
      return NotFound(new { message = "Campanha não encontrada." });
    }

    return Ok(CampaignResponseDTO.FromEntity(campaignsId));
  }

  [HttpGet("user/{userId}")] // GET campanhas por Usuário
  public async Task<ActionResult<IEnumerable<CampaignResponseDTO>>> GetCampaignByUserId([FromRoute] Guid userId)
  {
    var campaignsByUser = await _campaignRepository.GetCampaignByUserIdAsync(userId);

    return Ok(campaignsByUser.Select(CampaignResponseDTO.FromEntity));
  }

  [HttpPost] // POST (CRIA A CAMPANHA)
  [Authorize]
  public async Task<ActionResult<IEnumerable<CampaignResponseDTO>>> Create([FromBody] CampaignCreateDTO dto)
  {
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
    {
      return Unauthorized(new { message = "Usuário não autenticado."});
    }

    try
    {
      var campaign = new Campaign(
        dto.Title,
        dto.Description,
        dto.Category,
        dto.Product,
        dto.GoalAmount,
        dto.ReceiveOption,
        userId,
        dto.ImageUrl,
        dto.ConclusionDate
      );

      await _campaignRepository.AddAsync(campaign);

      var response = CampaignResponseDTO.FromEntity(campaign);
      return CreatedAtAction(nameof(GetCampaignById), new { id = campaign.Id }, response);
    }
    catch (ArgumentException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPut("{id:guid}")] // PUT (ATUALIZA OS DADOS)
  [Authorize]
  public async Task<ActionResult<CampaignResponseDTO>> Update(Guid id, [FromBody] CampaignUpdateDTO dto)
  {
    var campaign = await _campaignRepository.GetCampaignByIdAsync(id);

    if (campaign == null)
    {
      return NotFound(new { message = "Campanha não encontrada." });
    }

    // 2. Extrai o ID do usuário logado do token JWT
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        return Unauthorized(new { message = "Usuário não autenticado." });

    // 3. Garante que apenas o criador da campanha possa editá-la
    if (campaign.UserId != userId)
        return StatusCode(403, new { message = "Você não tem permissão para editar esta campanha." });

    try
    {
        // 4. Executa o método de domínio criado na Entidade
        campaign.UpdateCampaign(dto.Title, dto.Description, dto.ImageUrl);

        // 5. Persiste as alterações no PostgreSQL
        await _campaignRepository.UpdateAsync(campaign);

        // 6. Retorna o DTO atualizado
        return Ok(CampaignResponseDTO.FromEntity(campaign));
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

  [HttpDelete("{id:Guid}")] // DELETE (Close -> Está sendo usado SoftDelete, para não ser apagado o histórico do banco de dados)
  [Authorize]
  public async Task<ActionResult> Close(Guid id)
  {
    var campaign = await _campaignRepository.GetCampaignByIdAsync(id);
    if (campaign == null)
    {
      return NotFound(new { message = "Campanha não encontrada." });
    }

    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
      return Unauthorized(new { message = "Usuário não autenticado." });
    }
    if (campaign.UserId != userId)
    {
      return StatusCode(403, new { message = "Você não tem permissão para editar essa campanha." });
    }

    campaign.CloseCampaign();

    await _campaignRepository.UpdateAsync(campaign);

    return NoContent();
  }
}