let portfolioData = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            portfolioData = data;
            
            // 1. Inyectamos componentes globales
            renderNav();
            renderFooter();
            
            // 2. Comprobamos la página
            if (document.getElementById('skills-container')) {
                // Página Principal
                loadSkills(data.skills);
                loadProjects(data.projects, 'projects-container');
                setupVideo();
            } else if (document.getElementById('project-detail-page')) {
                // Página de Detalles del Proyecto
                loadProjectDetails();
            }
        })
        .catch(error => console.error('Error cargando el JSON:', error));
});

// Función para copiar Email al portapapeles y mostrar "Copiado"
function copyEmail(e, email) {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
        const tooltip = document.getElementById('copy-tooltip');
        if(tooltip) {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
            tooltip.style.opacity = 1;
            setTimeout(() => tooltip.style.opacity = 0, 1500);
        }
    });
}

// Lightbox para la imagen individual
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    if(lb && lbImg) {
        lbImg.src = src;
        lb.style.display = 'flex';
    }
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if(lb) lb.style.display = 'none';
}

// Reproductor de Vimeo Custom
function setupVideo() {
    const overlay = document.getElementById('video-overlay');
    if(overlay) {
        overlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            const iframe = document.getElementById('vimeo-iframe');
            iframe.src += "?autoplay=1";
        });
    }
}

// Inyecta el menú (mismos enlaces en todas partes)
function renderNav() {
    const dropdownLinks = portfolioData.projects.map(p => 
        `<a href="project-placeholder.html?title=${encodeURIComponent(p.title)}">${p.title}</a>`
    ).join('');
    
    const navHtml = `
    <nav>
        <div class="logo">
            <a href="https://humbertoferrerbernal.github.io/" style="color:inherit; text-decoration:none;">HUMBERTO FERRER</a>
        </div>
        <ul class="nav-links">
            <li><a href="https://humbertoferrerbernal.github.io/">HOME</a></li>
            <li class="dropdown">
                <a href="https://humbertoferrerbernal.github.io/#projects">PROJECTS ▾</a>
                <div class="dropdown-content">
                    ${dropdownLinks}
                </div>
            </li>
            <li><a href="https://humbertoferrerbernal.github.io/#album">ALBUM</a></li>
            <li><a href="https://humbertoferrerbernal.github.io/#contact" class="btn-contact">CONTACT</a></li>
        </ul>
    </nav>
    `;
    document.getElementById('nav-container').innerHTML = navHtml;
}

// Inyecta el footer global
function renderFooter() {
    const footerHtml = `
    <footer class="footer">
        <div class="footer-left">
            <strong>HUMBERTO FERRER</strong>
        </div>
        <div class="footer-center">
            <a href="#" onclick="copyEmail(event, 'humberto.ferrer.bernal@gmail.com')">HUMBERTO.FERRER.BERNAL@GMAIL.COM</a>
            <span class="separator">·</span>
            <a href="https://www.linkedin.com/in/humberto-ferrer-bernal/" target="_blank">LINKEDIN - HUMBERTO FERRER</a>
            <span class="separator">·</span>
            <a href="http://artstation.com/humbfbx" target="_blank">ARTSTATION - HUMBERTO FERRER BERNAL</a>
        </div>
        <div class="footer-right">
            <span class="copyright">© 2026 Humberto Ferrer - All rights reserved</span>
        </div>
    </footer>
    `;
    document.getElementById('footer-container').innerHTML = footerHtml;
}

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

function loadProjects(projects, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    projects.forEach(project => {
        // Para filtrar los que son solo álbum de la pantalla principal (si quisieras no mezclarlos)
        // Por ahora los carga tal cual
        const rolesHtml = project.roles ? project.roles.map(role => `<span class="role-tag">${role}</span>`).join('') : '';
        const largeClass = project.size === 'large' ? 'large' : '';
        
        let imgContent = `Landscape Placeholder`;
        if (project.image) {
            const fallbackImg = project.image.replace('.png', '.jpg');
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

// Función auxiliar para crear cuadrículas pequeñas
function buildRelatedSection(titleText, items) {
    if (!items || items.length === 0) return '';
    let html = `<h3 class="accent" style="margin: 3rem 0 1rem 0; font-size: 1.2rem; letter-spacing: 2px;">${titleText}</h3>`;
    html += `<div class="mini-projects-grid">`;
    
    items.forEach(project => {
        let imgContent = `Landscape Placeholder`;
        if (project.image) {
            const fallbackImg = project.image.replace('.png', '.jpg');
            imgContent = `<img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.src='${fallbackImg}';" style="width:100%; height:100%; object-fit:cover;">`;
        }
        const linkUrl = `project-placeholder.html?title=${encodeURIComponent(project.title)}`;
        
        html += `
            <a href="${linkUrl}" class="project-card">
                <div class="project-img">${imgContent}</div>
                <div class="project-info">
                    <h4 style="color:var(--text-main);">${project.title}</h4>
                </div>
            </a>
        `;
    });
    html += `</div>`;
    return html;
}

function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title') || 'Proyecto Desconocido';
    
    document.getElementById('project-title').textContent = title;
    document.title = title + " | Humberto Ferrer";
    
    const project = portfolioData.projects.find(p => p.title === title);
    
    if (project) {
        // Título y Descripción
        if(project.desc) {
            document.getElementById('project-desc').textContent = project.desc;
        }
        
        // Roles
        const rolesHtml = project.roles ? project.roles.map(role => `<span class="role-tag">${role}</span>`).join('') : '';
        document.getElementById('project-tags').innerHTML = rolesHtml;
        
        // Imagen Clickeable para Lightbox
        const wrapper = document.getElementById('project-media');
        if (project.image) {
            const fallbackImg = project.image.replace('.png', '.jpg');
            wrapper.innerHTML = `<img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.src='${fallbackImg}';" style="width:100%; height:100%; object-fit:cover;">`;
            wrapper.onclick = function() {
                const img = this.querySelector('img');
                if(img) openLightbox(img.src);
            };
        } else {
             if(title.includes("Lighting")) {
                 wrapper.innerHTML = `<div style="font-size:2rem;">${title}</div>`;
             }
        }
    }
    
    // Recomendaciones en la parte inferior
    const isAlbum = title.toLowerCase().includes('lighting');
    
    // Filtramos para conseguir los arrays de albums y de proyectos excluyendo el actual
    const albums = portfolioData.projects.filter(p => p.title.toLowerCase().includes('lighting') && p.title !== title);
    const projects = portfolioData.projects.filter(p => !p.title.toLowerCase().includes('lighting') && p.title !== title);
    
    let relatedHtml = '';
    
    if (isAlbum) {
        // En un album mostramos primero ANOTHER GALLERY y luego ANOTHER PROJECTS
        relatedHtml += buildRelatedSection('ANOTHER GALLERY::', albums);
        relatedHtml += buildRelatedSection('ANOTHER PROJECTS::', projects);
    } else {
        // En un proyecto mostramos primero ANOTHER PROJECTS y luego OTHER ALBUM
        relatedHtml += buildRelatedSection('ANOTHER PROJECTS::', projects);
        relatedHtml += buildRelatedSection('OTHER ALBUM::', albums);
    }
    
    document.getElementById('related-sections').innerHTML = relatedHtml;
}
