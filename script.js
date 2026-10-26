let portfolioData = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Tema (Dark por defecto)
    initTheme();

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            portfolioData = data;
            
            // 2. Inyectamos componentes globales
            renderNav();
            renderFooter();
            
            // 3. Comprobamos la página
            if (document.getElementById('skills-container')) {
                // Página Principal
                loadSkills(data.skills);
                loadProjects(data.projects, 'projects-container');
                loadProjects(data.gallery, 'gallery-container');
                setupVideo();
            } else if (document.getElementById('project-detail-page')) {
                // Página de Detalles del Proyecto
                loadProjectDetails();
            }

            // 4. Inicializamos las animaciones de scroll
            setTimeout(initScrollAnimations, 50);
        })
        .catch(error => console.error('Error cargando el JSON:', error));
});

// Manejo de Tema Claro / Oscuro
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Actualizar icono del botón
    const iconSpan = document.getElementById('theme-icon');
    if(iconSpan) {
        iconSpan.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }
}

// Animaciones On-Scroll
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

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

// Inyecta el menú (con Toggle de Tema, SHOWREEL, CV y Logo Amarillo)
function renderNav() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeIcon = currentTheme === 'light' ? '🌙' : '☀️';
    
    const dropdownLinks = portfolioData.projects.map(p => 
        `<a href="project-placeholder.html?title=${encodeURIComponent(p.title)}">${p.title}</a>`
    ).join('');
    
    const navHtml = `
    <nav>
        <div class="logo">
            <a href="https://humbertoferrerbernal.github.io/">HUMBERTO FERRER</a>
        </div>
        <ul class="nav-links">
            <li><button class="theme-toggle-btn" onclick="toggleTheme()" title="Cambiar Tema"><span id="theme-icon">${themeIcon}</span></button></li>
            <li><a href="https://humbertoferrerbernal.github.io/">HOME</a></li>
            <li><a href="https://humbertoferrerbernal.github.io/#showreel">SHOWREEL</a></li>
            <li class="dropdown">
                <a href="https://humbertoferrerbernal.github.io/#projects">PROJECTS ▾</a>
                <div class="dropdown-content">
                    ${dropdownLinks}
                </div>
            </li>
            <li><a href="https://humbertoferrerbernal.github.io/#gallery">GALLERY</a></li>
            <li><a href="https://humbertoferrerbernal.github.io/#contact" class="btn-contact">CONTACT</a></li>
            <li><a href="CV_Humberto_Ferrer.pdf" target="_blank" class="btn-cv">CV</a></li>
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
            <div class="card reveal">
                <h3>${skill.title}</h3>
                <p>${skill.description}</p>
                <div class="tags">${tagsHtml}</div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

// Cargar proyectos (Grid Principal Overlay)
function loadProjects(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !items) return;
    
    items.forEach(item => {
        const rolesHtml = item.roles ? item.roles.map(role => `<span class="role-tag">${role}</span>`).join('') : '';
        const largeClass = item.size === 'large' ? 'large' : '';
        
        let imgContent = `Landscape Placeholder`;
        if (item.image) {
            const fallbackImg = item.image.replace('.png', '.jpg');
            imgContent = `<img src="${item.image}" alt="${item.title}" onerror="this.onerror=null; this.src='${fallbackImg}';">`;
        }
            
        const linkUrl = `project-placeholder.html?title=${encodeURIComponent(item.title)}`;
        
        const cardHtml = `
            <a href="${linkUrl}" class="project-card ${largeClass} reveal">
                <div class="project-img">${imgContent}</div>
                <div class="project-info">
                    <h3>${item.title}</h3>
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
    let html = `<h3 class="accent reveal" style="margin: 3rem 0 1rem 0; font-size: 1.2rem; letter-spacing: 2px;">${titleText}</h3>`;
    html += `<div class="mini-projects-grid">`;
    
    items.forEach(item => {
        let imgContent = `Landscape Placeholder`;
        if (item.image) {
            const fallbackImg = item.image.replace('.png', '.jpg');
            imgContent = `<img src="${item.image}" alt="${item.title}" onerror="this.onerror=null; this.src='${fallbackImg}';">`;
        }
        const linkUrl = `project-placeholder.html?title=${encodeURIComponent(item.title)}`;
        
        html += `
            <a href="${linkUrl}" class="project-card reveal">
                <div class="project-img">${imgContent}</div>
                <div class="project-info">
                    <h4>${item.title}</h4>
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
    
    let project = portfolioData.projects.find(p => p.title === title);
    let isGallery = false;
    
    if (!project) {
        project = portfolioData.gallery.find(a => a.title === title);
        isGallery = true;
    }
    
    if (project) {
        if(project.desc) {
            document.getElementById('project-desc').textContent = project.desc;
        }
        
        const rolesHtml = project.roles ? project.roles.map(role => `<span class="role-tag" style="background:rgba(229,185,26,0.2); color:#9A7B0E; border:none; padding:0.3rem 0.8rem; border-radius:10px; font-weight:bold;">${role}</span>`).join('') : '';
        document.getElementById('project-tags').innerHTML = rolesHtml;
        
        const wrapper = document.getElementById('project-media');
        if (project.image) {
            const fallbackImg = project.image.replace('.png', '.jpg');
            wrapper.innerHTML = `<img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.src='${fallbackImg}';" style="width:100%; height:100%; object-fit:cover;">`;
            wrapper.onclick = function() {
                const img = this.querySelector('img');
                if(img) openLightbox(img.src);
            };
        } else {
             wrapper.innerHTML = `<div style="font-size:2rem;">${title}</div>`;
        }
    }
    
    const relatedGallery = portfolioData.gallery.filter(a => a.title !== title);
    const relatedProjects = portfolioData.projects.filter(p => p.title !== title);
    
    let relatedHtml = '';
    
    if (isGallery) {
        relatedHtml += buildRelatedSection('OTHER GALLERY:', relatedGallery);
        relatedHtml += buildRelatedSection('OTHER PROJECTS:', relatedProjects);
    } else {
        relatedHtml += buildRelatedSection('OTHER PROJECTS:', relatedProjects);
        relatedHtml += buildRelatedSection('OTHER GALLERY:', relatedGallery);
    }
    
    document.getElementById('related-sections').innerHTML = relatedHtml;
}
