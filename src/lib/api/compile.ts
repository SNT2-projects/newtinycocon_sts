import { fetchAllPublishedContent } from './directus';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Récupère le chemin absolu du répertoire exports
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exportDirRoot = path.join(__dirname, '..', '..', '..', 'exports');
const staticDir = path.join(__dirname, '..', '..', '..', 'static', 'export');

// Lire les fichiers statiques au démarrage
const headerHtml = fs.readFileSync(path.join(staticDir, 'header.php'), 'utf8');
const footerHtml = fs.readFileSync(path.join(staticDir, 'footer.php'), 'utf8');
const headHtml = fs.readFileSync(path.join(staticDir, 'head.php'), 'utf8');
const otherHtml = fs.readFileSync(path.join(staticDir, 'other.php'), 'utf8');
const styleContent = fs.readFileSync(path.join(staticDir, 'style.css'), 'utf8');

export async function compileAllContent(progressCallback?: (progress: number, total: number, stage: string) => void) {
  // Générer le nom du dossier d'export avec la date et l'heure actuelles
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
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
  
  // Le dossier assets sera créé pour chaque langue plus tard
  
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
  
  // Créer un index des cocons et articles
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
    
    const articleTitle = content.article.title;
    // Modification ici pour conserver les tirets dans le slug de l'article
    const articleSlug = articleTitle
      .toLowerCase()
      .replace(/\s+/g, '-');
    
    // Get the translated guides directory name
    const guidesDir = getGuidesTranslation(language);
    
    // Créer les dossiers nécessaires
    const contentPath = path.join(exportDir, language, guidesDir, coconSlug);
    fs.mkdirSync(contentPath, { recursive: true });
    
    // Générer le contenu HTML avec hreflang
    const articleInfo = articleMap.get(content.article.id);
    const htmlContent = generateHtml(content, articleInfo);
    
    // Écrire le fichier HTML
    const filePath = path.join(contentPath, `${articleSlug}.html`);
    const relativePath = path.relative(exportDir, filePath);
    fs.writeFileSync(filePath, htmlContent);
    
    // Ajouter à la liste des fichiers générés
    generatedFiles.push({
      coconTitle,
      coconSlug,
      articleTitle,
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
    const assetsDir = path.join(exportDir, language, guidesDir, 'assets', 'css');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Copier le fichier CSS dans le dossier assets de chaque langue
    fs.writeFileSync(path.join(assetsDir, 'style.css'), styleContent);
  }
  
  if (progressCallback) {
    progressCallback(100, 100, 'Export terminé');
  }
  
  return {
    exportName: exportDirName,
    filesCount: fileCount,
    path: exportDir
  };
}

function generateHtml(content: DirectusContent, articleInfo?: { coconTitle: string; articleTitle: string; languages: { language: string; content: DirectusContent; }[] }) {
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
  const breadcrumb2 = articleTitle.toLowerCase().replace(/\s+/g, '-');
  const url = `${PRODUCTION_URL}/${language}/${guidesDir}/${breadcrumb1}/${breadcrumb2}.html`;
  
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
      const hrefBreadcrumb2 = articleTitle.toLowerCase().replace(/\s+/g, '-');
      
      // Construire l'URL complète
      const langUrl = `${PRODUCTION_URL}/${langCode}/${langGuidesDir}/${hrefBreadcrumb1}/${hrefBreadcrumb2}.html`;
      
      return `<link rel="alternate" hreflang="${langCode}" href="${langUrl}" />`;
    }).join('\n');
    
    // Ajouter une balise hreflang par défaut (x-default)
    // Utiliser la première langue de la liste comme défaut
    const defaultLang = articleInfo.languages[0].language;
    const defaultGuidesDir = getGuidesTranslation(defaultLang);
    const defaultUrl = `${PRODUCTION_URL}/${defaultLang}/${defaultGuidesDir}/${breadcrumb1}/${breadcrumb2}.html`;
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
    .replace(/\<\?php echo \$breadcrumb2 \?\>/g, breadcrumb2);
  
  // Remplacer les variables PHP dans le footer
  const footerWithVariables = footerHtml
    .replace(/\<\?= date\('Y'\) \?\>/g, new Date().getFullYear().toString());
  
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
  <div class="content-wrapper">
    <div class="content-main">
      ${content.body || ''}
    </div>
    <div class="content-aside">
      ${content.aside || ''}
    </div>
  </div>
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