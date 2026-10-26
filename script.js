let portfolioData = null;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            portfolioData = data;
            
            renderNav();
            renderFooter();
            
            if (document.getElementById('projects-container')) {
                const validProjects = data.projects.filter(p => !p.title.startsWith('Proyecto 0'));
                loadProjects(validProjects, 'projects-container', false);
                loadProjects(data.gallery, 'gallery-container', true);
                setupVideo();
            } else if (document.getElementById('project-detail-page')) {
                loadProjectDetails();
            }

            setTimeout(initScrollAnimations, 50);
        })
        .catch(error => console.error('Error cargando el JSON:', error));
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const iconSpan = document.getElementById('theme-icon');
    if (iconSpan) {
        if (theme === 'light') {
            // Icono de línea Luna
            iconSpan.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        } else {
            // Icono de línea Sol
            iconSpan.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        }
    }
}

function toggleMailExpand(e) {
    e.preventDefault();
    const mailWrapper = document.getElementById('mail-wrapper');
    if (mailWrapper) {
        mailWrapper.classList.toggle('expanded');
    }
    navigator.clipboard.writeText('humberto.ferrer.bernal@gmail.com').then(() => {
        showTooltip(e, 'Email Copiado');
    });
}

function togglePhoneExpand(e) {
    e.preventDefault();
    const phoneWrapper = document.getElementById('phone-wrapper');
    if (phoneWrapper) {
        phoneWrapper.classList.toggle('expanded');
    }
    navigator.clipboard.writeText('+34 644 755 446').then(() => {
        showTooltip(e, 'Teléfono Copiado');
    });
}

function highlightContactButtons(e) {
    e.preventDefault();
    const mail = document.getElementById('mail-wrapper');
    const phone = document.getElementById('phone-wrapper');
    
    if (mail) {
        mail.classList.remove('glow-highlight');
        void mail.offsetWidth;
        mail.classList.add('glow-highlight');
        if (!mail.classList.contains('expanded')) mail.classList.add('expanded');
    }
    
    if (phone) {
        phone.classList.remove('glow-highlight');
        void phone.offsetWidth;
        phone.classList.add('glow-highlight');
        if (!phone.classList.contains('expanded')) phone.classList.add('expanded');
    }
}

function showTooltip(e, text) {
    const tooltip = document.getElementById('copy-tooltip');
    if(tooltip) {
        tooltip.textContent = text;
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
        tooltip.style.opacity = 1;
        setTimeout(() => tooltip.style.opacity = 0, 1500);
    }
}

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

function copyEmail(e, email) {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
        showTooltip(e, 'Email Copiado');
    });
}

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

// Menú de navegación (Garantiza siempre Desafío Champions SENDOKAI sin Rebirth)
function renderNav() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    const dropdownLinks = portfolioData.projects
        .filter(p => !p.title.startsWith('Proyecto 0'))
        .map(p => {
            let linkTitle = p.title;
            if (linkTitle.includes("Sendokai") || linkTitle.includes("SENDOKAI")) {
                linkTitle = "Desafío Champions SENDOKAI";
            }
            return `<a href="project-placeholder.html?title=${encodeURIComponent(p.title)}">${linkTitle}</a>`;
        })
        .join('');
    
    const navHtml = `
    <nav>
        <div class="logo">
            <a href="https://humbertoferrerbernal.github.io/">
                <img src="logo.png" onerror="this.onerror=null; this.src='PIC_Logo.png';" alt="Logo" class="logo-img">
                HUMBERTO FERRER
            </a>
        </div>
        <ul class="nav-links">
            <li><button class="theme-toggle-btn" onclick="toggleTheme()" title="Cambiar Tema"><span id="theme-icon"></span></button></li>
            <li><a href="https://humbertoferrerbernal.github.io/">HOME</a></li>
            <li><a href="https://humbertoferrerbernal.github.io/#showreel">SHOWREEL</a></li>
            <li><a href="CV_Humberto_Ferrer.pdf" target="_blank" title="Abrir CV">ABOUT</a></li>
            <li class="dropdown">
                <a href="https://humbertoferrerbernal.github.io/#projects">PROJECTS ▾</a>
                <div class="dropdown-content">
                    ${dropdownLinks}
                </div>
            </li>
            <li><a href="https://humbertoferrerbernal.github.io/#gallery">GALLERY</a></li>
            <li><a href="https://humbertoferrerbernal.github.io/#contact" class="btn-contact">CONTACT</a></li>
        </ul>
    </nav>
    `;
    document.getElementById('nav-container').innerHTML = navHtml;
    updateThemeIcon(currentTheme);
}

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

function loadProjects(items, containerId, isGallery = false) {
    const container = document.getElementById(containerId);
    if (!container || !items) return;
    
    items.forEach(item => {
        let displayTitle = item.title;
        if (displayTitle.includes("Sendokai") || displayTitle.includes("SENDOKAI")) {
            displayTitle = "Desafío Champions SENDOKAI";
        }
        
        const largeClass = item.size === 'large' ? 'large' : '';
        
        let imgContent = `Landscape Placeholder`;
        if (item.image) {
            const fallbackImg = item.image.replace('.png', '.jpg');
            imgContent = `<img src="${item.image}" alt="${displayTitle}" onerror="this.onerror=null; this.src='${fallbackImg}';">`;
        }
            
        const linkUrl = `project-placeholder.html?title=${encodeURIComponent(item.title)}`;
        
        // Si es Galería, NO mostrar título ni tags en la miniatura de la portada
        let infoHtml = '';
        if (!isGallery) {
            const rolesHtml = item.roles ? item.roles.map(role => `<span class="role-tag">${role}</span>`).join('') : '';
            infoHtml = `
                <div class="project-info">
                    <h3>${displayTitle}</h3>
                    <div class="project-roles">${rolesHtml}</div>
                </div>
            `;
        }
        
        const cardHtml = `
            <a href="${linkUrl}" class="project-card ${largeClass} reveal">
                <div class="project-img">${imgContent}</div>
                ${infoHtml}
            </a>
        `;
        container.innerHTML += cardHtml;
    });
}

function buildRelatedSection(titleText, items, isGallerySection = false) {
    if (!items || items.length === 0) return '';
    let html = `<h3 class="related-section-title reveal">${titleText}</h3>`;
    html += `<div class="mini-projects-grid">`;
    
    items.forEach(item => {
        let displayTitle = item.title;
        if (displayTitle.includes("Sendokai") || displayTitle.includes("SENDOKAI")) {
            displayTitle = "Desafío Champions SENDOKAI";
        }
        
        let imgContent = `Landscape Placeholder`;
        if (item.image) {
            const fallbackImg = item.image.replace('.png', '.jpg');
            imgContent = `<img src="${item.image}" alt="${displayTitle}" onerror="this.onerror=null; this.src='${fallbackImg}';">`;
        }
        const linkUrl = `project-placeholder.html?title=${encodeURIComponent(item.title)}`;
        
        // Si la sección relacionada es Gallery, no mostrar título en la tarjeta mini
        let miniInfoHtml = '';
        if (!isGallerySection) {
            miniInfoHtml = `
                <div class="project-info">
                    <h4>${displayTitle}</h4>
                </div>
            `;
        }
        
        html += `
            <a href="${linkUrl}" class="project-card reveal">
                <div class="project-img">${imgContent}</div>
                ${miniInfoHtml}
            </a>
        `;
    });
    html += `</div>`;
    return html;
}

function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const rawTitle = urlParams.get('title') || 'Proyecto Desconocido';
    
    let project = portfolioData.projects.find(p => p.title === rawTitle || p.title.startsWith(rawTitle));
    let isGallery = false;
    
    if (!project) {
        project = portfolioData.gallery.find(a => a.title === rawTitle);
        isGallery = true;
    }
    
    let displayTitle = rawTitle;
    if (project && (project.title.includes("Sendokai") || project.title.includes("SENDOKAI"))) {
        displayTitle = "Desafío Champions SENDOKAI";
    }
    
    const titleElem = document.getElementById('project-title');
    const subtitleElem = document.getElementById('project-subtitle');
    const dividerElem = document.getElementById('project-divider');
    
    document.title = (displayTitle || "Detalle") + " | Humberto Ferrer";
    
    // Si es un item de Gallery, Ocultar Título y Tags dentro de la página de detalle
    if (isGallery) {
        if (titleElem) titleElem.style.display = 'none';
        if (subtitleElem) subtitleElem.style.display = 'none';
        if (dividerElem) dividerElem.style.display = 'none';
        document.getElementById('project-tags').style.display = 'none';
    } else {
        if (titleElem) titleElem.textContent = displayTitle;
    }
    
    if (project) {
        let bioText = project.desc;
        if (displayTitle === "Desafío Champions SENDOKAI") {
            bioText = "Tasked with shaping the visual mood across several episodes, I developed master lighting setups that faithfully translated the directors' color keys into the 3D environment. A key focus was maintaining strict shot-to-shot consistency while preserving the show's signature friendly, cartoon aesthetic—characterized by vibrant colors, rich atmospheres, and strong rim lights. A major part of the process also involved managing the in-house render farm, maximizing its capacity, and actively troubleshooting render errors as they arose to keep production moving smoothly.";
        }
        
        document.getElementById('project-desc').textContent = bioText || "";
        
        if (!isGallery) {
            const rolesHtml = project.roles ? project.roles.map(role => `<span class="role-tag detail-page-tag">${role}</span>`).join('') : '';
            document.getElementById('project-tags').innerHTML = rolesHtml;
        }
        
        const wrapper = document.getElementById('project-media');
        const extraContainer = document.getElementById('project-extra-content');
        
        if (displayTitle === "Desafío Champions SENDOKAI") {
            // Reproductores y cuadrícula 2x2 específica para Sendokai
            wrapper.innerHTML = `
                <div class="video-overlay" id="sendokai-video-overlay" style="cursor:pointer;">
                    <img src="PIC_Sendokai_01.png" onerror="this.onerror=null; this.src='PIC_Sendokai_01.jpg';" alt="Sendokai Trailer" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0.8;">
                    <div class="play-btn" style="z-index:2;">&#9658;</div>
                </div>
                <iframe id="sendokai-iframe" src="https://www.youtube.com/embed/fwHFyvh3dgo" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;"></iframe>
            `;
            
            setTimeout(() => {
                const overlay = document.getElementById('sendokai-video-overlay');
                if(overlay) {
                    overlay.addEventListener('click', () => {
                        overlay.style.display = 'none';
                        const iframe = document.getElementById('sendokai-iframe');
                        iframe.src += "?autoplay=1";
                    });
                }
            }, 50);

            // Cuadrícula 2x2 con PIC_Sendokai_01 a 04
            extraContainer.innerHTML = `
                <div class="sendokai-grid">
                    <div class="sendokai-card" onclick="openLightbox('PIC_Sendokai_01.png')">
                        <img src="PIC_Sendokai_01.png" onerror="this.onerror=null; this.src='PIC_Sendokai_01.jpg';" alt="Sendokai 01">
                    </div>
                    <div class="sendokai-card" onclick="openLightbox('PIC_Sendokai_02.png')">
                        <img src="PIC_Sendokai_02.png" onerror="this.onerror=null; this.src='PIC_Sendokai_02.jpg';" alt="Sendokai 02">
                    </div>
                    <div class="sendokai-card" onclick="openLightbox('PIC_Sendokai_03.png')">
                        <img src="PIC_Sendokai_03.png" onerror="this.onerror=null; this.src='PIC_Sendokai_03.jpg';" alt="Sendokai 03">
                    </div>
                    <div class="sendokai-card" onclick="openLightbox('PIC_Sendokai_04.png')">
                        <img src="PIC_Sendokai_04.png" onerror="this.onerror=null; this.src='PIC_Sendokai_04.jpg';" alt="Sendokai 04">
                    </div>
                </div>
            `;
        } else if (project.image) {
            const fallbackImg = project.image.replace('.png', '.jpg');
            wrapper.innerHTML = `<img src="${project.image}" alt="${displayTitle}" onerror="this.onerror=null; this.src='${fallbackImg}';" style="width:100%; height:100%; object-fit:cover;">`;
            wrapper.onclick = function() {
                const img = this.querySelector('img');
                if(img) openLightbox(img.src);
            };
        } else {
             wrapper.innerHTML = `<div style="font-size:2rem;">${displayTitle}</div>`;
        }
    }
    
    const relatedGallery = portfolioData.gallery.filter(a => a.title !== rawTitle);
    const relatedProjects = portfolioData.projects.filter(p => p.title !== rawTitle && !p.title.startsWith('Proyecto 0'));
    
    let relatedHtml = '';
    
    if (isGallery) {
        relatedHtml += buildRelatedSection('OTHER GALLERY:', relatedGallery, true);
        relatedHtml += buildRelatedSection('OTHER PROJECTS:', relatedProjects, false);
    } else {
        relatedHtml += buildRelatedSection('OTHER PROJECTS:', relatedProjects, false);
        relatedHtml += buildRelatedSection('OTHER GALLERY:', relatedGallery, true);
    }
    
    document.getElementById('related-sections').innerHTML = relatedHtml;
}
