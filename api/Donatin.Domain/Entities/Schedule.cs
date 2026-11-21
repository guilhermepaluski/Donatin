using Donatin.Domain.Enums;

namespace Donatin.Domain.Entities;

public class Schedule
{
  public Guid Id { get; private set; }
  public DateTime ScheduleDate { get; private set; }
  public ScheduleStatus Status { get; private set; }
  public string? CancellationReason { get; private set; }
  public DateTime CreatedAt { get; private set; }

  // FK Donation (RN05)
  public Guid DonationId { get; private set; }
  public Donation? Donation { get; private set; }

  private Schedule() { }

  // constructor
  public Schedule(Guid donationId, DateTime scheduleDate)
  {
    OnlyFutureSchedules(scheduleDate);

    Id = Guid.NewGuid();
    DonationId = donationId;
    ScheduleDate = scheduleDate.ToUniversalTime();
    Status = ScheduleStatus.Confirmado;
    CreatedAt = DateTime.UtcNow;
  }

  public void Reschedule(DateTime newDate)
  {
    OnlyFutureSchedules(newDate);
    ScheduleDate = newDate.ToUniversalTime();
    Status = ScheduleStatus.Confirmado;
    CancellationReason = null;
  }

  public void RefuseSchedule(string? reason)
  {
    if (Status != ScheduleStatus.Confirmado)
      throw new InvalidOperationException("Este agendamento já foi recusado. Aguarde o doador propor uma nova data.");

    if (ScheduleDate <= DateTime.UtcNow)
      throw new InvalidOperationException("Só é possível recusar o agendamento antes da data prevista.");

    Status = ScheduleStatus.Recusado;
    CancellationReason = string.IsNullOrWhiteSpace(reason) ? null : reason.Trim();
  }

  public void RefuseWithDonation()
  {
    if (Status == ScheduleStatus.Confirmado)
    {
      Status = ScheduleStatus.Recusado;
      CancellationReason = "Doação cancelada.";
    }
  }

  private void OnlyFutureSchedules(DateTime date)
  {
    if (date.ToUniversalTime() <= DateTime.UtcNow)
      throw new ArgumentException("A data do agendamento deve ser futura.");
  }
}