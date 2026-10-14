<script lang="ts">
  // État du menu mobile et de la recherche mobile
  let isMobileMenuOpen = false;
  let isSearchOpen = false;

  // Fonction pour rediriger vers une URL
  function goTo(url: string) {
    window.location.href = url;
  }

  // Fonction pour basculer le menu mobile
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  }

  // Affiche / masque la barre de recherche sur mobile
  function toggleSearch() {
    isSearchOpen = !isSearchOpen;
  }
</script>

<header class="modern-header" class:search-open={isSearchOpen}>
  <!-- Bandeau informatif -->
  <div class="info-banner">
    <div class="banner-track">
      <div class="banner-group">
        <span class="banner-item">Stock en temps réel</span>
        <span class="banner-item">Revendeur DJI N°1 en France</span>
        <span class="banner-item">Livraison offerte dès 49€ d'achat</span>
        <span class="banner-item">Expédition le jour même</span>
        <span class="banner-item">Paiement en x3 / x4 / x10 via ALMA</span>
        <span class="banner-item">Service client et entrepôts en France</span>
      </div>
      <div class="banner-group" aria-hidden="true">
        <span class="banner-item">Stock en temps réel</span>
        <span class="banner-item">Revendeur DJI N°1 en France</span>
        <span class="banner-item">Livraison offerte dès 49€ d'achat</span>
        <span class="banner-item">Expédition le jour même</span>
        <span class="banner-item">Paiement en x3 / x4 / x10 via ALMA</span>
        <span class="banner-item">Service client et entrepôts en France</span>
      </div>
      <div class="banner-group" aria-hidden="true">
        <span class="banner-item">Stock en temps réel</span>
        <span class="banner-item">Revendeur DJI N°1 en France</span>
        <span class="banner-item">Livraison offerte dès 49€ d'achat</span>
        <span class="banner-item">Expédition le jour même</span>
        <span class="banner-item">Paiement en x3 / x4 / x10 via ALMA</span>
        <span class="banner-item">Service client et entrepôts en France</span>
      </div>
    </div>
  </div>

  <!-- Header principal -->
  <div class="hd-main">
    <div class="hd-main-inner">
      <button type="button" class="hd-burger" on:click={toggleMobileMenu} aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <a class="hd-logo" href="https://www.studiosport.fr/">
        <img class="hd-logo-desktop" width="250" height="74" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/logo/logo_header_1.webp?v=1781474902" alt="Logo studioSPORT">
        <img class="hd-logo-mobile" width="124" height="40" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/logo/logo_mobile_1.webp?v=1781474907" alt="Logo studioSPORT">
      </a>

      <form class="hd-search" action="https://www.studiosport.fr/dhtml/resultat_recherche.php" method="get" role="search">
        <input name="keywords" type="text" maxlength="255" placeholder="Rechercher un produit, une marque..." autocomplete="off" aria-label="Rechercher un produit, une marque">
        <button type="submit" aria-label="Rechercher">
          <img width="24" height="24" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/public/btn-recherche.webp?v=1751546046" alt="">
        </button>
      </form>

      <div class="hd-actions">
        <button type="button" class="hd-action hd-search-toggle" on:click={toggleSearch} aria-label="Rechercher">
          <img width="30" height="30" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/public/btn-recherche.webp?v=1751546046" alt="">
        </button>

        <div class="hd-action-wrap contact-dropdown">
          <button type="button" class="hd-action" on:click={() => goTo('https://support.studiosport.fr/')} aria-label="Contact">
            <img width="40" height="40" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/client/picto-contact.png" alt="">
            <span class="hd-label">Contact</span>
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
                <button class="contact-btn" on:click={() => goTo('https://support.studiosport.fr/')}>
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

        <a class="hd-action hd-desktop-only" href="https://www.studiosport.fr/nos-boutiques-m66733.html">
          <img width="40" height="40" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/client/picto-boutiques.png" alt="">
          <span class="hd-label">Boutiques</span>
        </a>

        <a class="hd-action hd-desktop-only" href="https://www.studiosport.fr/dhtml/acces.php">
          <img width="40" height="40" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/public/picto-compte.webp?v=1751546046" alt="">
          <span class="hd-label">Compte</span>
        </a>

        <a class="hd-action" href="https://www.studiosport.fr/dhtml/panier.php">
          <span class="hd-picto">
            <img width="40" height="40" src="https://www.studiosport.fr/themes/html_responsive/modeles/82/img/public/picto-panier.webp?v=1751546046" alt="">
            <span class="hd-badge">0</span>
          </span>
          <span class="hd-label">Panier</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Navigation principale -->
  <nav class="hd-nav" aria-label="Navigation principale">
    <ul>
        <li><a href="https://www.studiosport.fr/drones-modelisme-c-30.html">Drones</a></li>
        <li><a href="https://www.studiosport.fr/dji/">Drones DJI</a></li>
        <li><a href="https://www.studiosport.fr/drones-racer-m60281.html">Drones FPV</a></li>
        <li><a href="https://www.studiosport.fr/univers-cameras/">Caméras</a></li>
        <li><a href="https://www.studiosport.fr/appareils-photo-c2476.html">Appareils photo</a></li>
        <li><a href="https://www.studiosport.fr/stabilisateurs-pour-cameras-et-smartphone.html">Stabilisateurs</a></li>
        <li><a href="https://www.studiosport.fr/accessoires-fixations-accessoires-audio-c-25_274.html">Microphones</a></li>
        <li><a href="https://www.studiosport.fr/accessoires-c4457.html">Accessoires</a></li>
        <li><a href="https://www.studiosport.fr/marques-m60682.html" class="hd-pill hd-pill-grey">Marques</a></li>
        <li><a href="https://www.studiosport.fr/toutes-nos-nouveautes/" class="hd-pill hd-pill-blue">Nouveau</a></li>
        <li><a href="https://www.studiosport.fr/les-promotions-du-moment-m61245.html" class="hd-pill hd-pill-orange">Promos</a></li>
    </ul>
  </nav>

  <!-- Menu mobile -->
  <div class="hd-menu-overlay" class:is-open={isMobileMenuOpen} on:click|self={toggleMobileMenu}>
    <div class="hd-menu">
      <div class="hd-menu-head">
        <span>studioSPORT</span>
        <button type="button" class="hd-menu-close" on:click={toggleMobileMenu} aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <ul class="hd-menu-list">
        <li><a href="https://www.studiosport.fr/drones-modelisme-c-30.html" class="hd-menu-link has-sub">Drones</a></li>
        <li><a href="https://www.studiosport.fr/dji/" class="hd-menu-link has-sub">Drones DJI</a></li>
        <li><a href="https://www.studiosport.fr/drones-racer-m60281.html" class="hd-menu-link has-sub">Drones FPV</a></li>
        <li><a href="https://www.studiosport.fr/univers-cameras/" class="hd-menu-link has-sub">Caméras</a></li>
        <li><a href="https://www.studiosport.fr/appareils-photo-c2476.html" class="hd-menu-link has-sub">Appareils photo</a></li>
        <li><a href="https://www.studiosport.fr/stabilisateurs-pour-cameras-et-smartphone.html" class="hd-menu-link has-sub">Stabilisateurs</a></li>
        <li><a href="https://www.studiosport.fr/accessoires-fixations-accessoires-audio-c-25_274.html" class="hd-menu-link has-sub">Microphones</a></li>
        <li><a href="https://www.studiosport.fr/accessoires-c4457.html" class="hd-menu-link has-sub">Accessoires</a></li>
        <li><a href="https://www.studiosport.fr/marques-m60682.html" class="hd-menu-link has-sub">Marques</a></li>
        <li><a href="https://www.studiosport.fr/toutes-nos-nouveautes/" class="hd-menu-link">Nouveau</a></li>
        <li><a href="https://www.studiosport.fr/les-promotions-du-moment-m61245.html" class="hd-menu-link has-sub">Promos</a></li>
      </ul>

      <div class="hd-menu-foot">
        <a href="https://www.studiosport.fr/dhtml/acces.php" class="hd-menu-link has-sub hd-menu-account"><i class="fa fa-user" aria-hidden="true"></i>Compte</a>
        <p class="hd-menu-phone"><i class="fa fa-phone" aria-hidden="true"></i> <a href="tel:0235003000">02 35 00 30 00</a></p>
        <p class="hd-menu-hours">Du lundi au vendredi, de 8h à 18h</p>
        <a class="hd-menu-shops" href="https://www.studiosport.fr/nos-boutiques-m66733.html">Voir nos boutiques</a>
      </div>
    </div>
  </div>
</header>
