<script lang="ts">
  // État du menu mobile
  let isMobileMenuOpen = false;
  
  // Fonction pour rediriger vers une URL
  function goTo(url: string) {
    window.location.href = url;
  }
  
  // Fonction pour basculer le menu mobile
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
  
  // Données positionnelles pour la recherche
  const positionalData = {
    on_right_side: false,
    left_side: 605.6000366210938,
    right_side: 865.6000366210938
  };


</script>

<header class="modern-header">
  <!-- Bandeau informatif -->
  <div class="info-banner">
    <div class="banner-content">
      <span class="banner-item">Stock en temps réel</span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Revendeur DJI N°1 en France</span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Livraison offerte dès 49€ d'achat</span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Expédition le jour même</span>
      <span class="banner-separator">|</span>
      <span class="banner-item">Service client et entrepôts en France</span>
    </div>
  </div>

  <!-- Header principal -->
  <div class="main-header">
    <div class="header-container">
      <!-- Menu burger mobile -->
      <button class="mobile-menu-btn" on:click={toggleMobileMenu} aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Logo -->
      <div class="logo-section">
        <img 
          on:click={() => goTo('https://www.studiosport.fr/')} 
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
            data-positional={JSON.stringify(positionalData)}
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
        <div class="contact-dropdown">
          <button class="action-btn" on:click={() => goTo('http://support.studiosport.fr/')} aria-label="Contact">
            <img width="40" height="40" fetchpriority="high" decoding="sync" loading="eager" alt="contact" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/client/picto-contact.png">
            <span class="action-label">Contact</span>
          </button>
          
          <div class="contact-popup">
            <div class="contact-popup-content">
              <!-- Section Email -->
              <div class="contact-email-section">
                <div class="contact-title">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                  </svg>
                  
                  Contact email
                </div>
                <ul class="contact-services">
                  <li>Service commercial, devis & SAV</li>
                  <li>Réponse sous 24h (jours ouvrés)</li>
                </ul>
                <button class="contact-btn" on:click={() => goTo('http://support.studiosport.fr/')}>
                  Envoyer une demande
                </button>
              </div>

              <!-- Section Téléphone -->
              <div class="contact-phone-section">
                <div class="phone-number">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  02 35 00 30 00
                </div>

                <div class="service-hours">
                  <div class="service-item">
                    <span class="service-name">Service commercial :</span>
                    <span class="service-choice">Choix #1</span>
                    <span class="service-time">8h - 12h30 / 13h30 - 18h</span>
                  </div>
                  
                  <div class="service-item">
                    <span class="service-name">Service FPV & drones racers :</span>
                    <span class="service-choice">Choix #2</span>
                    <span class="service-time">8h30 - 12h / 14h - 17h30</span>
                  </div>
                  
                  <div class="service-item">
                    <span class="service-name">Service après-vente :</span>
                    <span class="service-choice">Choix #3</span>
                    <span class="service-time">9h30 - 12h30 / 13h30 - 17h</span>
                  </div>
                  
                  <div class="service-item">
                    <span class="service-name">Service administratif :</span>
                    <span class="service-choice">Choix #4</span>
                    <span class="service-time">10h - 12h30 / 13h30 - 17h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button class="action-btn" on:click={() => goTo('https://www.studiosport.fr/')} aria-label="Boutiques">
          <img width="40" height="40" fetchpriority="high" decoding="sync" loading="eager" alt="boutiques" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/client/picto-boutiques.png">
          <span class="action-label">Boutiques</span>
        </button>
        
        <button class="action-btn" on:click={() => goTo('https://www.studiosport.fr/dhtml/compte.php')} aria-label="Compte">
          <img width="40" height="40" src="https://studiosport.fr/themes/html_responsive/modeles/82/img/public/picto-compte.png" fetchpriority="high" decoding="sync" loading="eager" alt="compte">
          <span class="action-label">Compte</span>
        </button>
        
        <button class="action-btn cart-btn" on:click={() => goTo('https://www.studiosport.fr/')} aria-label="Panier">
          <img width="40" height="40" src="https://studiosport.fr/themes/html_responsive/modeles/82/img/public/picto-panier.png" fetchpriority="high" decoding="sync" loading="eager" alt="panier">
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
  {#if isMobileMenuOpen}
    <div class="mobile-menu-overlay" on:click={toggleMobileMenu}>
      <div class="mobile-menu-content" on:click|stopPropagation>
        <div class="mobile-menu-header">
          <h2>studioSPORT</h2>
          <button class="close-btn" on:click={toggleMobileMenu} aria-label="Fermer">
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
                  <a href="https://www.studiosport.fr/favoris/" class="mobile-menu-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Favoris (0)
        </a>
        <div class="mobile-contact">
          <p><strong>02 35 00 30 00</strong></p>
          <p>Du lundi au vendredi, de 8h à 18h</p>
          <a href="https://www.studiosport.fr/boutiques/">Voir nos boutiques</a>
        </div>
        </div>
      </div>
    </div>
  {/if}
</header>