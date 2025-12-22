/**
 * 1. FUNGSI LOAD KOMPONEN (NAVBAR & FOOTER)
 */
function loadComponent(elementId, filePath) {
    const rootPath = filePath.startsWith('/') ? filePath : '/' + filePath;

    fetch(rootPath)
        .then(response => {
            if (!response.ok) throw new Error("Gagal memuat " + rootPath);
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            
            if(elementId === 'nav-placeholder') {
                setActiveNavLink(); 
                initNavbarFunctions(); 
            }
            // Inisialisasi ulang image viewer agar gambar di nav/footer juga bisa di-klik
            initImageViewer();
        })
        .catch(error => console.error(error));
}

/**
 * 2. NAVIGASI AKTIF OTOMATIS
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === '/' && (currentPath === '/' || currentPath === '/index.html')) {
            link.classList.add('active');
        } else if (linkPath !== '/' && currentPath.includes(linkPath)) {
            link.classList.add('active');
        }
    });
}

/**
 * 3. FUNGSI NAVBAR (SCROLL & TOGGLE)
 */
function initNavbarFunctions() {
    const nav = document.getElementById('navbar');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Toggle Menu Mobile
    window.toggleMenu = function() {
        if (navLinks) navLinks.classList.toggle('active');
    };
}

/**
 * 4. FUNGSI ACCORDION (UNTUK KKN)
 */
function toggleAccordion(element) {
    const item = element.parentElement;
    item.classList.toggle('active');
    
    const icon = element.querySelector('.arrow-toggle');
    if (item.classList.contains('active')) {
        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    } else {
        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    }
}

/**
 * 5. FUNGSI IMAGE VIEWER (MODAL ZOOM)
 */
function initImageViewer() {
    const modal = document.getElementById("imageViewer");
    const modalImg = document.getElementById("fullImage");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-viewer");

    if (!modal) return; // Berhenti jika modal tidak ada di halaman

    // Untuk gambar umum
    document.querySelectorAll('img:not(.gallery-item img):not(.logo-img)').forEach(image => {
        image.style.cursor = "zoom-in";
        image.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            if (captionText) captionText.innerHTML = this.alt;
        }
    });

    // Untuk Gallery
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.cursor = "zoom-in";
        item.onclick = function() {
            const img = this.querySelector('img');
            modal.style.display = "block";
            modalImg.src = img.src;
            if (captionText) captionText.innerHTML = img.alt;
        }
    });

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }
}

/**
 * 6. EKSEKUSI SAAT HALAMAN DIMUAT
 */
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('nav-placeholder', '/navbar.html');
    loadComponent('footer-placeholder', '/footer.html');
    initImageViewer();
});