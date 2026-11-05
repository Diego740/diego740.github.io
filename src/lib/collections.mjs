import { getCollection } from 'astro:content';
// Las colecciones no garantizan orden: se ordena siempre por el campo `order` del JSON.
export const getOrdered = async (name) => (await getCollection(name)).sort((a, b) => a.data.order - b.data.order);
