let portfolioData = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            portfolioData = data;
            
            // 1. Inyectamos los componentes globales (Menú y Footer)
            renderNav();
            renderFooter();
            
            // 2. Comprobamos en qué página estamos
            if (document.getElementById('skills-container')) {
                // Página Principal
                loadSkills(data.skills);
                loadProjects(data.projects, 'projects-container', true); // true = Permite cajas grandes
            } else if (document.getElementById('project-detail-page')) {
                // Página de Detalles del Proyecto
                loadProjectDetails();
            }
        })
        .catch(error => console.error('Error cargando el JSON:', error));
});

// Renderiza el Menú Superior y sus Dropdowns
function renderNav() {
    const isSubPage = window.location.pathname.includes('project-placeholder');
    const prefix = isSubPage ? 'index.html' : '';
    
    // Genera los enlaces del Dropdown basados en los proyectos
    const dropdownLinks = portfolioData.projects.map(p => 
        `<a href="project-placeholder.html?title=${encodeURIComponent(p.title)}">${p.title}</a>`
    ).join('');
    
    const navHtml = `
    <nav>
        <div class="logo">HUMBERTO FERRER</div>
        <ul class="nav-links">
            <li><a href="${prefix}#home">HOME</a></li>
            <li class="dropdown">
                <a href="${prefix}#projects">PROJECTS ▾</a>
                <div class="dropdown-content">
                    ${dropdownLinks}
                </div>
            </li>
            <li><a href="${prefix}#album">ALBUM</a></li>
            <li><a href="${prefix}#contact" class="btn-contact">CONTACT</a></li>
        </ul>
    </nav>
    `;
    document.getElementById('nav-container').innerHTML = navHtml;
}

// Renderiza el Footer en todas las páginas de forma sincronizada
function renderFooter() {
    const footerHtml = `
    <footer class="footer">
        <a href="mailto:humberto.ferrer.bernal@gmail.com">HUMBERTO.FERRER.BERNAL@GMAIL.COM</a>
        <span class="separator">·</span>
        <a href="https://www.linkedin.com/in/humberto-ferrer-bernal/" target="_blank">LINKEDIN - HUMBERTO FERRER</a>
        <span class="separator">·</span>
        <a href="#" target="_blank">ARTSTATION - HUMBERTO FERRER BERNAL</a>
    </footer>
    `;
    document.getElementById('footer-container').innerHTML = footerHtml;
}

// Renderiza Habilidades
function loadSkills(skills) {
    const container = document.getElementById('skills-container');
    skills.forEach(skill => {
        const tagsHtml = skill.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const cardHtml = `
            <div class="card">
                <h3>${skill.title}</h3>
                <p>${skill.description}</p>
                <div class="tags">${tagsHtml}</div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

// Renderiza Proyectos (Reutilizable para principal y miniaturas)
function loadProjects(projects, containerId, allowLarge) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    projects.forEach(project => {
        const rolesHtml = project.roles ? project.roles.map(role => `<span class="role-tag">${role}</span>`).join('') : '';
        const largeClass = (allowLarge && project.size === 'large') ? 'large' : '';
        
        // Magia para JPG/PNG: Intentamos con el que viene en el JSON, si falla la carga (onerror) cambiamos a .png
        let imgContent = `Landscape Placeholder`;
        if (project.image) {
            const fallbackImg = project.image.replace('.jpg', '.png');
            imgContent = `<img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.src='${fallbackImg}';" style="width:100%; height:100%; object-fit:cover;">`;
        }
            
        const linkUrl = `project-placeholder.html?title=${encodeURIComponent(project.title)}`;
        
        const cardHtml = `
            <a href="${linkUrl}" class="project-card ${largeClass}">
                <div class="project-img">${imgContent}</div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <div class="project-roles">${rolesHtml}</div>
                </div>
            </a>
        `;
        container.innerHTML += cardHtml;
    });
}

// Lógica exclusiva de la página de Detalles
function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title') || 'Proyecto Desconocido';
    
    document.getElementById('project-title').textContent = title;
    document.title = title + " | Humberto Ferrer";
    
    const project = portfolioData.projects.find(p => p.title === title);
    
    if (project) {
        // Renderizar etiquetas bajo la imagen
        const rolesHtml = project.roles ? project.roles.map(role => `<span class="role-tag">${role}</span>`).join('') : '';
        document.getElementById('project-tags').innerHTML = rolesHtml;
        
        // Renderizar imagen central con fallback JPG/PNG
        if (project.image) {
            const fallbackImg = project.image.replace('.jpg', '.png');
            document.getElementById('project-media').innerHTML = `<img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.src='${fallbackImg}';" style="width:100%; height:100%; object-fit:cover;">`;
        }
    }
    
    // Renderizar resto de proyectos (ignorando el actual) y sin permitir clase .large
    const otherProjects = portfolioData.projects.filter(p => p.title !== title);
    loadProjects(otherProjects, 'other-projects-container', false);
}
