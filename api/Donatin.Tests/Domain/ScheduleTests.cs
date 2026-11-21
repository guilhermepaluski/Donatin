using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Tests.Helpers;

namespace Donatin.Tests.Domain;

public class ScheduleTests
{
  [Fact]
  public void NovoAgendamento_NasceConfirmado()
  {
    var schedule = new Schedule(Guid.NewGuid(), TestData.Future);

    Assert.Equal(ScheduleStatus.Confirmado, schedule.Status);
  }

  [Fact]
  public void Criar_ComDataNoPassado_LancaExcecao() // RN04
  {
    Assert.Throws<ArgumentException>(() => new Schedule(Guid.NewGuid(), DateTime.UtcNow.AddHours(-1)));
  }

  [Fact]
  public void RefuseSchedule_MudaParaRecusadoEGuardaOMotivo()
  {
    var schedule = new Schedule(Guid.NewGuid(), TestData.Future);

    schedule.RefuseSchedule("  Não estarei em casa  ");

    Assert.Equal(ScheduleStatus.Recusado, schedule.Status);
    Assert.Equal("Não estarei em casa", schedule.CancellationReason);
  }

  [Fact]
  public void RefuseSchedule_DepoisDaDataPrevista_LancaInvalidOperationException() // RN08
  {
    var schedule = new Schedule(Guid.NewGuid(), TestData.Future);
    TestData.SetPrivate(schedule, nameof(Schedule.ScheduleDate), DateTime.UtcNow.AddHours(-1)); // a data já passou

    var ex = Assert.Throws<InvalidOperationException>(() => schedule.RefuseSchedule("motivo"));

    Assert.Equal("Só é possível recusar o agendamento antes da data prevista.", ex.Message);
    Assert.Equal(ScheduleStatus.Confirmado, schedule.Status); // nada mudou
  }

  [Fact]
  public void RefuseSchedule_DuasVezes_LancaExcecao()
  {
    var schedule = new Schedule(Guid.NewGuid(), TestData.Future);
    schedule.RefuseSchedule(null);

    Assert.Throws<InvalidOperationException>(() => schedule.RefuseSchedule(null));
  }

  [Fact]
  public void Reschedule_VoltaParaConfirmadoELimpaOMotivo()
  {
    var schedule = new Schedule(Guid.NewGuid(), TestData.Future);
    schedule.RefuseSchedule("motivo");

    schedule.Reschedule(TestData.Future.AddDays(1));

    Assert.Equal(ScheduleStatus.Confirmado, schedule.Status);
    Assert.Null(schedule.CancellationReason);
  }

  [Fact]
  public void Reschedule_ParaDataNoPassado_LancaExcecao()
  {
    var schedule = new Schedule(Guid.NewGuid(), TestData.Future);

    Assert.Throws<ArgumentException>(() => schedule.Reschedule(DateTime.UtcNow.AddDays(-1)));
  }

  [Fact]
  public void RefuseWithDonation_RecusaAgendamentoConfirmado()
  {
    var schedule = new Schedule(Guid.NewGuid(), TestData.Future);

    schedule.RefuseWithDonation();

    Assert.Equal(ScheduleStatus.Recusado, schedule.Status);
    Assert.Equal("Doação cancelada.", schedule.CancellationReason);
  }
}
