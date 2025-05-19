import { json } from '@sveltejs/kit';
import { compileAllContent } from '$lib/api/compile';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
  try {
    const result = await compileAllContent();
    return json(result);
  } catch (error) {
    console.error('Erreur de compilation:', error);
    return json({ error: 'Erreur lors de la compilation' }, { status: 500 });
  }
}; 