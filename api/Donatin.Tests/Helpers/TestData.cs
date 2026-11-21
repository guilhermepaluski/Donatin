using System.Reflection;
using System.Security.Claims;
using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Donatin.Tests.Helpers;

// Fábricas de objetos válidos, para cada teste mudar só o que importa
public static class TestData
{
  public static DateTime Future => DateTime.UtcNow.AddDays(10);

  public static Campaign Campaign(
    Guid? ownerId = null,
    ReceiveOption receiveOption = ReceiveOption.Coleta,
    decimal goal = 10)
  {
    return new Campaign(
      "Agasalhos para o inverno", "Arrecadação de agasalhos", CampaignCategory.Roupas,
      "agasalhos", goal, receiveOption, ownerId ?? Guid.NewGuid(), null, Future,
      "89201000", "Rua XV", "Centro", "100", null, "Joinville", "SC");
  }

  public static Donation Donation(
    Campaign campaign,
    Guid? donorId = null,
    decimal quantity = 2,
    DonationMethod method = DonationMethod.Entrega)
  {
    var donation = new Donation(quantity, "obs", method,
      "89201000", "Rua A", "Bairro", "10", null,
      donorId ?? Guid.NewGuid(), campaign.Id);

    // a navegação Campaign é private set (quem preenche é o EF); no teste preenchemos via reflexão
    SetPrivate(donation, "Campaign", campaign);
    return donation;
  }

  public static User User(string? cnpj = null) =>
    new("Maria", cnpj, null, "47999999999", "89201000", "Rua A", "Centro", "10", null,
        "Joinville", "SC", null, null, "maria@email.com", "hash");

  public static void SetPrivate(object target, string property, object? value) =>
    target.GetType().GetProperty(property, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)!
      .SetValue(target, value);

  // simula o usuário logado (o que o JWT colocaria no HttpContext)
  public static void LoginAs(ControllerBase controller, Guid userId)
  {
    var identity = new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, userId.ToString())], "Test");
    controller.ControllerContext = new ControllerContext
    {
      HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
    };
  }
}
