using Donatin.Api.DTOs.CampaignDTOs;
using Donatin.Domain.Enums;
using Donatin.Tests.Helpers;

namespace Donatin.Tests.DTOs;

public class CampaignResponseDTOTests
{
  [Fact]
  public void FromEntity_DevolveOEnderecoDeEntregaSeparadoEmCampos() // para o formulário de edição (RF15)
  {
    var campaign = TestData.Campaign(receiveOption: ReceiveOption.Entrega); // Rua XV, 100, Centro, Joinville/SC, 89201000

    var dto = CampaignResponseDTO.FromEntity(campaign);

    Assert.Equal("89201000", dto.DeliveryCep);
    Assert.Equal("Rua XV", dto.DeliveryStreet);
    Assert.Equal("Centro", dto.DeliveryNeighborhood);
    Assert.Equal("100", dto.DeliveryNumber);
    Assert.Null(dto.DeliveryComplement);
    Assert.Equal("Joinville", dto.DeliveryCity);
    Assert.Equal("SC", dto.DeliveryUf);
  }

  [Fact]
  public void FromEntity_CampanhaSoComColeta_NaoTemEndereco()
  {
    var campaign = TestData.Campaign(receiveOption: ReceiveOption.Coleta);

    var dto = CampaignResponseDTO.FromEntity(campaign);

    Assert.Null(dto.DeliveryCep);
    Assert.Null(dto.DeliveryStreet);
    Assert.Null(dto.DeliveryCity);
  }
}
