<script lang="ts">
  // Fonction pour rediriger vers une URL
  function goTo(url: string) {
    window.location.href = url;
  }
  
  // Données positionnelles pour la recherche
  const positionalData = {
    on_right_side: false,
    left_side: 605.6000366210938,
    right_side: 865.6000366210938
  };
</script>

<header>
  <div class="headerStyle">
    <p class="contact">
      <span class="infoHeader" on:click={() => goTo('https://www.studiosport.fr/expeditions-et-retours.html')}>
        Relais colis offert à partir de 79€ en France métropolitaine 
      </span>| 
      <span class="infoHeader" on:click={() => goTo('https://www.studiosport.fr/devis-drone-camera-m60647.html')}>
        Demandez un devis
      </span>| 
      <span class="infoHeader" on:click={() => goTo('https://www.studiosport.fr/marques-m60682.html')}>
        Toutes nos marques
      </span>
    </p>
    <div class="headerRaw">
      <div class="logoHead">
        <img 
          on:click={() => goTo('https://www.studiosport.fr/')} 
          src="https://www.studiosport.fr/themes/html_1708/modeles/62/img/logo/logo_header_1.jpg" 
          alt="Logo studiosport" 
          class="img-responsive"
        />
      </div>
      <div class="search">
        <div class="headRecherche Head_recherche-active" id="head-recherche">
          <form action="https://www.studiosport.fr/dhtml/resultat_recherche.php" method="get" name="form_recherche">
            <input 
              name="keywords" 
              type="text" 
              maxlength="255" 
              placeholder="Rechercher une produit, une marque..." 
              on:click={() => {
                const element = document.getElementById('head-recherche');
                if (element) element.className = 'headRecherche Head_recherche-active';
              }} 
              class="Head_rechChamp input-text-search ui-autocomplete-input" 
              autocomplete="off" 
              role="textbox" 
              aria-autocomplete="list" 
              aria-haspopup="true" 
              data-positional={JSON.stringify(positionalData)}
            />
            <input name="ok" type="submit" value="Ok" class="Head_rechBouton" />
          </form>
          <ul 
            class="ui-autocomplete ui-menu ui-widget ui-widget-content ui-corner-all" 
            role="listbox" 
            aria-activedescendant="ui-active-menuitem" 
            style="z-index:2; top:0px; left:0px; display:none;"
          ></ul>
        </div>
      </div>
      <div class="header_contact">
        <div class="header_contact_mail" on:click={() => goTo('http://support.studiosport.fr/')}>
          Contact email
        </div>
        <hr class="header_contact_hr" />
        <div class="header_contact_tel">02 35 00 30 00</div>
        <div class="header_contact_horaires">DU LUN. AU VEN. DE 8H À 18H</div>
      </div>
      <div class="accountCart" on:click={() => goTo('https://www.studiosport.fr/dhtml/compte.php')}>
        <div class="account">
          <p><b>Mon</b>Compte</p>
          <div class="connexion">
            <btn class="btnAccount btnConnect"><span>Me connecter</span></btn>
            <btn class="btnAccount btnCreate"><span>Créer un compte</span></btn>
          </div>
        </div>
        <div class="cart" on:click={(e) => {
          e.stopPropagation();
          goTo('https://www.studiosport.fr/');
        }}>
          <p><b>Mon</b>Panier</p>
        </div>
      </div>
    </div>
  </div>
  <nav>
    <ul id="menu_personnalisable">
      <li class="sprite-head s1" on:click={() => goTo('https://www.studiosport.fr/drones-modelisme-c-30.html')}>
        <span>Univers drones</span>
      </li>
      <li class="sprite-head s2" on:click={() => goTo('https://www.studiosport.fr/drones-racer-m60281.html')}>
        <span>Drones racer</span>
      </li>
      <li class="sprite-head s3" on:click={() => goTo('https://www.studiosport.fr/materiel-professionnel-drones-et-cameras-m60358.html')}>
        <span>Drones professionnels</span>
      </li>
      <li class="sprite-head s4" on:click={() => goTo('https://www.studiosport.fr/univers-cameras/')}>
        <span>Univers caméras</span>
      </li>
      <li class="sprite-head s5" on:click={() => goTo('https://www.studiosport.fr/cameras/dslr-et-hybrides-c2476.html')}>
        <span>Hybrides &amp; DSLR</span>
      </li>
      <li class="sprite-head s6" on:click={() => goTo('https://www.studiosport.fr/stabilisateurs-pour-cameras-et-smartphone-m60585.html')}>
        <span>Stabilistateurs caméras</span>
      </li>
      <li class="sprite-head s7" on:click={() => goTo('https://www.studiosport.fr/occasions-et-destockage-c2283.html')}>
        <span>Occasions &amp; Refub</span>
      </li>
      <li class="sprite-head s8" on:click={() => goTo('https://www.studiosport.fr/toutes-nos-nouveautes/')}>
        <span>Nouveautés</span>
      </li>
      <li class="last_menu sprite-head s9" on:click={() => goTo('https://www.studiosport.fr/drones-modelisme-multirotors-dji-c-30_360.html')}></li>
    </ul>
  </nav>
</header>