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
  <div class="FormDI">
    <div
      class="DialogInsightFormDiv"
      id="divForm_DIForm_1390_775"
      style="display: none"
    >
      <a href="#divForm_DIForm_1390_775_globalErrors_anchor" id="divForm_DIForm_1390_775_globalErrors_anchor"></a>
      <span class="FormDItitle">Suivez toute l'actualité studioSPORT</span>
      <div
        class="DialogInsightGlobalErrors"
        id="divForm_DIForm_1390_775_globalErrors"
      ></div>
      <div class="DialogInsightFormContainer">
        <div class="DialogInsightFormRow">
          <div class="DialogInsightInputContainer">
            <div class="DialogInsightInputWithPlaceholderContainer">
              <input
                type="text"
                class="DialogInsightFormInput DialogInsightInputWithPlaceholder"
                id="DIField_775_f_EMail"
                maxlength="125"
                placeholder="email"
              />
            </div>
            <div
              class="DialogInsightErrorContainer"
              id="DIField_775_f_EMail_errors"
            ></div>
          </div>
        </div>
        <div class="DialogInsightFormRow">
          <div class="DialogInsightInputContainer">
            <div class="DialogInsightInputWithPlaceholderContainer">
              <input
                type="text"
                class="DialogInsightFormInput DialogInsightInputWithPlaceholder"
                id="DIField_775_f_FirstName"
                maxlength="50"
                placeholder="Prenom"
              />
            </div>
            <div
              class="DialogInsightErrorContainer"
              id="DIField_775_f_FirstName_errors"
            ></div>
          </div>
        </div>
        <div class="DialogInsightFormRow">
          <div class="DialogInsightInputContainer">
            <div class="DialogInsightInputWithPlaceholderContainer">
              <input
                type="text"
                class="DialogInsightFormInput DialogInsightInputWithPlaceholder"
                id="DIField_775_f_LastName"
                maxlength="50"
                placeholder="Nom"
              />
            </div>
            <div
              class="DialogInsightErrorContainer"
              id="DIField_775_f_LastName_errors"
            ></div>
          </div>
        </div>
        <div class="DialogInsightFormSubmit">
          <input
            class="btnForm"
            type="submit"
            value="Soumettre"
            on:click={submitForm}
          />
          <img
            class="DialogInsightFormSubmitLoader"
            src="https://cdn.dialoginsight.com/DI/Forms/resources/AjaxBlackLoader.gif"
            alt="Chargement"
          />
        </div>
      </div>
      <div
        class="DialogInsightFormSuccessDiv"
        id="divForm_DIForm_1390_775_success"
        style="padding: 10px; display: none"
      >
        <b>Abonnement réussi</b><br />Merci de vous être abonné.<br />
      </div>
    </div>
  </div>
  <div class="footContent">
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/nos-horaires-et-coordonnees-m10016.html')}>
        Nos horaires et coordonnées
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/conditions-generales-de-vente.html')}>
        C.G.V
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/foire-aux-questions-faq-m62960.html')}>
        Foire aux questions (FAQ)
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('http://blog.studiosport.fr/')}>
        Le blog studioSPORT
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/mentions-legales.html')}>
        Mentions légales
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/avis-client-studiosport.html')}>
        Nos clients parlent de nous
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://support.studiosport.fr/')}>
        Nous contacter
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/plan-du-site.html')}>
        Plan du site
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/qui-sommes-nous.html')}>
        Qui somme-nous ?
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/nos-guides-d-achat-m60387.html')}>
        Toutes nos guides d'achats
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/marques-m60682.html')}>
        Toutes nos marques
      </li>
    </ul>
    <ul>
      <li on:click={() => goTo('https://www.studiosport.fr/rejoindre-notre-equipe-m60562.html')}>
        Rejoindre notre équipe
      </li>
    </ul>
  </div>
  <div class="creditsLogo">
    <img
      src="https://www.studiosport.fr/upload/image/-image-195351-moyenne.png"
      alt="Logo studioSPORT noir et blanc"
    />
  </div>
  <hr />
  <div class="credits">
    <div class="creditsLogo">
      <ul>
        <li>© studioSPORT 2007 - {currentYear}</li>
        <li>SIRET :49504913200071</li>
        <li>TVA IntraComm :FR02495049132</li>
      </ul>
    </div>
    <p>
      Les sites du groupe SNT2 :SNT2.fr - OPS-store.fr - Blog.studioSPORT.fr -
      lespagesdrones.fr - Abot.fr | Agence :Agence Web et Solutions - Oasis
      e-commerce
    </p>
  </div>
</footer>
