#!/usr/bin/env python3
"""
Script para actualizar el navbar en todas las páginas HTML de ServiLocal
"""

import os
import re
from pathlib import Path

# Navbar moderno con hamburguesa
MODERN_NAVBAR = '''  <header class="c-navbar">
    <div class="container c-navbar__inner">
      <a class="c-navbar__brand" href="index.html">
        <i class="fas fa-map-marker-alt c-navbar__brand-icon"></i>
        ServiLocal
      </a>
      
      <!-- Botón hamburguesa para móvil -->
      <button class="c-navbar__toggle" type="button" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="navbar-menu">
        <span class="c-navbar__toggle-line"></span>
        <span class="c-navbar__toggle-line"></span>
        <span class="c-navbar__toggle-line"></span>
      </button>
      
      <!-- Menú de navegación -->
      <nav class="c-navbar__menu" id="navbar-menu">
        <div class="c-navbar__links">
          <a class="c-navbar__link" href="index.html">
            <i class="fas fa-home c-navbar__link-icon"></i>
            Inicio
          </a>
          <a class="c-navbar__link" href="buscar.html">
            <i class="fas fa-search c-navbar__link-icon"></i>
            Buscar
          </a>
          <a class="c-navbar__link" href="todos_los_servicios.html">
            <i class="fas fa-th-large c-navbar__link-icon"></i>
            Servicios
          </a>
          <a class="c-navbar__link" href="perfil.html">
            <i class="fas fa-user c-navbar__link-icon"></i>
            Mi perfil
          </a>
        </div>
      </nav>
    </div>
  </header>'''

def update_navbar_in_file(filepath):
    """Actualiza el navbar en un archivo HTML"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Patrón para encontrar el header completo (incluyendo variantes con role="banner")
        pattern = r'<header class="c-navbar"[^>]*>.*?</header>'
        
        # Verificar si ya tiene el navbar moderno
        if 'c-navbar__toggle' in content:
            print(f"✓ {filepath.name} - Ya tiene navbar moderno")
            return False
        
        # Reemplazar el navbar
        new_content = re.sub(pattern, MODERN_NAVBAR, content, flags=re.DOTALL)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ {filepath.name} - Navbar actualizado")
            return True
        else:
            print(f"✗ {filepath.name} - No se encontró navbar para actualizar")
            return False
            
    except Exception as e:
        print(f"✗ {filepath.name} - Error: {e}")
        return False

def main():
    """Procesar todos los archivos HTML"""
    base_dir = Path(__file__).parent
    html_files = list(base_dir.glob('*.html'))
    
    # Excluir componentes.html si existe (página de demostración)
    html_files = [f for f in html_files if f.name != 'componentes.html']
    
    print(f"\n🔧 Actualizando navbars en {len(html_files)} archivos HTML...\n")
    
    updated_count = 0
    for html_file in sorted(html_files):
        if update_navbar_in_file(html_file):
            updated_count += 1
    
    print(f"\n✅ Proceso completado: {updated_count} archivos actualizados\n")

if __name__ == '__main__':
    main()
