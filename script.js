document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            loadSkills(data.skills);
            loadProjects(data.projects);
        })
        .catch(error => console.error('Error cargando el JSON:', error));
});

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

function loadProjects(projects) {
    const container = document.getElementById('projects-container');
    projects.forEach(project => {
        const rolesHtml = project.roles.map(role => `<span class="role-tag">${role}</span>`).join('');
        
        // Verifica si hay imagen, de lo contrario muestra el placeholder text
        const imgContent = project.image 
            ? `<img src="${project.image}" alt="${project.title}" style="width:100%; height:100%; object-fit:cover;">` 
            : `Landscape Placeholder`;
            
        // Creamos un link <a> envolviendo la tarjeta para abrir la pestaña placeholder
        const linkUrl = `project-placeholder.html?title=${encodeURIComponent(project.title)}`;
        
        const cardHtml = `
            <a href="${linkUrl}" class="project-card">
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
