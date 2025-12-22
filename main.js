/**
 * 1. FUNGSI LOAD KOMPONEN (NAVBAR & FOOTER) - PERBAIKAN PATH
 */
function loadComponent(elementId, filePath) {
    // Menghapus '/' di depan agar menjadi path relatif
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    // Logika penyesuaian path agar jalan di Local maupun GitHub Pages
    let finalPath = '';
    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    
    if (isLocal) {
        // Jika local, gunakan root path
        finalPath = '/' + cleanPath;
    } else {
        // Jika di GitHub Pages, hitung kedalaman folder
        const pathArray = window.location.pathname.split('/');
        // Jika berada di subfolder (seperti /profile/), tambahkan '../'
        if (pathArray.length > 3 || (pathArray.length === 3 && pathArray[2] !== "")) {
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
        // Mendapatkan nama file terakhir dari path
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

    if (!nav) return;

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
 * 6. EKSEKUSI SAAT HALAMAN DIMUAT
 */
document.addEventListener('DOMContentLoaded', function() {
    // Memanggil tanpa '/' di depan agar ditangani oleh logika finalPath
    loadComponent('nav-placeholder', 'navbar.html');
    loadComponent('footer-placeholder', 'footer.html');
});