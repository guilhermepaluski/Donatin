using Donatin.Infrastructure.Data;
using Donatin.Infrastructure.Repositories;
using Donatin.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Tests.Infrastructure.Repositories;

// Banco em memória (EF InMemory): testa as consultas do repositório sem PostgreSQL.
public class CampaignRepositoryTests
{
  private readonly string _dbName = Guid.NewGuid().ToString(); // um banco novo por teste

  private AppDbContext NewContext() =>
    new(new DbContextOptionsBuilder<AppDbContext>()
      .UseInMemoryDatabase(_dbName)
      .Options);

  [Fact]
  public async Task GetCampaignByUserIdAsync_TrazODonoDaCampanha()
  {
    var owner = TestData.User();
    var campaign = TestData.Campaign(owner.Id);

    await using (var seed = NewContext())
    {
      seed.Users.Add(owner);
      seed.Campaigns.Add(campaign);
      await seed.SaveChangesAsync();
    }

    // contexto novo: sem o Include, o EF não carrega o User sozinho
    await using var context = NewContext();
    var result = await new CampaignRepository(context).GetCampaignByUserIdAsync(owner.Id);

    var found = Assert.Single(result);
    Assert.NotNull(found.User); // nome e cidade do dono aparecem no card da campanha
    Assert.Equal("Maria", found.User!.Name);
  }
}
