#!/usr/bin/env python3
"""
Script para agregar meta tags PWA y manifest a todos los archivos HTML
"""

import os
import re
from pathlib import Path

def agregar_meta_pwa(archivo_html):
    """Agrega meta tags PWA si no existen"""
    
    with open(archivo_html, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    # Verificar si ya tiene manifest
    if 'manifest.json' in contenido:
        print(f"✓ {archivo_html.name} - Ya tiene manifest")
        return False
    
    # Meta tags PWA para agregar
    meta_tags_pwa = '''  <!-- PWA Meta Tags -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="ServiLocal">
  <!-- theme-color se añade dinámicamente desde js/pwa.js -->
  <meta name="msapplication-TileColor" content="#4F46E5">
  <meta name="msapplication-tap-highlight" content="no">
  
  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <!-- Apple Touch Icons -->
  <link rel="apple-touch-icon" sizes="152x152" href="/imagen/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/imagen/icon-192x192.png">
  
  <!-- Splash Screens iOS -->
  <link rel="apple-touch-startup-image" href="/imagen/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)">
  <link rel="apple-touch-startup-image" href="/imagen/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)">
  <link rel="apple-touch-startup-image" href="/imagen/splash-1242x2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)">
  <link rel="apple-touch-startup-image" href="/imagen/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)">

'''
    
    # Buscar dónde insertar (después del último link de favicon o meta viewport)
    patron = r'(<link rel="icon"[^>]*>\s*)'
    
    if re.search(patron, contenido):
        nuevo_contenido = re.sub(
            patron,
            r'\1' + meta_tags_pwa,
            contenido,
            count=1
        )
    else:
        # Si no encuentra favicon, buscar viewport
        patron_viewport = r'(<meta name="viewport"[^>]*>\s*)'
        if re.search(patron_viewport, contenido):
            nuevo_contenido = re.sub(
                patron_viewport,
                r'\1\n' + meta_tags_pwa,
                contenido,
                count=1
            )
        else:
            print(f"✗ {archivo_html.name} - No se encontró dónde insertar")
            return False
    
    # Agregar script pwa.js antes de </body> si no existe
    if 'js/pwa.js' not in nuevo_contenido:
        nuevo_contenido = re.sub(
            r'(\s*<script src="js/accesibilidad\.js"></script>)',
            r'\1\n  <script src="js/pwa.js"></script>',
            nuevo_contenido,
            count=1
        )
    
    # Guardar cambios
    with open(archivo_html, 'w', encoding='utf-8') as f:
        f.write(nuevo_contenido)
    
    print(f"✓ {archivo_html.name} - Meta tags PWA agregadas")
    return True

def main():
    """Procesa todos los archivos HTML"""
    
    # Directorio raíz del proyecto
    directorio = Path(__file__).parent
    
    # Archivos HTML en la raíz
    archivos_html = [
        'index.html',
        'buscar.html',
        'proveedor.html',
        'jardineria.html',
        'plomeria.html',
        'electricidad.html',
        'limpieza.html',
        'construccion.html',
        'abogacia.html',
        'contaduria.html',
        'veterinaria.html',
        'mecanica.html',
        'ferreteria.html',
        'corralon.html',
        'todos_los_servicios.html',
        'login.html',
        'registro.html',
        'perfil.html',
        'politicas.html'
    ]
    
    archivos_modificados = 0
    archivos_totales = 0
    
    print("\n🔄 Agregando meta tags PWA a archivos HTML...\n")
    
    for nombre_archivo in archivos_html:
        archivo = directorio / nombre_archivo
        if archivo.exists():
            archivos_totales += 1
            if agregar_meta_pwa(archivo):
                archivos_modificados += 1
        else:
            print(f"⚠ {nombre_archivo} - Archivo no encontrado")
    
    print(f"\n✅ Proceso completado:")
    print(f"   - Archivos procesados: {archivos_totales}")
    print(f"   - Archivos modificados: {archivos_modificados}")
    print(f"   - Archivos sin cambios: {archivos_totales - archivos_modificados}\n")

if __name__ == '__main__':
    main()
