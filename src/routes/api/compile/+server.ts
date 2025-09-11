import { json } from '@sveltejs/kit';
import { compileAllContent } from '$lib/api/compile';
import type { RequestHandler } from './$types';
import { compilationStatus } from './compilationStore';

export const POST: RequestHandler = async () => {
  try {
    // Réinitialiser le statut
    compilationStatus.progress = 0;
    compilationStatus.total = 100;
    compilationStatus.stage = 'Démarrage...';
    
    const result = await compileAllContent((progress, total, stage) => {
      compilationStatus.progress = progress;
      compilationStatus.total = total;
      compilationStatus.stage = stage;
    });
    
    return json(result);
  } catch (error) {
    console.error('Erreur de compilation:', error);
    return json({ error: 'Erreur lors de la compilation' }, { status: 500 });
  }
}; 