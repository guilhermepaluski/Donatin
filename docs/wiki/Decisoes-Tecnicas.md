# Decisões Técnicas

Cada decisão com o contexto, o que foi escolhido e o custo (trade-off).

## 1. Web primeiro (em vez de app Flutter)
- **Contexto:** o RFC previa um app mobile em Flutter.
- **Decisão:** o projeto foi reposicionado para a linha **Web Apps**: React no front e .NET na API.
- **Trade-off:** perde-se a experiência nativa (RNF16), mas a entrega fica mais segura dentro do prazo e o site funciona em qualquer dispositivo com navegador (layout responsivo). A API é a mesma para um app futuro.

## 2. Doação é uma contribuição a uma campanha
- **Contexto:** no RFC, o doador criava um "anúncio" do item.
- **Decisão:** quem precisa cria a **campanha** e o doador **contribui** para ela.
- **Trade-off:** o foco fica em quem precisa (alinhado ao problema do RFC), e a meta/progresso da campanha passa a fazer sentido. O "anúncio avulso" do doador não existe.

## 3. Qualquer usuário pode criar campanha (RN02 não implementada)
- **Decisão:** não há tipos de usuário com permissões diferentes. Instituição é só um usuário com CNPJ (`User.IsInstitution`).
- **Trade-off:** mais simples e permite pessoas físicas com necessidades reais. Não há verificação de instituições (já era fora do escopo no RFC).

## 4. Autenticação própria com JWT (em vez de Firebase Auth / Auth0)
- **Decisão:** cadastro e login na própria API, senha com **BCrypt** e sessão com **JWT** (expira em 8h), guardado no `localStorage`.
- **Por quê:** sem dependência externa, e o controle das regras (e-mail único, CNPJ) fica no back.
- **Trade-off:** recuperação de senha (RF03) precisaria de um serviço de e-mail, que ficou para o futuro. `localStorage` é simples, mas exige cuidado com XSS (o React já escapa o conteúdo renderizado).

## 5. Notificações dentro do site (em vez de push com FCM)
- **Decisão:** tabela `Notifications` e o sininho no menu, que consulta a API.
- **Trade-off:** sem push no celular, mas sem serviço externo e com histórico guardado no banco.

## 6. Camadas sem "Services": regras nas entidades (domínio rico)
- **Decisão:** as regras ficam **dentro das entidades** (`Donation.ConfirmDonation()`, `Schedule.RefuseSchedule()`, `Campaign.AddDonation()`), e os controllers orquestram: buscam no repositório, chamam a entidade e salvam.
- **Por quê:** a regra fica num lugar só e é fácil de testar sem banco (testes de domínio).
- **Trade-off:** os controllers têm um pouco mais de código (verificações de permissão e notificações).

## 7. Repositórios com interfaces (inversão de dependência)
- **Decisão:** controllers recebem `ICampaignRepository` etc. por injeção de dependência (`Program.cs`).
- **Por quê:** permite trocar o banco e, principalmente, **testar os controllers com Moq** sem PostgreSQL.

## 8. Encerramento por soft delete
- **Decisão:** `DELETE /campaigns/{id}` marca `IsActive = false` em vez de apagar. As FKs usam `DeleteBehavior.Restrict`.
- **Por quê:** doações e agendamentos antigos continuam com histórico (RN09).

## 9. Enums como texto e datas em UTC
- **Decisão:** enums gravados como `string` no banco e no JSON (`JsonStringEnumConverter`); nomes sem acento (`Concluida`). Datas sempre em UTC na API; o front envia a data escolhida em ISO/UTC (`new Date(...).toISOString()`).
- **Por quê:** banco legível, sem problemas de encoding e sem confusão de fuso horário entre servidor e navegador.

## 10. `PUT` para atualizar campanha
- **Decisão:** atualização completa (`PUT`) em vez de parcial (`PATCH`).
- **Por quê:** o formulário de edição sempre envia todos os campos, e as validações do domínio rodam sobre o objeto inteiro.

## 11. Endereço só quando necessário (LGPD)
- **Decisão:** o endereço de entrega da campanha só é guardado se ela recebe por Entrega, e o endereço do doador só se a doação for por Coleta. Doações por Entrega podem ser anônimas.
- **Por quê:** princípio da minimização de dados da LGPD.

## 12. Azure App Service + GitHub Actions (deploy sem SSH/FTP)
- **Decisão:** front e API em dois App Services, banco em PostgreSQL Flexible Server, deploy automático a cada push na `main` com login por **OIDC** (sem senha guardada no repositório).
- **Por quê:** ambiente público estável, exigido pelo Playbook, e deploy reproduzível. Ver [Deploy](Deploy).

## 13. Migrations aplicadas na subida da API
- **Decisão:** `db.Database.Migrate()` no `Program.cs`.
- **Trade-off:** simplifica o deploy (o banco se atualiza sozinho), mas numa escala maior o ideal seria rodar as migrations como um passo separado do pipeline.
