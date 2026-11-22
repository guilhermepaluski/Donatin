# Donatin

Plataforma web que conecta quem quer doar objetos a pessoas e instituições que precisam deles. Quem precisa publica uma **campanha** (o que precisa, quanto e até quando), o doador registra uma **doação** com **agendamento** de entrega ou coleta, e quem recebe **confirma o recebimento**, atualizando o progresso da campanha.

Projeto de Portfólio (TCC) de Engenharia de Software da **Católica SC**, linha **Web Apps**.
**Autor:** Guilherme Mafra Paluski

## Links

| O quê | Onde |
|---|---|
| Aplicação (front) | https://donatin-d0hsc7hkbvg8eyh7.brazilsouth-01.azurewebsites.net/ |
| API | https://donatin-api-ehdvhbd5gzh8eza5.brazilsouth-01.azurewebsites.net/api |
| Análise estática | [SonarCloud — guilhermepaluski_Donatin](https://sonarcloud.io/project/overview?id=guilhermepaluski_Donatin) |
| RFC (especificação original) | [`docs/RFC-Donatin-Guilherme_Mafra_Paluski.md`](../blob/main/docs/RFC-Donatin-Guilherme_Mafra_Paluski.md) |

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React 19 + TypeScript, Vite, Tailwind CSS, React Router, React Hook Form + Zod |
| Back-end | ASP.NET Core (.NET 10), Entity Framework Core, Npgsql |
| Banco de dados | PostgreSQL (Azure Database for PostgreSQL – Flexible Server) |
| Autenticação | JWT Bearer, senhas com BCrypt |
| Testes | xUnit + Moq + coverlet (back) · Vitest + Testing Library (front) |
| CI/CD | GitHub Actions → Azure App Service |
| Qualidade | SonarCloud |
| Imagens | Azure Blob Storage (upload pela API) |
| Monitoramento | Azure Application Insights |

## Páginas desta Wiki

1. [Arquitetura](Arquitetura) — camadas, diagramas C4 e modelo de dados
2. [Requisitos](Requisitos) — RFs, RNFs, regras de negócio e o que ficou para o futuro
3. [Casos de Uso](Casos-de-Uso)
4. [Fluxos de Negócio](Fluxos-de-Negocio) — cada fluxo da tela até o banco, com os arquivos envolvidos
5. [Decisões Técnicas](Decisoes-Tecnicas)
6. [Deploy e Ambientes](Deploy) — como rodar local e como funciona o deploy na Azure
7. [Qualidade e Testes](Qualidade-e-Testes) — testes, cobertura, TDD e SonarCloud
8. [Monitoramento](Monitoramento)

## Status

| Item obrigatório (Playbook Web Apps) | Situação |
|---|---|
| Deploy em nuvem pública | ✅ Azure App Service (front e API) + PostgreSQL |
| ≥ 3 fluxos de negócio completos | ✅ Cadastro/Login · Campanha · Doação + agendamento · Confirmação |
| Cobertura com TDD (75% back / 25% front) | ✅ ver [Qualidade e Testes](Qualidade-e-Testes) |
| CI/CD | ✅ GitHub Actions |
| Análise estática | ✅ SonarCloud com Quality Gate |
| Monitoramento | ✅ Application Insights |
| Documentação em Wiki | ✅ esta Wiki |
