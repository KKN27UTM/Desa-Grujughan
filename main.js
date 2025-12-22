/**
 * 1. FUNGSI LOAD KOMPONEN (NAVBAR & FOOTER)
 * Diperbaiki untuk menangani perbedaan path di GitHub Pages & Local
 */
function loadComponent(elementId, filePath) {
    // Hapus tanda '/' di awal jika ada untuk memudahkan pengolahan path
    let cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    // Logika penentuan path relatif
    let finalPath = '';
    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    
    if (isLocal) {
        // Jika di Local (VS Code Live Server), gunakan path absolut
        finalPath = '/' + cleanPath;
    } else {
        // Jika di GitHub Pages, kita gunakan path relatif terhadap lokasi file saat ini
        // Kita cek apakah kita berada di subfolder (seperti /profile/index.html)
        const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
        
        // Asumsi struktur GitHub Pages: /nama-repo/folder/index.html
        // Jika segments > 1, berarti kita ada di subfolder
        if (pathSegments.length > 1 && !window.location.pathname.endsWith(pathSegments[0] + '/')) {
             finalPath = '../' + cleanPath;
        } else {
             finalPath = cleanPath;
        }
    }

    fetch(finalPath)
        .then(response => {
            if (!response.ok) throw new Error("Gagal memuat " + finalPath);
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            
            if(elementId === 'nav-placeholder') {
                setActiveNavLink(); 
                initNavbarFunctions(); 
            }
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
        
        // Cek jika link adalah Beranda (/)
        const isHome = currentPath.endsWith('/') || currentPath.endsWith('index.html');
        
        if (linkPath === '/' && isHome) {
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

    if (!nav) return; // Guard clause jika navbar belum dimuat

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    window.toggleMenu = function() {
        if (navLinks) navLinks.classList.toggle('active');
    };
}

/**
 * 4. FUNGSI ACCORDION
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
 * 5. FUNGSI IMAGE VIEWER
 */
function initImageViewer() {
    const modal = document.getElementById("imageViewer");
    const modalImg = document.getElementById("fullImage");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-viewer");

    if (!modal) return;

    document.querySelectorAll('img:not(.logo-img)').forEach(image => {
        image.style.cursor = "zoom-in";
        image.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            if (captionText) captionText.innerHTML = this.alt;
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
 * 6. EKSEKUSI
 */
document.addEventListener('DOMContentLoaded', function() {
    // Panggil tanpa tanda '/' di depan agar ditangani logika finalPath
    loadComponent('nav-placeholder', 'navbar.html');
    loadComponent('footer-placeholder', 'footer.html');
});