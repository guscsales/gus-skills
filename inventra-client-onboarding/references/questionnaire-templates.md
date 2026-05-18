# Questionnaire Templates

Questionnaire sent to the client before Generation Mode. Language always matches the client's language.

## General rules

- Accessible language (not technical). The client is the business owner, technical or not.
- Each question must have a clear function in generating the final content.
- Explain the purpose of the question when it helps the client answer well.
- Maximum ~10 questions. A too-long questionnaire has low response rate.
- End with an open-ended question to capture anything the client wants to add.

## Additional output: Summary for the user (always in English)

Before the questionnaire, generate a short block for the user showing what the skill will extract from the answers. Format:

```markdown
## What the skill will need from the answers

For business description and product context:
- Client name
- What the client does (functional description)
- Who their ideal customer is
- Differentiator vs competitors / editorial stance
- Market positioning
- Products and services
- Blog goal

Per category:
- Name
- Scope (what's in / what's not)
- Strategic vector
- Specific reader profile
- Whether it allows product bridge

If anything comes in missing or vague, I'll ask before generating.
```

## en-US template

```markdown
# [Client Name] — Content Setup Questionnaire

Hi! To build your automated blog the right way, we need to understand your business at a level that lets us generate content that sounds like you wrote it — opinionated, specific, and useful to your actual customers.

Take 15-20 minutes with this. The more specific your answers, the better the output.

## About your business

**1. In one or two sentences, what does your company do?**
(No marketing language. Plain description.)

**2. Who is your ideal customer?**
Be specific — not "small businesses" but "founders of seed-stage B2B SaaS companies in the US." Include role, company size or profile, and the situation that makes them need you.

**3. What do your competitors do badly that you do well?**
This is the most important question. It captures what makes your perspective worth reading. Be honest and specific.

**4. What is your positioning in the market?**
Pick one:
- New entrant (disrupting established players)
- Challenger (credible alternative to the leader)
- Leader (established, defending position)
- Niche specialist (deep focus on a specific vertical or use case)

**5. What do you believe about your industry that others might disagree with?**
Controversial opinions, hot takes, observations that push against conventional wisdom. List 2-3 if you can. This is what will give your blog its voice.

## Your products and services

**6. List your products or services.**
For each, include: the name, what it does for the customer (not features), and who it's for. Keep it brief — 1-2 sentences per product.

## Blog strategy

**7. What's the primary goal of your blog?**
Pick one (or rank them):
- Build authority and credibility in our space
- Generate qualified leads (people reaching out to buy)
- Nurture existing prospects through the sales cycle
- A mix of the above

**8. What are the main topics or categories you want to cover?**
List them. For each, include:
- Category name
- What it covers (and what it should NOT cover, if adjacent)
- Who the specific reader is for this category (can be a subset of your overall ideal customer)

**9. Are there any topics or angles we should absolutely avoid?**
Anything off-limits — competitors to not mention, claims to not make, sensitive subjects for your industry.

**10. Anything else we should know?**
Past content that worked well, tone preferences, people or companies you admire the writing style of, or anything we didn't ask.
```

## pt-BR template

```markdown
# [Nome do Cliente] — Questionário de Conteúdo

Oi! Pra montar seu blog automatizado do jeito certo, a gente precisa entender seu negócio num nível que permita gerar conteúdo que soe como se você tivesse escrito — com opinião, específico, e útil pros seus clientes de verdade.

Reserve 15-20 minutos pra responder. Quanto mais específica a resposta, melhor o resultado.

## Sobre seu negócio

**1. Em uma ou duas frases, o que sua empresa faz?**
(Sem linguagem de marketing. Descrição direta.)

**2. Quem é seu cliente ideal?**
Seja específico — não "pequenas empresas" mas "fundadores de SaaS B2B em fase seed no Brasil". Inclua cargo, tamanho ou perfil da empresa, e a situação que faz essa pessoa precisar de você.

**3. O que seus concorrentes fazem mal que você faz bem?**
Essa é a pergunta mais importante. Ela captura o que torna sua perspectiva diferente. Seja honesto e específico.

**4. Qual é sua posição no mercado?**
Escolha uma:
- Novo entrante (desafiando os estabelecidos)
- Challenger (alternativa crível ao líder)
- Líder (estabelecido, defendendo posição)
- Especialista de nicho (foco profundo em um vertical ou caso de uso)

**5. Em que você acredita sobre sua indústria que muita gente pode discordar?**
Opiniões polêmicas, leituras contrárias ao senso comum, observações que vão contra o consenso do setor. Liste 2-3 se conseguir. É isso que vai dar voz ao seu blog.

## Seus produtos e serviços

**6. Liste seus produtos ou serviços.**
Pra cada um, inclua: o nome, o que faz pro cliente (não features), e pra quem serve. Curto — 1-2 frases por produto.

## Estratégia do blog

**7. Qual o objetivo principal do seu blog?**
Escolha uma (ou ranqueie):
- Construir autoridade e credibilidade no nosso espaço
- Gerar leads qualificados (pessoas entrando em contato pra comprar)
- Nutrir prospects existentes ao longo do ciclo de venda
- Uma mistura das opções acima

**8. Quais os principais tópicos ou categorias você quer cobrir?**
Liste eles. Pra cada um, inclua:
- Nome da categoria
- O que cobre (e o que NÃO deve cobrir, se tiver algo adjacente)
- Quem é o leitor específico dessa categoria (pode ser um subconjunto do cliente ideal geral)

**9. Existem tópicos ou ângulos que a gente deve absolutamente evitar?**
Qualquer coisa fora dos limites — concorrentes que não devem ser mencionados, afirmações que não devem ser feitas, assuntos sensíveis pra sua indústria.

**10. Tem mais alguma coisa que a gente deveria saber?**
Conteúdo passado que funcionou bem, preferências de tom, pessoas ou empresas que você admira o estilo de escrita, ou qualquer coisa que a gente não perguntou.
```

## Questionnaire adjustments

If the user responds with fewer than 3 categories or more than 8, adjust question 8:

- **Fewer than 3:** reinforce to the client that they can suggest additional categories if relevant.
- **More than 8:** ask the client to prioritize the top 5-6.

If the client is in a highly regulated sector (health, legal, finance), consider adding an extra question about regulatory limits on content.
