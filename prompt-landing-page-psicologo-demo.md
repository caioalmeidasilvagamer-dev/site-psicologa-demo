# Prompt: Landing Page Demo — Profissional de Psicologia

Copie e cole o conteúdo abaixo na IA que vai gerar os arquivos do projeto.

---

## PROMPT

Você é um desenvolvedor front-end sênior especializado em landing pages de alta conversão para a área da saúde mental, com forte conhecimento em UX, copywriting persuasivo ético e design de confiança. Você também pensa como um sênior que vai **reaproveitar esse projeto como template para vender a múltiplos clientes**, então a estrutura de pastas e arquivos precisa ser organizada para isso desde o início.

### 0. Setup do projeto (faça isso antes de escrever qualquer conteúdo)

**O projeto já existe na pasta:** `C:\Users\walla\OneDrive\Documentos\SIte psicóloga demo`

Não crie uma nova pasta raiz. Entre nesse diretório e crie **dentro dele** a seguinte estrutura de subpastas e arquivos:

```
SIte psicóloga demo/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── img/
│   │   ├── foto-perfil.jpg        (placeholder)
│   │   └── favicon.png
│   └── icons/
├── README.md
└── .gitignore
```

Comandos de terminal a executar (PowerShell/Windows):

```powershell
cd "C:\Users\walla\OneDrive\Documentos\SIte psicóloga demo"
mkdir css, js, assets\img, assets\icons
New-Item index.html, css\style.css, js\script.js, README.md, .gitignore -ItemType File
git init
```

Conteúdo mínimo do `.gitignore`:
```
.DS_Store
*.log
node_modules/
```

No `README.md`, documente:
- Como rodar localmente (`npx live-server` ou `python -m http.server 8000`)
- Quais campos precisam ser editados para customizar para um novo cliente (nome, CRP, cores, fotos, textos)
- Onde estão centralizadas as variáveis de cor/fonte (CSS custom properties no topo do `style.css`)

**Requisito de reaproveitamento (importante):** marque no HTML, com comentários claros, todos os pontos que mudam de cliente para cliente, no formato `<!-- EDITAR: [o que é] -->` (ex: `<!-- EDITAR: nome do profissional -->`, `<!-- EDITAR: CRP -->`, `<!-- EDITAR: foto de perfil -->`). Isso permite duplicar a pasta inteira para um novo cliente e customizar via busca-e-substitui, sem precisar reler todo o código.

Centralize cores e fontes em variáveis CSS no topo do `style.css`:
```css
:root {
  --cor-primaria: #7c9885;
  --cor-secundaria: #f4ede4;
  --fonte-titulo: 'Fraunces', serif;
  --fonte-texto: 'Inter', sans-serif;
}
```

Só depois de criar essa estrutura, siga para o conteúdo da página abaixo.

---

Sua tarefa é criar uma **landing page DEMO** (não é para um cliente real — é uma peça de portfólio/demonstração) para um psicólogo clínico genérico, generalista, que atende tanto online quanto presencialmente. Use dados fictícios plausíveis (nome fictício, CRP fictício no formato correto, foto placeholder/ilustração).

### 1. Objetivo da página
Converter visitantes em agendamentos de consulta, transmitindo — na ordem de prioridade — confiança, empatia e competência técnica. A decisão do usuário nesse nicho é ~80% emocional (sente que será compreendido) e ~20% racional (credenciais, logística, preço). Priorize a construção de confiança emocional antes de qualquer prova técnica.

### 2. Persona do público-alvo (paciente)
Pessoa adulta, 25-45 anos, classe B/C, que está enfrentando ansiedade, estresse, sobrecarga emocional, dificuldades de relacionamento ou busca de autoconhecimento. Está pesquisando pela primeira vez ou trocando de profissional. Está insegura/o, com medo de ser julgada/o, de escolher errado, ou de "abrir demais" com um estranho. Decide em segundos, olhando foto, tom de voz do texto e sensação geral da página, se "esse profissional parece me entender".

### 3. Persona do profissional (a landing page representa)
Psicólogo(a) clínico(a) generalista, com abordagem baseada em evidências (ex: TCC ou abordagem humanista, escolha uma e seja consistente), que atende presencial e online. Quer ser visto como acessível, humano e, ao mesmo tempo, tecnicamente sólido e ético — não "místico", não "vendedor", não frio/clínico demais.

### 4. Regras éticas obrigatórias (simule como se fosse real — CFP, Brasil)
Mesmo sendo uma demo, siga estas regras para ficar realista e profissionalmente correto:
- Nunca prometer cura, resultado garantido ou prazo de melhora ("elimine sua ansiedade em X dias" está proibido).
- Nunca usar preço como gancho de venda: proibido "desconto", "promoção", "pacote", "condição especial", "preço social".
- Nunca usar depoimentos que identifiquem um paciente real (nome completo, foto, detalhes do caso). Use depoimentos genéricos, iniciais ou "Paciente em acompanhamento há X meses".
- Sempre exibir: nome completo do profissional, o título "Psicólogo(a)" e o número de CRP (formato: CRP 00/000000) de forma visível — no cabeçalho ou rodapé.
- Tom sóbrio, sem sensacionalismo, sem comparação com outros profissionais.
- Não usar termos como "especialista em X" a menos que a copy deixe claro que é uma formação complementar, não título oficial.

### 5. Estrutura obrigatória da página (nesta ordem)
1. **Header fixo**: logo/nome, menu simples (Sobre, Como funciona, Depoimentos, FAQ, Contato), CTA "Agendar conversa inicial"
2. **Hero**: título emocional + subtítulo com promessa de processo (não de resultado) + CTA + foto/ilustração profissional acolhedora
3. **Sobre o profissional**: bio curta, formação, CRP, abordagem teórica, motivação pessoal (1-2 frases humanizando sem exagero)
4. **Para quem é a terapia**: lista de situações comuns que levam à busca (ansiedade, sobrecarga, luto, relacionamentos, autoconhecimento) — sem parecer diagnóstico
5. **Como funciona o processo**: primeira sessão, frequência, duração média, modalidade (presencial/online), sigilo
6. **Abordagem terapêutica**: explicação simples e acessível da linha de trabalho escolhida
7. **Depoimentos** (anonimizados, éticos, sem prometer resultado)
8. **FAQ**: pelo menos 6 perguntas (sigilo, convênio/particular sem tom promocional, cancelamento, como agendar, online funciona mesmo, o que levar para a 1ª sessão)
9. **CTA final + formulário/WhatsApp de agendamento**
10. **Rodapé**: nome completo, CRP, redes sociais, aviso de política de privacidade (LGPD)

### 6. Diretrizes de design
- Paleta de cores suaves (tons terrosos, verde-sálvia, azul-acinzentado ou lavanda) — nada de cores agressivas/corporativas frias
- Tipografia legível, com serifa ou humanista para transmitir acolhimento, combinada com sans-serif limpa para textos longos
- Muito espaço em branco, layout organizado, nada de poluição visual
- Totalmente responsivo (mobile-first)
- Microinterações discretas (hover states suaves), sem exageros
- Botões de CTA visualmente destacados mas não agressivos

### 7. Diretrizes de copywriting
- Frases curtas, linguagem simples e calorosa, sem jargão técnico excessivo
- Fale diretamente com o visitante ("você"), validando o que ele pode estar sentindo antes de apresentar a solução
- Evite qualquer gatilho de urgência artificial ("vagas limitadas", "última chance") — isso é eticamente inadequado nesse nicho
- CTAs no formato de convite, não de pressão: "Agende uma conversa inicial", "Vamos conversar", em vez de "Compre agora"

### 8. Entregável técnico
- **Stack obrigatório: HTML puro + CSS + JavaScript vanilla (sem framework, sem build tool, sem dependências de servidor)**. O motivo: essa página será usada como base para venda a múltiplos profissionais de psicologia, então precisa ser fácil de duplicar, editar e hospedar em qualquer serviço simples (ex: hospedagem compartilhada, Netlify, GitHub Pages), sem exigir conhecimento técnico avançado para manutenção.
- Um único arquivo `index.html` com CSS e JS inline ou em arquivos separados (`style.css`, `script.js`) na mesma pasta — nada de múltiplas páginas ou rotas complexas
- Código limpo, bem indentado e comentado em cada seção (ex: `<!-- SEÇÃO: Hero -->`), para que qualquer pessoa consiga localizar e editar rapidamente nome, textos, cores e fotos
- Variáveis de cor centralizadas via CSS custom properties (`:root { --cor-primaria: ...; }`) para facilitar a troca de paleta por cliente
- Imagens/fotos como placeholders indicados claramente como tal (ex: comentário `<!-- placeholder: foto profissional -->`)
- Sem dependências externas desnecessárias além de fontes web (Google Fonts) e ícones (Lucide via CDN ou SVGs inline)
- Totalmente responsivo, testado mentalmente para mobile, tablet e desktop

---

**Nota final para a IA executora**: como isso é uma demonstração e não um produto para uso real, é permitido usar nomes e CRPs fictícios, mas a estrutura, o tom e as regras éticas devem ser tratados como se fossem para um cliente real — isso é o que torna a demo convincente e profissionalmente crível.
