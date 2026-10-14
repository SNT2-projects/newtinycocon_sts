<script lang="ts">
  // Fonction pour rediriger vers une URL
  function goTo(url: string) {
    window.location.href = url;
  }

  // Fonction pour soumettre le formulaire Dialog Insight
  function submitForm() {
    // Vérifier si l'objet DI existe dans le contexte global
    if (typeof window !== 'undefined' && 'DI' in window) {
      // @ts-ignore - DI est un objet global non typé
      const form = window.DI.Forms.Optin.Client.GetOptinForm('DIForm_1390_775');
      if (form && typeof form.Submit === 'function') {
        form.Submit();
      }
    }
    return false;
  }

  // Ouvre le panneau de consentement Didomi s'il est chargé sur la page
  function showCookiePreferences() {
    // @ts-ignore - Didomi est un objet global non typé
    window.Didomi?.preferences.show();
  }

  // Ouvre un lien externe dans un nouvel onglet
  function openNew(url: string) {
    window.open(url, '_blank');
  }

  // Accordéon des colonnes du footer (mobile)
  function toggleColumn(event: MouseEvent) {
    (event.currentTarget as HTMLElement).parentElement?.classList.toggle('is-open');
  }

  // Date pour le copyright
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <!-- Contenu principal du footer -->
  <div class="footer-main">
    <div class="footer-container">
      <div class="footer-columns">
        <!-- Colonne Univers produit -->
        <div class="footer-column">
          <span class="foot_menu_group" on:click={toggleColumn}>Univers produit</span>
          <ul>
            <li on:click={() => goTo('https://www.studiosport.fr/drones-modelisme-c-30.html')}>Drones</li>
            <li on:click={() => goTo('https://www.studiosport.fr/dji/')}>Drones DJI</li>
            <li on:click={() => goTo('https://www.studiosport.fr/drones-racer-m60281.html')}>Drones FPV</li>
            <li on:click={() => goTo('https://www.studiosport.fr/appareils-photo-c2476.html')}>Appareils photo &amp; caméras vidéo</li>
            <li on:click={() => goTo('https://www.studiosport.fr/cameras/cameras-sport-et-360-c4358.html')}>Caméras sport &amp; 360</li>
            <li on:click={() => goTo('https://www.studiosport.fr/stabilisateurs-pour-cameras-et-smartphone.html')}>Stabilisateurs</li>
            <li on:click={() => goTo('https://www.studiosport.fr/accessoires-fixations-accessoires-audio-c-25_274.html')}>Microphones</li>
            <li on:click={() => goTo('https://www.studiosport.fr/accessoires-c4457.html')}>Tous les accessoires</li>
            <li on:click={() => goTo('https://www.studiosport.fr/marques-m60682.html')}>Toutes nos marques</li>
          </ul>
        </div>

        <!-- Colonne Pages pratiques -->
        <div class="footer-column">
          <span class="foot_menu_group" on:click={toggleColumn}>Pages pratiques</span>
          <ul>
            <li on:click={() => goTo('https://www.studiosport.fr/nos-guides-dachat-m60387.html')}>Guides d'achat</li>
            <li on:click={() => goTo('https://www.studiosport.fr/foire-aux-questions-faq-m62960.html')}>Foire aux questions (F.A.Q)</li>
            <li on:click={() => goTo('https://www.studiosport.fr/nos-horaires-et-coordonnees-m10016.html')}>Horaires &amp; cordonnées</li>
            <li on:click={() => goTo('https://www.studiosport.fr/atelier-sav-reparation-drone.html')}>Service après vente (S.A.V)</li>
            <li on:click={() => goTo('https://support.studiosport.fr/')}>Contact</li>
            <li on:click={() => goTo('https://www.studiosport.fr/expeditions-et-retours.html')}>Livraison &amp; retours</li>
            <li on:click={() => goTo('https://www.studiosport.fr/modes-paiements.html')}>Paiement</li>
            <li on:click={() => goTo('https://www.studiosport.fr/devis-drone-camera-m60647.html')}>Demander un devis</li>
            <li on:click={() => goTo('https://www.studiosport.fr/securite-des-donnees-studiosport-m64254.html')}>Sécurité des données</li>
          </ul>
        </div>

        <!-- Colonne Groupe studioSPORT -->
        <div class="footer-column">
          <span class="foot_menu_group" on:click={toggleColumn}>Groupe studioSPORT</span>
          <ul>
            <li on:click={() => goTo('https://www.studiosport.fr/qui-sommes-nous.html')}>Qui sommes-nous ?</li>
            <li on:click={() => goTo('https://www.studiosport.fr/rejoindre-notre-equipe-m60562.html')}>Rejoindre l'équipe</li>
            <li on:click={() => goTo('https://www.studiosport.fr/nos-boutiques-m66733.html')}>Nos boutiques en France</li>
            <li on:click={() => goTo('https://www.studiosport.fr/boutique-studiosport-boulogne-billancourt-m66598.html')}>Boutique studioSPORT Boulogne Billancourt</li>
            <li on:click={() => goTo('https://www.studiosport.fr/drones-fpv/atelier-fpv-studiosport-c2403.html')}>L’Atelier FPV studioSPORT</li>
            <li on:click={() => goTo('https://www.studiosport.fr/conception-recherche-montage.html')}>Bureau d’études ABOT</li>
            <li on:click={() => goTo('https://www.studiosport.fr/avis-client-studiosport.html')}>Avis clients</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Logo et réseaux sociaux -->
  <div class="footer-social">
    <div class="footer-social-wrapper">
      <div>
        <img
        width="240" height="70"
        src="https://www.studiosport.fr/upload/image/-image-278536-grande.png?1751553812"
        alt="Logo studioSPORT"
        class="footer-logo"
      />
      </div>
      <div class="right">
        <div class="social-links">
          <span class="social-link" role="link" tabindex="0" title="Facebook" on:click={() => openNew('https://www.facebook.com/studiosport.fr/')}>
             <i class="fa fa-facebook-square"></i>
          </span>
          <span class="social-link" role="link" tabindex="0" title="Instagram" on:click={() => openNew('https://www.instagram.com/studiosport.fr/?hl=fr')}>
             <i class="fa fa-instagram"></i>
          </span>
          <span class="social-link" role="link" tabindex="0" title="TikTok" on:click={() => openNew('https://www.tiktok.com/@studiosport.fr')}>
             <img width="32" height="32" src="https://www.studiosport.fr/upload/image/-image-278534-grande.png?1751553790" alt="TikTok">
          </span>
          <span class="social-link" role="link" tabindex="0" title="YouTube" on:click={() => openNew('https://www.youtube.com/@StudiosportFr/videos')}>
             <i class="fa fa-youtube-play"></i>
          </span>
          <span class="social-link" role="link" tabindex="0" title="X" on:click={() => openNew('https://x.com/studiosport_fr')}>
             <img width="32" height="32" src="https://www.studiosport.fr/upload/image/-image-278535-grande.png?1751553801" alt="X">
          </span>
          <span class="social-link" role="link" tabindex="0" title="LinkedIn" on:click={() => openNew('https://www.linkedin.com/company/studiosport')}>
             <i class="fa fa-linkedin"></i>
          </span>
        </div>
        <p class="community-text">Rejoignez notre communauté de passionnés de drones et caméras</p>
      </div>
    </div>
  </div>

  <!-- Footer légal -->
  <div class="footer-legal">
    <div class="footer-legal-container">
      <div class="legal-links">
        <span class="legal-link" on:click={() => goTo('https://www.studiosport.fr/plan-du-site.html')}>Plan du site</span>
        <span class="legal-sep">|</span>
        <span class="legal-link" on:click={() => goTo('https://www.studiosport.fr/mentions-legales.html')}>Mentions légales</span>
        <span class="legal-sep">|</span>
        <span class="legal-link" on:click={() => goTo('https://www.studiosport.fr/mentions-legales.html')}>Politique de confidentialité</span>
        <span class="legal-sep">|</span>
        <span class="legal-link" on:click={showCookiePreferences}>Cookies</span>
        <span class="legal-sep">|</span>
        <span class="legal-link" on:click={() => goTo('https://www.studiosport.fr/conditions-generales-de-vente.html')}>Conditions Générales de Vente</span>
      </div>
      <div class="legal-info">
        <p>Entreprise certifiée ISO 9001 - SIRET : 49504913200105 - TVA IntraComm : FR02495049132 - © studioSPORT 2007-{currentYear}</p>
      </div>
      <div class="legal-partner">
        <p><span on:click={() => window.open('https://www.oasis-projet.com', '_blank')}>Propulsé par</span> - <span on:click={() => window.open('https://www.oasis-commerce.com', '_blank')}>OASIS Commerce</span></p>
      </div>
    </div>
  </div>
</footer>

