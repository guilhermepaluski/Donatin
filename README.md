# Donatin

# RFC: Request for Comments — Projeto de Portfólio

**Engenharia de Software – Católica SC**

---

# Identificação

- **Título do Projeto:**  
  Donatin

- **Linha de Projeto (Direction):**  
  Mobile

- **Autor:**  
  Guilherme Mafra Paluski

- **Data da Proposta:**  
  19/03/2026

- **Versão:**  
  1.0

---

# 1. Visão do Produto e Impacto (O Problema)

O objetivo desta seção é responder uma pergunta fundamental:

**Este projeto resolve um problema real ou é apenas um exercício técnico?**

---

## 1.1 Contexto e Problema

No Brasil, muitas instituições carentes dependem de objetos do dia a dia para garantirem uma melhor qualidade de vida e não passarem por necessidades em diferentes épocas do ano, como cobertores para o inverno, protetores solares para o verão e produtos de higiene no geral.

De acordo com o IDIS (Instituto para o Desenvolvimento do Investimento Social), o valor estimado em doações no Brasil em 2024 foi  de R$24,3 bilhões, superando os R$14,8 bilhões em 2022. No entanto, o ato de doar se demonstra um pouco mais intervalado, com ocorrências menores ao ano, devido ao fato de doadores serem mais seletivos para quais organizações ajudarem, muitas vezes relacionado ao fato de que é gerada uma falta de confiança sobre as instituições/pessoas que receberão a doação.

Conforme informações do site tracknmob, devem ser superados a falta de confiança e credibilidade em organizações sem fins lucrativos e as variadas formas de doar para ajudar a impulsionar a cultura de doação no país. De acordo com o site, algumas soluções para aumentar a divulgação e credibilidade das causas são criar um relacionamento e engajamento dos doadores para com os receptores e desenvolver inteligência de dados para direcionar esforços.

Atualmente, muitas pessoas possuem o desejo de doar objetos que estão sobrando ou que não fazem mais sentido para elas, mas não sabem como e onde podem realizar tal ação, muitas vezes precisando conversar com conhecidos para alcançar alguém que necessita de alguma ajuda. Inclusive, em alguns cenários, acabam desistindo de realizar a doação fazendo com que, consequentemente, aquele objeto que poderia facilitar a vida de outra pessoa vá parar como descarte.

Por esse motivo, com o objetivo de facilitar/promover doações no cotidiano, o aplicativo Donatin vem como uma solução para conectar quem necessita com quem quer ajudar.

Ao realizar o cadastro no aplicativo, o usuário poderá verificar quem está necessitando de alguma doação e o que essa pessoa está precisando, sendo isso de forma anônima ou expositiva. Além disso, ele poderá criar uma postagem com o item que está doando, para caso alguém necessite e queira receber a doação.

Dados como e-mail e endereço poderão ser usados para agendar uma possível doação com o receptor, o que facilita e agiliza o processo para ambos os lados.

---

## 1.2 Origem da Demanda e Evidências

Com o propósito de levantar evidências e possíveis futuros usuários da aplicação, foi realizada uma pesquisa por meio de um formulário onde participantes expressaram suas opiniões e sugestões sobre o projeto.
A partir das respostas do formulário, grande parte dos contribuintes relatou já ter enfrentado dificuldades em doar algum objeto por não saber como ou onde doar:

<img src="/images/readme/evidencia1.png">

Baseado nas respostas dos candidatos, o sistema tem grande potencial de facilitar doações na região onde o usuário se encontra. Algumas respostas indicam que o aplicativo pode alavancar ainda mais doações no cotidiano:

<img src="/images/readme/evidencia2.png">

Além disso, a partir das respostas, o sistema apresenta potencial interesse de uso pelos usuários:

<img src="/images/readme/evidencia3.png">

Estas evidências provam que há interesse real na aplicação e que o problema abordado é existente e presente no cotidiano dos usuários. A falta de organização explícita do processo e a dificuldade em encontrar locais adequados para doação demonstra a necessidade de um sistema que facilite e centralize essa boa ação.
Dessa forma, os dados coletados reforçam a aceitação do projeto, evidenciando não apenas sua relevância social, mas também seu potencial de adesão por parte dos usuários.

---

## 1.3 Análise de Soluções Existentes (Benchmark)

Givee (https://www.givee.pt/)

<img src="/images/readme/givee.png">

O público-alvo da plataforma Givee abrange pessoas que desejam doar objetos e ajudar outras pessoas diretamente.

Suas funcionalidades principais incluem doação de itens que não são mais utilizados, conexão entre doador e receptor, sistema de interação entre usuários e incentivo à reutilização e economia circular.

As principais limitações estão em não possuir foco em instituições, sendo a visão mais pessoa para pessoa; não há agendamento estruturado de coleta e o processo ainda depende do contato entre usuários.

---

Doação do Bem (https://apps.apple.com/br/app/doação-do-bem/id1516919023)

O público-alvo do aplicativo Doação do Bem são pessoas que desejam doar para instituições como ONGs, hospitais e abrigos.

Suas funcionalidades principais incluem a conexão entre doadores e instituições, doações realizadas diretamente pelo app e apoio a diversas causas sociais.

<img src="/images/readme/doacaoDoBem1.png">
<img src="/images/readme/doacaoDoBem2.png">
<img src="/images/readme/doacaoDoBem3.png">

As principais limitações estão no foco maior em doações diretas, não em objetos físicos com logística; não oferece agendamento detalhado de coleta e possui pouca personalização no processo de doação.

---

Solidarizando (https://solidarizando.com.br/)

Seu público-alvo constitui pessoas interessadas em ajudar instituições por meio de doações ou voluntariado.

<img src="/images/readme/solidarizando.png">

Suas funcionalidades principais são a conexão entre usuários e ONGs, geolocalização de instituições, participação em ações solidárias e doações e voluntariado na mesma plataforma.
Suas limitações abrangem o não foco específico em doação de objetos, a falta sistema de agendamento de coleta/entrega e abrange muitas áreas, o que pode causar confusão ou perda do usuário.

---

Geev (https://play.google.com/store/apps/details?id=fr.geev.application)
O aplicativo é focado em pessoas interessadas em consumo sustentável e reaproveitamento.

<img src="/images/readme/geev1.png">
<img src="/images/readme/geev2.png">

Suas funcionalidades principais incluem doação e coleta gratuita de itens; comunidade ativa de usuários e incentivo à economia circular.
Suas limitações incluem foco em troca entre pessoas, não em instituições; não possui sistema de agendamento estruturado e a logística depende dos próprios usuários.

---

### Comparação

| Solução        | Pontos Fortes                                                                 | Limitações                                                                 |
|----------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Givee          | Plataforma simples e intuitiva para doação de objetos;<br>Incentivo à economia circular;<br>Boa interação entre usuários | Ausência de agendamento;<br>Dependência de contato manual                 |
| Doação do Bem  | Integração com instituições;<br>Facilidade para doar diretamente            | Não foca em objetos físicos/logística;<br>Ausência de agendamento detalhado |
| Solidarizando  | Conexão com ONGs;<br>Geolocalização                                         | Escopo muito amplo;<br>Não possui logística estruturada                   |
| Geev           | Comunidade ativa;<br>Forte incentivo à sustentabilidade                      | Foco em pessoa para pessoa;<br>Ausência de agendamento                    |
| Donatin        | Agendamento estruturado de doações;<br>Recomendação inteligente de instituições;<br>Acompanhamento de impacto das doações | Projeto acadêmico (escala inicial limitada);<br>Dependência de adesão de instituições;<br>Funcionalidades avançadas podem não ser totalmente implementadas na primeira versão |

---

### Diferencial do Projeto

O projeto tem como diferencial integrar e agrupar funcionalidades como cadastro de doações, listagem de instituições e agendamento de doação, facilitando a organização logística e o acompanhamento de impacto, promovendo o ato de doar não apenas pela praticidade, mas também pela confiabilidade e segurança.

A criação de uma nova solução se justifica pela ausência de plataformas que ofereçam esse conjunto de funcionalidades de forma integrada. As soluções existentes focam apenas na conexão entre doadores e receptores, sem oferecer suporte adequado ao planejamento e à execução da doação.

Dessa forma, identifica-se como principal lacuna a falta de organização do processo de doação, especialmente no que se refere ao agendamento, à logística e à orientação do usuário. Além disso, muitas plataformas não priorizam a conexão com instituições específicas, o que pode dificultar a destinação adequada dos itens.

O projeto busca atender um nicho composto por pessoas que desejam doar objetos de maneira prática e organizada, com um olhar para instituições que necessitam desses itens e enfrentam dificuldades na gestão do recebimento. Assim, a aplicação propõe uma solução mais estruturada, acessível e eficiente para o processo de doação.

---

## 1.4 Público-Alvo

A aplicação tem foco para 2 tipos de usuários: pessoas físicas interessadas em realizar uma doação de algum objeto e itens no geral, de forma simples e organizada e instituições que desejam receber uma doação, como igrejas, ONGs e responsáveis por ações sociais, mantendo um registro das doações e facilitando o pedido de ajuda.

O sistema será utilizado em situações do cotidiano em que o usuário deseja doar algum item, mas não possui um processo estruturado para a ação e não sabe quem está precisando. Além disso, o sistema pode ser utilizado por instituições para visualizar e organizar o recebimento de doações, facilitando a comunicação e o planejamento logístico.

O sistema é projetado para usuários com baixo a médio nível técnico, para que cada usuário consiga utilizar da aplicação de forma simples e prática, priorizando facilidade de uso.

---

## 1.5 Objetivos do Projeto

### Objetivo Geral

Desenvolver uma aplicação que facilite e organize o processo de doação entre doadores e receptores, por meio de cadastros de doações, agendamentos e localização, tornando essa boa ação algo acessível, eficiente e estruturado.

---

### Objetivos Específicos

- Permitir o cadastro de doações, incluindo tipo de item, quantidade e descrição;
- Disponibilizar uma lista de instituições receptoras, com informações relevantes e localização;
- Implementar um sistema de agendamento de doações, permitindo ao usuário definir data e horário;
- Desenvolver um sistema de notificações de lembretes, auxiliando o usuário no cumprimento do agendamento.

---

## 1.6 Métricas de Sucesso (KPIs)

- Quantidade de doações realizadas: número total de doações cadastradas e concluídas no sistema;
- Taxa de cumprimento de agendamentos: proporção entre doações agendadas e efetivamente realizadas;
- Cobertura de instituições: quantidade de instituições cadastradas e ativas na plataforma;
- Impacto estimado gerado: número total de itens doados e pessoas potencialmente beneficiadas.

- ---
 
## 2. Engenharia de Requisitos
 
### 2.1 Personas
 
**Persona 1: Lucas Almeida, 23 anos — Doador Casual**
 
Estudante universitário que mora sozinho. Possui roupas, livros e objetos em bom estado que não utiliza mais, mas encontra dificuldade em descobrir quem precisa e como doar de maneira prática. Prefere soluções rápidas e intuitivas.
 
*Objetivos:* encontrar receptores que realmente precisem dos itens; realizar doações de forma rápida e organizada; agendar entregas sem precisar trocar muitas mensagens; acompanhar o impacto das suas doações.
 
*Dificuldades:* não saber onde doar determinados objetos; falta de confiança em alguns locais; dificuldade de organização para combinar entregas; desistir da doação por falta de praticidade.
 
---
 
**Persona 2: Mariana Souza, 38 anos — Responsável por Instituição**
 
Coordenadora de uma ONG em Joinville que organiza campanhas sociais e recebimento de doações para famílias em situação de carência. Grande parte do processo atual ocorre manualmente por redes sociais e mensagens.
 
*Objetivos:* divulgar facilmente os itens que a instituição necessita; receber doações de forma organizada; melhorar a comunicação com doadores; controlar datas e horários de recebimento.
 
*Dificuldades:* falta de sistema centralizado; dificuldade em alcançar novos doadores; organização manual de agendamentos; recebimento de itens que nem sempre são prioritários.
 
---
 
**Persona 3: Renato Ferreira, 31 anos — Usuário Solidário com Pouco Tempo**
 
Trabalha em período integral e deseja ajudar causas sociais, mas possui uma rotina corrida. Tem interesse em doar alimentos, roupas e objetos, porém acaba adiando por não encontrar um processo simples. Valoriza praticidade, notificações e organização.
 
*Objetivos:* conseguir doar sem perder muito tempo; encontrar instituições próximas rapidamente; receber lembretes sobre agendamentos; realizar doações com segurança e confiabilidade.
 
*Dificuldades:* falta de tempo para procurar locais de doação; processos demorados e pouco intuitivos; falta de confirmação sobre o recebimento; esquecimento de datas combinadas.
 
---
 
### 2.2 Casos de Uso Principais
 
**Cadastro e Acesso**
- Criar conta de usuário (CPF para usuários comuns; CNPJ para instituições/empresas)
- Realizar login no sistema
- Recuperar senha
- Editar perfil do usuário
<!-- 📌 IMAGEM: Diagrama de caso de uso — Cadastro e Acesso -->
 
**Gerenciamento de Campanhas/Doações**
- Criar campanha/anúncio de doação
- Editar ou remover a própria campanha/anúncio
- Visualizar detalhes de uma campanha/doação
- Pesquisar itens disponíveis para doação
<!-- 📌 IMAGEM: Diagrama de caso de uso — Gerenciamento de Campanhas/Doações -->
 
**Agendamentos**
- Agendar entrega de doação
- Confirmar recebimento da doação
- Cancelar agendamento
- Consultar histórico de agendamentos
<!-- 📌 IMAGEM: Diagrama de caso de uso — Agendamentos -->
 
**Comunicação e Notificações**
- Receber notificações de agendamento
- Receber lembretes de doação
- Entrar em contato com doador/receptor via chat
<!-- 📌 IMAGEM: Diagrama de caso de uso — Comunicação e Notificações -->
 
**Acompanhamento e Organização**
- Visualizar histórico de doações realizadas
- Acompanhar impacto das doações
- Gerenciar solicitações recebidas
- Consultar status das doações
<!-- 📌 IMAGEM: Diagrama de caso de uso — Acompanhamento e Organização -->
 
---
 
### 2.3 Requisitos Funcionais (RF)
 
| ID | Descrição |
|---|---|
| RF01 | O sistema deve permitir que o usuário crie uma conta. |
| RF02 | O sistema deve permitir que o usuário realize login utilizando e-mail e senha. |
| RF03 | O sistema deve permitir que o usuário recupere sua senha. |
| RF04 | O sistema deve permitir que o usuário edite suas informações de perfil. |
| RF05 | O sistema deve permitir que o usuário cadastre uma doação. |
| RF06 | O sistema deve permitir que o usuário informe descrição, categoria, quantidade e imagens do item doado. |
| RF07 | O sistema deve permitir que o usuário visualize doações disponíveis. |
| RF08 | O sistema deve permitir que o usuário pesquise doações por categoria ou palavra-chave. |
| RF09 | O sistema deve permitir que o usuário edite ou remova a própria doação cadastrada. |
| RF10 | O sistema deve permitir que o usuário solicite uma doação por meio de campanhas. |
| RF11 | O sistema deve permitir que instituições publiquem necessidades de doação. |
| RF12 | O sistema deve permitir que instituições realizem cadastro na plataforma. |
| RF13 | O sistema deve permitir que o usuário visualize informações de instituições cadastradas. |
| RF14 | O sistema deve permitir que o usuário consulte as necessidades de cada instituição. |
| RF15 | O sistema deve permitir que a instituição atualize seus dados e necessidades. |
| RF16 | O sistema deve permitir que o usuário agende uma entrega de doação. |
| RF17 | O sistema deve permitir que o usuário defina data e horário para entrega. |
| RF18 | O sistema deve permitir que o usuário visualize seus agendamentos. |
| RF19 | O sistema deve permitir que o usuário cancele um agendamento. |
| RF20 | O sistema deve permitir que o receptor confirme o recebimento da doação. |
| RF21 | O sistema deve permitir que o usuário receba notificações sobre agendamentos. |
| RF22 | O sistema deve permitir que o usuário receba lembretes relacionados às doações. |
| RF23 | O sistema deve permitir a comunicação entre doador e receptor. |
| RF24 | O sistema deve permitir que o usuário visualize seu histórico de doações. |
| RF25 | O sistema deve permitir que instituições acompanhem solicitações recebidas. |
| RF26 | O sistema deve permitir que o usuário visualize o status de suas doações. |
| RF27 | O sistema deve permitir que o usuário acompanhe o impacto estimado das doações realizadas. |
 
---
 
### 2.4 Requisitos Não Funcionais (RNF)
 
| ID | Descrição |
|---|---|
| RNF01 | O sistema deve suportar pelo menos 50 usuários simultâneos durante a fase inicial. |
| RNF02 | O tempo médio de resposta das principais operações deve ser inferior a 2 segundos em condições normais de uso. |
| RNF03 | O sistema deve carregar as telas principais em até 3 segundos utilizando conexão padrão de internet móvel. |
| RNF04 | O sistema deve utilizar autenticação segura por e-mail e senha. |
| RNF05 | O sistema deve armazenar senhas de usuários de forma criptografada. |
| RNF06 | O sistema deve permitir acesso apenas a usuários autenticados em funcionalidades privadas. |
| RNF07 | O sistema deve proteger dados pessoais dos usuários conforme princípios básicos da LGPD. |
| RNF08 | O sistema deve possuir disponibilidade mínima de 90% durante o período de testes e utilização acadêmica. |
| RNF09 | O sistema deve possuir mecanismo de recuperação de sessão em caso de falha temporária de conexão. |
| RNF10 | O sistema deve permitir expansão futura para suportar novos módulos e funcionalidades. |
| RNF11 | O banco de dados deve suportar crescimento contínuo de usuários, instituições e registros sem necessidade de alterações estruturais imediatas. |
| RNF12 | O sistema deve possuir interface simples e intuitiva para usuários com baixo ou médio conhecimento técnico. |
| RNF13 | O sistema deve manter padronização visual entre telas e componentes. |
| RNF14 | O sistema deve ser responsivo para diferentes tamanhos de dispositivos móveis. |
| RNF15 | O sistema deve minimizar a quantidade de etapas necessárias para realizar uma doação ou agendamento. |
| RNF16 | O sistema deve funcionar em dispositivos móveis com versões recentes do sistema operacional. |
| RNF17 | O código do sistema deve seguir boas práticas de organização e manutenção. |
| RNF18 | O sistema deve utilizar serviços em nuvem para armazenamento e gerenciamento de dados. |
 
---
 
### 2.5 Regras de Negócio
 
| ID | Descrição |
|---|---|
| RN01 | Apenas usuários autenticados poderão cadastrar, editar ou remover doações. |
| RN02 | Apenas instituições cadastradas poderão publicar campanhas e solicitações institucionais. |
| RN03 | O usuário deverá fornecer informações mínimas obrigatórias ao cadastrar uma doação: título, categoria e descrição do item. |
| RN04 | O sistema não deverá permitir agendamentos em datas ou horários já expirados. |
| RN05 | Uma doação poderá possuir apenas um agendamento ativo por vez. |
| RN06 | O receptor deverá confirmar o recebimento da doação para que ela seja marcada como concluída. |
| RN07 | Usuários não poderão editar informações de doações já concluídas. |
| RN08 | O sistema deverá permitir o cancelamento de agendamentos apenas antes da data prevista para entrega. |
| RN09 | O sistema deverá registrar o histórico das ações principais realizadas pelos usuários. |
| RN10 | O sistema deverá impedir o cadastro de contas utilizando e-mails já registrados. |
| RN11 | Campanhas de solicitação de doação deverão possuir descrição clara sobre a necessidade apresentada. |
| RN12 | O sistema deverá permitir que usuários denunciem anúncios ou campanhas inadequadas. |
| RN13 | Apenas o usuário responsável pela publicação poderá editar ou remover sua própria doação ou campanha. |
| RN14 | O sistema deverá exibir apenas doações disponíveis como ativas nas pesquisas dos usuários. |
| RN15 | O sistema deverá enviar notificações relacionadas a alterações importantes nos agendamentos e status das doações. |
 
---
 
### 2.6 Fora do Escopo
 
Para manter o projeto viável dentro do prazo estimado, as seguintes funcionalidades **não** farão parte da primeira versão:
 
- Pagamentos ou transações financeiras internas.
- Integração com serviços de entrega ou transporte de doações.
- Videoconferências ou chamadas em tempo real entre usuários.
- Verificação oficial de antecedentes ou autenticidade jurídica de instituições.
- Integração com redes sociais para publicação automática de campanhas.
- Doações monetárias diretamente pela plataforma.
- Suporte multilíngue.
- Painel administrativo complexo para análise avançada de métricas e relatórios.
- Rastreamento em tempo real da entrega das doações.
- Suporte offline (sem conexão com internet).
---
 
## 3. Fluxos e Comportamento do Sistema
 
### 3.1 Fluxo Principal do Usuário
 
**Fluxograma Geral do Sistema**
 
<!-- 📌 IMAGEM: Fluxograma geral do sistema (usuário abre app → possui conta? → login/cadastro → página inicial → Doar / Criar campanha / Visualizar perfil) -->
 
**Diagrama de Atividades — Processo de Doação**
 
<!-- 📌 IMAGEM: Diagrama de atividades do processo de doação (abrir app → login → campanhas → selecionar → inserir quantidade → combinar entrega → agendamento registrado? → sucesso/erro → meta atingida?) -->
 
**Diagrama de Atividades — Criação de Campanha**
 
<!-- 📌 IMAGEM: Diagrama de atividades de criação de campanha (acessar área → criar → preencher título/descrição → adicionar imagens → definir meta → enviar → dados válidos? → salvar/publicar ou exibir erros) -->
 
**Diagrama de Sequência — Fluxo de Doação**
 
<!-- 📌 IMAGEM: Diagrama de sequência do fluxo de doação (Usuário → Aplicativo → Backend/API → Banco de Dados) -->
 
**Diagrama de Sequência — Criação de Campanha**
 
<!-- 📌 IMAGEM: Diagrama de sequência da criação de campanha (Usuário → Aplicativo → Backend/API → Banco de Dados) -->
 
---
 
### 3.2 Fluxos Alternativos
 
**Falha no Login** — Ocorre quando o usuário informa credenciais inválidas durante a autenticação.
 
<!-- 📌 IMAGEM: Fluxograma de falha no login (informa email/senha → credenciais válidas? → permitir acesso / exibir erro → nova tentativa) -->
 
**Usuário Não Autenticado** — Ocorre quando um usuário tenta acessar funcionalidades restritas sem estar autenticado.
 
<!-- 📌 IMAGEM: Fluxograma de usuário não autenticado (tenta acessar recurso → autenticado? → permitir acesso / redirecionar para login) -->
 
**Cancelamento da Criação de Campanha** — Ocorre quando o usuário decide interromper o processo de criação antes da publicação.
 
<!-- 📌 IMAGEM: Fluxograma de cancelamento de criação de campanha (preenche formulário → deseja cancelar? → confirmar cancelamento? → descartar dados / continuar preenchimento) -->
 
**Dados Inválidos na Campanha** — Ocorre quando o usuário envia informações incompletas ou inválidas ao criar uma campanha.
 
<!-- 📌 IMAGEM: Fluxograma de dados inválidos na campanha (envia campanha → dados válidos? → salvar / exibir mensagens de validação → destacar campos incorretos → usuário corrige) -->
 
---
 
## 4. Mockups e Experiência do Usuário (UX)
 
Ferramentas utilizadas: **Figma** e **Draw.io**
 
🔗 **Link do Figma:** https://www.figma.com/design/lQJVVT0smAukCS2pbduew4/Untitled?node-id=0-1&t=C1dJyzfSYoPxMfnU-1
 
---
 
### 4.1 Fluxo de Navegação
 
<!-- 📌 IMAGEM: Diagrama do fluxo de navegação completo (tela de abertura → login/cadastro → Início / Doar / Criar campanha / Perfil → subfluxos de cada seção) -->
 
---
 
### 4.2 Wireframes e Mockups das Telas
 
**Tela de cadastro e login**
 
Reúnem as informações necessárias para o usuário realizar o cadastro na plataforma, sendo todos os dados obrigatórios.
 
<!-- 📌 IMAGEM: Mockups das telas de Criar conta e Entrar -->
 
---
 
**Tela de início**
 
Página principal do sistema, onde o usuário pode interagir com ícones e widgets, buscar campanhas, visualizar categorias e campanhas em destaque.
 
<!-- 📌 IMAGEM: Mockup da tela de início -->
 
---
 
**Tela de doações**
 
O usuário explora as diversas campanhas criadas e decide para qual realizará a doação, podendo filtrar por "Todas", "Mais apoiadas" e "Finalizando". Ao selecionar uma campanha, visualiza seus detalhes completos e o botão de agendar doação.
 
<!-- 📌 IMAGEM: Mockups da tela de exploração de campanhas e detalhe de campanha -->
 
---
 
**Tela de agendamento/confirmação de doação**
 
O usuário preenche quantidade a ser doada, modalidade (entrega ou coleta), dia e horário. Ao confirmar, é exibido o resumo do agendamento com mensagem de sucesso.
 
<!-- 📌 IMAGEM: Mockups da tela de agendar doação e tela de confirmação de sucesso -->
 
---
 
**Tela de denúncia de campanha**
 
Permite ao usuário denunciar uma campanha irregular, selecionando o motivo (Spam, Conteúdo ofensivo/inapropriado, Campanha falsa, Outro).
 
<!-- 📌 IMAGEM: Mockup da tela de denúncia de campanha -->
 
---
 
**Tela de criação de campanha**
 
Fluxo em 3 etapas: introdução → informações básicas (título, categoria, descrição, produto, meta, prazo, tipo de recebimento) → confirmação de publicação.
 
<!-- 📌 IMAGEM: Mockups das telas de criação de campanha (etapas 1, 2 e confirmação) -->
 
---
 
**Tela de perfil**
 
Retorna informações da conta do usuário. Permite acessar e editar dados pessoais, acessar doações realizadas, campanhas criadas, excluir conta e efetuar logoff.
 
<!-- 📌 IMAGEM: Mockups da tela de perfil, dados pessoais, minhas doações, minhas campanhas e exclusão de conta -->
 
---
 
### 4.3 Fluxo de Interação do Usuário
 
1. O usuário acessa o sistema e cadastra uma conta.
<!-- 📌 IMAGEM: Telas de splash/welcome e Criar conta -->
 
2. O usuário é redirecionado para a página principal e acessa a área de doações.
<!-- 📌 IMAGEM: Telas de Início e Explorar campanhas -->
 
3. O usuário seleciona uma campanha e agenda uma doação.
<!-- 📌 IMAGEM: Telas de detalhe da campanha e Agendar doação -->
 
4. O usuário finaliza o preenchimento e confirma o agendamento, sendo redirecionado para a tela de sucesso.
<!-- 📌 IMAGEM: Tela de confirmação "Doação agendada com sucesso!" -->
 
5. Caso acesse a criação de campanha, o usuário preenche as informações em etapas e recebe a confirmação de publicação.
<!-- 📌 IMAGEM: Telas do fluxo de criação de campanha -->
 
---
 
## 5. Arquitetura do Sistema
 
### 5.1 Diagrama C4
 
#### Nível 1 — Diagrama de Contexto
 
Visão macro do sistema Donatin, mostrando como o aplicativo se relaciona com os usuários e com os serviços externos.
 
**Atores:**
- **Doador/Beneficiário:** usuário responsável por realizar doações, criar campanhas solidárias e acompanhar históricos de contribuição.
- **Administrador:** responsável pela moderação de conteúdo, gerenciamento de usuários, análise de denúncias e suporte operacional.
**Sistemas Externos:**
- **Serviço de Notificações** (ex: Firebase Cloud Messaging): envio de notificações push aos usuários via HTTPS.
- **Provedor de Autenticação** (ex: Firebase Authentication, Auth0): autenticação, login e gerenciamento de sessões via OAuth 2.0 / JWT.
<!-- 📌 IMAGEM: Diagrama C4 Nível 1 — Contexto -->
 
**Fluxo de Valor:**
1. O usuário realiza login no aplicativo.
2. O sistema valida a autenticação através do provedor externo.
3. O doador cria ou participa de campanhas.
4. Quando uma doação é realizada, o sistema cria o agendamento.
5. O banco de dados retorna a confirmação do agendamento.
6. Notificações são enviadas aos envolvidos.
7. O administrador acompanha e modera o ambiente.
---
 
#### Nível 2 — Diagrama de Containers
 
<!-- 📌 IMAGEM: Diagrama C4 Nível 2 — Containers -->
 
| Container | Tecnologia | Responsabilidade |
|---|---|---|
| **Aplicativo Mobile** | Flutter | Interface do usuário, criação de campanhas, realização de doações, acompanhamento e notificações |
| **API Backend** | ASP.NET Core Web API | Regras de negócio, autenticação, gerenciamento de campanhas, processamento de solicitações e integração com serviços externos |
| **Banco de Dados** | PostgreSQL | Armazenamento de usuários, campanhas, solicitações, doações, notificações, históricos e denúncias |
| **Serviço de Notificações** | Firebase Cloud Messaging (FCM) | Envio de notificações push, alertas de campanha e atualizações de status |
| **Serviço de Autenticação** | JWT / OAuth 2.0 | Autenticação, autorização, gerenciamento de sessões e proteção de rotas |
 
---
 
#### Nível 3 — Diagrama de Componentes (API Backend)
 
<!-- 📌 IMAGEM: Diagrama C4 Nível 3 — Componentes da API Backend -->
 
A API Backend segue uma **arquitetura em camadas**:
 
**Controllers**
- `AuthController` — login, cadastro, autenticação e geração de token JWT.
- `CampaignController` — criação/atualização de campanhas, listagem e gerenciamento de solicitações.
- `DonationController` — registro de doações e consulta de histórico.
- `UserController` — gerenciamento de perfis, atualização de dados e permissões.
**Services**
- `AuthenticationService` — validação de credenciais, geração de JWT e controle de acesso.
- `CampaignService` — validação de campanhas, regras de criação, encerramento e gerenciamento de status.
- `DonationService` — processamento de doações, validação e atualização de quantidade de itens arrecadados.
- `NotificationService` — envio de notificações.
**Repositories**
- `UserRepository` — persistência de usuários.
- `CampaignRepository` — persistência de campanhas.
- `DonationRepository` — persistência de doações.
---
 
### 5.2 Modelo de Dados
 
O modelo de dados segue abordagem **relacional**, garantindo integridade dos dados e organização estrutural.
 
**DER (Diagrama Entidade-Relacionamento)**
 
<!-- 📌 IMAGEM: DER completo do sistema (entidades: Usuario, Notificacao, Denuncia, Campanha, Doacao, Agendamento) -->
 
**Esquema Relacional**
 
| Entidade | PK | Atributos |
|---|---|---|
| **Usuario** | id_user: UUID | name, email, password_hash, cpf_cnpj, birth_date, cep, street, neighborhood, num, city_uf |
| **Notificacao** | id_notification: UUID | title, subject, is_read, created_at, user_id (FK) |
| **Denuncia** | id_report: UUID | type, description, created_at, reporter_id (FK), campaign_id (FK) |
| **Campanha** | id_campaign: UUID | title, category, description, product, goal, conclusion_date, receive_option, campaing_image |
| **Doacao** | id_donation: UUID | message, created_at, user_id (FK), campaign_id (FK), donation_quantity, send_date |
| **Agendamento** | id_scheduling: UUID | scheduling_date, status, user_id (FK), donation_id (FK), campaign_id (FK) |
 
---
 
### 5.3 Principais Componentes
 
- **Aplicativo Mobile** (Flutter) — interface, autenticação, campanhas, doações e notificações.
- **API Backend** (ASP.NET Core) — regras de negócio, autenticação, validações e comunicação com o banco.
- **Sistema de Autenticação** — JWT e ASP.NET Identity para login, autorização e proteção de rotas.
- **Módulo de Campanhas** — criação, edição, listagem e gerenciamento das campanhas solidárias.
- **Módulo de Doações** — registros de doações realizadas, sem processamento financeiro integrado.
- **Sistema de Notificações** — Firebase Cloud Messaging para notificações e alertas.
- **Camada de Persistência** — Entity Framework Core para acesso e manipulação dos dados.
- **Banco de Dados** — PostgreSQL para armazenamento com integridade relacional.
---
 
### 5.4 Stack Tecnológica
 
| Tecnologia | Uso | Justificativa |
|---|---|---|
| **Flutter** | Aplicativo Mobile | Desenvolvimento multiplataforma (Android e iOS) com única base de código, aumentando produtividade e reduzindo custos. |
| **C# / ASP.NET Core** | Backend | Alta performance na construção de APIs e forte suporte a arquitetura em camadas. |
| **PostgreSQL** | Banco de Dados | Excelente suporte a integridade referencial e consultas complexas, essencial para um sistema com usuários, campanhas e registros de doações. |
| **JWT** | Autenticação | Comunicação stateless entre cliente e servidor com segurança no controle de acesso. |
| **Firebase Cloud Messaging** | Notificações | Envio de push notifications de forma confiável, gratuita e com suporte multiplataforma. |
 
---
 
## 6. Segurança e Privacidade
 
O sistema utilizará autenticação por login e senha, garantindo que apenas usuários autenticados acessem funcionalidades restritas. Serão aplicados mecanismos de autorização para que cada usuário acesse apenas seus próprios dados.
 
As senhas serão armazenadas com **hash seguro** — nunca em texto puro. A comunicação entre cliente e servidor ocorrerá exclusivamente via **HTTPS**.
 
Serão adotadas práticas de proteção contra as vulnerabilidades do **OWASP Top 10**, incluindo validação de entradas, prevenção contra injeção de código, controle de autenticação, proteção contra exposição indevida de informações e tratamento seguro de erros.
 
### 6.1 Privacidade e LGPD
 
O Donatin coletará apenas os dados necessários para o funcionamento da plataforma: nome, e-mail, senha, informações de perfil e registros relacionados às doações.
 
Os dados serão armazenados em banco protegido por autenticação e controle de acesso. Senhas serão armazenadas com algoritmos de hash seguros, impossibilitando sua recuperação em formato original.
 
Os dados coletados serão utilizados **exclusivamente** para o funcionamento da plataforma — sem comercialização ou compartilhamento com terceiros.
 
Em conformidade com a **LGPD**, o usuário poderá solicitar a exclusão da sua conta. Quando isso ocorrer, os dados pessoais serão removidos ou anonimizados, exceto quando houver necessidade de retenção por motivos legais ou de auditoria. O sistema disponibilizará informações claras sobre quais dados são armazenados e sua finalidade.
 
---
 
## 7. Planejamento do Projeto
 
| Marco | Descrição | Prazo |
|---|---|---|
| M1 | Levantamento de requisitos, definição da arquitetura, setup do ambiente e prova de conceito | Semanas 1 a 4 |
| M2 | Desenvolvimento das funcionalidades principais (cadastro, autenticação, gerenciamento de doações e perfis) | Semanas 5 a 12 |
| M3 | Entrega do MVP funcional com fluxo principal completo | Semanas 13 a 16 |
| M4 | Testes, correção de bugs e melhorias de usabilidade | Semanas 17 a 20 |
| M5 | Ajustes finais, documentação e preparação para publicação nas lojas | Semanas 21 a 24 |
 
---
 
## 8. Referências
 
GIVEE. Plataforma de doação de bens. Disponível em: https://www.givee.pt/. Acesso em: 11 jun. 2026.
 
DOAÇÃO DO BEM. Aplicativo para doação de itens. Disponível em: https://apps.apple.com/br/app/doação-do-bem/id1516919023. Acesso em: 11 jun. 2026.
 
SOLIDARIZANDO. Plataforma de doação e impacto social. Disponível em: https://solidarizando.com.br/. Acesso em: 11 jun. 2026.
 
GEEV. Aplicativo de doação e reutilização de objetos. Disponível em: https://play.google.com/store/apps/details?id=fr.geev.application. Acesso em: 11 jun. 2026.
 
HUSSAIN, A.; MKPOJIOGU, E. O. C.; YUE, W. S. Software engineering process models for mobile app development: a systematic literature review. *Journal of Systems and Software*, v. 145, p. 98–111, 2018. Disponível em: https://doi.org/10.1016/j.jss.2018.08.028.
 
BERNARDES, T. F.; MIYAKE, M. Cross-platform mobile development approaches: a systematic review. *IEEE Latin America Transactions*, v. 14, n. 4, p. 1892–1898, 2016. Disponível em: https://doi.org/10.1109/TLA.2016.7483531.
 
EBRAHIMI, F.; TUSHEV, M.; MAHMOUD, A. Mobile app privacy in software engineering research: a systematic mapping study. *arXiv*, 2019. Disponível em: https://arxiv.org/abs/1910.03622.
 
