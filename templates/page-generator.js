/**
 * ServiLocal - Generador de Páginas
 * Script para generar páginas usando la plantilla base
 */

const fs = require('fs');
const path = require('path');

// Configuración de páginas
const pageConfigs = {
    'index.html': {
        title: 'Inicio',
        bodyClass: 'home-page',
        activeNav: 'HOME_ACTIVE',
        specificCSS: '<link rel="stylesheet" href="css/linkedin-homepage.css">',
        specificJS: '<script src="js/homepage.js"></script>',
        content: `
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="container">
                <div class="hero-content">
                    <div class="hero-text">
                        <h1 class="hero-title">
                            Conectamos <span class="highlight">profesionales</span> con clientes
                        </h1>
                        <p class="hero-description">
                            ServiLocal es tu plataforma de confianza para encontrar y ofrecer servicios locales de calidad.
                        </p>
                        <div class="hero-actions">
                            <a href="linkedin-servicios.html" class="btn btn-primary">
                                Explorar Servicios
                                <i class="fas fa-arrow-right"></i>
                            </a>
                            <a href="linkedin-register.html" class="btn btn-secondary">
                                Ofrecer Servicios
                            </a>
                        </div>
                    </div>
                    <div class="hero-image">
                        <img src="imagenes/hero-image.jpg" alt="Profesionales trabajando" class="hero-img">
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Services -->
        <section class="featured-services">
            <div class="container">
                <h2 class="section-title">Servicios Destacados</h2>
                <div class="services-grid">
                    <!-- Los servicios se cargarán aquí -->
                </div>
            </div>
        </section>
        `
    },
    
    'linkedin-servicios.html': {
        title: 'Servicios',
        bodyClass: 'services-page',
        activeNav: 'SERVICES_ACTIVE',
        specificCSS: '<link rel="stylesheet" href="css/linkedin-listings.css">',
        specificJS: '<script src="js/services.js"></script>',
        content: `
        <!-- Services Hero -->
        <section class="listings-hero">
            <div class="container">
                <h1>Encuentra el Servicio Perfecto</h1>
                <p>Miles de profesionales verificados listos para ayudarte</p>
            </div>
        </section>

        <!-- Services Grid -->
        <section class="listings-section">
            <div class="container">
                <div class="listings-grid" id="servicesGrid">
                    <!-- Los servicios se cargarán aquí -->
                </div>
            </div>
        </section>
        `
    },
    
    'linkedin-productos.html': {
        title: 'Productos',
        bodyClass: 'products-page',
        activeNav: 'PRODUCTS_ACTIVE',
        specificCSS: '<link rel="stylesheet" href="css/linkedin-listings.css">',
        specificJS: '<script src="js/products.js"></script>',
        content: `
        <!-- Products Hero -->
        <section class="listings-hero">
            <div class="container">
                <h1>Productos Digitales</h1>
                <p>Plantillas, herramientas y recursos para tu negocio</p>
            </div>
        </section>

        <!-- Products Grid -->
        <section class="listings-section">
            <div class="container">
                <div class="listings-grid" id="productsGrid">
                    <!-- Los productos se cargarán aquí -->
                </div>
            </div>
        </section>
        `
    },
    
    'linkedin-feed.html': {
        title: 'Feed Social',
        bodyClass: 'feed-page',
        activeNav: 'FEED_ACTIVE',
        specificCSS: '<link rel="stylesheet" href="css/linkedin-feed.css">',
        specificJS: '<script src="js/feed.js"></script>',
        content: `
        <!-- Feed Container -->
        <div class="feed-container">
            <div class="feed-sidebar">
                <!-- Sidebar content -->
            </div>
            
            <div class="feed-main">
                <div class="create-post-section">
                    <!-- Create post form -->
                </div>
                
                <div class="posts-container">
                    <!-- Posts will be loaded here -->
                </div>
            </div>
            
            <div class="feed-right-sidebar">
                <!-- Right sidebar content -->
            </div>
        </div>
        `
    },
    
    'perfil-moderno.html': {
        title: 'Mi Perfil',
        bodyClass: 'profile-page',
        activeNav: 'PROFILE_ACTIVE',
        specificCSS: '<link rel="stylesheet" href="css/linkedin-style.css">',
        specificJS: '<script src="js/profile.js"></script>',
        content: `
        <!-- Profile Container -->
        <div class="profile-container">
            <div class="profile-sidebar">
                <!-- Profile sidebar -->
            </div>
            
            <div class="profile-main">
                <!-- Profile main content -->
            </div>
            
            <div class="profile-right-sidebar">
                <!-- Profile right sidebar -->
            </div>
        </div>
        `
    }
};

/**
 * Generar una página usando la plantilla base
 */
function generatePage(pageName, config) {
    try {
        // Leer la plantilla base
        const templatePath = path.join(__dirname, 'base-template.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Reemplazar placeholders
        template = template.replace('{{PAGE_TITLE}}', config.title);
        template = template.replace('{{BODY_CLASS}}', config.bodyClass || '');
        template = template.replace('{{PAGE_SPECIFIC_CSS}}', config.specificCSS || '');
        template = template.replace('{{PAGE_SPECIFIC_JS}}', config.specificJS || '');
        template = template.replace('{{MAIN_CONTENT}}', config.content || '');
        
        // Marcar navegación activa
        const navStates = {
            'HOME_ACTIVE': '',
            'SERVICES_ACTIVE': '',
            'PRODUCTS_ACTIVE': '',
            'FEED_ACTIVE': '',
            'PROFILE_ACTIVE': ''
        };
        
        if (config.activeNav) {
            navStates[config.activeNav] = 'active';
        }
        
        // Reemplazar estados de navegación
        Object.keys(navStates).forEach(key => {
            template = template.replace(`{{${key}}}`, navStates[key]);
        });
        
        // Escribir el archivo generado
        const outputPath = path.join(__dirname, '..', pageName);
        fs.writeFileSync(outputPath, template, 'utf8');
        
        console.log(`✅ Página generada: ${pageName}`);
        return true;
        
    } catch (error) {
        console.error(`❌ Error generando ${pageName}:`, error.message);
        return false;
    }
}

/**
 * Generar todas las páginas
 */
function generateAllPages() {
    console.log('🚀 Iniciando generación de páginas...\n');
    
    let successCount = 0;
    let totalPages = Object.keys(pageConfigs).length;
    
    Object.entries(pageConfigs).forEach(([pageName, config]) => {
        if (generatePage(pageName, config)) {
            successCount++;
        }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`   Páginas generadas: ${successCount}/${totalPages}`);
    console.log(`   Estado: ${successCount === totalPages ? '✅ Completado' : '⚠️  Con errores'}`);
    
    if (successCount === totalPages) {
        console.log('\n🎉 Todas las páginas han sido generadas correctamente!');
        console.log('💡 Ahora todas las páginas usan la plantilla base global.');
    }
}

/**
 * Validar que existe la plantilla base
 */
function validateTemplate() {
    const templatePath = path.join(__dirname, 'base-template.html');
    
    if (!fs.existsSync(templatePath)) {
        console.error('❌ Error: No se encontró la plantilla base en:', templatePath);
        console.log('💡 Asegúrate de que existe el archivo base-template.html');
        return false;
    }
    
    console.log('✅ Plantilla base encontrada');
    return true;
}

/**
 * Crear backup de páginas existentes
 */
function createBackup() {
    const backupDir = path.join(__dirname, '..', 'backup-pages');
    
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    
    console.log('📦 Creando backup de páginas existentes...');
    
    Object.keys(pageConfigs).forEach(pageName => {
        const sourcePath = path.join(__dirname, '..', pageName);
        const backupPath = path.join(backupDir, `${pageName}.backup`);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, backupPath);
            console.log(`   📄 ${pageName} → backup`);
        }
    });
    
    console.log('✅ Backup completado\n');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    console.log('🏗️  ServiLocal - Generador de Páginas\n');
    
    // Validar plantilla
    if (!validateTemplate()) {
        process.exit(1);
    }
    
    // Crear backup
    createBackup();
    
    // Generar páginas
    generateAllPages();
}

module.exports = {
    generatePage,
    generateAllPages,
    pageConfigs
};
