// Fonctions utilitaires pour interroger l'API Directus

const API_URL = import.meta.env.VITE_DIRECTUS_URL;
if (!API_URL) {
  throw new Error('La variable d\'environnement VITE_DIRECTUS_URL doit être définie');
}

interface CoconResponse {
  data: Cocon[];
}

interface Cocon {
  id: string;
  title: string;
  sort: number;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  articles: Article[];
}

interface Article {
  id: string;
  title: string;
  contents: Content[];
}

interface Content {
  id: string;
  language: string;
  title?: string;
  meta_title?: string;
  description?: string;
  body?: string;
  status?: 'published' | 'draft' | 'archived' | string;
}

/**
 * Récupère tous les cocons avec filtrage optionnel par titre
 */
export async function fetchCocons(query: string = ''): Promise<DirectusResponse<Cocon[]>> {
  // Construire l'URL de base avec tous les champs nécessaires
  let url = `${API_URL}/items/cocons?fields=*,articles.id,articles.title,articles.contents.id,articles.contents.language`;
  
  // Ajouter le filtre seulement si query n'est pas vide
  if (query.trim() !== '') {
    url += `&filter[title][_contains]=${encodeURIComponent(query)}`;
  }
  
  return fetchFromDirectus(url);
}

/**
 * Récupère un cocon par son ID avec tous ses articles et leurs détails
 */
export async function fetchCoconById(id: string): Promise<DirectusResponse<Cocon>> {
  const url = `${API_URL}/items/cocons/${id}?fields=*,articles.*,articles.contents.*`;
  return fetchFromDirectus(url);
}

/**
 * Récupère un cocon par son titre exact
 */
export async function fetchCoconByTitle(title: string): Promise<DirectusResponse<Cocon[]>> {
  const url = `${API_URL}/items/cocons?fields=*,articles.*,articles.contents.*&filter[title][_eq]=${encodeURIComponent(title)}`;
  return fetchFromDirectus(url);
}

/**
 * Récupère tous les articles d'un cocon
 */
export async function fetchArticlesByCoconId(coconId: string): Promise<DirectusResponse<Article[]>> {
  const url = `${API_URL}/items/articles?fields=*,contents.*&filter[cocon][_eq]=${coconId}`;
  return fetchFromDirectus(url);
}

/**
 * Récupère un article par son ID
 */
export async function fetchArticleById(id: string): Promise<DirectusResponse<Article>> {
  const url = `${API_URL}/items/articles/${id}?fields=*,contents.*,cocon.*`;
  return fetchFromDirectus(url);
}

/**
 * Récupère un contenu spécifique par son ID avec tous les détails
 */
export async function fetchContentById(id: string): Promise<DirectusResponse<Content>> {
  const url = `${API_URL}/items/contents/${id}?fields=*,article.*,article.cocon.*`;
  return fetchFromDirectus(url);
}

/**
 * Récupère tous les contenus d'un article
 */
export async function fetchContentsByArticleId(articleId: string): Promise<DirectusResponse<Content[]>> {
  const url = `${API_URL}/items/contents?fields=*&filter[article][_eq]=${articleId}`;
  return fetchFromDirectus(url);
}

/**
 * Récupère tous les contenus publiés avec leurs relations (article et cocon)
 */
export async function fetchAllPublishedContent(): Promise<DirectusResponse<Content[]>> {
  const url = `${API_URL}/items/contents?fields=*,article.title,article.id,article.cocon.title,article.cocon.id&filter[status][_eq]=published`;
  return fetchFromDirectus(url);
}

/**
 * Fonction générique pour gérer les appels à l'API Directus
 */
async function fetchFromDirectus<T>(url: string): Promise<DirectusResponse<T>> {
  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.errors?.[0]?.message || `Erreur API (${res.status})`);
    }
    
    return res.json();
  } catch (error: any) {
    console.error('Erreur lors de l\'appel à l\'API Directus:', error);
    throw new Error(error.message || 'Erreur lors de la récupération des données');
  }
}