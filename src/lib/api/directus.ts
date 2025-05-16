// Fonctions utilitaires pour interroger l'API Directus

const API_URL = 'https://sts.tinycocon.snt2.tech';

export async function fetchCocons(query: string = '') {
  const url = `${API_URL}/items/cocon?fields=name,articles.id,articles.title,articles.contents.id,articles.contents.language&filter[name][_contains]=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur lors de la récupération des cocons');
  return res.json();
}

export async function fetchCoconByName(name: string) {
  const url = `${API_URL}/items/cocon?fields=name,articles.id,articles.title,articles.contents.id,articles.contents.language,articles.contents.title,articles.contents.meta_title,articles.contents.description,articles.contents.body&filter[name][_eq]=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur lors de la récupération du cocon');
  return res.json();
}

// Ajoute d'autres fonctions si besoin (ex: fetchArticles, fetchContents) 