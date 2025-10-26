#!/usr/bin/env python3
"""
Script para agregar/actualizar meta tags SEO en archivos HTML
Incluye: description, keywords, Open Graph, Twitter Cards, canonical
"""

import re
import json
from pathlib import Path

# Cargar configuración SEO
with open('seo-config.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

def generate_meta_tags(page_name, config):
    """Genera los meta tags para una página específica"""
    
    page_config = config['pages'].get(page_name, {})
    title = page_config.get('title', config['defaultTitle'])
    description = page_config.get('description', config['defaultDescription'])
    keywords = page_config.get('keywords', config['defaultKeywords'])
    url = f"{config['siteUrl']}/{page_name}"
    image = config['defaultImage']
    
    meta_tags = f'''  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="{description}">
  <meta name="keywords" content="{keywords}">
  <meta name="author" content="{config['siteName']}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{url}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="{config['type']}">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="{config['siteUrl']}{image}">
  <meta property="og:locale" content="{config['locale']}">
  <meta property="og:site_name" content="{config['siteName']}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="{url}">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{config['siteUrl']}{image}">
  <meta name="twitter:site" content="{config['twitterHandle']}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  
  <title>{title}</title>'''
    
    return meta_tags

def update_html_file(file_path, config):
    """Actualiza un archivo HTML con los meta tags apropiados"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    page_name = file_path.name
    new_meta_tags = generate_meta_tags(page_name, config)
    
    # Patrón para encontrar la sección <head> completa hasta el primer <link> de fonts
    # Buscamos desde <meta charset> hasta justo antes de <link rel="preconnect">
    pattern = r'(<head>\s*)(<meta charset[^>]*>\s*<meta name="viewport"[^>]*/>)(.*?)(<link rel="preconnect")'
    
    def replacer(match):
        return match.group(1) + new_meta_tags + '\n  ' + match.group(4)
    
    # Intentar reemplazar
    new_content, count = re.subn(pattern, replacer, content, count=1, flags=re.DOTALL)
    
    if count == 0:
        # Si no encuentra el patrón, intentar con un patrón más simple
        # Buscar <head> hasta <title>
        pattern2 = r'(<head>\s*)(.*?)(</head>)'
        
        # Buscar el <title> actual
        title_match = re.search(r'<title>([^<]+)</title>', content)
        current_title = title_match.group(1) if title_match else config['defaultTitle']
        
        # Actualizar el título en config si es necesario
        page_config = config['pages'].get(page_name, {})
        if 'title' not in page_config:
            page_config['title'] = current_title
        
        new_meta_tags_full = generate_meta_tags(page_name, config)
        
        def replacer2(match):
            # Mantener solo los links después del título
            old_head_content = match.group(2)
            links = re.findall(r'<link[^>]*>', old_head_content)
            links_str = '\n  '.join(links)
            return match.group(1) + new_meta_tags_full + '\n  ' + links_str + '\n' + match.group(3)
        
        new_content, count = re.subn(pattern2, replacer2, content, count=1, flags=re.DOTALL)
    
    if count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    else:
        print(f"⚠️  No se pudo actualizar {file_path.name}")
        return False

def main():
    """Procesa todos los archivos HTML en el directorio"""
    
    html_files = [
        'index.html',
        'buscar.html',
        'perfil.html',
        'login.html',
        'registro.html',
        'proveedor.html',
        'todos_los_servicios.html',
        'jardineria.html',
        'plomeria.html',
        'electricidad.html',
        'limpieza.html',
        'construccion.html',
        'abogacia.html',
        'contaduria.html',
        'veterinaria.html',
        'politicas.html',
        'corralon.html',
        'ferreteria.html',
        'mecanica.html',
    ]
    
    updated = 0
    for filename in html_files:
        file_path = Path(filename)
        if file_path.exists():
            if update_html_file(file_path, config):
                print(f"✓ {filename} actualizado")
                updated += 1
        else:
            print(f"⚠️  {filename} no encontrado")
    
    print(f"\n✅ {updated} archivos actualizados con meta tags SEO")

if __name__ == '__main__':
    main()
