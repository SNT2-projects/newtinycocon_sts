import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteExport } from '$lib/api/compile';

export const DELETE: RequestHandler = async ({ params }) => {
  const { name } = params;
  
  try {
    const result = deleteExport(name);
    
    if (!result.success) {
      return json({ error: result.message }, { status: 404 });
    }
    
    return json({ message: result.message });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'export:', error);
    return json(
      { error: 'Erreur lors de la suppression de l\'export' }, 
      { status: 500 }
    );
  }
}; 