using Donatin.Infrastructure.Services;
using Microsoft.Extensions.Configuration;

namespace Donatin.Tests.Infrastructure.Services;

// o envio de verdade precisa da Azure; aqui só conferimos a configuração
public class BlobImageStorageTests
{
  private static IConfiguration Config(Dictionary<string, string?> values) =>
    new ConfigurationBuilder().AddInMemoryCollection(values).Build();

  [Fact]
  public void SemConnectionString_LancaExcecaoComMensagemClara()
  {
    var ex = Assert.Throws<InvalidOperationException>(() => new BlobImageStorage(Config([])));

    Assert.Contains("Storage__ConnectionString", ex.Message);
  }

  [Fact]
  public void ComConnectionString_CriaSemAcessarAAzure()
  {
    var config = Config(new()
    {
      ["Storage:ConnectionString"] = "DefaultEndpointsProtocol=https;AccountName=teste;AccountKey=dGVzdGU=;EndpointSuffix=core.windows.net"
    });

    var storage = new BlobImageStorage(config);

    Assert.NotNull(storage);
  }
}
