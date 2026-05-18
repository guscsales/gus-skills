# Guia de Execução — Site Inventra

> Tempo estimado: ~1.5 horas
> Stack: Next.js (App Router) + Tailwind CSS + Vercel
> Ferramentas: Claude Code + referência visual + conteúdo pronto
> Idioma padrão do site: en-US (com toggle futuro para PT-BR)

---

## PRÉ-REQUISITOS (antes de abrir o Claude Code)

- [ ] Ter o boilerplate Next.js criado e rodando local (`npx create-next-app@latest inventra-site --typescript --tailwind --app --src-dir`)
- [ ] Baixar o arquivo `Inventra_Website_Content_EN.md` na raiz do projeto (ou em /docs)
- [ ] Ter o logo da Inventra em SVG em `/public/logo.svg` (e variação light em `/public/logo-light.svg` se tiver)
- [ ] Separar favicon e OG image em `/public/`
- [ ] Ter 2-4 screenshots de referência visual (Vercel.com, Linear.app, Resend.com — dark, minimal, tech-elegant) em `/docs/references/`
- [ ] Confirmar link do cal.com para CTA EN
- [ ] Confirmar link do WhatsApp para CTA PT-BR

---

## PASSO 1 — Estrutura com conteúdo (15 min)

### Prompt para Claude Code:

```
Read the file docs/Inventra_Website_Content_EN.md — it contains all the content for a multi-page website for Inventra, an AI-powered software house.

All the copies on this website MUST be written in English (en-US).

Create the page structure with ALL the text content from the doc. For now, focus only on structure and content — no styling yet. Use semantic HTML and Next.js App Router conventions.

Create these files:

**Pages:**
- src/app/page.tsx (Home — all sections: Hero + Stats bar, What we do (3 product cards), The problem, How it works (4 steps), Who it's for (3 columns), Who we are, CTA final)
- src/app/about/page.tsx (About — Hero, The story, How we think (4 items), Timeline table, CTA)
- src/app/products/sites-ai-blog/page.tsx (Sites + AI Blog — Hero, The website (3 items), The blog (AI Blog details + key capabilities list), API Integration section, Before/After table, Who this is for, CTA)
- src/app/products/custom-software/page.tsx (Custom Software — Hero, What we build (6 items), How we work, The difference (4 items), CTA)
- src/app/products/consulting/page.tsx (IT & AI Consulting — Hero, What we do (4 items), The real problem, How it works (4 steps), CTA)
- src/app/blog/page.tsx (Blog listing — header + subtitle + category filter + article cards placeholder)
- src/app/blog/[slug]/page.tsx (Blog post template — article header + body + CTA + related posts)
- src/app/contact/page.tsx (Contact — Hero, 3 contact options (cal.com, email, WhatsApp), contact form, info section)

**Components:**
- src/components/layout/Header.tsx (nav with Inventra logo, menu: Home | About | Products (mega menu) | Blog | Contact, CTA "Book a call" button, language toggle placeholder)
- src/components/layout/Footer.tsx (4-column footer: Brand, Pages, Products, Connect + bottom bar with copyright)
- src/components/layout/MegaMenu.tsx (Products dropdown with 3 cards: Sites + AI Blog, Custom Software, IT & AI Consulting — each with title, one-line description, and link)
- src/components/ui/SectionLabel.tsx (small uppercase label component used across all sections)
- src/components/ui/StatsBar.tsx (horizontal stats bar for hero section)

Use the exact text from the markdown doc. All primary CTAs should link to cal.com (placeholder href for now).

Contact info:
- Email: hello@inventra.sh
- WhatsApp: link for PT-BR visitors
- Location: Remote-first. Based in Brazil. Clients worldwide.
- Languages: English, Portuguese

Don't worry about styling — just get all the content in the right structure.
```

---

## PASSO 2 — Design tokens / system (10 min)

### Antes de rodar o prompt:

1. Selecione 2-4 screenshots de referência visual (Vercel, Linear, Resend, Raycast — dark, minimal, tech-premium)
2. Coloque as imagens em `/docs/references/` no projeto (ex: ref-vercel.png, ref-linear.png)
3. Ao rodar o prompt no Claude Code, arraste as imagens junto com o texto para ele analisar visualmente

### Prompt para Claude Code:

> **IMPORTANTE:** Ao colar este prompt, arraste junto as imagens de referência visual. O Claude Code vai analisar o estilo, layout, espaçamento e atmosfera das referências.

```
I'm attaching reference images that represent the visual direction for this project. Analyze them carefully — pay attention to spacing, layout rhythm, color usage, typography hierarchy, and overall atmosphere. The vibe is: Vercel/Linear — dark, minimal, technical-elegant. Premium but not flashy.

Now create a design token system for this site based on these references. Here's the brand:

Colors:
- Gold (primary accent): #D4A853
- Gold hover/dark: #B8903F
- Gold light: #E8C97A
- Slate Blue (secondary): #2E314C
- Dark background: #232323
- Darker (footer/sections): #1A1A1A
- Light background: #FBFBFA
- Light secondary: #F5F5F3
- Text primary (on light): #232323
- Text secondary (on light): #6B6B6B
- Text on dark: #FBFBFA
- Text muted on dark: #A0A0A0
- Border subtle: #E5E5E5 (light) / #333333 (dark)

Typography (use next/font/google for all fonts — NO external CSS imports, NO <link> tags):
- Headings (display): Source Serif 4 — serif, elegant, editorial
- Body / UI: Geist — clean, modern sans-serif
- Code / monospace: Geist Mono (for any tech-related UI)

Create:
1. Update tailwind.config.ts with these colors as custom theme tokens (inventra-gold, inventra-slate, inventra-dark, inventra-light, etc.)
2. Configure fonts in src/app/layout.tsx using next/font/google (Source Serif 4) and next/font/local or next/font/google for Geist:
   import { Source_Serif_4 } from 'next/font/google'
   const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' })
   For Geist, use next/font/local if available in the project or next/font/google.
   Apply CSS variables to <body> className.
3. Create a CSS variables layer in globals.css for the full palette AND font variables
4. Set base typography styles:
   - h1-h6: Source Serif 4, with clear size hierarchy (h1: 56-64px, h2: 40-48px, h3: 28-32px)
   - body/p: Geist, 16-18px, line-height 1.6-1.7
   - labels/section-labels: Geist, uppercase, letter-spacing 0.1em, small (12-13px), gold color
   - buttons/CTAs: Geist, weight 500-600
5. Define spacing tokens inspired by the reference images:
   - Section vertical padding: 96-120px desktop, 64-80px mobile
   - Container max-width: 1200px, with 24px side padding
   - Card gaps: 24-32px
   - Element spacing within sections: 48-64px between heading and content

The overall feel: dark premium, tech-editorial. Gold accents are used sparingly — for labels, hover states, accent lines, and CTAs. NOT gold everywhere. The default hero and several sections use dark backgrounds (#232323 or #1A1A1A). Other sections alternate with light (#FBFBFA). Think: dark with gold highlights, not gold theme.

IMPORTANT: Do NOT use @import url() or <link> for Google Fonts. Only use next/font which optimizes font loading automatically.
```

---

## PASSO 2.5 — Assets (5 min, paralelo)

Enquanto o Claude Code processa o passo 2:

- [ ] Confirmar que o logo SVG está em `/public/logo.svg` (versão para fundo escuro)
- [ ] Se tiver versão do logo para fundo claro, colocar em `/public/logo-light.svg`
- [ ] Preparar OG image (1200×630) em `/public/og-image.png`
- [ ] Preparar favicon em `/public/favicon.ico`
- [ ] Ícones: vamos usar Lucide React (já vem com Next.js ecosystem) — não precisa baixar nada

---

## PASSO 3 — Montar as páginas com design (30 min)

### 3.1 — Home (a mais importante)

> **IMPORTANTE:** Ao colar este prompt, arraste novamente os screenshots de referência visual de /docs/references/. O Claude Code pode perder contexto entre prompts longos — reforçar a referência visual na Home garante que o tom visual seja acertado.

```
Use the design-taste-frontend skill (and other frontend/design skills you have access to) for reference on visual quality, spacing, and design patterns.

I'm re-attaching the reference images for visual direction. Analyze them again for spacing, rhythm, and atmosphere.

Now apply the design system to build the HOME PAGE (src/app/page.tsx). Make it production-ready.

Use the design tokens already configured. The design should feel like Vercel's website — dark, minimal, technical-elegant. Gold accents are used sparingly.

HERO SECTION:
- Dark background (#232323)
- Centered text layout (not split)
- Small gold label "AI-powered technology company" above headline (uppercase, Geist, letter-spaced)
- Headline in Source Serif 4, white, large (56-64px desktop, 36-40px mobile)
- Subheadline in Geist, muted white (#A0A0A0), max-width ~680px
- Two CTAs side by side: primary gold button "Book a call" + secondary outline/ghost button "See our work"
- Subtle gradient or grain texture on the background (very subtle, Vercel-style)

STATS BAR:
- Slightly lighter dark background (#2A2A2A) or a thin border-top/bottom separating it
- 4 stats in a row, Geist font, white text, short and punchy
- Subtle gold accent (dot, line, or number highlight)

WHAT WE DO (Products) SECTION:
- Light background (#FBFBFA)
- Gold label "Products" + headline "What we build." in dark text
- 3 cards in a row (1 col on mobile)
- Cards: white background, subtle border, hover effect (lift + gold border-bottom or gold accent line)
- Each card: title (Source Serif 4), description (Geist), "Learn more →" link in gold
- Cards link to their respective product pages

THE PROBLEM SECTION:
- Dark background
- Gold label + white headline + muted white text
- Keep it simple, text-focused, no cards

HOW IT WORKS SECTION:
- Light background
- 4 steps in a horizontal row (stack on mobile)
- Each step: gold number (01, 02, 03, 04), title in dark, description in muted
- Subtle connecting line between steps on desktop

WHO IT'S FOR SECTION:
- Light background (or very subtle off-white alternation)
- 3 columns: Local businesses, Growing companies, AI-ready teams
- Each column: title (Source Serif 4), text (Geist)

WHO WE ARE (Company) SECTION:
- Dark background
- Short, impactful text block
- "Our story →" link in gold

CTA FINAL SECTION:
- Dark background with subtle gradient
- Centered headline + text
- Gold button "Book a call" + secondary "Or email us at hello@inventra.sh"

Make it fully responsive. Use Lucide React icons where appropriate.
Smooth scroll behavior for "See our work" CTA.
Use framer-motion or CSS transitions for subtle entrance animations (fade-up on scroll).
```

### 3.2 — About page

```
Now build the ABOUT page (src/app/about/page.tsx) with the same design system.

HERO:
- Dark background, centered
- Gold label "About Inventra" + white headline + muted subtext
- This is a text-heavy page — keep it clean and editorial

THE STORY SECTION:
- Light background
- Gold label "Origin" + headline "Why Inventra exists."
- Long-form text block, max-width ~720px, good reading typography (18px, 1.7 line-height)
- Founder signature at the end: "— Gustavo Sales, Founder" in italic or muted style

HOW WE THINK SECTION:
- Dark background
- Gold label "Philosophy"
- 4 items in a 2×2 grid (1 col mobile)
- Each item: title in white (Source Serif 4), text in muted white
- Subtle gold accent (left border, dot, or icon)

TIMELINE TABLE SECTION:
- Light background
- Gold label "Timeline" + headline "Our typical production timeline."
- Clean table with 3 columns: Phase, What happens, Timeline
- Table styling: subtle borders, alternating row shading, gold header accents
- Note below the table in muted text

CTA SECTION:
- Dark background, centered, gold button
```

### 3.3 — Product pages (3 pages)

```
Now build the 3 PRODUCT PAGES with the same design system.

## src/app/products/sites-ai-blog/page.tsx

HERO:
- Dark background
- Gold label "Product 01" + white headline "A beautiful website with a blog that runs itself."
- Subtext in muted white

THE WEBSITE SECTION:
- Light background
- 3 items (Custom design, Fast and mobile-first, Built to convert)
- Card or list layout with icons from Lucide (Palette, Zap, Target)

THE BLOG (AI Blog) SECTION:
- Dark background — this is the star section
- Gold label "AI Blog" + headline + descriptive text
- "Key capabilities" as a list with gold checkmarks or bullet points
- Make this section feel premium and detailed

API INTEGRATION SECTION:
- Light background
- Short and clean — headline + text block
- Could have a subtle code-block visual or API icon

BEFORE/AFTER TABLE:
- Light or dark background
- 2-column comparison table with clear visual distinction
- "Before Inventra" column slightly muted, "After Inventra" column with gold accents or highlights

WHO THIS IS FOR:
- Brief text section with industry list

CTA: dark background, gold button

---

## src/app/products/custom-software/page.tsx

HERO:
- Dark background, gold label "Product 02"

WHAT WE BUILD:
- Light background, 6 items in a 2×3 grid (or 3×2)
- Each item: icon (Lucide), title, description
- Icons: LayoutDashboard, ShoppingCart, Cog, Link, Sparkles, Layers

HOW WE WORK:
- Dark background, text-focused section

THE DIFFERENCE:
- Light background, 4 items in a 2×2 grid
- Subtle gold accent on each

CTA: dark background, gold button

---

## src/app/products/consulting/page.tsx

HERO:
- Dark background, gold label "Product 03"

WHAT WE DO:
- Light background, 4 items

THE REAL PROBLEM:
- Dark background, editorial text block

HOW IT WORKS:
- Light background, 4 numbered steps (same style as Home "How it works")

CTA: dark background, gold button
```

### 3.4 — Contact page

```
Build the CONTACT page (src/app/contact/page.tsx).

HERO:
- Dark background, centered
- Gold label "Contact" + headline "Let's talk." + subtext

CONTACT OPTIONS:
- Light background
- 3 cards in a row: Book a call (Calendar icon), Email (Mail icon), WhatsApp (MessageCircle icon)
- Each card: icon, title, description, CTA link
- Cards have subtle hover effect
- WhatsApp card has a note: "Prefere falar em português? Manda uma mensagem."

CONTACT FORM:
- Light background (same section or slight variation)
- Clean form: Name, Email, Company, dropdown "What do you need?", textarea "Tell us more"
- Gold focus states on inputs
- Dark submit button with gold hover state
- Fields: Name (required), Email (required), Company (optional), What do you need? (dropdown: Website + AI Blog | Custom Software | AI Consulting | Not sure yet), Tell us more (textarea, optional)

INFO SECTION:
- Dark background
- Email, Location, Languages — simple and clean

Make the form a client component ("use client") with basic validation.
```

### 3.5 — Blog page

```
Build the BLOG pages.

## src/app/blog/page.tsx (listing)

HEADER:
- Dark background
- "Blog" title (Source Serif 4) + subtitle from content doc

CATEGORY FILTER:
- Horizontal pills below header: Engineering, AI & Automation, Business & Strategy, Product Updates
- Gold active state, ghost inactive state
- Make this a client component that filters already-fetched data

ARTICLE GRID:
- Light background
- 3 columns desktop, 1 mobile
- Each card: image placeholder (16:9, dark placeholder with Inventra logo watermark), category tag (small pill), title (Source Serif 4), date, excerpt
- Subtle hover: lift + gold border
- Pagination at bottom

Use 6 mock articles with realistic titles:
1. "Why Your Business Needs an AI-Powered Blog in 2026" (AI & Automation)
2. "SEO vs GEO: What Changes When AI Answers the Search" (Business & Strategy)
3. "How We Build a Custom Site in 5 Days" (Engineering)
4. "The Compounding Effect of Automated Content" (AI & Automation)
5. "Why Off-the-Shelf Software Fails Growing Companies" (Business & Strategy)
6. "Introducing Inventra's AI Blog Engine" (Product Updates)

## src/app/blog/[slug]/page.tsx (article template)

- Clean reading layout, max-width 720px centered
- Dark header area: category tag + title (Source Serif 4, large) + date + reading time
- Light body: good reading typography (Geist, 18px, 1.7 line-height)
- Render article content as HTML (dangerouslySetInnerHTML — CMS sends HTML)
- CTA at the end: "Need help with this? Book a call" → cal.com link, styled with gold accent
- Related articles section: 3 cards at bottom
```

### 3.6 — Header com Mega Menu + Footer

```
Polish the Header and Footer components.

## src/components/layout/Header.tsx

- Sticky header, dark background (#1A1A1A), with slight backdrop-blur if over content
- Left: Inventra logo (SVG from /public/logo.svg)
- Center: Navigation links (Home, About, Products ▾, Blog, Contact) in Geist, white text, muted on hover with gold underline
- Products has a MEGA MENU dropdown:
  - Triggered on hover (desktop) or click (mobile)
  - Dark dropdown panel with 3 cards side by side
  - Each card: title, one-line description, arrow icon
  - Cards: Sites + AI Blog → /products/sites-ai-blog, Custom Software → /products/custom-software, IT & AI Consulting → /products/consulting
  - Subtle animation on open (fade + slide down)
- Right: "Book a call" gold button (small, compact) + language toggle placeholder (EN/PT-BR text toggle)
- Mobile: hamburger menu that opens full-screen dark overlay with all nav items + mega menu items listed

## src/components/layout/Footer.tsx

- Dark background (#1A1A1A)
- 4 columns:
  1. Brand: Inventra logo + "AI-powered technology company." tagline
  2. Pages: Home, About, Blog, Contact
  3. Products: Sites + AI Blog, Custom Software, IT & AI Consulting
  4. Connect: hello@inventra.sh, GitHub, LinkedIn, Twitter/X (use Lucide icons)
- Bottom bar: "© 2026 Inventra. All rights reserved." in muted text
- All links: muted white, gold on hover
- Responsive: stacks to 2 cols on tablet, 1 col on mobile
```

---

## PASSO 4 — Blog API (Inventra CMS) + SEO (10 min)

### Prompt para Claude Code:

```
Set up blog integration with the Inventra CMS API and full SEO infrastructure.

## Blog API Integration

The API endpoints are:
- GET {INVENTRA_API_URL}/api/organizations/{INVENTRA_ORG_ID}/contents — list all blog posts
- GET {INVENTRA_API_URL}/api/organizations/{INVENTRA_ORG_ID}/contents/{id} — get single post by ID

Create:

1. src/lib/inventra.ts — API client:
   - Read API config from environment variables: INVENTRA_API_KEY, INVENTRA_API_URL, INVENTRA_ORG_ID
   - Function `getContents()`: fetches all published blog posts
   - Function `getContent(id: string)`: fetches single post by ID
   - Auth: Bearer token in Authorization header
   - TypeScript types:
     ```ts
     type BlogPost = {
       id: string
       slug: string
       title: string
       excerpt: string
       content: string // HTML
       category: string
       coverImage?: string
       publishedAt: string
       author?: string
       metaTitle?: string
       metaDescription?: string
     }
     ```
   - Proper error handling, return empty array on failure

2. src/lib/env.ts — Environment config:
   - Export typed env vars: INVENTRA_API_KEY, INVENTRA_API_URL, INVENTRA_ORG_ID
   - Validate at build time

3. Update src/app/blog/page.tsx:
   - Fetch posts using `getContents()` in Server Component
   - Use Next.js fetch with `{ next: { revalidate: 3600 } }` for ISR
   - If API returns empty or errors, fall back to the 6 mock articles
   - Category filter stays client-side

4. Update src/app/blog/[slug]/page.tsx:
   - Use `generateStaticParams()` for known posts
   - Fetch individual post with `getContent(id)`
   - Render HTML content with dangerouslySetInnerHTML
   - Dynamic metadata per post

5. Create .env.local.example with the 3 required env vars (no real values)

## SEO Setup

6. src/app/layout.tsx metadata:
   - Title: "Inventra — AI-Powered Technology Company"
   - Description: "We build websites, software, and AI systems for businesses that need technology to work. 17+ years of engineering experience, including Silicon Valley."
   - OG image: /og-image.png

7. Per-page metadata (use the meta tags from the content doc):
   - /about → "About Inventra — Our Story"
   - /products/sites-ai-blog → "Sites + AI Blog — Inventra"
   - /products/custom-software → "Custom Software — Inventra"
   - /products/consulting → "IT & AI Consulting — Inventra"
   - /blog → "Blog — Inventra"
   - /contact → "Contact — Inventra"

8. Create src/app/sitemap.ts:
   - Static pages: /, /about, /products/sites-ai-blog, /products/custom-software, /products/consulting, /blog, /contact
   - Dynamic: fetch all posts from getContents() and add /blog/[slug] for each

9. Create src/app/robots.ts (allow all, reference sitemap)

10. Add JSON-LD structured data to Home page:
    - Organization schema for Inventra
    - BreadcrumbList for navigation

11. Add JSON-LD to each product page (Service schema) and blog posts (Article schema)
```

---

## PASSO 5 — Polish + Performance (10 min)

### Prompt para Claude Code:

```
Final polish pass on the entire site.

1. Animations:
   - Add subtle fade-up-on-scroll animations to sections using framer-motion or CSS Intersection Observer
   - Mega menu: smooth open/close with opacity + translateY
   - Page transitions: subtle fade between routes (optional, only if simple)
   - Button hover states: smooth gold glow or brightness shift
   - Stats bar: subtle number count-up animation on first view (optional)

2. Dark/light section rhythm check:
   - Verify the alternating pattern makes visual sense on every page
   - Hero sections should always be dark
   - CTA final sections should always be dark
   - Content sections alternate light/dark logically

3. Responsive check:
   - Test at 375px (mobile), 768px (tablet), 1280px (desktop), 1440px+ (wide)
   - Mega menu becomes a regular list on mobile
   - Stats bar wraps to 2×2 grid on mobile
   - Product cards stack to 1 column on mobile
   - Blog grid goes to 1 column on mobile
   - Typography scales down properly

4. Accessibility:
   - All images have alt text
   - All interactive elements are keyboard-accessible
   - Color contrast meets WCAG AA (gold on dark should be fine, verify gold on white)
   - Proper heading hierarchy (h1 → h2 → h3, no skips)
   - aria-labels on icon-only buttons

5. Performance:
   - Images use next/image with proper sizing
   - Fonts loaded via next/font (no external requests)
   - No unnecessary client components (keep Server Components where possible)
   - Add loading.tsx skeletons for blog pages
```

---

## PASSO 6 — Deploy (5 min)

```bash
# Vercel (recomendado)
vercel --prod

# Ou via Vercel dashboard: conectar repo do GitHub
# Configurar env vars no Vercel: INVENTRA_API_KEY, INVENTRA_API_URL, INVENTRA_ORG_ID
# Custom domain: inventra.sh
```

### Checklist pré-deploy:

- [ ] Todas as páginas renderizam sem erros (Home, About, 3 products, Blog, Blog post, Contact)
- [ ] Mega menu funciona no desktop (hover) e mobile (click/tap)
- [ ] Mobile responsivo funciona (375px, 768px, 1280px)
- [ ] CTAs "Book a call" linkam para cal.com
- [ ] Email hello@inventra.sh aparece corretamente
- [ ] Links de navegação funcionam em todas as páginas
- [ ] Blog listing mostra artigos (mock ou API)
- [ ] Blog post template renderiza conteúdo corretamente
- [ ] Contact form tem validação frontend básica
- [ ] Meta tags aparecem corretamente (testar com og:image debugger)
- [ ] Favicon e OG image carregam
- [ ] Performance: Lighthouse > 90 em todas as categorias
- [ ] Logo SVG carrega corretamente em header e footer
- [ ] Alternância dark/light sections faz sentido visual em todas as páginas
- [ ] Gold accents são usados com parcimônia (não excessivo)

---

## NOTAS

- **Prioridade de build:** Home → Header/Footer/MegaMenu → About → Sites+AI Blog → Custom Software → Consulting → Contact → Blog. Se travar, foca na Home + Header/Footer primeiro. É o que define o tom visual de todo o site.
- **Gold com moderação.** O gold (#D4A853) é accent, não cor principal. Usar para: labels, hover states, CTAs, accent lines, números de steps. O site é fundamentalmente dark (#232323) + light (#FBFBFA) com gold como destaque.
- **Source Serif 4 só pra headings.** Todo o resto (body, labels, buttons, nav) é Geist. Misturar as fontes corretamente é o que dá o tom editorial-tech.
- **Blog mock é suficiente pra v1.** A integração com Inventra CMS vem depois. O importante é o template estar pronto pra receber dados reais.
- **Mega menu é diferencial.** Dedicar tempo pra fazer ele smooth e elegante. É o primeiro elemento de interação que mostra sofisticação.
- **Referência visual importa muito.** Arrastar screenshots do Vercel/Linear/Resend junto com os prompts de design faz uma diferença enorme na qualidade do output do Claude Code.
- **Internacionalização (PT-BR)** fica pra v2. O toggle no header é só placeholder por enquanto. Quando implementar, usar next-intl ou similar.

---

## ENTREGA FINAL

1. ✅ **Site no ar** — inventra.sh (ou URL de preview Vercel)
2. ✅ **Brand Strategy doc** — Inventra_Estrategia_de_Marca_v2.md
3. ✅ **Website Content doc** — Inventra_Website_Content_EN.md
4. 🔜 **PT-BR content version** — tradução do conteúdo para português
5. 🔜 **Blog real** — conectar Inventra CMS API com dados reais
6. 🔜 **i18n** — implementar toggle EN/PT-BR funcional
