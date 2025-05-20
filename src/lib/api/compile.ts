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

export async function compileAllContent() {
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
  
  // Créer le dossier assets pour les styles et autres ressources
  const assetsDir = path.join(exportDir, 'assets', 'content');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  // Copier le fichier CSS dans le dossier assets
  fs.writeFileSync(path.join(assetsDir, 'style.css'), styleContent);
  
  // Récupérer tous les contenus publiés
  const response = await fetchAllPublishedContent();
  const contents = response.data as DirectusContent[];
  
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
  
  // Générer les fichiers HTML pour chaque contenu
  for (const content of contents) {
    // Vérifier que le contenu a toutes les données nécessaires
    if (!content.article || !content.article.cocon || !content.language) {
      console.warn('Contenu incomplet ignoré:', content.id);
      continue;
    }
    
    // Extraire uniquement les deux premiers caractères du code de langue
    const language = content.language.substring(0, 2).toLowerCase();
    
    const coconTitle = content.article.cocon.title;
    const coconSlug = coconTitle
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_');
    
    const articleTitle = content.article.title;
    const articleSlug = articleTitle
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_');
    
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
  }
  
  // Générer les index pour chaque cocon et langue
  const langCoconMap = new Map<string, Set<string>>();
  
  generatedFiles.forEach(file => {
    const key = `${file.language}_${file.coconSlug}`;
    if (!langCoconMap.has(key)) {
      langCoconMap.set(key, new Set<string>());
    }
    langCoconMap.get(key)?.add(file.coconSlug);
  });
  
  // Créer des index par cocon et langue
  for (const [key, coconSet] of langCoconMap.entries()) {
    const [language, coconSlug] = key.split('_');
    
    // Trouver les informations du cocon
    const coconGroup = coconGroups.find(cg => 
      cg.coconTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_') === coconSlug
    );
    
    if (!coconGroup) continue;
    
    const coconTitle = coconGroup.coconTitle;
    const guidesDir = getGuidesTranslation(language);
    const indexDir = path.join(exportDir, language, guidesDir, coconSlug);
    
    // Créer un index pour ce cocon et cette langue
    const indexContent = generateCoconIndex(coconTitle, language, coconGroup, language);
    fs.writeFileSync(path.join(indexDir, 'index.html'), indexContent);
  }
  
  // Créer un index principal par langue
  const languages = Array.from(new Set(generatedFiles.map(file => file.language)));
  
  for (const language of languages) {
    const guidesDir = getGuidesTranslation(language);
    const indexDir = path.join(exportDir, language, guidesDir);
    if (!fs.existsSync(indexDir)) {
      fs.mkdirSync(indexDir, { recursive: true });
    }
    
    const langCocons = Array.from(langCoconMap.entries())
      .filter(([key]) => key.startsWith(`${language}_`))
      .map(([key]) => {
        const coconSlug = key.split('_')[1];
        const coconGroup = coconGroups.find(cg => 
          cg.coconTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_') === coconSlug
        );
        return coconGroup;
      })
      .filter((cg): cg is CoconGroup => cg !== undefined);
    
    const indexContent = generateLanguageIndex(language, langCocons);
    fs.writeFileSync(path.join(indexDir, 'index.html'), indexContent);
  }
  
  // Créer un index principal
  const mainIndexContent = generateMainIndex(languages, coconGroups);
  fs.writeFileSync(path.join(exportDir, 'index.html'), mainIndexContent);
  
  return {
    exportName: exportDirName,
    filesCount: fileCount,
    path: exportDir
  };
}

// Générer l'index principal
function generateMainIndex(languages: string[], coconGroups: CoconGroup[]): string {
  const languagesHtml = languages.map(lang => {
    const guidesDir = getGuidesTranslation(lang);
    return `<li><a href="${PRODUCTION_URL}/${lang}/${guidesDir}/">${lang.toUpperCase()}</a></li>`;
  }).join('\n');
  
  const coconsList = coconGroups.map(cg => {
    const coconSlug = cg.coconTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
    return `<li>
      <strong>${cg.coconTitle}</strong> (${cg.articles.length} articles)
      <ul>
        ${languages.map(lang => {
          const guidesDir = getGuidesTranslation(lang);
          return `<li><a href="${PRODUCTION_URL}/${lang}/${guidesDir}/${coconSlug}/">${lang.toUpperCase()}</a></li>`;
        }).join('\n')}
      </ul>
    </li>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index des guides studioSPORT</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2 {
      color: #2b89b5;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
    }
    .sidebar {
      flex: 1;
      min-width: 250px;
      margin-right: 20px;
    }
    .content {
      flex: 3;
    }
    ul {
      padding-left: 20px;
    }
    a {
      color: #2b89b5;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #efefef;
      color: #666;
      font-size: 0.8em;
    }
  </style>
</head>
<body>
  <h1>Index des guides studioSPORT</h1>
  <p>Export généré le ${new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}</p>
  
  <div class="container">
    <div class="sidebar">
      <h2>Langues disponibles</h2>
      <ul>
        ${languagesHtml}
      </ul>
    </div>
    
    <div class="content">
      <h2>Cocons</h2>
      <ul>
        ${coconsList}
      </ul>
    </div>
  </div>
</body>
</html>`;
}

// Générer un index par langue
function generateLanguageIndex(language: string, coconGroups: CoconGroup[]): string {
  const guidesDir = getGuidesTranslation(language);
  
  const coconsList = coconGroups.map(cg => {
    const coconSlug = cg.coconTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
    const articlesList = cg.articles.map(article => {
      const hasLangContent = article.contents.some(content => 
        content.language.toLowerCase().startsWith(language)
      );
      
      if (!hasLangContent) return '';
      
      const articleSlug = article.articleTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
      return `<li><a href="${PRODUCTION_URL}/${language}/${guidesDir}/${coconSlug}/${articleSlug}.html">${article.articleTitle}</a></li>`;
    }).filter(html => html !== '').join('\n');
    
    return `<div class="cocon-card">
      <h3><a href="${PRODUCTION_URL}/${language}/${guidesDir}/${coconSlug}/">${cg.coconTitle}</a></h3>
      <ul>
        ${articlesList}
      </ul>
    </div>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guides studioSPORT - ${language.toUpperCase()}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2b89b5;
    }
    .cocon-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    .cocon-card {
      flex: 1 1 calc(33% - 20px);
      min-width: 300px;
      border: 1px solid #eee;
      padding: 15px;
      border-radius: 5px;
    }
    ul {
      padding-left: 20px;
    }
    a {
      color: #2b89b5;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .breadcrumb {
      margin-bottom: 20px;
      color: #666;
    }
    .breadcrumb a {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="breadcrumb">
    <a href="${PRODUCTION_URL}/">Accueil</a> &gt; ${language.toUpperCase()}
  </div>

  <h1>Guides studioSPORT - ${language.toUpperCase()}</h1>
  <p>Tous les guides disponibles en ${language.toUpperCase()}</p>
  
  <div class="cocon-container">
    ${coconsList}
  </div>
</body>
</html>`;
}

// Générer un index par cocon et langue
function generateCoconIndex(coconTitle: string, language: string, coconGroup: CoconGroup, displayLang: string): string {
  const guidesDir = getGuidesTranslation(language);
  
  const articlesList = coconGroup.articles.map(article => {
    const langContents = article.contents.filter(content => 
      content.language.toLowerCase().startsWith(language)
    );
    
    if (langContents.length === 0) return '';
    
    const articleSlug = article.articleTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
    const coconSlug = coconTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
    
    return `<li>
      <a href="${PRODUCTION_URL}/${language}/${guidesDir}/${coconSlug}/${articleSlug}.html">${article.articleTitle}</a>
      <span class="status-badge">${langContents.length} version${langContents.length > 1 ? 's' : ''}</span>
    </li>`;
  }).filter(html => html !== '').join('\n');
  
  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${coconTitle} - Guides studioSPORT ${displayLang.toUpperCase()}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2 {
      color: #2b89b5;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 10px;
    }
    a {
      color: #2b89b5;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #efefef;
      color: #666;
      font-size: 0.8em;
      margin-left: 10px;
    }
    .breadcrumb {
      margin-bottom: 20px;
      color: #666;
    }
    .breadcrumb a {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="breadcrumb">
    <a href="${PRODUCTION_URL}/">Accueil</a> &gt; 
    <a href="${PRODUCTION_URL}/${language}/${guidesDir}/">${displayLang.toUpperCase()}</a> &gt; ${coconTitle}
  </div>

  <h1>${coconTitle}</h1>
  <p>Articles disponibles en ${displayLang.toUpperCase()}</p>
  
  <ul class="articles-list">
    ${articlesList}
  </ul>
</body>
</html>`;
}

function generateHtml(content: DirectusContent, articleInfo?: { coconTitle: string; articleTitle: string; languages: { language: string; content: DirectusContent; }[] }) {
  // Variables pour les templates PHP
  const title = content.title || content.meta_title || 'Sans titre';
  const description = content.description || '';
  const language = content.language.toLowerCase().substring(0, 2);
  const articleTitle = content.article.title;
  const coconTitle = content.article.cocon.title;
  const body = content.body || '<p>Pas de contenu disponible</p>';
  
  // Get the translated guides directory name
  const guidesDir = getGuidesTranslation(language);
  
  // Variables pour les fils d'ariane
  const breadcrumb1 = coconTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
  const breadcrumb2 = articleTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
  const url = `${PRODUCTION_URL}/${language}/${guidesDir}/${breadcrumb1}/${breadcrumb2}.html`;
  
  // Générer les balises hreflang
  let hreflangTags = '';
  
  // Ajouter la balise hreflang pour la page courante (self-reference)
  hreflangTags += `<link rel="alternate" hreflang="${language}" href="${url}" />\n`;
  
  // Ajouter les balises hreflang pour les autres langues disponibles pour cet article
  if (articleInfo && articleInfo.languages.length > 0) {
    articleInfo.languages.forEach(langInfo => {
      if (langInfo.language !== language) {  // Skip la langue courante (déjà ajoutée)
        const langGuidesDir = getGuidesTranslation(langInfo.language);
        const langUrl = `${PRODUCTION_URL}/${langInfo.language}/${langGuidesDir}/${breadcrumb1}/${breadcrumb2}.html`;
        hreflangTags += `<link rel="alternate" hreflang="${langInfo.language}" href="${langUrl}" />\n`;
      }
    });
  }
  
  // Ajouter la balise hreflang x-default (page par défaut, généralement en anglais ou la principale)
  const defaultLang = 'fr';  // On utilise le français comme langue par défaut
  const defaultGuidesDir = getGuidesTranslation(defaultLang);
  const defaultUrl = `${PRODUCTION_URL}/${defaultLang}/${defaultGuidesDir}/${breadcrumb1}/${breadcrumb2}.html`;
  hreflangTags += `<link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`;
  
  // Remplacer les variables PHP dans le head
  const processedHead = headHtml
    .replace(/\<\?php echo \$title \?\>/g, title)
    .replace(/\<\?php echo \$desc \?\>/g, description)
    .replace(/\<\?php echo \$url \?\>/g, url)
    .replace(/\<\?php echo \$breadcrumb1 \?\>/g, breadcrumb1)
    .replace(/\<\?php echo \$breadcrumb2 \?\>/g, breadcrumb2);
  
  // Remplacer la fonction PHP date dans le footer
  const processedFooter = footerHtml
    .replace(/\<\?= date\('Y'\) \?\>/g, new Date().getFullYear().toString());
  
  // Construire le HTML complet
  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  ${processedHead}
  <!-- Balises hreflang pour l'internationalisation -->
  ${hreflangTags}
</head>
<body>
  ${otherHtml}
  ${headerHtml}
  
  <div class="container">
    <nav class="breadcrumbs">
      <ol>
        <li><a href="${PRODUCTION_URL}/">Accueil</a></li>
        <li><a href="${PRODUCTION_URL}/${language}/${guidesDir}/">${guidesDir.charAt(0).toUpperCase() + guidesDir.slice(1)}</a></li>
        <li><a href="${PRODUCTION_URL}/${language}/${guidesDir}/${breadcrumb1}/">${coconTitle}</a></li>
        <li>${articleTitle}</li>
      </ol>
    </nav>
    
    <div class="content-wrapper">
      <article class="guide-content">
        <header>
          <h1>${title}</h1>
          ${description ? `<p class="description">${description}</p>` : ''}
          <div class="meta">
            <div class="category">Guide: ${coconTitle}</div>
            <div class="article">Article: ${articleTitle}</div>
            <div class="language">Langue: ${language.toUpperCase()}</div>
          </div>
        </header>
        
        <div class="article-body">
          ${body}
        </div>
        
        <footer class="article-footer">
          <div class="update-date">
            Dernière mise à jour: ${new Date(content.date_updated || content.date_created || new Date()).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </div>
        </footer>
      </article>
      
      <aside class="related-guides">
        <h2>Sur le même sujet</h2>
        <ul>
          <li><a href="${PRODUCTION_URL}/${language}/${guidesDir}/${breadcrumb1}/">Voir tous les guides sur ${coconTitle}</a></li>
        </ul>
      </aside>
    </div>
  </div>
  
  ${processedFooter}
  
  <script>
    // Ajout de scripts spécifiques aux pages de guide
    document.addEventListener('DOMContentLoaded', function() {
      // Ajouter des classes pour les images et tableaux dans le contenu
      const articleBody = document.querySelector('.article-body');
      if (articleBody) {
        // Images
        const images = articleBody.querySelectorAll('img');
        images.forEach(img => {
          img.classList.add('img-responsive');
          // Ajouter le wrapper pour le centrage si pas déjà fait
          if (img.parentElement.nodeName !== 'DIV' || !img.parentElement.classList.contains('image-centre')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('image-centre');
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
          }
        });
        
        // Tableaux
        const tables = articleBody.querySelectorAll('table');
        tables.forEach(table => {
          table.classList.add('table', 'table-responsive');
          // Ajouter un div wrapper pour la responsivité si pas déjà fait
          if (table.parentElement.nodeName !== 'DIV' || !table.parentElement.classList.contains('table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('table-wrapper');
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
          }
        });
      }
    });
  </script>
</body>
</html>`;
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