# Landing Page — Psicólogo(a) Clínico(a) | Template & Gerador Dinâmico

Este projeto é um template de landing page profissional premium para psicólogos clínicos. Ele possui um **gerador automático** escrito em Python que permite gerar o site personalizado de um novo cliente em segundos a partir de um arquivo de configuração JSON.

---

## 🛠️ Como usar o Gerador de Site Automático

Você pode gerar uma nova landing page customizada rodando o script `gerar_site.py`.

### 1. Requisitos
- Python 3.x instalado localmente (não requer dependências externas, utiliza apenas a biblioteca padrão).

### 2. Passo a Passo
1. Crie ou copie o arquivo de configuração para o novo cliente. Você pode usar o [config.exemplo.json](file:///c:/Users/walla/OneDrive/Documentos/SIte%20psic%C3%B3loga%20demo/config.exemplo.json) como base:
   ```json
   {
     "NOME": "Dra. Marina Oliveira",
     "CRP": "CRP 06/123456",
     "WHATSAPP": "5511999999999",
     "EMAIL": "contato@dramarinaoliveirapsi.com.br",
     "TELEFONE_FORMATADO": "(11) 99999-9999",
     "ENDERECO": "Av. Paulista, 1000 - Cj 52",
     "HORARIOS": "Seg–Sex: 08h às 20h",
     "CIDADE": "São Paulo",
     "CIDADE_ENDERECO": "São Paulo (Av. Paulista)",
     "UNIVERSIDADE": "Universidade de São Paulo (USP)",
     "INSTITUTO": "Instituto de Psiquiatria HC-FMUSP",
     "ANOS_EXPERIENCIA": "8",
     "MAPA_IFRAME": "<iframe src=\"https://www.google.com/maps/embed?pb=...\" width=\"100%\" height=\"200\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>"
   }
   ```
   > **Como obter o link do Google Maps:** Acesse [maps.google.com](https://maps.google.com), pesquise o endereço do consultório, clique em **Compartilhar → Incorporar um mapa** e copie o código `<iframe>` gerado.
   >
   > Se o campo `MAPA_IFRAME` for omitido ou deixado vazio, o gerador insere automaticamente um placeholder visual no lugar.
2. Execute o script gerador passando o arquivo de configuração e a pasta de destino:
   ```bash
   python gerar_site.py config.exemplo.json saida-marina
   ```
3. O script criará a pasta `saida-marina` contendo o site completo com todos os dados substituídos, copiando automaticamente as pastas de CSS, JS, assets estáticos e o robots.txt.
4. Substitua as fotos em `saida-marina/assets/img/foto-perfil.jpg` com a foto real da profissional.

---

## 🚀 Como rodar localmente (para desenvolvimento/visualização)

Qualquer uma dessas opções funciona (dentro da pasta gerada, ex: `saida-marina/`):

```bash
# Opção 1 — Node.js
npx live-server

# Opção 2 — Python
python -m http.server 8000

# Opção 3 — Abrir direto no navegador
# Basta dar duplo clique no arquivo index.html da pasta gerada
```

---

## 🎨 Customização de Estilos (CSS Custom Properties)

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

Altere as variáveis no arquivo `css/style.css` para alterar a paleta de cores global do site.

---

## 📁 Estrutura de arquivos do Projeto

```
├── index.template.html                 ← Template HTML com marcadores {{CAMPO}}
├── politica-privacidade.template.html  ← Template de Política de Privacidade
├── manifest.template.webmanifest       ← Template do Manifesto PWA
├── sitemap.template.xml                ← Template de Sitemap XML
├── config.exemplo.json                 ← Configuração JSON de exemplo com as 12 chaves
├── gerar_site.py                       ← Script Python que compila o site final
├── css/
│   └── style.css                       ← Estilos globais responsivos (Mobile-First)
├── js/
│   └── script.js                       ← JavaScript de interações da página
├── assets/
│   ├── img/                            ← Imagens estáticas (placeholders de fotos)
│   └── icons/                          ← Ícones complementares
├── README.md                           ← Este arquivo
├── index.html                          ← Demo estática genérica atualizada
└── .gitignore
```

---

## ⚖️ Regras éticas (CFP)

Este template segue estritamente as diretrizes éticas do Conselho Federal de Psicologia do Brasil (CFP):
- Sem promessas de cura ou de resultados clínicos/prazos.
- Sem apelos mercadológicos ou de preços (descontos, pacotes).
- Depoimentos anonimizados.
- CRP sempre visível e linkado ao início/rodapé.
