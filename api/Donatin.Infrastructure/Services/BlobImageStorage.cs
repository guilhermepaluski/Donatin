using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Donatin.Domain.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace Donatin.Infrastructure.Services;

// guarda as imagens no Azure Blob Storage (contêiner "images", com leitura pública)
public class BlobImageStorage : IImageStorage
{
  private readonly BlobContainerClient _container;

  public BlobImageStorage(IConfiguration configuration)
  {
    var connectionString = configuration["Storage:ConnectionString"];
    if (string.IsNullOrWhiteSpace(connectionString))
      throw new InvalidOperationException("Configure 'Storage__ConnectionString' para enviar imagens.");

    _container = new BlobContainerClient(connectionString, configuration["Storage:Container"] ?? "images");
  }

  public async Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
  {
    var blob = _container.GetBlobClient(fileName);

    // o tipo é definido aqui pela API, para o navegador sempre tratar o arquivo como imagem
    await blob.UploadAsync(content, new BlobHttpHeaders { ContentType = contentType }, cancellationToken: cancellationToken);

    return blob.Uri.ToString(); // URL pública que vai para o banco (ImageUrl)
  }
}
