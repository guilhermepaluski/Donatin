import { InfoPage, InfoSection } from '../components/InfoPage'

export default function TermsPage() {
  return (
    <InfoPage title="Termos de Uso">
      <p>
        Ao usar o Donatin, você concorda com os termos abaixo. O Donatin é um projeto acadêmico que aproxima
        doadores e receptores; a entrega dos itens é combinada diretamente entre as partes.
      </p>

      <InfoSection title="Cadastro">
        <p>
          Você é responsável pelas informações que fornece e por manter sua senha em segurança. Cada e-mail,
          CPF ou CNPJ pode ser usado em apenas uma conta.
        </p>
      </InfoSection>

      <InfoSection title="Campanhas">
        <p>
          Campanhas devem descrever com clareza a necessidade e o item pedido. Apenas quem criou a campanha
          pode editá-la ou encerrá-la. É proibido publicar conteúdo falso, ofensivo ou que peça dinheiro.
        </p>
      </InfoSection>

      <InfoSection title="Doações e agendamentos">
        <p>
          Agendamentos só podem ser feitos para datas futuras e recusados antes da data prevista. Doações
          concluídas não podem ser alteradas. Quem recebe deve confirmar o recebimento quando o item chegar.
        </p>
      </InfoSection>

      <InfoSection title="Responsabilidades">
        <p>
          O Donatin não verifica oficialmente a identidade ou a situação jurídica de instituições e pessoas
          cadastradas, e não se responsabiliza pelo estado dos itens doados ou pela entrega combinada entre os
          usuários.
        </p>
      </InfoSection>

      <InfoSection title="Mudanças nestes termos">
        <p>Estes termos podem ser atualizados. A versão em vigor é sempre a publicada nesta página.</p>
      </InfoSection>
    </InfoPage>
  )
}
