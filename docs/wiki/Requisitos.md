# Requisitos

Requisitos do [RFC](../blob/main/docs/RFC-Donatin-Guilherme_Mafra_Paluski.md) e a situação de cada um na versão atual.

**Legenda:** ✅ implementado · 🟡 parcial · ⏳ trabalho futuro · ➖ fora do escopo atual (decisão consciente)

> No RFC a "doação" era um anúncio criado pelo doador. Na implementação, **doação é uma contribuição para uma campanha** (ver [Decisões Técnicas](Decisoes-Tecnicas)). Os RFs abaixo foram lidos com essa interpretação.

## Requisitos Funcionais

| RF | Descrição | Situação | Onde está |
|---|---|---|---|
| RF01 | Criar conta (CPF ou CNPJ) | ✅ | `POST /auth/register` · `RegisterPage` |
| RF02 | Login com e-mail e senha | ✅ | `POST /auth/login` · `LoginPage` |
| RF03 | Recuperar senha | ⏳ | depende de serviço de envio de e-mail |
| RF04 | Editar perfil | ✅ | `PUT /users/me` · `ProfilePage` |
| RF05 | Cadastrar doação | ✅ | `POST /donations` · `DonatePage` |
| RF06 | Informar descrição, categoria, quantidade e imagens | 🟡 | imagem da campanha é uma URL; upload (Firebase Storage) é futuro |
| RF07 | Visualizar campanhas disponíveis | ✅ | `GET /campaigns` · `CampaignsPage`, `HomePage` |
| RF08 | Pesquisar por categoria ou palavra-chave | ✅ | `GET /campaigns?category=&keyword=` |
| RF09 | Editar ou remover a própria doação | 🟡 | doação pode ser **cancelada** enquanto pendente; não é editável |
| RF10 | Solicitar doação por meio de campanhas | ✅ | `POST /campaigns` · `CreateCampaignPage` |
| RF11 | Instituições publicam necessidades | ✅ | campanhas (qualquer usuário pode publicar) |
| RF12 | Cadastro de instituições | ✅ | cadastro com CNPJ (`User.IsInstitution`) |
| RF13 | Visualizar informações de instituições | 🟡 | perfil público `GET /users/{id}/public`; lista de instituições é futuro |
| RF14 | Consultar necessidades de cada instituição | ✅ | campanhas do usuário no perfil público (`GET /campaigns/user/{id}`) |
| RF15 | Instituição atualiza dados e necessidades | 🟡 | dados: ✅ perfil. Campanha: API pronta (`PUT`/`DELETE /campaigns/{id}`), tela ⏳ |
| RF16 | Agendar entrega | ✅ | data escolhida na doação; `POST /schedules` para nova data |
| RF17 | Definir data e horário | ✅ | `Schedule.ScheduleDate` (só datas futuras) |
| RF18 | Visualizar agendamentos | ✅ | `GET /schedules/mine` · `MyCampaignsAndDonationsPage` |
| RF19 | Cancelar agendamento | ✅ | receptor recusa a data (`POST /schedules/{id}/refuse`); cancelar a doação recusa o agendamento |
| RF20 | Receptor confirma o recebimento | ✅ | `POST /donations/{id}/confirm` |
| RF21 | Notificações sobre agendamentos | ✅ | sininho (`NotificationBell`) · `/notifications` |
| RF22 | Lembretes relacionados às doações | ⏳ | tipo `Lembrete` existe, envio automático é futuro |
| RF23 | Contato por link de telefone | ✅ | links `tel:` no perfil e no card da doação |
| RF24 | Histórico de doações | ✅ | `GET /donations/mine` |
| RF25 | Instituição acompanha solicitações recebidas | ✅ | `GET /donations/campaign/{id}` |
| RF26 | Status das doações | ✅ | Pendente · Concluída · Cancelada (badge no card) |
| RF27 | Impacto estimado das doações | ⏳ | — |

## Regras de Negócio

| RN | Regra | Situação | Onde é garantida |
|---|---|---|---|
| RN01 | Só usuários autenticados cadastram/alteram doações | ✅ | `[Authorize]` no `DonationsController` |
| RN02 | Só instituições publicam campanhas | ➖ | decisão: qualquer usuário pode criar campanha |
| RN03 | Informações mínimas obrigatórias | ✅ | validações nos DTOs e no construtor de `Campaign` |
| RN04 | Sem agendamentos no passado | ✅ | `Schedule` (`OnlyFutureSchedules`) |
| RN05 | Um agendamento ativo por doação | ✅ | índice único em `Schedules.DonationId`; nova data **reagenda** o mesmo registro |
| RN06 | Expiração após 7 dias sem confirmação | ⏳ | status `Expirada` já existe no modelo |
| RN07 | Doação concluída não pode ser alterada | ✅ | `Donation.EnsurePending` |
| RN08 | Recusar agendamento só antes da data prevista | ✅ | `Schedule.RefuseSchedule` |
| RN09 | Histórico das ações principais | 🟡 | datas de criação + notificações de cada mudança |
| RN10 | E-mail não pode repetir | ✅ | `AuthController.Register` (409) + índice único |
| RN11 | Campanha com descrição clara | ✅ | descrição obrigatória |
| RN12 | Denunciar campanhas | ⏳ | exige moderação (papel de administrador) |
| RN13 | Só o dono edita/remove a própria campanha | ✅ | `CampaignsController` (403) |
| RN14 | Pesquisa mostra só campanhas ativas | ✅ | `CampaignRepository.SearchActiveAsync` |
| RN15 | Notificar mudanças em agendamentos e doações | ✅ | `Notify(...)` nos controllers |

Regras adicionais que surgiram na implementação:

- Ninguém pode doar para a **própria campanha**.
- Campanha **encerrada, expirada ou com a meta atingida** não aceita novas doações (o front mostra o motivo; o back devolve 400).
- Doação **anônima** só é permitida na modalidade **Entrega** (na coleta o receptor precisa saber quem buscar).
- O recebimento pode ser confirmado mesmo se a campanha já encerrou/expirou: a doação foi feita dentro do prazo.

## Requisitos Não Funcionais

| RNF | Descrição | Situação |
|---|---|---|
| RNF04 / RNF05 | Autenticação por e-mail e senha; senha criptografada | ✅ JWT + BCrypt |
| RNF06 | Funcionalidades privadas só autenticado | ✅ `[Authorize]` na API + `ProtectedRoute` no front |
| RNF07 | LGPD | 🟡 endereço só guardado quando necessário, doação anônima, Política de Privacidade; exclusão de conta ⏳ |
| RNF08 | Disponibilidade | ✅ hospedado na Azure, monitorado pelo Application Insights |
| RNF10 / RNF17 | Expansível, código organizado | ✅ camadas + testes |
| RNF12 / RNF13 / RNF14 | Interface simples, padronizada e responsiva | ✅ Tailwind + componentes reutilizáveis |
| RNF16 | Android/iOS com Flutter | ➖ projeto reposicionado para Web Apps |
| RNF18 | Serviços em nuvem | ✅ Azure |
| RNF19 | Imagens no Firebase Storage | ⏳ |

## Trabalho futuro

| Item | Motivo de ter ficado para depois |
|---|---|
| RF03 — Recuperar senha | Precisa de um serviço de e-mail (SendGrid, Azure Communication Services) |
| RF22 / RN06 — Lembretes e expiração automática | Precisa de uma rotina em segundo plano na API |
| RF27 — Impacto estimado | Priorizados os fluxos principais |
| RN12 — Denúncias | Precisa de um papel de administrador para moderar |
| RF13 — Lista de instituições | Hoje as instituições são vistas pelo perfil público |
| RNF19 — Upload de imagens | Hoje a imagem é informada por URL |
| Tela de editar/encerrar campanha | A API já suporta (`PUT` / `DELETE /campaigns/{id}`) |
| Exclusão de conta (LGPD) | Anonimizar os dados pessoais mantendo o histórico |
