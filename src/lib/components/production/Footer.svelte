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

  // Date pour le copyright
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <!-- Contenu principal du footer -->
  <div class="footer-main">
    <div class="footer-container">
      <div class="footer-columns">
        <!-- Colonne studioSPORT -->
        <div class="footer-column">
          <h3>studioSPORT</h3>
          <ul>
            <li on:click={() => goTo('https://www.studiosport.fr/qui-sommes-nous.html')}>
              L'équipe studioSPORT
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/nos-boutiques.html')}>
              Nos boutiques
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/rejoindre-notre-equipe-m60562.html')}>
              Rejoindre notre équipe
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/avis-client-studiosport.html')}>
              Nos clients parlent de nous
            </li>
            <li on:click={() => goTo('http://blog.studiosport.fr/')}>
              Le blog studioSPORT
            </li>
          </ul>
        </div>

        <!-- Colonne Services -->
        <div class="footer-column">
          <h3>Services</h3>
          <ul>
            <li on:click={() => goTo('https://www.studiosport.fr/modes-paiements.html')}>
              Paiements
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/expeditions-et-retours.html')}>
              Expéditions et retours
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/atelier-sav-reparation-drone.html')}>
              Notre Atelier SAV et réparation drone
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/demandez-un-devis-drone-ou-camera.html')}>
              Demandez un devis drone ou caméra
            </li>
          </ul>
        </div>

        <!-- Colonne Besoin d'aide -->
        <div class="footer-column">
          <h3>Besoin d'aide ?</h3>
          <ul>
            <li on:click={() => goTo('https://www.studiosport.fr/foire-aux-questions-faq-m62960.html')}>
              Foire aux questions (FAQ)
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/nos-guides-d-achat-m60387.html')}>
              Tous nos guides d'achats
            </li>
            <li on:click={() => goTo('https://support.studiosport.fr/')}>
              Nous contacter
            </li>
          </ul>
        </div>

        <!-- Colonne Marques -->
        <div class="footer-column">
          <h3>Marques</h3>
          <ul>
            <li on:click={() => goTo('https://www.studiosport.fr/dji/')}>DJI</li>
            <li on:click={() => goTo('https://www.studiosport.fr/gopro/')}>GoPro</li>
            <li on:click={() => goTo('https://www.studiosport.fr/sony/')}>Sony</li>
            <li on:click={() => goTo('https://www.studiosport.fr/canon/')}>Canon</li>
            <li on:click={() => goTo('https://www.studiosport.fr/nikon/')}>Nikon</li>
            <li on:click={() => goTo('https://www.studiosport.fr/insta360/')}>Insta360</li>
          </ul>
        </div>

        <!-- Colonne Produits -->
        <div class="footer-column">
          <h3>Produits</h3>
          <ul>
            <li on:click={() => goTo('https://www.studiosport.fr/drones-modelisme-c-30.html')}>
              Drones
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/drones-fpv/')}>
              Drones FPV
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/cameras/')}>
              Caméras
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/appareils-photo/')}>
              Appareils photo
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/stabilisateurs-camera/')}>
              Stabilisateurs caméra
            </li>
            <li on:click={() => goTo('https://www.studiosport.fr/batteries-nomades/')}>
              Batteries nomades
            </li>
          </ul>
        </div>
      </div>

      <!-- Logo et réseaux sociaux -->
      <div class="footer-social">
        <div class="flex">
          <div>
            <img
            src="https://www.studiosport.fr/upload/image/-image-278536-grande.png?1751553812"
            alt="Logo studioSPORT"
            class="footer-logo"
          />
          </div>
          <div>

            <div class="social-links">
              <a href="https://www.facebook.com/studiosportfrance" target="_blank" rel="noopener">
                <i class="fa fa-facebook-square"></i>
              </a>
              <a href="https://www.instagram.com/studiosportfrance" target="_blank" rel="noopener">
                <i class="fa fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@studiosportfrance" target="_blank" rel="noopener">
                <img width="32" height="32" src="https://www.studiosport.fr/upload/image/-image-278534-grande.png?1751553790" alt="TikTok">
              </a>
              <a href="https://www.youtube.com/studiosportfrance" target="_blank" rel="noopener">
                <i class="fa fa-youtube-play"></i>
              </a>
              <a href="https://twitter.com/studiosportfr" target="_blank" rel="noopener">
                <img width="32" height="32" src="https://www.studiosport.fr/upload/image/-image-278535-grande.png?1751553801" alt="X">
              </a>
              <a href="https://www.linkedin.com/company/studiosport" target="_blank" rel="noopener">
                <i class="fa fa-linkedin"></i>
              </a>
            </div>
            <p class="community-text">Rejoignez notre communauté de passionnés de drones et caméras</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer légal -->
  <div class="footer-legal">
    <div class="footer-legal-container">
      <div class="legal-links">
        <a href="https://www.studiosport.fr/plan-du-site.html">Plan du site</a>
        <span>|</span>
        <a href="https://www.studiosport.fr/mentions-legales.html">Mentions légales</a>
        <span>|</span>
        <a href="https://www.studiosport.fr/politique-de-confidentialite.html">Politique de confidentialité</a>
        <span>|</span>
        <a href="#">Cookies</a>
        <span>|</span>
        <a href="https://www.studiosport.fr/conditions-generales-de-vente.html">Conditions Générales de Vente</a>
      </div>
      <div class="legal-info">
        <p>Entreprise certifiée ISO 9001 - SIRET : 49504913200105 - TVA IntraComm : FR02495049132 - © studioSPORT 2007-{currentYear}</p>
      </div>
      <div class="legal-partner">
        <p>Propulsé par - OASIS Commerce</p>
      </div>
    </div>
  </div>
</footer>

