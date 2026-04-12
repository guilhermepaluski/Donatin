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

<img src="/images/evidencia1.png">

Baseado nas respostas dos candidatos, o sistema tem grande potencial de facilitar doações na região onde o usuário se encontra. Algumas respostas indicam que o aplicativo pode alavancar ainda mais doações no cotidiano:

<img src="/images/evidencia2.png">

Além disso, a partir das respostas, o sistema apresenta potencial interesse de uso pelos usuários:

<img src="/images/evidencia3.png">

Estas evidências provam que há interesse real na aplicação e que o problema abordado é existente e presente no cotidiano dos usuários. A falta de organização explícita do processo e a dificuldade em encontrar locais adequados para doação demonstra a necessidade de um sistema que facilite e centralize essa boa ação.
Dessa forma, os dados coletados reforçam a aceitação do projeto, evidenciando não apenas sua relevância social, mas também seu potencial de adesão por parte dos usuários.

---

## 1.3 Análise de Soluções Existentes (Benchmark)

Givee (https://www.givee.pt/)

<img src="/images/givee.png">

O público-alvo da plataforma Givee abrange pessoas que desejam doar objetos e ajudar outras pessoas diretamente.

Suas funcionalidades principais incluem doação de itens que não são mais utilizados, conexão entre doador e receptor, sistema de interação entre usuários e incentivo à reutilização e economia circular.

As principais limitações estão em não possuir foco em instituições, sendo a visão mais pessoa para pessoa; não há agendamento estruturado de coleta e o processo ainda depende do contato entre usuários.

---

Doação do Bem (https://apps.apple.com/br/app/doação-do-bem/id1516919023)

O público-alvo do aplicativo Doação do Bem são pessoas que desejam doar para instituições como ONGs, hospitais e abrigos.

Suas funcionalidades principais incluem a conexão entre doadores e instituições, doações realizadas diretamente pelo app e apoio a diversas causas sociais.

<img src="/images/doacaoDoBem1.png">
<img src="/images/doacaoDoBem2.png">
<img src="/images/doacaoDoBem3.png">

As principais limitações estão no foco maior em doações diretas, não em objetos físicos com logística; não oferece agendamento detalhado de coleta e possui pouca personalização no processo de doação.

---

Solidarizando (https://solidarizando.com.br/)

Seu público-alvo constitui pessoas interessadas em ajudar instituições por meio de doações ou voluntariado.

<img src="/images/solidarizando.png">

Suas funcionalidades principais são a conexão entre usuários e ONGs, geolocalização de instituições, participação em ações solidárias e doações e voluntariado na mesma plataforma.
Suas limitações abrangem o não foco específico em doação de objetos, a falta sistema de agendamento de coleta/entrega e abrange muitas áreas, o que pode causar confusão ou perda do usuário.

---

Geev (https://play.google.com/store/apps/details?id=fr.geev.application)
O aplicativo é focado em pessoas interessadas em consumo sustentável e reaproveitamento.

<img src="/images/geev1.png">
<img src="/images/geev2.png">

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