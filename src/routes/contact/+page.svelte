<script lang="ts">
  import { enhance } from '$app/forms';
  
  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  let isSubmitting = false;
  let submitStatus: 'success' | 'error' | null = null;

  async function handleSubmit(event: SubmitEvent) {
    isSubmitting = true;
    submitStatus = null;

    try {
      // Ici, vous pouvez ajouter la logique pour envoyer les données à votre backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation d'un appel API
      submitStatus = 'success';
      formData = { name: '', email: '', subject: '', message: '' };
    } catch (error) {
      submitStatus = 'error';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">Contactez-nous</h1>
      <p class="mt-4 text-lg text-gray-600">
        Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question.
      </p>
    </div>

    <div class="mt-12 bg-white shadow-lg rounded-lg p-8">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700">Sujet</label>
          <input
            type="text"
            id="subject"
            bind:value={formData.subject}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Sujet de votre message"
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            bind:value={formData.message}
            required
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Votre message..."
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              Envoi en cours...
            {:else}
              Envoyer
            {/if}
          </button>
        </div>

        {#if submitStatus === 'success'}
          <div class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  Votre message a été envoyé avec succès !
                </p>
              </div>
            </div>
          </div>
        {:else if submitStatus === 'error'}
          <div class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              </div>
            </div>
          </div>
        {/if}
      </form>
    </div>
  </div>
</div>