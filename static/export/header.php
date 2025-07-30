<header class="modern-header">
  <!-- Bandeau défilant -->
  <div class="scrolling-banner">
    <div class="scrolling-banner-content" onmouseenter="this.style.animationPlayState='paused'" onmouseleave="this.style.animationPlayState='running'">
      <span class="banner-item">
        <span class="trustpilot-stars">★★★★★</span> Trustpilot
      </span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Stock en temps réel</span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Revendeur DJI N°1 en France</span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Livraison offerte dès 49€ d'achat</span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Expédition le jour même</span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Paiement en 3/4/10x jusqu'à 5000€</span>
    </div>
  </div>

  <!-- Header principal -->
  <div class="main-header">
    <div class="header-container">
      <!-- Menu burger mobile -->
      <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Logo -->
      <div class="logo-section">
        <img 
          onclick="window.location.href='https://www.studiosport.fr/';" 
          src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/logo/logo_header_1.png?1751546046" 
          alt="Logo studioSPORT" 
          class="logo"
        />
      </div>

      <!-- Barre de recherche -->
      <div class="search-section">
        <form action="https://www.studiosport.fr/dhtml/resultat_recherche.php" method="get" class="search-form">
          <input 
            name="keywords" 
            type="text" 
            maxlength="255" 
            placeholder="Rechercher un produit, une marque..." 
            class="search-input"
            autocomplete="off"
            data-positional="{&quot;on_right_side&quot;:false,&quot;left_side&quot;:605.6000366210938,&quot;right_side&quot;:865.6000366210938}"
          />
          <button type="submit" class="search-btn" aria-label="Rechercher">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </form>
      </div>

      <!-- Actions utilisateur -->
      <div class="user-actions">
        <button class="action-btn" onclick="window.location.href='http://support.studiosport.fr/';" aria-label="Contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="action-label">Contact</span>
        </button>
        
        <button class="action-btn" onclick="window.location.href='https://www.studiosport.fr/';" aria-label="Boutiques">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span class="action-label">Boutiques</span>
        </button>
        
        <button class="action-btn" onclick="window.location.href='https://www.studiosport.fr/dhtml/compte.php';" aria-label="Compte">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="action-label">Compte</span>
        </button>
        
        <button class="action-btn cart-btn" onclick="window.location.href='https://www.studiosport.fr/dhtml/panier.php';" aria-label="Panier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-badge">0</span>
          <span class="action-label">Panier</span>
        </button>
      </div>
         </div>
      </div>

  <!-- Navigation principale -->
  <nav class="main-nav">
    <div class="nav-container">
      <ul class="nav-list">
        <li><a href="https://www.studiosport.fr/drones-modelisme-c-30.html">DRONES</a></li>
        <li><a href="https://www.studiosport.fr/drones-racer-m60281.html">DRONES FPV</a></li>
        <li><a href="https://www.studiosport.fr/materiel-professionnel-drones-et-cameras-m60358.html">DRONES PRO</a></li>
        <li><a href="https://www.studiosport.fr/univers-cameras/">CAMÉRAS</a></li>
        <li><a href="https://www.studiosport.fr/cameras/dslr-et-hybrides-c2476.html">APPAREILS PHOTO</a></li>
        <li><a href="https://www.studiosport.fr/stabilisateurs-pour-cameras-et-smartphone-m60585.html">STABILISATEURS</a></li>
        <li><a href="https://www.studiosport.fr/batteries-nomades-c3598.html">BATTERIES NOMADES</a></li>
        <li><a href="https://www.studiosport.fr/les-promotions-du-moment-m61245.html" class="promo-btn">PROMOS</a></li>
        <li><a href="https://www.studiosport.fr/toutes-nos-nouveautes/" class="nouveau-btn">NOUVEAU</a></li>
        <li><a href="https://www.studiosport.fr/marques-m60682.html">MARQUES</a></li>
        <li><a href="https://www.studiosport.fr/drones-modelisme-multirotors-dji-c-30_360.html">DJI</a></li>
      </ul>
    </div>
  </nav>

  <!-- Menu mobile overlay -->
  <div id="mobile-menu-overlay" class="mobile-menu-overlay" style="display: none;" onclick="toggleMobileMenu()">
    <div class="mobile-menu-content" onclick="event.stopPropagation()">
      <div class="mobile-menu-header">
        <h2>studioSPORT</h2>
        <button class="close-btn" onclick="toggleMobileMenu()" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="mobile-menu-list">
        <a href="https://www.studiosport.fr/drones-modelisme-c-30.html" class="mobile-menu-item">
          Drones
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/drones-racer-m60281.html" class="mobile-menu-item">
          Drones FPV
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/materiel-professionnel-drones-et-cameras-m60358.html" class="mobile-menu-item">
          Drones Pro
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/univers-cameras/" class="mobile-menu-item">
          Caméras
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/cameras/dslr-et-hybrides-c2476.html" class="mobile-menu-item">
          Appareils photo
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/stabilisateurs-pour-cameras-et-smartphone-m60585.html" class="mobile-menu-item">
          Stabilisateurs
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/batteries-nomades-c3598.html" class="mobile-menu-item">
          Batteries nomades
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/les-promotions-du-moment-m61245.html" class="mobile-menu-item">
          Promos
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/toutes-nos-nouveautes/" class="mobile-menu-item">
          Nouveau
        </a>
        <a href="https://www.studiosport.fr/marques-m60682.html" class="mobile-menu-item">
          Marques
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="https://www.studiosport.fr/drones-modelisme-multirotors-dji-c-30_360.html" class="mobile-menu-item">
          DJI
        </a>
         </div>
      
      <div class="mobile-menu-footer">
        <a href="https://www.studiosport.fr/dhtml/compte.php" class="mobile-menu-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Compte
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </a>
        <a href="#" class="mobile-menu-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Favoris (0)
        </a>
        <div class="mobile-contact">
          <p><strong>02 35 00 30 00</strong></p>
          <p>Du lundi au vendredi, de 8h à 18h</p>
          <a href="#">Voir nos boutiques</a>
            </div>
         </div>
      </div>
   </div>
</header>

<script>
function toggleMobileMenu() {
  var overlay = document.getElementById('mobile-menu-overlay');
  if (overlay.style.display === 'none' || overlay.style.display === '') {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } else {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}
</script>