import { json } from '@sveltejs/kit';
import { listExportZips } from '$lib/api/exports';

export async function GET() {
  const files = await listExportZips();
  return json(files);
} 