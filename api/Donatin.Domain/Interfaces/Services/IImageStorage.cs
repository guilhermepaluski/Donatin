namespace Donatin.Domain.Interfaces.Services;

// guarda uma imagem num serviço externo (Azure Blob Storage) e devolve a URL pública (RNF19)
public interface IImageStorage
{
  Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);
}
