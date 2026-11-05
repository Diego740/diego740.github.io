import { buildLlms } from '../lib/llms.mjs';
export async function GET() {
  return new Response(await buildLlms('es'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
