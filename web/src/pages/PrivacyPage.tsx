import { InfoPage, InfoSection } from '../components/InfoPage'

export default function PrivacyPage() {
  return (
    <InfoPage title="Política de Privacidade">
      <p>
        Esta política explica quais dados o Donatin coleta e como eles são usados, seguindo os princípios
        da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
      </p>

      <InfoSection title="Dados que coletamos">
        <ul className="list-disc space-y-1 pl-6">
          <li>Nome ou razão social, e-mail, telefone e CPF ou CNPJ, informados no cadastro.</li>
          <li>Endereço, quando é necessário para a entrega ou a coleta de uma doação.</li>
          <li>Histórico de campanhas, doações e agendamentos feitos na plataforma.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Como usamos os dados">
        <p>
          Os dados servem apenas para viabilizar as doações: identificar quem doa e quem recebe, combinar a
          entrega ou coleta e enviar notificações sobre o andamento. Não vendemos nem compartilhamos seus
          dados com terceiros para fins comerciais.
        </p>
      </InfoSection>

      <InfoSection title="O que fica visível">
        <p>
          O endereço só é mostrado para quem participa da doação e só quando ele é necessário. Doações por
          entrega podem ser anônimas: nesse caso, seu nome não aparece para quem recebe.
        </p>
      </InfoSection>

      <InfoSection title="Seus direitos">
        <p>
          Você pode consultar e corrigir seus dados no seu perfil a qualquer momento, e pode pedir a exclusão
          da sua conta. Ao excluir a conta, seus dados pessoais são anonimizados.
        </p>
      </InfoSection>

      <InfoSection title="Segurança">
        <p>Sua senha é guardada de forma criptografada e o acesso à plataforma é feito por conexão segura (HTTPS).</p>
      </InfoSection>
    </InfoPage>
  )
}
