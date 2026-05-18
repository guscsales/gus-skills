---
name: gus-quem-fala-video-creator
description: >
  Skill para criação completa de conteúdo para vídeos do YouTube — roteiro, títulos,
  thumbnails, descrição, tags e SEO. Otimizado para o canal Gus Quem Fala (programação em
  português, foco em React, Next.js, TypeScript, IA para devs e carreira dev). Use esta skill sempre
  que o usuário mencionar: vídeo, YouTube, roteiro, script de vídeo, thumbnail, SEO
  YouTube, tags YouTube, descrição de vídeo, ideias de conteúdo, planejamento de vídeo,
  shorts, reels, ou qualquer referência a criação de conteúdo para o canal. Também
  dispare quando o usuário pedir "ideias de vídeo", "me ajuda com um vídeo sobre X",
  "preciso de um roteiro", ou variações similares — mesmo que não mencionem YouTube
  explicitamente, se o contexto indicar criação de conteúdo educativo de programação.
---

# YouTube Video Creator — Gus Quem Fala Edition

Skill para gerar conteúdo completo de vídeos do YouTube para o canal **Gus Quem Fala**,
um canal de programação em português focado em React, Next.js, TypeScript, IA para devs
e carreira dev. O canal tem origem na marca Codegus, que pode ser mencionada no conteúdo.

## Contexto do Canal

- **Canal**: Gus Quem Fala (YouTube, ~5k inscritos, conteúdo em pt-BR, marca Codegus associada)
- **Público-alvo**: Desenvolvedores brasileiros — de júniors querendo evoluir a plenos/seniores
  buscando se atualizar em ferramentas modernas e uso de IA no desenvolvimento
- **Stack principal**: React, Next.js, TypeScript, Neon (Postgres serverless), Vercel, Node.js
- **Temas-chave**: Desenvolvimento web moderno + como usar IA para programar melhor
  (Claude, Claude Code, Cursor, AI-assisted development, prompting para devs)
- **Tom de voz**: Direto, autêntico, baseado em experiência real. Sem corporativismo.
  Fala como dev pra dev. Usa "você" (não "vocês"). Pode usar gírias de dev naturalmente
  (deploy, refatorar, tipar, etc.)
- **Diferencial**: Conteúdo baseado em experiência prática de trabalho real e uso diário
  de IA no workflow de desenvolvimento, não tutoriais genéricos copiados da documentação

## Formato Prioritário: Vídeos Longos (Tutorial/Explicação)

O formato principal é vídeo longo (8-20 minutos) no estilo tutorial ou explicação técnica.

## Workflow Completo

Ao receber um pedido de vídeo, execute as etapas abaixo. Se o usuário pedir apenas uma
etapa específica (ex: "só o roteiro"), execute apenas aquela. Caso contrário, gere o
pacote completo.

### Etapa 1: Ideação e Ângulo

Antes de escrever qualquer coisa, defina:

1. **Tema central**: Qual tecnologia/conceito/problema?
2. **Ângulo único**: O que diferencia este vídeo dos outros sobre o mesmo tema?
   Priorize ângulos como:
   - "Isso é o que eu uso no trabalho real"
   - "Erros que eu cometi e como corrigi"
   - "Tutorial que eu queria ter tido quando comecei"
   - Opinião forte + fundamentação técnica
3. **Público específico**: Qual nível de dev vai assistir? (isso define a profundidade)
4. **Promessa do vídeo**: Em uma frase, o que o viewer vai ganhar assistindo?

### Etapa 2: Roteiro (Script)

Use a estrutura **Hook → Intro → CTA Meio → Problema → [Publi] → Solução → CTA Final**.

**ANTES DE ESCREVER O ROTEIRO, PERGUNTE:**
"Esse vídeo vai ter alguma publi/patrocínio? Se sim, qual marca e qual a mensagem
que precisa passar?"

Se tiver publi, encaixe ela **depois do Problema e antes da Solução** — o viewer
já entendeu a dor, está engajado esperando a solução, e a publi entra com transição
natural (especialmente se a marca conectar com o tema). Se não tiver, segue direto
do Problema pra Solução.

#### Como escrever o roteiro

**Princípio fundamental**: O roteiro é texto FALADO, escrito de ponta a ponta. Não é
bullet point, não é "talking points abstratos", não é resumo. É a fala real do Gus,
escrita em parágrafos corridos, do jeito que ele vai gravar — com as pausas naturais,
o jeito dele de construir argumento, conectivos como "olha", "saca", "tipo assim",
"então", etc.

**O que vai em parágrafo (texto corrido)**:
- Tudo que sai da boca do Gus
- Hook, intro, transições, explicações, CTAs — tudo escrito como fala

**O que vai em destaque visual (blockquote ou bloco marcado)**:
- **APENAS** direções de cena: TELA, DEMO, DICA, transições visuais, cortes
- Notas pro Gus que NÃO são pra falar (ex: "respira aqui", "fala devagar nessa parte")

#### Marcadores de direção de cena

Use blockquote (`>`) para destacar SOMENTE direções de cena, separando visualmente
da fala. Marcadores padrão:

- `> [TELA: descrição]` — B-roll cinematográfico, gerado por IA (Higgsfield)
- `> [SCREENSHOT: descrição]` — print/recording REAL de software, capturado pelo Gus
- `> [DEMO: o que demonstrar]` — gravação de tela ao vivo, fluxo, interface real
- `> [DICA DE GRAVAÇÃO: nota pro Gus]` — pausa, ritmo, expressão facial, tom
- `> [B-ROLL: descrição]` — alternativa ao [TELA] quando for genérico

Esses marcadores aparecem ENTRE parágrafos da fala, nunca dentro do texto falado.

**Quando usar cada um**:
- `[TELA]` → quando dá pra entregar com IA: pessoa, atmosfera, código abstrato
- `[SCREENSHOT]` → quando precisa de UI real reconhecível (Cursor 3, Antigravity, dashboards)
- `[DEMO]` → quando o Gus vai mostrar fluxo ao vivo (cliques, navegação)

#### Prompts Higgsfield (B-roll para cada [TELA])

Toda direção `[TELA: ...]` deve vir acompanhada de **2 opções de prompt**, em inglês,
pra colar no Higgsfield. Os prompts são **curtos, diretos, sem duração**, e geram
B-rolls que entram em cima da fala do Gus pra **tirar um pouco o rosto dele do
quadro o tempo todo**. Formato:

```
> [TELA: descrição em português do que aparece]
>
> 🎬 Higgsfield (Opção 1): [prompt curto em inglês, 1-2 frases]
> 🎬 Higgsfield (Opção 2): [prompt alternativo, vibe diferente]
```

#### Princípio fundamental: humano e atmosférico, NÃO interface

Modelos de vídeo AI (Higgsfield, Kling, Sora, Veo) **não conseguem gerar UI específica
de software de forma reconhecível**. Pedir "Cursor 3 Agents Window" ou "VSCode com
extensões React" sai borrado, com texto torto, parecendo amador. Mesmo princípio
pra logos de empresas, dashboards específicos e telas de produto reais.

**Regra prática**:

| ❌ Não pede pra IA | ✅ Pede pra IA |
|---|---|
| "Cursor 3 Agents Window com agents rodando" | "Dev olhando pra monitor com várias janelas abertas" |
| "VSCode com código React" | "Close-up de código colorido fora de foco numa tela" |
| "Print do Antigravity Manager View" | "Dev orquestrando múltiplos monitores numa mesa" |
| "Logo da Anthropic em fundo escuro" | "Código terminal verde rodando rapidamente" |
| "Dashboard do GitHub" | "Tela escura com gráficos abstratos brilhando" |

**Quando precisar de UI real específica** (Cursor 3 real, Antigravity real),
substitua a [TELA] por um marcador `[SCREENSHOT: ...]` indicando ao Gus que ele
deve **tirar um print real da ferramenta** e adicionar como overlay no editor
(CapCut, DaVinci). Isso fica **muito mais profissional** que IA tentando renderizar
software.

#### Princípios do prompt Higgsfield

1. **Curto e direto** — 1 a 2 frases. Sem listinhas, sem múltiplas adjetivações
   empilhadas. Modelos performam melhor com comandos precisos.
2. **Sem duração no prompt** — Higgsfield já tem campo separado pra isso.
3. **Estilo command-line** — sem "please", sem polidez, sem "I want".
4. **Estrutura**: subject → action → camera → mood. Nessa ordem.
5. **Sempre em inglês**.
6. **Sempre 2 opções** — uma mais "humana/dev no quadro", outra mais "abstrata/
   atmosférica/objeto". Permite variar o ritmo visual do vídeo.
7. **Mencione câmera** quando quiser fotorrealismo: `"shot on cinema camera"`,
   `"50mm lens"`, `"shallow depth of field"`.
8. **Defina motion**: `"slow push in"`, `"static shot"`, `"slow handheld"`,
   `"slow dolly"`. Sem isso, o modelo inventa motion estranha.

#### Templates de B-roll que SEMPRE funcionam

Use como base, varie o detalhe específico:

**Dev no ambiente (humano)**:
```
Cinematic close-up of a developer typing on a mechanical keyboard
in a dimly lit room, monitor glow on the desk. Slow handheld
push-in. Shallow depth of field, moody color grading.
```

**Mãos + objeto (parcial humano)**:
```
Close-up of hands hovering over a keyboard, steam rising from a
coffee cup beside it. Soft window light, plants blurred in
background. Static shot, very shallow depth of field.
```

**Dev pensativo / contemplativo**:
```
Medium shot of a young developer leaning back in his chair,
contemplative expression, soft monitor glow on his face. Dark
home office, slow dolly push-in. Cinematic warm-cool grading.
```

**Tela com código (sem UI real, só vibes)**:
```
Extreme close-up of code scrolling on a dark monitor, syntax-
highlighted text out of focus. Lens reflection visible in glass.
Static shot with slow zoom. Cinematic blue color grading.
```

**Ambiente de trabalho (sem pessoa)**:
```
Empty modern home office at night, multiple monitors glowing
softly, plants and books blurred. Slow dolly across the desk.
Cinematic moody lighting, shallow depth of field.
```

**Time-lapse atmosférico**:
```
Time-lapse of a desk workspace, monitor light pulsing, day
turning into night through the window behind. Slow camera push.
Cinematic color grading.
```

**Cena urbana / cidade tech**:
```
Aerial shot of a city skyline at night, scattered window lights,
soft fog. Slow drift forward. Cinematic moody atmosphere.
```

**Abstrato (partículas / dados)**:
```
Abstract flowing particles of light forming network patterns,
dark blue background. Slow camera rotation. Dreamy atmospheric
mood.
```

#### O que evitar

- Pedir UI específica (Cursor, VSCode, Antigravity, GitHub, etc.)
- Pedir logos de empresas específicas
- Personagens com características muito específicas (modelo não vai acertar)
- Misturar muita coisa no mesmo prompt (split screen + glitch + texto + zoom)
- Texto na tela (modelo erra ~40% das vezes)
- Frases enroladas com mais de 2 frases

#### Estrutura do roteiro

```markdown
# [TÍTULO DO VÍDEO]

## HOOK (0:00 - 0:15)

[Parágrafo escrito, palavra por palavra, da fala de abertura. Curto e impactante.
Pode ser uma afirmação forte, um resultado, uma pergunta, ou um erro comum.
Em torno de 30-40 palavras — o Gus fala ~150 palavras por minuto, então 30-40
palavras = 12-15 segundos.]

> [TELA: descrição do que entra na tela durante o hook]

> [DICA DE GRAVAÇÃO: nota sobre energia, pausa ou expressão pro hook funcionar]

---

## INTRO (0:15 - 0:30)

[Parágrafo escrito, palavra por palavra. Sempre começa com:
"Fala aí pessoa desenvolvedora, blza? Aqui é o Gus Quem Fala."
Depois vem promessa específica do vídeo (1-2 frases) e, opcionalmente,
1 linha de credibilidade real. Total: 30-40 palavras, ~12s.]

> [TELA: nome do canal, vinheta, ou identificação visual]

---

## CTA MEIO (~0:30 - ~0:50)

[Parágrafo escrito, palavra por palavra, da fala do CTA. Leve e curto, ~20s.
Estrutura interna: conexão com a promessa → pedido honesto curto (inscrição + like
com motivo real) → opcional: gancho de pergunta a ser cobrada no final →
transição pra próxima parte.

Escreva como fala natural, não como lista. Total: ~50 palavras, máximo 60.]

> [DICA DE GRAVAÇÃO: tom amigável aqui, não vendedor. Como se tivesse pedindo
um favor pra um amigo dev.]

---

## PROBLEMA (~0:50 - ~2:30)

### Subseção 1: [Nome da subseção]

[Parágrafo escrito, fala corrida. Apresenta o problema, conecta com a dor real
do viewer. Pode ter 2-3 parágrafos curtos, separados por quebra de linha,
representando pausas naturais na fala.]

> [TELA: o que mostrar enquanto fala]

[Continua a fala. Pode ter direção de cena no meio entre parágrafos.]

> [DICA DE GRAVAÇÃO: ritmo aqui é importante — devagar pra o problema bater]

### Subseção 2: [Nome da subseção]

[Mais parágrafos da fala...]

---

## [PUBLI — se aplicável] (~2:30 - ~3:00)

[Parágrafo escrito da fala da publi. Transição natural a partir do problema,
conectando a marca com o tema sempre que possível.]

> [TELA: identificação visual da marca, screenshot do produto, etc]

---

## SOLUÇÃO (~3:00 - ~tempo)

### Seção 1: [Subtópico]

[Parágrafos escritos da fala. Aqui é o coração do vídeo, então capricha:
escreva como você fala naturalmente, com transições, exemplos, analogias.
Pode ter vários parágrafos por seção — quebra cada parágrafo onde tem uma
pausa natural na fala.]

> [DEMO: descrição exata do que vai mostrar no demo]

[Volta pra fala depois do demo, comentando o que aconteceu na tela.]

> [DICA DE GRAVAÇÃO: aqui é onde costuma travar — preparar o demo antes pra
não perder o ritmo]

### Seção 2: [Subtópico]

[Mais parágrafos da fala...]

### Seção N: [Subtópico]

[Mais parágrafos da fala...]

---

## CTA FINAL (últimos 45-60s)

[Parágrafo escrito da fala de fechamento. Estrutura interna:
resumo curto e poderoso (2-3 frases) → próximo passo prático → CTA de
reciprocidade (escolha 1 ângulo: gratidão / comunidade / diálogo cobrando
pergunta plantada no CTA Meio) → despedida curta.

Total: ~150 palavras, ~60s. Escreva como fala, não como lista.]

> [TELA: end screen com vídeos sugeridos + botão de inscrição]

> [DICA DE GRAVAÇÃO: energia alta no final, sem arrastar, encerre com punch]
```

#### Regras do roteiro

1. **Tudo que é fala vai em parágrafo corrido**, escrito palavra por palavra do
   jeito que o Gus fala — com gírias de dev, "saca?", "tipo assim", contrações
   ("tá", "pra", "tô"), tudo natural.
2. **Destaques visuais (blockquote) são SÓ pra direção de cena** — TELA, DEMO,
   DICA DE GRAVAÇÃO, B-ROLL. Nunca pra fala em si.
3. **Direções aparecem entre parágrafos**, não dentro deles. Quebra natural.
4. **Quebre parágrafos onde tem pausa natural na fala** — facilita a leitura
   na hora de gravar.
5. **Calcule duração**: ~150 palavras por minuto. 100 palavras = ~40s.
6. **O hook precisa ser curto e impactante** — se levar mais de 15s, reescreva.
7. **A intro SEMPRE começa com** "Fala aí pessoa desenvolvedora, blza? Aqui é o
   Gus Quem Fala" — esse é o jargão do canal, parte da identidade.
8. **CTAs nunca interrompem o valor** — o do meio é leve (semente), o do final
   é profundo (colheita).
9. **Reciprocidade > performance**: o viewer ajuda quem ajuda ele primeiro.
10. **Loop opcional**: se plantar uma pergunta no CTA Meio, sempre cobre ela no
    CTA Final — isso aumenta retenção até o fim do vídeo.

#### Exemplo curto (pra você ver o formato)

✅ **Forma correta** — fala em parágrafo + 2 opções de B-roll humano/atmosférico:

```markdown
## HOOK (0:00 - 0:15)

Se você ainda chama o que você usa de "editor de código", você não percebeu o que
aconteceu nos últimos 6 meses. A ferramenta principal do dev mudou. E não foi um
upgrade — foi uma substituição.

> [TELA: dev em frente ao monitor, atmosfera de mudança/contemplação]
>
> 🎬 Higgsfield (Opção 1): Cinematic medium shot of a developer leaning back
> from his monitor, contemplative expression, soft blue screen glow on his
> face. Slow dolly push-in. Shallow depth of field, cinematic grading.
> 🎬 Higgsfield (Opção 2): Close-up of code scrolling on a dark monitor,
> syntax-highlighted text out of focus, lens reflection of a face barely
> visible in the glass. Slow zoom in. Cinematic blue grading.

> [DICA DE GRAVAÇÃO: energia alta nos primeiros 5s, depois desacelera no
> "não foi um upgrade — foi uma substituição"]
```

✅ **Quando precisar de UI real** — usa `[SCREENSHOT]` em vez de `[TELA]`:

```markdown
## SOLUÇÃO (...)

Olha o que mudou na prática: a Agents Window do Cursor 3 agora é o modo padrão.

> [SCREENSHOT: Cursor 3 com Agents Window aberta, vários agents rodando]
> Tira um print real do Cursor 3 e adiciona como overlay no editor.
> Sem prompt de IA aqui — vai parecer amador.
```

❌ **Forma errada** — talking points em bullet, ou IA tentando renderizar UI:

```markdown
## HOOK (0:00 - 0:15)

> Talking points:
> - Falar sobre como o editor mudou
> - Mencionar substituição

> 🎬 Higgsfield: VSCode editor on the left, Cursor 3 Agents Window on the
> right with multiple agent tabs running, glitch transition...
```

A diferença é total: o primeiro entrega B-roll que vai sair bem do Higgsfield e
contém autoridade visual real. O segundo é anotação solta + pedido pra IA fazer
o que ela não consegue fazer.

### Etapa 3: Títulos e Thumbnails

Gere **5 opções de título** seguindo estes princípios:
- Máximo 60 caracteres (pra não cortar no mobile)
- Inclua a keyword principal no início quando possível
- Use pelo menos 2 estilos diferentes entre:
  - **Curiosidade**: "Por que eu parei de usar X"
  - **Resultado**: "Como eu fiz X em Y minutos"
  - **Polêmico**: "X está morto? Minha opinião sincera"
  - **Tutorial direto**: "Next.js 15: Guia Completo pra Iniciantes"
  - **Dor**: "O erro que todo dev Junior comete com React"

#### Thumbnails — formato viral (1-2 palavras)

Pra cada um dos 5 títulos, **escolha os 3 títulos mais fortes** e gere **uma ideia
de thumbnail no formato viral curto** pra cada um. Total: **3 thumbnails**.
Texto da thumb com **1 a 2 palavras NO MÁXIMO**, fonte gigante, alto contraste,
pensadas pra fazer a pessoa sentir que PRECISA clicar.

A lógica desse formato: o título do YouTube já carrega a explicação. A thumb tem
1 segundo pra gerar curiosidade ou emoção. Texto longo na thumb = thumb fraca.

**Tipos de texto curto que funcionam:**
- **Choque/Polêmico**: "MORREU?", "ACABOU", "ERREI", "TÓXICO"
- **Curiosidade**: "POR QUÊ?", "OLHA ISSO", "CALMA AÍ"
- **Resultado**: "EM 5MIN", "FUNCIONA", "R$50K", "100X"
- **Erro/Alerta**: "PARE!", "CUIDADO", "EVITE"
- **Identificação**: "TODO DEV", "É VOCÊ?", "É HOJE"

Pra cada thumb, entregue:

1. **Texto da thumb** (1-2 palavras, CAIXA ALTA)
2. **Expressão facial sugerida** (ex: surpresa genuína, confusão, "você não vai
   acreditar", apontando, sério/irritado)
3. **Elemento visual de apoio** (logo da tech, ícone, código borrado ao fundo,
   seta vermelha, círculo destacando algo)
4. **Paleta** (2-3 cores dominantes — pense em contraste alto, vermelho/amarelo
   funciona muito pra retenção, azul/branco pra credibilidade)
5. **Prompt rápido pra geração da imagem** — ver formato abaixo

#### Prompt rápido pra geração da imagem

> O usuário vai mandar uma foto transparente dele junto com esse prompt. A skill
> `image-prompt-generator` (referência completa em `/mnt/skills/user/image-prompt-generator/SKILL.md`)
> trata isso como modo **Editing** (texto + imagem → imagem), porque vai compor a
> foto do Gus na thumb.

Pra cada uma das 3 thumbs, gere um prompt curto, direto, no formato que viraliza
no YouTube:

```
📋 PROMPT (para gpt-image-2, modo Editing)
[1-3 frases descrevendo a thumb. Estrutura recomendada:]

"YouTube thumbnail, [orientação da pessoa: ex. 'Gus on the left side, looking
shocked at the camera, pointing right']. Big bold text '[TEXTO DA THUMB]' in
[cor] with thick black outline, taking up [proporção, ex. '40% of the right
side']. Background: [descrição rápida — ex. 'dark gradient with subtle code
pattern, [logo da tech] visible behind']. High contrast, vibrant colors,
mobile-optimized, dramatic lighting on the face. Style: modern tech YouTuber
thumbnail, MrBeast-inspired energy."

⚙️ PARÂMETROS
- Model: gpt-image-2
- Mode: Editing (com foto transparente do Gus como input)
- Size: 1792x1024 (16:9 thumbnail)
- Quality: high

💡 DICA
[1 linha sobre o que faz essa thumb específica funcionar — ex.
"A expressão de choque + texto 'MORREU?' cria a curiosidade de
saber 'o que morreu?' e força o clique."]
```

**Princípios pros prompts de thumb:**
- Sempre especifique **posição da pessoa** (esquerda/direita) — texto vai do
  outro lado, pra não cobrir o rosto
- Texto sempre com **outline preto grosso** — garante leitura no mobile
- Cores saturadas, contraste alto — thumbs limpas demais somem no feed
- Mencione "mobile-optimized" no prompt — força composição que funciona em tela pequena
- Pode referenciar estilos consagrados ("MrBeast-inspired", "tech YouTuber style")
  que o gpt-image-2 reconhece

### Etapa 4: Descrição e SEO

**Pesquise na web** antes de gerar tags e descrição. Use web_search para:
- Encontrar termos relacionados que estão em alta
- Ver como outros vídeos do mesmo tema foram otimizados
- Identificar perguntas frequentes sobre o tema (People Also Ask)

Depois gere:

**Descrição** (formato padrão):
```
[2-3 frases resumindo o que o viewer vai aprender — inclua keywords naturalmente]

⏱ Timestamps:
00:00 - [Seção]
00:00 - [Seção]
...

🔗 Links mencionados:
- [recurso 1]
- [recurso 2]

💻 Me siga:
- Instagram: @codegus
- GitHub: [link]

#tag1 #tag2 #tag3
```

**Tags** (15-20 tags):
- Mix de tags amplas (programação, desenvolvimento web) e específicas (nextjs 15 tutorial)
- Inclua variações em pt-BR e inglês quando fizer sentido
- Priorize tags com volume de busca real (baseado na pesquisa web)

**Categoria sugerida**: Geralmente "Science & Technology" ou "Education"

### Etapa 5: Shorts (5 ideias)

A partir do tema/roteiro do vídeo principal, gere **5 ideias de YouTube Shorts**.
Cada short é vertical, 30-60 segundos, e tem **um único objetivo**: prender o viewer
até o fim e gerar engajamento real (comentário, compartilhamento, salvar).

**Filosofia dos shorts**: Short ruim entrega tudo no primeiro segundo. Short bom
abre uma curiosidade e só fecha no final. A diferença entre 30% e 90% de retenção
é o quanto você segura a "promessa" sem entregar logo de cara.

Pra cada uma das 5 ideias, entregue:

#### 1. Título / Caption (o que aparece no feed)
Frase curta que faz o dedo parar. Princípios:
- Use uma das fórmulas de retenção:
  - **Promessa específica**: "Como eu reduzi 80% do meu tempo escrevendo testes"
  - **Polêmica direta**: "Pare de usar useEffect pra isso"
  - **Curiosidade aberta**: "O que ninguém te conta sobre Server Components"
  - **Identificação dolorosa**: "Se você ainda escreve `if (!user) return null`, assiste isso"
  - **Resultado intrigante**: "Mudei 1 linha e o app ficou 10x mais rápido"
- Evite "dica de programação" — específico sempre vence genérico
- Não revele a resposta no título. O título é a pergunta, o short é a resposta.

#### 2. Hook (primeiros 2 segundos — palavra por palavra)
A frase EXATA de abertura. Esses 2 segundos decidem 70% da retenção. Princípios:
- Comece com a parte mais provocativa, não com contexto
- Use padrões que o algoritmo recompensa:
  - **Pattern interrupt**: "Para. Faz isso aqui antes."
  - **Negação direta**: "Você tá usando X errado."
  - **Promessa de tempo**: "Em 30 segundos eu te mostro..."
  - **Pergunta retórica**: "Sabia que [X] tem [Y]?"
- ❌ Nunca: "Fala galera, hoje eu vou falar sobre..." (perde 50% em 2s)

#### 3. Roteiro condensado (30-60s, talking points)
Estrutura que segura retenção:

```
[0-2s]  HOOK (a frase exata)
[2-8s]  TENSÃO: por que isso importa / qual a dor
[8-45s] PAYOFF: a resposta/dica/demonstração
        - [TELA: ...] sempre que tiver código/visual
        - Mantenha cortes a cada 3-5 segundos (mesmo se for só zoom/pan)
[45-60s] LOOP/CTA: pergunta que gera comentário OU
         frase que faz o viewer querer rever ("agora volta no início e olha de novo")
```

Marque `[TELA: descrição]` pra elementos visuais. Lembre: short sem corte visual
a cada poucos segundos PERDE retenção drasticamente.

#### 4. Ângulo (o recorte específico)
Cada um dos 5 shorts tem que ter um ângulo diferente. Tipos pra variar:

- **Dica acionável**: 1 truque que o viewer pode aplicar HOJE
- **Erro comum + correção**: "Não faça X, faça Y" (visualmente: errado riscado → certo)
- **Antes/depois**: Código ruim na tela → mesmo código limpo (impacto visual forte)
- **Hot take**: Opinião forte com fundamentação rápida
- **Curiosidade técnica**: "Você sabia que [tech] faz [coisa] por baixo?"
- **Workflow real**: 30s mostrando seu fluxo de trabalho com IA / ferramenta

#### 5. CTA do short
Curto e específico. Não peça like ("isso o algoritmo faz sozinho"). Peça:

- **Pergunta que gera comentário real**: "E aí, você usa X ou Y? Comenta."
- **Direcionamento pro vídeo completo**: "Vídeo completo no canal — link no perfil."
- **Loop**: "Volta no início e tenta achar o erro que eu deixei passar." (gera replays
  que bombam o algoritmo)
- **Polêmica controlada**: "Discordo? Comenta seu argumento, eu respondo."

**Regra de ouro do short**: se o viewer assistir 70%+ ou comentar, o algoritmo
distribui. Tudo no roteiro tem que servir esses dois objetivos. Curtida é bônus.

### Etapa 6: Posts da Comunidade (5 ideias)

Gere **5 ideias de posts pra aba Comunidade do YouTube** que conversam com o tema do
vídeo. Posts da Comunidade são ótimos pra manter engajamento entre uploads e bombar
o algoritmo antes/depois do lançamento.

Para cada uma das 5 ideias, entregue:

- **Tipo**: Texto, enquete, imagem, ou GIF/vídeo curto
- **Texto do post**: O conteúdo exato (máx ~280 caracteres pra ficar legível no feed)
- **Objetivo**: O que esse post está fazendo (gerar discussão, validar tema do próximo
  vídeo, teaser do que vem aí, dividir opinião, celebrar marco, etc.)
- **Quando postar**: Sugestão de timing relativo ao vídeo (ex: "3 dias antes do upload",
  "no dia do upload", "1 semana depois")

Varie entre os 5 posts:
- **Enquete técnica**: "React Server Components: você usa em produção? [Sim / Não / Tô estudando]"
- **Hot take**: Opinião curta que divide a comunidade
- **Pergunta aberta**: "Qual foi o pior bug que você caçou esse mês?"
- **Teaser**: Print/screenshot do próximo vídeo com chamada
- **Bastidor/processo**: "Tô gravando sobre X, o que você quer ver coberto?"

Regra: posts da Comunidade têm tom mais conversacional que vídeos. Use pra construir
relacionamento, não pra vender. Pode usar emoji com moderação. Evite caps lock.

## Output

Gere tudo em um único arquivo Markdown bem organizado, com seções claramente separadas.
Salve como: `video-[slug-do-tema].md` em `/mnt/user-data/outputs/`

Estrutura do arquivo final:

```
# 🎬 [Tema do Vídeo]

## 📋 Ficha Técnica
- **Público**: [nível do dev]
- **Duração estimada**: [X-Y min]
- **Promessa**: [o que o viewer ganha]

## 🎯 Títulos (5 opções)
...

## 🖼️ Ideias de Thumbnail
...

## 📝 Roteiro
...

## 📄 Descrição YouTube
...

## 🏷️ Tags
...

## 📱 Ideias de Shorts (5)
...

## 💬 Posts da Comunidade (5)
...
```

## Dicas de Qualidade

- Se o tema for sobre uma ferramenta/lib, sempre mencione a versão atual
- Priorize exemplos de código reais sobre exemplos "foo/bar"
- Quando o tema envolver IA, mostre o workflow real (prompts usados, ferramentas,
  antes/depois do código com e sem IA)
- Considere o que o viewer pode pesquisar no YouTube pra encontrar esse vídeo
- O roteiro não precisa ser perfeito na primeira versão — é um guia pra gravação,
  não um artigo de blog
