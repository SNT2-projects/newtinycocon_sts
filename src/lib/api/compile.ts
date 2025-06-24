import { fetchAllPublishedContent } from './directus';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// URL de production pour les liens canoniques et hreflang
const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://www.studiosport.fr';

// Translation mapping for the guides directory
const guidesTranslations: Record<string, string> = {
  'de': 'fuehrungen',
  'en': 'guides',
  'es': 'guias',
  'fr': 'guides',
  'it': 'guide',
  'nl': 'gidsen'
};

// Function to get the translated guides folder name
function getGuidesTranslation(language: string): string {
  return guidesTranslations[language] || 'guides'; // Default to 'guides' if language not found
}

// Définir un type spécifique pour le contenu Directus qui inclut les propriétés nécessaires
interface DirectusArticle {
  id: string;
  title: string;
  cocon: {
    id: string;
    title: string;
  };
}

interface DirectusContent {
  id: string;
  language: string;
  title?: string;
  meta_title?: string;
  description?: string;
  body?: string;
  aside?: string;
  status?: string;
  date_created?: string;
  date_updated?: string;
  slug?: string;
  article: DirectusArticle;
}

// Structure pour regrouper les contenus par cocon et par langue
interface CoconGroup {
  coconId: string;
  coconTitle: string;
  articles: {
    articleId: string;
    articleTitle: string;
    contents: DirectusContent[];
  }[];
}

// Utiliser process.cwd() pour pointer vers la racine du projet au lieu de chemins relatifs
const exportDirRoot = path.join(process.cwd(), 'exports');
const staticDir = path.join(process.cwd(), 'static', 'export');

// Lire les fichiers statiques au démarrage
const headerHtml = fs.readFileSync(path.join(staticDir, 'header.php'), 'utf8');
const footerHtml = fs.readFileSync(path.join(staticDir, 'footer.php'), 'utf8');
const headHtml = fs.readFileSync(path.join(staticDir, 'head.php'), 'utf8');
const otherHtml = fs.readFileSync(path.join(staticDir, 'other.php'), 'utf8');
const styleContent = fs.readFileSync(path.join(staticDir, 'style.css'), 'utf8');

// Fonction pour télécharger une image et la sauvegarder dans le dossier d'images du cocon
async function downloadImage(assetId: string, filename: string, coconImagesDir: string): Promise<boolean> {
  if (!coconImagesDir) {
    console.warn('Dossier d\'images du cocon non spécifié, impossible de télécharger l\'image');
    return false;
  }
  
  try {
    const response = await fetch(`https://back.tinycocon.snt2.tech/assets/${assetId}`);
    if (!response.ok) {
      console.warn(`Erreur lors du téléchargement de l'image ${assetId}: ${response.status}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    const filePath = path.join(coconImagesDir, filename);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`Image téléchargée: ${filename} dans ${coconImagesDir}`);
    return true;
  } catch (error) {
    console.error(`Exception lors du téléchargement de l'image ${assetId}:`, error);
    return false;
  }
}

// Fonction pour traiter les URLs des images dans le contenu HTML pour un cocon spécifique
async function processImageUrls(html: string, coconImagesDir?: string): Promise<string> {
  if (!html) return '';

  // Regex pour trouver les URLs d'images au format https://back.tinycocon.snt2.tech/assets/[id]
  const imageUrlRegex = /https:\/\/back\.tinycocon\.snt2\.tech\/assets\/([a-zA-Z0-9-]+)/g;
  
  // Collecter tous les IDs d'assets uniques
  const assetIds = new Set<string>();
  let match;
  
  // Trouver tous les IDs d'assets dans le HTML
  while ((match = imageUrlRegex.exec(html)) !== null) {
    assetIds.add(match[1]);
  }
  
  // Créer un mapping des IDs d'assets vers les noms de fichiers
  const assetIdToFilename = new Map<string, string>();
  
  // Récupérer les informations sur chaque asset
  for (const assetId of assetIds) {
    try {
      const response = await fetch(`https://back.tinycocon.snt2.tech/files/${assetId}`);
      if (response.ok) {
        const { data } = await response.json();
        if (data && data.filename_download) {
          assetIdToFilename.set(assetId, data.filename_download);
          
          // Si le dossier d'images du cocon est spécifié, télécharger l'image
          if (coconImagesDir) {
            await downloadImage(assetId, data.filename_download, coconImagesDir);
          }
        } else {
          console.warn(`Impossible de récupérer le nom de fichier pour l'asset ${assetId}`);
        }
      } else {
        console.warn(`Erreur lors de la récupération de l'asset ${assetId}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Exception lors de la récupération de l'asset ${assetId}:`, error);
    }
  }
  
  // Remplacer toutes les URLs d'images dans le HTML
  let processedHtml = html;
  for (const [assetId, filename] of assetIdToFilename.entries()) {
    const oldUrl = `https://back.tinycocon.snt2.tech/assets/${assetId}`;
    const newUrl = `images/${filename}`;
    processedHtml = processedHtml.replace(new RegExp(oldUrl.replace(/\//g, '\\/').replace(/\./g, '\\.'), 'g'), newUrl);
  }
  
  return processedHtml;
}

// Fonction pour générer les sitemaps XML
function generateSitemapXML(urls: Array<{
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}>): string {
  const urlEntries = urls.map(url => {
    let urlEntry = `  <url>\n    <loc>${url.loc}</loc>`;
    
    if (url.lastmod) {
      urlEntry += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }
    
    if (url.changefreq) {
      urlEntry += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority) {
      urlEntry += `\n    <priority>${url.priority}</priority>`;
    }
    
    urlEntry += '\n  </url>';
    return urlEntry;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Fonction pour générer un sitemap index XML
function generateSitemapIndexXML(sitemaps: Array<{
  loc: string;
  lastmod?: string;
}>): string {
  const sitemapEntries = sitemaps.map(sitemap => {
    let entry = `  <sitemap>\n    <loc>${sitemap.loc}</loc>`;
    
    if (sitemap.lastmod) {
      entry += `\n    <lastmod>${sitemap.lastmod}</lastmod>`;
    }
    
    entry += '\n  </sitemap>';
    return entry;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

// Fonction pour formater une date au format ISO 8601 pour les sitemaps
function formatDateForSitemap(dateString?: string): string {
  if (!dateString) {
    return new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  }
  
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// Fonction principale pour générer tous les sitemaps
async function generateSitemaps(
  exportDir: string,
  coconGroups: CoconGroup[],
  languages: Set<string>,
  generatedFiles: Array<{
    coconTitle: string;
    coconSlug: string;
    articleTitle: string;
    language: string;
    filePath: string;
  }>,
  contents: DirectusContent[]
) {
  const sitemapIndexes: Record<string, Array<{
    loc: string;
    lastmod: string;
  }>> = {};

  // Organiser les fichiers générés par langue et cocon
  const filesByLanguageAndCocon: Record<string, Record<string, Array<{
    coconTitle: string;
    coconSlug: string;
    articleTitle: string;
    language: string;
    filePath: string;
  }>>> = {};

  generatedFiles.forEach(file => {
    if (!filesByLanguageAndCocon[file.language]) {
      filesByLanguageAndCocon[file.language] = {};
    }
    
    if (!filesByLanguageAndCocon[file.language][file.coconSlug]) {
      filesByLanguageAndCocon[file.language][file.coconSlug] = [];
    }
    
    filesByLanguageAndCocon[file.language][file.coconSlug].push(file);
  });

  // Générer les sitemaps par cocon pour chaque langue
  for (const language of languages) {
    const guidesDir = getGuidesTranslation(language);
    
    if (!sitemapIndexes[language]) {
      sitemapIndexes[language] = [];
    }

    const coconsByLanguage = filesByLanguageAndCocon[language] || {};
    
    for (const [coconSlug, files] of Object.entries(coconsByLanguage)) {
      // Créer les URLs pour ce cocon
      const urls = files.map(file => {
        // Extraire le nom du fichier sans l'extension
        const fileName = path.basename(file.filePath, '.html');
        // Gestion spéciale pour le français - pas de préfixe de langue
        const url = language === 'fr' 
          ? `${PRODUCTION_URL}/${guidesDir}/${coconSlug}/${fileName}.html`
          : `${PRODUCTION_URL}/${language}/${guidesDir}/${coconSlug}/${fileName}.html`;
        
        // Trouver les informations du contenu pour les métadonnées
        const content = contents.find((c: DirectusContent) => {
          if (!c.article || !c.article.cocon) return false;
          const contentLanguage = c.language.substring(0, 2).toLowerCase();
          const contentCoconSlug = c.article.cocon.title.toLowerCase().replace(/\s+/g, '-');
          const contentSlug = c.slug || c.article.title.toLowerCase().replace(/\s+/g, '-');
          
          return contentLanguage === language && 
                 contentCoconSlug === coconSlug && 
                 fileName === contentSlug;
        });

        return {
          loc: url,
          lastmod: formatDateForSitemap(content?.date_updated || content?.date_created),
          changefreq: 'weekly',
          priority: '0.8'
        };
      });

      // Générer le sitemap XML pour ce cocon
      const sitemapXML = generateSitemapXML(urls);
      
      // Écrire le sitemap dans le dossier du cocon - Gestion spéciale pour le français
      const coconDir = language === 'fr' 
        ? path.join(exportDir, guidesDir, coconSlug)
        : path.join(exportDir, language, guidesDir, coconSlug);
      const sitemapPath = path.join(coconDir, 'sitemap.xml');
      fs.writeFileSync(sitemapPath, sitemapXML);

      // Ajouter ce sitemap à l'index global de la langue
      const sitemapUrl = language === 'fr' 
        ? `${PRODUCTION_URL}/${guidesDir}/${coconSlug}/sitemap.xml`
        : `${PRODUCTION_URL}/${language}/${guidesDir}/${coconSlug}/sitemap.xml`;
      
      // Utiliser la date la plus récente parmi tous les contenus du cocon
      const latestDate = files.reduce((latest, file) => {
        const content = contents.find((c: DirectusContent) => {
          if (!c.article || !c.article.cocon) return false;
          const contentLanguage = c.language.substring(0, 2).toLowerCase();
          const contentCoconSlug = c.article.cocon.title.toLowerCase().replace(/\s+/g, '-');
          return contentLanguage === language && contentCoconSlug === coconSlug;
        });
        
        const fileDate = content?.date_updated || content?.date_created;
        if (!fileDate) return latest;
        
        if (!latest || new Date(fileDate) > new Date(latest)) {
          return fileDate;
        }
        
        return latest;
      }, null as string | null);

      sitemapIndexes[language].push({
        loc: sitemapUrl,
        lastmod: formatDateForSitemap(latestDate || undefined)
      });
    }
  }

  // Générer les sitemaps index globaux pour chaque langue
  for (const language of languages) {
    const guidesDir = getGuidesTranslation(language);
    const sitemapIndexXML = generateSitemapIndexXML(sitemapIndexes[language]);
    
    // Écrire le sitemap index dans le dossier guides de la langue - Gestion spéciale pour le français
    const languageGuidesDir = language === 'fr' 
      ? path.join(exportDir, guidesDir)
      : path.join(exportDir, language, guidesDir);
    const indexPath = path.join(languageGuidesDir, 'sitemap.xml');
    fs.writeFileSync(indexPath, sitemapIndexXML);
  }
}

export async function compileAllContent(progressCallback?: (progress: number, total: number, stage: string) => void) {
  // Générer le nom du dossier d'export avec la date et l'heure actuelles
  const date = new Date();
  // Forcer le fuseau horaire à Paris/France
  const parisDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  
  const day = String(parisDate.getDate()).padStart(2, '0');
  const month = String(parisDate.getMonth() + 1).padStart(2, '0'); 
  const year = parisDate.getFullYear();
  const hours = String(parisDate.getHours()).padStart(2, '0');
  const minutes = String(parisDate.getMinutes()).padStart(2, '0');
  const seconds = String(parisDate.getSeconds()).padStart(2, '0');
  
  const exportDirName = `export-${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
  const exportDir = path.join(exportDirRoot, exportDirName);
  // Assurez-vous que le dossier d'export existe
  if (!fs.existsSync(exportDirRoot)) {
    fs.mkdirSync(exportDirRoot, { recursive: true });
  }
  
  // Créer le dossier d'export avec la date
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }
  
  // Notifier la préparation
  if (progressCallback) {
    progressCallback(0, 100, 'Récupération des contenus publiés');
  }
  
  // Récupérer tous les contenus publiés (sans limite)
  const response = await fetchAllPublishedContent(-1);
  const contents = response.data as DirectusContent[];
  
  if (progressCallback) {
    progressCallback(5, 100, `Préparation de ${contents.length} pages`);
  }
  
  let fileCount = 0;
  
  // Créer un index des cocons et articles organisés par langue et cocon
  const coconGroups: CoconGroup[] = [];
  const generatedFiles: {
    coconTitle: string;
    coconSlug: string;
    articleTitle: string;
    language: string;
    filePath: string;
  }[] = [];
  
  // Organiser les contenus par cocon et article pour la génération des index
  contents.forEach(content => {
    if (!content.article || !content.article.cocon || !content.language) {
      return;
    }
    
    const coconId = content.article.cocon.id;
    const coconTitle = content.article.cocon.title;
    const articleId = content.article.id;
    const articleTitle = content.article.title;
    
    // Trouver ou créer le groupe de cocon
    let coconGroup = coconGroups.find(cg => cg.coconId === coconId);
    if (!coconGroup) {
      coconGroup = {
        coconId,
        coconTitle,
        articles: []
      };
      coconGroups.push(coconGroup);
    }
    
    // Trouver ou créer l'article dans le groupe
    let article = coconGroup.articles.find(a => a.articleId === articleId);
    if (!article) {
      article = {
        articleId,
        articleTitle,
        contents: []
      };
      coconGroup.articles.push(article);
    }
    
    // Ajouter le contenu à l'article
    article.contents.push(content);
  });
  
  // Créer un mapping pour faciliter l'accès aux informations des articles (pour les hreflang)
  const articleMap = new Map<string, {
    coconTitle: string;
    articleTitle: string;
    languages: {
      language: string;
      content: DirectusContent;
    }[];
  }>();
  
  // Organiser les contenus par article pour faciliter la génération des hreflang
  coconGroups.forEach(coconGroup => {
    const coconTitle = coconGroup.coconTitle;
    
    coconGroup.articles.forEach(article => {
      const articleId = article.articleId;
      const articleTitle = article.articleTitle;
      
      if (!articleMap.has(articleId)) {
        articleMap.set(articleId, {
          coconTitle,
          articleTitle,
          languages: []
        });
      }
      
      article.contents.forEach(content => {
        if (content.language) {
          // Extraire uniquement les deux premiers caractères du code de langue
          const language = content.language.substring(0, 2).toLowerCase();
          
          articleMap.get(articleId)?.languages.push({
            language,
            content
          });
        }
      });
    });
  });
  
  // Garder la trace des langues pour créer les dossiers assets pour chaque langue
  const languages = new Set<string>();
  
  // Générer les fichiers HTML pour chaque contenu
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    // Vérifier que le contenu a toutes les données nécessaires
    if (!content.article || !content.article.cocon || !content.language) {
      console.warn('Contenu incomplet ignoré:', content.id);
      continue;
    }
    
    // Extraire uniquement les deux premiers caractères du code de langue
    const language = content.language.substring(0, 2).toLowerCase();
    languages.add(language);
    
    const coconTitle = content.article.cocon.title;
    // Modification ici pour conserver les tirets dans le slug du cocon
    const coconSlug = coconTitle
      .toLowerCase()
      .replace(/\s+/g, '-');
    
    // Utiliser le slug traduit du contenu au lieu du titre de l'article
    const contentSlug = content.slug || content.article.title.toLowerCase().replace(/\s+/g, '-');
    
    // Get the translated guides directory name
    const guidesDir = getGuidesTranslation(language);
    
    // Créer les dossiers nécessaires pour le cocon
    // Gestion spéciale pour le français - pas de préfixe de langue
    const contentPath = language === 'fr' 
      ? path.join(exportDir, guidesDir, coconSlug)
      : path.join(exportDir, language, guidesDir, coconSlug);
    fs.mkdirSync(contentPath, { recursive: true });
    
    // Créer le dossier images pour ce cocon spécifique
    const coconImagesDir = path.join(contentPath, 'images');
    if (!fs.existsSync(coconImagesDir)) {
      fs.mkdirSync(coconImagesDir, { recursive: true });
    }
    
    // Générer le contenu HTML avec hreflang et traitement des images pour ce cocon
    const articleInfo = articleMap.get(content.article.id);
    const htmlContent = await generateHtml(content, articleInfo, coconImagesDir);
    
    // Écrire le fichier HTML avec le slug traduit
    const filePath = path.join(contentPath, `${contentSlug}.html`);
    const relativePath = path.relative(exportDir, filePath);
    fs.writeFileSync(filePath, htmlContent);
    
    // Ajouter à la liste des fichiers générés
    generatedFiles.push({
      coconTitle,
      coconSlug,
      articleTitle: content.article.title,
      language,
      filePath: relativePath
    });
    
    fileCount++;
    
    // Mettre à jour la progression - 5% à 95% pour la génération des fichiers
    if (progressCallback) {
      const progress = Math.floor(5 + (i / contents.length) * 90);
      progressCallback(progress, 100, `Génération des fichiers: ${fileCount}/${contents.length}`);
    }
  }
  
  // Créer le dossier assets pour chaque langue et y copier le CSS
  for (const language of languages) {
    const guidesDir = getGuidesTranslation(language);
    // Gestion spéciale pour le français - pas de préfixe de langue
    const assetsDir = language === 'fr' 
      ? path.join(exportDir, guidesDir, 'assets', 'css')
      : path.join(exportDir, language, guidesDir, 'assets', 'css');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Copier le fichier CSS dans le dossier assets de chaque langue
    fs.writeFileSync(path.join(assetsDir, 'style.css'), styleContent);
  }
  
  // Générer les sitemaps
  if (progressCallback) {
    progressCallback(95, 100, 'Génération des sitemaps');
  }
  
  await generateSitemaps(exportDir, coconGroups, languages, generatedFiles, contents);

  if (progressCallback) {
    progressCallback(100, 100, 'Export terminé');
  }
  
  return {
    exportName: exportDirName,
    filesCount: fileCount,
    path: exportDir
  };
}

async function generateHtml(content: DirectusContent, articleInfo?: { coconTitle: string; articleTitle: string; languages: { language: string; content: DirectusContent; }[] }, coconImagesDir?: string) {
  if (!content.article || !content.article.cocon) {
    return 'Contenu incomplet';
  }
  
  const articleTitle = content.article.title;
  const coconTitle = content.article.cocon.title;
  
  // Extraire uniquement les deux premiers caractères du code de langue
  const language = content.language.substring(0, 2).toLowerCase();
  const guidesDir = getGuidesTranslation(language);
  
  // Variables pour les fils d'ariane
  const breadcrumb1 = coconTitle.toLowerCase().replace(/\s+/g, '-');
  // Utiliser le slug traduit du contenu pour breadcrumb2
  const breadcrumb2 = content.slug || articleTitle.toLowerCase().replace(/\s+/g, '-');
  // Gestion spéciale pour le français - pas de préfixe de langue
  const url = language === 'fr' 
    ? `${PRODUCTION_URL}/${guidesDir}/${breadcrumb1}/${breadcrumb2}.html`
    : `${PRODUCTION_URL}/${language}/${guidesDir}/${breadcrumb1}/${breadcrumb2}.html`;
  
  // Préparer les méta-données
  const title = content.meta_title || content.title || articleTitle;
  const description = content.description || '';
  
  // Préparer les balises hreflang
  let hreflangTags = '';
  
  if (articleInfo && articleInfo.languages && articleInfo.languages.length > 0) {
    // Ajouter les balises hreflang pour chaque langue disponible
    hreflangTags = articleInfo.languages.map(langInfo => {
      const langCode = langInfo.language;
      const langGuidesDir = getGuidesTranslation(langCode);
      
      // Créer les slugs pour l'URL hreflang
      const hrefBreadcrumb1 = coconTitle.toLowerCase().replace(/\s+/g, '-');
      // Utiliser le slug traduit de chaque contenu pour les hreflang
      const hrefBreadcrumb2 = langInfo.content.slug || articleTitle.toLowerCase().replace(/\s+/g, '-');
      
      // Construire l'URL complète - Gestion spéciale pour le français
      const langUrl = langCode === 'fr' 
        ? `${PRODUCTION_URL}/${langGuidesDir}/${hrefBreadcrumb1}/${hrefBreadcrumb2}.html`
        : `${PRODUCTION_URL}/${langCode}/${langGuidesDir}/${hrefBreadcrumb1}/${hrefBreadcrumb2}.html`;
      
      return `<link rel="alternate" hreflang="${langCode}" href="${langUrl}" />`;
    }).join('\n');
    
    // Ajouter une balise hreflang par défaut (x-default)
    // Utiliser la première langue de la liste comme défaut
    const defaultLang = articleInfo.languages[0].language;
    const defaultGuidesDir = getGuidesTranslation(defaultLang);
    const defaultBreadcrumb2 = articleInfo.languages[0].content.slug || articleTitle.toLowerCase().replace(/\s+/g, '-');
    // Gestion spéciale pour le français dans l'URL par défaut
    const defaultUrl = defaultLang === 'fr' 
      ? `${PRODUCTION_URL}/${defaultGuidesDir}/${breadcrumb1}/${defaultBreadcrumb2}.html`
      : `${PRODUCTION_URL}/${defaultLang}/${defaultGuidesDir}/${breadcrumb1}/${defaultBreadcrumb2}.html`;
    hreflangTags += `<link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`;
  }
  
  // Remplacer les variables PHP dans le head
  const headWithVariables = headHtml
    // Mettre à jour le chemin CSS pour qu'il pointe vers la structure par langue
    .replace(/<link title="style studiosport" type="text\/css" rel="stylesheet" href="..\/assets\/content\/style.css" \/>/g, 
      `<link title="style studiosport" type="text\/css" rel="stylesheet" href="..\/assets\/css\/style.css" \/>`)
    .replace(/\<\?php echo \$title \?\>/g, title)
    .replace(/\<\?php echo \$desc \?\>/g, description)
    .replace(/\<\?php echo \$url \?\>/g, url)
    .replace(/\<\?php echo \$breadcrumb1 \?\>/g, breadcrumb1)
    .replace(/\<\?php echo \$breadcrumb2 \?\>/g, breadcrumb2)
    // Ajuster les URLs de breadcrumb pour le français (sans préfixe de langue)
    .replace(/https:\/\/www\.studiosport\.fr\/guides/g, 
      language === 'fr' 
        ? 'https://www.studiosport.fr/guides'
        : `https://www.studiosport.fr/${language}/${guidesDir}`);
  
  // Remplacer les variables PHP dans le footer
  const footerWithVariables = footerHtml
    .replace(/\<\?= date\('Y'\) \?\>/g, new Date().getFullYear().toString());
  
  // Traiter les URLs des images dans le contenu pour ce cocon spécifique
  const processedBody = content.body ? await processImageUrls(content.body, coconImagesDir) : '';
  const processedAside = content.aside ? await processImageUrls(content.aside, coconImagesDir) : '';
  
  // Combiner tous les éléments pour créer le HTML final
  const finalHtml = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  ${headWithVariables}
  <link rel="canonical" href="${url}" />
  ${hreflangTags}
</head>
<body>
  ${headerHtml}
  <section class="flex">
    <article class="content-main">
      ${processedBody}
    </article>
    <aside class="content-aside">
      ${processedAside}
    </aside>
  </section>
  ${footerWithVariables}
  ${otherHtml}
</body>
</html>`;
  
  return finalHtml;
}

/**
 * Supprime un export spécifique
 * @param exportName Le nom du dossier d'export à supprimer
 * @returns Un objet contenant le statut de l'opération
 */
export function deleteExport(exportName: string) {
  const exportPath = path.join(exportDirRoot, exportName);
  
  // Vérifier si l'export existe
  if (!fs.existsSync(exportPath)) {
    return {
      success: false,
      message: `L'export "${exportName}" n'existe pas.`
    };
  }
  
  try {
    // Fonction récursive pour supprimer un dossier et son contenu
    const deleteFolderRecursive = (folderPath: string) => {
      if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
          const curPath = path.join(folderPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            // Récursivement supprimer les sous-dossiers
            deleteFolderRecursive(curPath);
          } else {
            // Supprimer les fichiers
            fs.unlinkSync(curPath);
          }
        });
        // Supprimer le dossier vide
        fs.rmdirSync(folderPath);
      }
    };
    
    // Supprimer l'export
    deleteFolderRecursive(exportPath);
    
    return {
      success: true,
      message: `L'export "${exportName}" a été supprimé avec succès.`
    };
  } catch (error) {
    return {
      success: false,
      message: `Erreur lors de la suppression de l'export "${exportName}": ${error instanceof Error ? error.message : String(error)}`
    };
  }
}