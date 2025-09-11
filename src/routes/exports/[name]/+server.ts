import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { RequestHandler } from './$types';
import archiver from 'archiver';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

// Utiliser process.cwd() pour pointer vers la racine du projet au lieu de chemins relatifs
const exportDir = path.join(process.cwd(), 'exports');

export const GET: RequestHandler = async ({ params }) => {
  const exportName = params.name;
  
  if (!exportName || !exportName.startsWith('export-')) {
    throw error(404, 'Export non trouvé');
  }
  
  const exportPath = path.join(exportDir, exportName);
  
  // Vérifier si le dossier d'export existe
  if (!fs.existsSync(exportPath)) {
    throw error(404, 'Export non trouvé');
  }
  
  // Créer une archive ZIP à la volée
  const archive = archiver('zip', {
    zlib: { level: 9 } // Niveau maximum de compression
  });
  
  // Ajouter le contenu du dossier d'export à l'archive
  archive.directory(exportPath, false);
  
  // Finaliser l'archive
  archive.finalize();
  
  // Créer un flux de lecture à partir de l'archive
  const readableStream = Readable.from(archive);
  
  // Retourner le contenu de l'archive
  return new Response(readableStream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${exportName}.zip"`
    }
  });
}; 