// Pour le typage Node.js, installer : npm i --save-dev @types/node
import fs from 'fs/promises';
import path from 'path';

const EXPORTS_DIR = path.resolve(process.cwd(), 'exports');

export async function listExportZips(): Promise<string[]> {
  const files = await fs.readdir(EXPORTS_DIR);
  return files.filter((file: string) => file.endsWith('.zip'));
} 