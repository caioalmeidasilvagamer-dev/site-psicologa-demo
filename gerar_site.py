#!/usr/bin/env python3
import os
import sys
import json
import shutil
import re

def slugify(text):
    # Convert to lowercase, remove non-alphanumeric chars, replace spaces with dashes
    text = text.lower()
    # Normalize some common portuguese chars
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'â': 'a', 'ê': 'e', 'ô': 'o',
        'ã': 'a', 'õ': 'o',
        'ç': 'c',
        'à': 'a',
        '.': '',
        ' ': '-'
    }
    for char, rep in replacements.items():
        text = text.replace(char, rep)
    # Remove any other non-alphanumeric/non-dash characters
    text = re.sub(r'[^a-z0-9\-]', '', text)
    # Remove duplicate dashes
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def extract_sigla(text, fallback_prefix=""):
    # Try to find text inside parentheses first (e.g. "Universidade de São Paulo (USP)")
    match = re.search(r'\(([^)]+)\)', text)
    if match:
        return match.group(1).strip()
    
    # Try to find uppercase word/abbreviation at the end (e.g. "Instituto de Psiquiatria HC-FMUSP")
    words = text.split()
    for w in reversed(words):
        # If the word has multiple uppercase letters, it's likely a sigla
        if len(re.sub(r'[^A-Z\-]', '', w)) >= 2:
            return w.strip()
            
    # Fallback: take the first letters of main words
    main_words = [w for w in words if w.lower() not in ['de', 'da', 'do', 'em', 'para', 'e', 'o', 'a']]
    if main_words:
        sigla = "".join(w[0].upper() for w in main_words if w)
        return sigla
        
    return text[:4].upper()

def main():
    if len(sys.argv) < 3:
        print("Uso: python gerar_site.py <config.json> <diretorio_saida>")
        sys.exit(1)
        
    config_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    if not os.path.exists(config_path):
        print(f"Erro: O arquivo de configuracao '{config_path}' nao existe.")
        sys.exit(1)
        
    # Load config
    with open(config_path, "r", encoding="utf-8") as f:
        try:
            config = json.load(f)
        except Exception as e:
            print(f"Erro ao ler JSON: {e}")
            sys.exit(1)
            
    # Required keys validation
    required_keys = [
        "NOME", "CRP", "WHATSAPP", "EMAIL", "TELEFONE_FORMATADO", 
        "ENDERECO", "HORARIOS", "CIDADE", "CIDADE_ENDERECO", 
        "UNIVERSIDADE", "INSTITUTO", "ANOS_EXPERIENCIA"
    ]
    
    missing_keys = [k for k in required_keys if k not in config or not str(config[k]).strip()]
    if missing_keys:
        print(f"Erro: Os seguintes campos obrigatorios estao ausentes ou vazios: {', '.join(missing_keys)}")
        sys.exit(1)
        
    # Standardize values
    nome = config["NOME"]
    slug_nome = slugify(nome)
    
    # Deriving variables
    if "DOMINIO" not in config or not config["DOMINIO"].strip():
        # Ex: https://dramarinaoliveirapsi.com.br
        config["DOMINIO"] = f"https://{slug_nome}.com.br"
        
    if "UNIVERSIDADE_SIGLA" not in config or not config["UNIVERSIDADE_SIGLA"].strip():
        config["UNIVERSIDADE_SIGLA"] = extract_sigla(config["UNIVERSIDADE"])
        
    if "INSTITUTO_SIGLA" not in config or not config["INSTITUTO_SIGLA"].strip():
        config["INSTITUTO_SIGLA"] = extract_sigla(config["INSTITUTO"])
        
    if "HORAS_ATENDIMENTO" not in config or not config["HORAS_ATENDIMENTO"].strip():
        try:
            anos = int(re.sub(r'\D', '', str(config["ANOS_EXPERIENCIA"])))
            # Estimate roughly 500 hours of clinical practice per year as a conservative calculation
            hours = anos * 500
            if hours >= 1000:
                config["HORAS_ATENDIMENTO"] = f"{hours/1000:.1f}k+"
            else:
                config["HORAS_ATENDIMENTO"] = f"{hours}+"
        except:
            config["HORAS_ATENDIMENTO"] = "1.0k+"
            
    if "INSTAGRAM" not in config or not config["INSTAGRAM"].strip():
        config["INSTAGRAM"] = f"https://www.instagram.com/{slug_nome}"
        
    if "LINKEDIN" not in config or not config["LINKEDIN"].strip():
        config["LINKEDIN"] = f"https://www.linkedin.com/in/{slug_nome}"
        
    if "MAPA_IFRAME" not in config or not str(config["MAPA_IFRAME"]).strip():
        config["MAPA_IFRAME"] = """<div class="map-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="map-placeholder-icon" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span class="map-placeholder-label">Mapa de Localização</span>
                <span class="map-placeholder-sub">O iframe interativo do Google Maps aparecerá aqui</span>
              </div>"""
        
    # Clean output directory
    if os.path.exists(output_dir):
        print(f"Diretorio de saida '{output_dir}' ja existe. Removendo versao anterior...")
        shutil.rmtree(output_dir)
        
    os.makedirs(output_dir, exist_ok=True)
    
    # Directories/Files mapping to copy directly
    static_dirs = ["css", "js", "assets"]
    static_files = ["robots.txt"]
    
    # Base directory of the template
    template_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Copy static dirs
    for s_dir in static_dirs:
        src = os.path.join(template_dir, s_dir)
        dst = os.path.join(output_dir, s_dir)
        if os.path.exists(src):
            shutil.copytree(src, dst)
            
    # Copy static files
    for s_file in static_files:
        src = os.path.join(template_dir, s_file)
        dst = os.path.join(output_dir, s_file)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            
    # Mapping of templates to resolve
    templates = {
        "index.template.html": "index.html",
        "politica-privacidade.template.html": "politica-privacidade.html",
        "manifest.template.webmanifest": "manifest.webmanifest",
        "sitemap.template.xml": "sitemap.xml"
    }
    
    # Generate files from templates
    print("\n--- Gerando arquivos a partir dos templates ---")
    for t_name, out_name in templates.items():
        t_path = os.path.join(template_dir, t_name)
        if not os.path.exists(t_path):
            print(f"Aviso: Template '{t_name}' nao encontrado. Pulando...")
            continue
            
        with open(t_path, "r", encoding="utf-8") as f:
            template_content = f.read()
            
        # Replace variables
        resolved_content = template_content
        for key, val in config.items():
            placeholder = f"{{{{{key}}}}}"
            resolved_content = resolved_content.replace(placeholder, str(val))
            
        out_path = os.path.join(output_dir, out_name)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(resolved_content)
        print(f"Gerado: {out_name}")
        
    # Validation step: search for unresolved placeholders
    print("\n--- Executando checagem de marcadores pendentes ---")
    placeholder_pattern = re.compile(r'\{\{[A-Z0-9_]+\}\}')
    unresolved_found = False
    
    for root, dirs, files in os.walk(output_dir):
        for file in files:
            # Check only text files
            if file.endswith(('.html', '.xml', '.webmanifest', '.js', '.css')):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                matches = placeholder_pattern.findall(content)
                if matches:
                    unresolved_found = True
                    rel_path = os.path.relpath(file_path, output_dir)
                    print(f"Aviso: Marcador(es) nao substituido(s) encontrado(s) em '{rel_path}': {set(matches)}")
                    
    if not unresolved_found:
        print("Sucesso! Todos os marcadores foram substituidos corretamente.")
    else:
        print("\nAtencao: Algum marcador nao foi substituido. Verifique os dados passados no config JSON.")
        
    print(f"\nLanding Page gerada com sucesso na pasta: '{output_dir}'")
    print(f"Lembre-se de colocar as fotos personalizadas em: '{output_dir}/assets/img/'")

if __name__ == "__main__":
    main()
