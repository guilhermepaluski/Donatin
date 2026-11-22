import { InfoPage, InfoSection } from '../components/InfoPage'

export default function HowItWorksPage() {
  return (
    <InfoPage title="Como funciona?">
      <p>
        O Donatin conecta quem quer doar objetos a pessoas e instituições que precisam deles,
        organizando a doação do início ao fim: da escolha da campanha até a confirmação de recebimento.
      </p>

      <InfoSection title="1. Encontre uma campanha">
        <p>Explore as campanhas ativas e filtre por categoria ou palavra-chave para achar o que você pode doar.</p>
      </InfoSection>

      <InfoSection title="2. Faça sua doação">
        <p>
          Informe a quantidade e escolha como o item vai chegar: você entrega no endereço da campanha
          ou o responsável busca na sua casa (coleta).
        </p>
      </InfoSection>

      <InfoSection title="3. Agende a entrega">
        <p>
          Escolha uma data e horário. Quem recebe pode recusar o horário antes da data prevista, e aí
          você propõe uma nova data. Vocês recebem notificações a cada mudança.
        </p>
      </InfoSection>

      <InfoSection title="4. Confirmação de recebimento">
        <p>
          Quando o item chega, quem criou a campanha confirma o recebimento, a doação é concluída e o
          valor arrecadado da campanha é atualizado.
        </p>
      </InfoSection>

      <InfoSection title="Quer receber doações?">
        <p>Crie uma conta e publique uma campanha contando o que você precisa, quanto e até quando.</p>
      </InfoSection>
    </InfoPage>
  )
}
