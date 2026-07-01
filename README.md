# Landing Page — Psicólogo(a) Clínico(a) | Template Demo

Template de landing page profissional para psicólogos clínicos. Projeto 100% estático (HTML + CSS + JS vanilla), pronto para hospedar em qualquer serviço (Netlify, GitHub Pages, hospedagem compartilhada).

---

## 🚀 Como rodar localmente

Qualquer uma dessas opções funciona:

```bash
# Opção 1 — Node.js (recomendado)
npx live-server

# Opção 2 — Python
python -m http.server 8000

# Opção 3 — Abrir direto no navegador
# Basta dar duplo clique no arquivo index.html
```

---

## 🎨 Customização para novo cliente

### 1. Cores e fontes (CSS Custom Properties)

Todas as cores e fontes estão centralizadas no topo do arquivo `css/style.css`, dentro do bloco `:root`:

```css
:root {
  --cor-primaria: #7c9885;       /* verde-sálvia principal */
  --cor-primaria-escura: #5a7262; /* hover/ênfase */
  --cor-primaria-clara: #a8c4b0; /* detalhes suaves */
  --cor-secundaria: #f4ede4;     /* fundo quente */
  --cor-fundo: #faf8f5;          /* fundo principal */
  --cor-texto: #3a3a3a;          /* texto principal */
  --fonte-titulo: 'Fraunces', serif;
  --fonte-texto: 'Inter', sans-serif;
}
```

Basta alterar os valores das variáveis para mudar toda a paleta do site de uma vez.

### 2. Dados do profissional (HTML)

No `index.html`, todos os pontos que precisam ser editados para cada cliente estão marcados com comentários no formato:

```html
<!-- EDITAR: nome do profissional -->
<!-- EDITAR: CRP -->
<!-- EDITAR: foto de perfil -->
<!-- EDITAR: bio do profissional -->
<!-- EDITAR: WhatsApp -->
```

Use **Ctrl+F** (busca) no seu editor de código e procure por `EDITAR:` para encontrar rapidamente todos os pontos de customização.

### 3. Imagens

| Imagem | Local | Tamanho recomendado |
|---|---|---|
| Foto de perfil | `assets/img/foto-perfil.jpg` | 600×600px, quadrada |
| Favicon | `assets/img/favicon.png` | 32×32px |

### 4. Checklist de customização rápida

- [ ] Trocar nome do profissional
- [ ] Trocar número do CRP
- [ ] Trocar foto de perfil (`assets/img/foto-perfil.jpg`)
- [ ] Ajustar bio/formação na seção "Sobre"
- [ ] Ajustar paleta de cores no `css/style.css`
- [ ] Atualizar número de WhatsApp nos CTAs
- [ ] Atualizar links de redes sociais no rodapé
- [ ] Atualizar textos de depoimentos
- [ ] Substituir favicon

---

## 📁 Estrutura de arquivos

```
├── index.html          ← Página principal (HTML semântico, comentado)
├── css/
│   └── style.css       ← Estilos (variáveis de cor no topo)
├── js/
│   └── script.js       ← Interações (menu, FAQ, scroll, animações)
├── assets/
│   ├── img/            ← Imagens (foto-perfil.jpg, favicon.png)
│   └── icons/          ← Ícones SVG (se necessário)
├── README.md           ← Este arquivo
└── .gitignore
```

---

## 📋 Dependências externas (CDN)

- [Google Fonts](https://fonts.google.com/) — Fraunces + Inter
- [Lucide Icons](https://lucide.dev/) — Ícones SVG via CDN

Nenhuma dependência de build, npm ou framework.

---

## ⚖️ Regras éticas (CFP)

Este template segue as diretrizes éticas do Conselho Federal de Psicologia:
- Sem promessas de cura ou resultado
- Sem preços como gatilho de venda
- Depoimentos anonimizados
- CRP sempre visível
- Tom sóbrio e profissional
