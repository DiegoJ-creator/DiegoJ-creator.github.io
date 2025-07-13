// Función para aplicar el tema
function applyTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark'; // 'dark' por defecto si no hay nada guardado
    document.documentElement.setAttribute('data-theme', currentTheme);
}

// Llama a la función applyTheme inmediatamente cuando el script se carga.
applyTheme();


// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el resto del script
document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. INICIALIZACIÓN DE LIBRERÍAS ===== //
    AOS.init({
        duration: 800, // Duración de la animación en ms
        once: true,    // La animación solo ocurre una vez
        offset: 50,    // Se activa 50px antes de que el elemento sea visible
    });

    // ===== 2. PRELOADER / PANTALLA DE CARGA ===== //
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        });
    }

    // ===== 3. BOTÓN PARA VOLVER ARRIBA ===== //
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== 4. CAMBIADOR DE TEMA (MODO OSCURO / CLARO) ===== //
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme); // Guarda la preferencia del usuario
        });
    }

    // ===== 5. BUSCADOR INTERACTIVO DE COMPONENTES ===== //
    const buscador = document.getElementById('buscador');
    const tarjetas = document.querySelectorAll('.componente-card');

    if (buscador && tarjetas.length > 0) {
        buscador.addEventListener('keyup', (e) => {
            const terminoBusqueda = e.target.value.toLowerCase().trim();

            tarjetas.forEach(tarjeta => {
                const nombreComponente = tarjeta.dataset.nombre.toLowerCase();
                if (nombreComponente.includes(terminoBusqueda)) {
                    tarjeta.style.display = 'block';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    }

    // ===== 6. SISTEMA DE PESTAÑAS PARA PÁGINAS DE COMPONENTES ===== //
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabLinks.length > 0) {
        // Asegúrate de que al menos una pestaña esté activa al cargar
        if (document.querySelector('.tab-pane.active') === null) {
            if (tabLinks[0]) {
                tabLinks[0].classList.add('active');
                document.getElementById(tabLinks[0].dataset.tab).classList.add('active');
            }
        }

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.dataset.tab;

                tabPanes.forEach(pane => pane.classList.remove('active'));
                tabLinks.forEach(l => l.classList.remove('active'));

                const activePane = document.getElementById(tabId);
                link.classList.add('active');
                activePane.classList.add('active');
            });
        });
    }

    // ===== 7. LÓGICA DE CARGA DE IMÁGENES PARA EL HERO SECTION ===== //
    const backgroundSlider = document.querySelector('.background-slider');
    
    // Tus imágenes locales
    const imageUrls = [
        "imagenes/com.jpg",
        "imagenes/com1.jpg",
        "imagenes/pro.jpg",
        "imagenes/armando.jpg",
        "imagenes/des.jpg",
        "imagenes/gpu.jpg",
    ];

    // Guarda el número de imágenes originales para el cálculo CSS
    const originalImageCount = imageUrls.length;

    // Duplica las imágenes para crear un bucle continuo sin saltos visibles
    const doubledImageUrls = [...imageUrls, ...imageUrls];
    
    // Asegura que el slider esté vacío antes de añadir imágenes
    backgroundSlider.innerHTML = ''; 

    doubledImageUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = "Fondo animado de componentes"; // Texto alt descriptivo
        backgroundSlider.appendChild(img);
    });

    // Calcula el número total de imágenes en el slider después de duplicarlas
    const totalImagesInSlider = doubledImageUrls.length;

    // Establece las propiedades CSS como variables directamente en el elemento root (html)
    // Esto permite que el CSS use estos valores dinámicamente
    document.documentElement.style.setProperty('--original-image-count', originalImageCount);
    document.documentElement.style.setProperty('--total-slider-images', totalImagesInSlider);

    // Define la duración de la animación aquí. Cuanto menor el número, más rápido el movimiento.
    // Prueba con 10 o 15 para un movimiento rápido. 
    // Lo multiplico por 'originalImageCount' para que el tiempo sea proporcional
    // a la cantidad de imágenes que deben pasar en un ciclo completo.
    const animationSpeedMultiplier = 5; // Ajusta este valor para controlar la velocidad
    const animationDuration = animationSpeedMultiplier * originalImageCount; // Por ejemplo, 5 segundos por cada imagen original
    document.documentElement.style.setProperty('--animation-duration', `${animationDuration}s`);


    // ===== 8. ANIMACIÓN DE TEXTO DINÁMICO EN EL HERO ===== //
    const dynamicTextElement = document.getElementById('dynamic-text');
    if (dynamicTextElement) {
        const textOptions = [
            "Descubre el Poder del Hardware",
            "Tu Guía Definitiva de Componentes",
            "PC Gamer o Laptop Profesional",
            "Diagnóstico y Soluciones Rápidas",
            "Innovación al Alcance de tus Manos" 
        ];
        let textIndex = 0;
        let charIndex = 0;
        const typingSpeed = 100; // ms por caracter
        const deletingSpeed = 50; // ms por caracter al borrar
        const delayBetweenTexts = 2000; // ms de espera entre textos

        function typeText() {
            // Añade la clase para la animación del cursor
            dynamicTextElement.classList.add('typing-active');

            if (charIndex < textOptions[textIndex].length) {
                dynamicTextElement.textContent += textOptions[textIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeText, typingSpeed);
            } else {
                // Texto completo, espera y luego borra
                // Remueve la clase del cursor después de terminar de escribir
                dynamicTextElement.classList.remove('typing-active');
                setTimeout(deleteText, delayBetweenTexts);
            }
        }

        function deleteText() {
            // Vuelve a añadir la clase para la animación del cursor mientras borra
            dynamicTextElement.classList.add('typing-active');
            
            if (charIndex > 0) {
                dynamicTextElement.textContent = textOptions[textIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(deleteText, deletingSpeed);
            } else {
                // Texto borrado, pasa al siguiente y comienza a escribir
                textIndex = (textIndex + 1) % textOptions.length;
                // Remueve la clase del cursor un momento antes de volver a escribir
                dynamicTextElement.classList.remove('typing-active');
                setTimeout(typeText, typingSpeed);
            }
        }

        // Inicia la animación al cargar la página
        typeText();
    }

}); // Fin del evento DOMContentLoaded