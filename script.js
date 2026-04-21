document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const filterSelect = document.getElementById("filter");
    const tableBody = document.querySelector("#table tbody");
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    const noResultsMsg = document.getElementById("no-results");
    const table = document.getElementById("table");
    initEnterlabBackground();

    // ==========================================
// MOTOR DE PARTÍCULAS ENTERLAB (BG-CORE)
// ==========================================
function initEnterlabBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Crear Geometría de Partículas
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1500; // Cantidad de puntos
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material estilo "Cyan Enterlab"
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x00f2ff, 
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animación y Movimiento
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        // Rotación constante sutil
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Reacción suave al mouse
        particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

    // --- FUNCIÓN 1: FILTRO Y BÚSQUEDA COMBINADOS ---
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filterValue = filterSelect.value;
        let visibleCount = 0;

        rows.forEach(row => {
            // Extraer el texto completo de la fila para una búsqueda global
            const rowText = row.innerText.toLowerCase();
            const type = row.dataset.type;

            const matchesSearch = rowText.includes(searchTerm);
            const matchesType = (filterValue === "all") || (type === filterValue);

            if (matchesSearch && matchesType) {
                row.classList.remove("hidden");
                // Pequeña animación de entrada
                row.style.opacity = "0";
                setTimeout(() => row.style.opacity = "1", 50);
                visibleCount++;
            } else {
                row.classList.add("hidden");
            }
        });

        // Mostrar mensaje si no hay resultados
        if (visibleCount === 0) {
            noResultsMsg.classList.remove("hidden");
            table.classList.add("hidden");
        } else {
            noResultsMsg.classList.add("hidden");
            table.classList.remove("hidden");
        }
    }

    // --- FUNCIÓN 2: ORDENAR COLUMNAS AL HACER CLIC ---
    document.querySelectorAll("th").forEach(header => {
        header.addEventListener("click", () => {
            const index = Array.from(header.parentElement.children).indexOf(header);
            // Solo permitimos ordenar las dos primeras columnas para evitar errores de contexto
            if (index > 1) return; 

            const isAscending = header.classList.contains("asc");
            const direction = isAscending ? -1 : 1;

            // Limpiar clases de otras cabeceras
            document.querySelectorAll("th").forEach(th => th.classList.remove("asc", "desc"));
            header.classList.add(isAscending ? "desc" : "asc");

            rows.sort((a, b) => {
                const aText = a.children[index].innerText.trim();
                const bText = b.children[index].innerText.trim();
                return aText.localeCompare(bText) * direction;
            });

            // Re-renderizar filas ordenadas
            rows.forEach(row => tableBody.appendChild(row));
        });
    });

    // Event Listeners
    searchInput.addEventListener("input", filterTable);
    filterSelect.addEventListener("change", filterTable);

    // Animación inicial en cascada
    rows.forEach((row, index) => {
        row.style.opacity = "0";
        row.style.transform = "translateY(10px)";
        row.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        setTimeout(() => {
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
        }, 100 * index);
    });
});
