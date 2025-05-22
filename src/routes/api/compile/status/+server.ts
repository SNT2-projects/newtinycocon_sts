import type { RequestHandler } from './$types';

// Importer la variable de statut depuis le fichier parent
import { compilationStatus } from '../compilationStore';

export const GET: RequestHandler = async ({ request }) => {
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  let timer: NodeJS.Timeout | null = null;
  
  const stream = new ReadableStream({
    start(controller) {
      // Envoi des données initiales
      const message = `data: ${JSON.stringify(compilationStatus)}\n\n`;
      controller.enqueue(message);
      
      // Mise à jour toutes les 500ms
      timer = setInterval(() => {
        const message = `data: ${JSON.stringify(compilationStatus)}\n\n`;
        controller.enqueue(message);
        
        // Arrêter le flux lorsque la compilation est terminée
        if (compilationStatus.progress >= 100) {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          controller.close();
        }
      }, 500);
    },
    cancel() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  });
  
  return new Response(stream, { headers });
}; 