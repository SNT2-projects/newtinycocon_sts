import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import type { RequestHandler } from './$types';

// Utiliser process.cwd() pour pointer vers la racine du projet au lieu de chemins relatifs
const exportDir = path.join(process.cwd(), 'exports');

export const GET: RequestHandler = async () => {
  try {
    // Vérifier si le dossier d'exports existe
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
      return json([]);
    }
    
    // Lire les dossiers d'exports
    const files = fs.readdirSync(exportDir);
    
    // Filtrer pour ne garder que les dossiers d'exports (commençant par "export-")
    const exports = files
      .filter(file => file.startsWith('export-'))
      .sort((a, b) => {
        // Trier par date décroissante (du plus récent au plus ancien)
        const fileAStats = fs.statSync(path.join(exportDir, a));
        const fileBStats = fs.statSync(path.join(exportDir, b));
        return fileBStats.mtime.getTime() - fileAStats.mtime.getTime();
      });
    
    return json(exports);
  } catch (error) {
    console.error('Erreur lors de la récupération des exports:', error);
    return json([], { status: 500 });
  }
}; 