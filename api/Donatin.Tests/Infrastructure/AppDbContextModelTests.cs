using Donatin.Domain.Entities;
using Donatin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Donatin.Tests.Infrastructure;

// Confere as regras de banco configuradas no AppDbContext (índices únicos, enums como texto, deletes).
// Montar o "modelo" do EF não abre conexão, então não precisa de PostgreSQL rodando.
public class AppDbContextModelTests
{
  private static readonly IModel Model = BuildModel();

  private static IModel BuildModel()
  {
    var options = new DbContextOptionsBuilder<AppDbContext>()
      .UseNpgsql("Host=localhost;Database=fake") // só para escolher o provedor; nada é conectado
      .Options;
    using var context = new AppDbContext(options);
    return context.Model;
  }

  private static IEntityType Entity<T>() => Model.FindEntityType(typeof(T))!;

  private static bool HasUniqueIndexOn<T>(params string[] properties) =>
    Entity<T>().GetIndexes().Any(i => i.IsUnique && i.Properties.Select(p => p.Name).SequenceEqual(properties));

  [Fact]
  public void User_EmailECnpjSaoUnicos()
  {
    Assert.True(HasUniqueIndexOn<User>(nameof(User.Email)));
    Assert.True(HasUniqueIndexOn<User>(nameof(User.CpfCnpj)));
  }

  [Fact]
  public void Schedule_UmAgendamentoPorDoacao() // RN05
  {
    Assert.True(HasUniqueIndexOn<Schedule>(nameof(Schedule.DonationId)));
  }

  [Theory]
  [InlineData(typeof(Campaign), nameof(Campaign.Category))]
  [InlineData(typeof(Campaign), nameof(Campaign.ReceiveOption))]
  [InlineData(typeof(Donation), nameof(Donation.Status))]
  [InlineData(typeof(Donation), nameof(Donation.DonationMethod))]
  [InlineData(typeof(Schedule), nameof(Schedule.Status))]
  [InlineData(typeof(Notification), nameof(Notification.Type))]
  public void Enums_SaoGuardadosComoTexto(Type entity, string property)
  {
    var prop = Model.FindEntityType(entity)!.FindProperty(property)!;

    Assert.Equal(typeof(string), prop.GetProviderClrType());
  }

  [Fact]
  public void ApagarUsuario_NaoApagaCampanhasNemDoacoes_MasApagaNotificacoes()
  {
    DeleteBehavior OnDeleteOf<T>(string fk) =>
      Entity<T>().GetForeignKeys().Single(f => f.Properties.Single().Name == fk).DeleteBehavior;

    Assert.Equal(DeleteBehavior.Restrict, OnDeleteOf<Campaign>(nameof(Campaign.UserId)));
    Assert.Equal(DeleteBehavior.Restrict, OnDeleteOf<Donation>(nameof(Donation.UserId)));
    Assert.Equal(DeleteBehavior.Cascade, OnDeleteOf<Notification>(nameof(Notification.UserId)));
  }

  [Theory]
  [InlineData(typeof(User), nameof(User.Name), 100)]
  [InlineData(typeof(Campaign), nameof(Campaign.Title), 100)]
  [InlineData(typeof(Donation), nameof(Donation.Notes), 400)]
  [InlineData(typeof(Notification), nameof(Notification.Content), 600)]
  public void CamposDeTexto_TemTamanhoMaximo(Type entity, string property, int max)
  {
    Assert.Equal(max, Model.FindEntityType(entity)!.FindProperty(property)!.GetMaxLength());
  }
}
