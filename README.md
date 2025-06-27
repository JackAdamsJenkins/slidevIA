# 🎯 Générateur de Présentations Slidev avec Gemini v2.0

> Application web React moderne pour créer des présentations professionnelles au format Slidev avec l'IA Google Gemini

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend**: React 19 + Vite 6 + JavaScript (ES2024)
- **UI Components**: Radix UI + shadcn/ui + Tailwind CSS 4
- **Animations**: Framer Motion + CSS3 avec accélération matérielle
- **IA**: Google Gemini API (communication directe)
- **Build Tool**: Vite avec Hot Module Replacement
- **Package Manager**: pnpm 10+
- **Linting**: ESLint 9 avec configuration moderne

### Architecture des Composants
```
src/
├── components/           # Composants UI réutilisables
│   ├── ui/              # Primitives UI (shadcn/ui + Radix)
│   ├── GenerationSettings.jsx     # Configuration avancée
│   ├── PresentationPlanEditor.jsx # Éditeur de plan interactif
│   ├── SlideEditor.jsx            # Éditeur de slides complet
│   ├── SlideViewer.jsx            # Visualiseur avec animations
│   ├── PresentationMode.jsx       # Mode présentateur dual-screen
│   ├── MultiWindowPresentation.jsx # Mode multi-fenêtres
│   └── PresentationHistory.jsx    # Historique avec persistance
├── hooks/               # Hooks personnalisés
│   ├── useApiKeyValidator.js      # Validation API Gemini
│   ├── useErrorHandler.js         # Gestion d'erreurs avancée
│   ├── useNetworkStatus.js        # Monitoring réseau
│   └── useLocalStorage.js         # Persistance locale
└── lib/                 # Utilitaires et helpers
    └── utils.js         # Fonctions utilitaires (cn, etc.)
```

## ✨ Nouveautés v2.0

🎉 **Version majeure avec architecture moderne et fonctionnalités avancées !**

### 🎨 Interface Utilisateur Moderne
- 🌙 **Thème sombre élégant** avec gradients et glassmorphism
- ✨ **Animations fluides** avec Framer Motion
- 📱 **Design responsive** adaptatif (desktop/mobile/tablette)
- 🎭 **Micro-interactions** et feedback visuel temps réel
- 🖥️ **Résolution normalisée 1920x1080** (16:9) pour toutes les présentations

### 🤖 IA et Génération Intelligente
- 📝 **Génération et modification du plan** avant création finale
- 🎛️ **Paramètres avancés** : nombre de slides (1-50), styles, niveau de détail
- 🎤 **Notes présentateur** générées automatiquement par l'IA
- 🎯 **5 styles de présentation** : Professionnel, Éducatif, Créatif, Technique, Business
- 🔧 **Validation API en temps réel** avec retry automatique

### 🛠️ Outils d'Édition Avancés
- ✏️ **Éditeur complet** avec onglets (Contenu, Notes, Aperçu)
- 🔧 **Support Markdown amélioré** (titres, listes, formatage, code)
- 📋 **Gestion des slides** : ajout, suppression, réorganisation par glisser-déposer
- 💾 **Auto-sauvegarde** et récupération des brouillons
- 🖥️ **Historique optimisé** avec interface PC native

### 🎭 Mode Présentateur Professionnel
- 🖥️ **Mode dual-screen** avec écran de contrôle et présentation
- ⏱️ **Timer intégré** avec play/pause/reset
- ⌨️ **Raccourcis clavier** complets (navigation, plein écran, notes)
- 📊 **Indicateurs de progression** et navigation intuitive
- 🌐 **Mode multi-fenêtres** pour configurations complexes

[📖 Voir le détail des nouvelles fonctionnalités](./NOUVELLES-FONCTIONNALITES.md)

## 🚀 Fonctionnalités Principales

### 🎨 Interface Utilisateur Moderne
- **Design glassmorphism** avec gradients dynamiques et effets de transparence
- **Animations fluides** : Framer Motion + CSS3 avec accélération matérielle
- **Thème sombre élégant** : Palette de couleurs bleu/violet harmonisée
- **Responsive design** : Adaptation intelligente desktop/tablette/mobile
- **Micro-interactions** : Feedback visuel instantané et transitions subtiles

### 🤖 Intelligence Artificielle Avancée
- **Google Gemini API** : Communication directe sans serveur backend
- **Génération de plans** : IA crée un plan détaillé modifiable
- **Styles adaptatifs** : 5 modes de présentation (Professionnel, Éducatif, Créatif, Technique, Business)
- **Notes contextuelles** : Génération automatique de notes présentateur
- **Retry intelligent** : Gestion d'erreurs avec backoff exponentiel

### 🛠️ Outils d'Édition Professionnels
- **Éditeur Markdown** : Support complet avec prévisualisation temps réel
- **Gestion de slides** : Ajout, suppression, réorganisation par glisser-déposer
- **Édition modale** : Interface d'édition avec onglets (Contenu/Notes/Aperçu)
- **Auto-sauvegarde** : Persistance locale automatique des brouillons
- **Validation temps réel** : Contrôles de format et de contenu

### 📱 Workflow d'Utilisation Optimisé
1. **Configuration** : API Gemini + Prompt + Paramètres de génération
2. **Plan interactif** : Génération et modification du plan de présentation
3. **Génération IA** : Création automatique des slides avec notes
4. **Édition avancée** : Modification manuelle complète et personnalisation
5. **Présentation** : Mode présentateur dual-screen avec contrôles avancés

### 🎭 Mode Présentateur Professionnel
- **Dual-screen** : Écran de contrôle séparé et écran de présentation
- **Timer intégré** : Chronométrage avec play/pause/reset
- **Navigation avancée** : Raccourcis clavier et contrôles tactiles
- **Mode plein écran** : Présentation immersive avec overlay discret
- **Multi-fenêtres** : Support configurations d'écrans complexes

## 🔧 Installation et Configuration

### Prérequis
- **Node.js** 18+ ou 20+ (recommandé)
- **pnpm** 10+ (package manager moderne)
- **Navigateur moderne** : Chrome 100+, Firefox 100+, Safari 16+, Edge 100+

### Installation Rapide

```powershell
# Cloner le projet
git clone <repository-url>
cd slidev-2

# Installer les dépendances avec pnpm
pnpm install

# Démarrer le serveur de développement
pnpm run dev

# Ouvrir http://localhost:5173
```

### Scripts Disponibles

```json
{
  "dev": "vite",              # Serveur de développement avec HMR
  "build": "vite build",      # Build de production optimisé
  "preview": "vite preview",  # Prévisualisation du build
  "lint": "eslint ."          # Analyse du code avec ESLint
}
```

### Configuration API Gemini
1. Rendez-vous sur [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Créez une nouvelle clé API
3. Copiez la clé dans l'interface de l'application
4. La validation s'effectue automatiquement

## 🎯 Guide d'Utilisation Détaillé

### 1. Configuration Initiale
- **Clé API Gemini** : Obtenez votre clé sur [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Validation automatique** : L'application vérifie la validité de votre clé en temps réel
- **Prompt principal** : Décrivez le sujet de votre présentation (min. 10 caractères)
- **Paramètres avancés** : Configurez le nombre de slides, style et niveau de détail

### 2. Génération et Édition du Plan
- **Génération IA** : Cliquez sur "Générer le plan" pour créer un plan structuré
- **Édition interactive** : 
  - Modifiez titres et descriptions de chaque slide
  - Réorganisez par glisser-déposer
  - Ajoutez ou supprimez des slides
  - Prévisualisez les modifications en temps réel
- **Validation** : Confirmez avec "Générer la présentation"

### 3. Génération des Slides
- **Création automatique** : L'IA génère le contenu complet basé sur votre plan
- **Format Slidev** : Markdown optimisé pour Slidev avec métadonnées
- **Notes présentateur** : Génération automatique de notes contextuelles
- **Résolution standardisée** : Format 1920x1080 (16:9) professionnel

### 4. Édition Avancée des Slides
- **Éditeur modal** : Interface avec onglets Contenu/Notes/Aperçu
- **Support Markdown** : Syntaxe complète avec prévisualisation temps réel
- **Gestion des slides** :
  - Navigation intuitive entre slides
  - Ajout/suppression de slides
  - Réorganisation (monter/descendre)
- **Auto-sauvegarde** : Persistance automatique des modifications

### 5. Mode Présentation
- **Mode simple** : Plein écran avec contrôles overlay
- **Mode présentateur** : Écran dual avec notes et timer
- **Mode multi-fenêtres** : Configuration avancée pour plusieurs écrans
- **Navigation** : Raccourcis clavier et contrôles tactiles
- **Timer professionnel** : Chronométrage avec indicateurs visuels

## ⌨️ Raccourcis Clavier et Contrôles

### Mode Présentation
| Touche | Action | Description |
|--------|--------|-------------|
| `→` `Espace` | Slide suivante | Navigation vers l'avant |
| `←` | Slide précédente | Navigation vers l'arrière |
| `F` `F11` | Basculer plein écran | Mode immersif |
| `P` | Mode présentateur | Affichage dual-screen |
| `N` | Afficher/masquer notes | Basculer les notes |
| `T` | Timer play/pause | Contrôle du chronométrage |
| `R` | Reset timer | Remettre à zéro |
| `Échap` | Quitter mode | Retour à l'éditeur |
| `Home` | Première slide | Navigation rapide |
| `End` | Dernière slide | Navigation rapide |

### Mode Édition
| Raccourci | Action | Description |
|-----------|--------|-------------|
| `Ctrl + S` | Sauvegarder | Auto-sauvegarde locale |
| `Ctrl + Z` | Annuler | Historique des modifications |
| `Ctrl + Enter` | Aperçu | Prévisualisation temps réel |
| `Tab` | Navigation | Entre les éléments d'interface |

## 🎨 Paramètres de Génération Avancés

### Nombre de Slides
- **Automatique** : 5-8 slides optimales (recommandé)
- **Personnalisé** : 1 à 50 slides selon vos besoins
- **Adaptation intelligente** : L'IA adapte le contenu au nombre choisi

### Styles de Présentation
- **👔 Professionnel** : Ton formel, structuré, orienté business
- **🎓 Éducatif** : Approche pédagogique, exemples concrets
- **🎨 Créatif** : Innovant, original, storytelling
- **⚙️ Technique** : Détaillé, précis, orienté expertise
- **💼 Business** : Orienté résultats, métriques, ROI

### Niveau de Détail
- **Concis** : Points clés essentiels, présentation courte
- **Équilibré** : Mix optimal contenu/clarté (recommandé)
- **Détaillé** : Informations approfondies, exemples nombreux

### Options de Contenu Avancées
- ✅ **Notes présentateur** : Générées automatiquement par l'IA
- ✅ **Slide de conclusion** : Résumé et appel à l'action
- ✅ **Slide de titre** : Page de garde professionnelle
- ⚙️ **Métadonnées Slidev** : Configuration automatique (thème, layout)

## 🏗️ Architecture et Technologies

### Stack Frontend Moderne
```json
{
  "runtime": "React 19 + Vite 6",
  "styling": "Tailwind CSS 4 + shadcn/ui",
  "components": "Radix UI primitives",
  "animations": "Framer Motion + CSS3",
  "forms": "React Hook Form + Zod",
  "state": "React Hooks + Context",
  "build": "Vite avec optimisations",
  "package": "pnpm avec workspace"
}
```

### Composants UI Réutilisables (shadcn/ui)
- **Primitives** : Button, Input, Card, Dialog, Sheet, Tabs
- **Data Display** : Table, Badge, Avatar, Progress, Chart
- **Navigation** : Menubar, Navigation Menu, Breadcrumb
- **Forms** : Select, Checkbox, Radio Group, Switch, Slider
- **Feedback** : Alert, Toast (Sonner), Skeleton, Spinner
- **Layout** : Separator, Resizable Panels, Scroll Area
### Hooks Personnalisés et Utilitaires
```javascript
// Gestion d'état et persistance
useLocalStorage()       // Persistance locale avec versioning
useApiKeyValidator()    // Validation API Gemini temps réel
useErrorHandler()       // Gestion d'erreurs avec retry intelligent
useNetworkStatus()      // Monitoring connexion réseau

// Fonctions utilitaires
cn()                   // Class merging avec tailwind-merge
formatTime()           // Formatage temporel pour timer
validateMarkdown()     // Validation syntaxe Markdown
exportToSlidev()       // Export format Slidev optimisé
```

## 📁 Structure du Projet Détaillée

```
slidev-2/
├── 📋 Configuration
│   ├── package.json           # Dépendances et scripts pnpm
│   ├── vite.config.js         # Configuration Vite + plugins
│   ├── tailwind.config.js     # Configuration Tailwind CSS 4
│   ├── eslint.config.js       # Linting moderne ESLint 9
│   ├── jsconfig.json          # Configuration JavaScript/JSX
│   └── components.json        # Configuration shadcn/ui
│
├── 🎨 Interface Utilisateur
│   ├── src/
│   │   ├── 🧩 components/
│   │   │   ├── ui/                    # Primitives shadcn/ui (34 composants)
│   │   │   │   ├── button.jsx         # Boutons avec variants
│   │   │   │   ├── card.jsx           # Cartes avec glassmorphism
│   │   │   │   ├── dialog.jsx         # Modales et overlays
│   │   │   │   ├── sheet.jsx          # Panneaux latéraux
│   │   │   │   ├── tabs.jsx           # Navigation onglets
│   │   │   │   └── ...                # 29 autres composants
│   │   │   │
│   │   │   ├── 📝 GenerationSettings.jsx      # Configuration avancée IA
│   │   │   ├── 📋 PresentationPlanEditor.jsx  # Éditeur plan interactif
│   │   │   ├── ✏️ SlideEditor.jsx             # Éditeur slides modal
│   │   │   ├── 👁️ SlideViewer.jsx            # Visualiseur avec animations
│   │   │   ├── 🎭 PresentationMode.jsx        # Mode présentateur complet
│   │   │   ├── 🖥️ MultiWindowPresentation.jsx # Mode multi-écrans
│   │   │   └── 📚 PresentationHistory.jsx     # Historique persistant
│   │   │
│   │   ├── 🪝 hooks/
│   │   │   ├── useApiKeyValidator.js   # Validation Gemini API
│   │   │   ├── useErrorHandler.js      # Gestion erreurs + retry
│   │   │   ├── useNetworkStatus.js     # Status connexion
│   │   │   └── useLocalStorage.js      # Persistance + versioning
│   │   │
│   │   ├── 🛠️ lib/
│   │   │   └── utils.js               # Fonctions utilitaires
│   │   │
│   │   ├── 🎨 assets/
│   │   ├── 📱 App.jsx                 # Composant racine (691 lignes)
│   │   ├── 🎨 App.css                 # Styles et animations
│   │   ├── 🎨 index.css               # Styles globaux
│   │   └── 🚀 main.jsx                # Point d'entrée React
│
├── 📖 Documentation
│   ├── README.md                      # Documentation principale
│   ├── NOUVELLES-FONCTIONNALITES.md  # Détail des améliorations v2.0
│   ├── GUIDE-UTILISATION.md           # Guide utilisateur complet
│   ├── CORRECTIONS-APPLIQUEES.md      # Historique des corrections
│   └── exemple-presentation.md        # Exemple de sortie Slidev
│
└── 🌐 Assets publics
    ├── public/
    │   ├── favicon.ico               # Icône application
    │   └── index.html                # Template HTML
    └── pnpm-lock.yaml                # Lock file dependencies
```

## 🔐 Sécurité et Architecture

### Architecture Front-end Pure
- **🚀 100% Client-side** : Aucun serveur backend nécessaire
- **🔒 Données locales** : Stockage exclusivement dans le navigateur (localStorage)
- **🌐 API directe** : Communication directe avec Google Gemini API
- **🔑 Sécurité des clés** : Encodage base64 local, pas de transmission serveur
- **⚡ Performance** : Pas de latence serveur, traitement instantané

### Gestion des Données
```javascript
// Stockage local avec versioning
{
  "presentations": [],      // Historique des présentations
  "drafts": {},            // Brouillons auto-sauvegardés  
  "settings": {},          // Paramètres utilisateur
  "apiKey": "encoded",     // Clé API encodée
  "version": "2.0"         // Version format données
}
```

### Conformité et Confidentialité
- ✅ **RGPD Compatible** : Aucune donnée transmise à des tiers
- ✅ **Données chiffrées** : Clé API encodée en base64
- ✅ **Pas de tracking** : Aucun service d'analytics tiers
- ✅ **Open Source** : Code transparent et auditable

## 🌟 Fonctionnalités Avancées et Optimisations

### 💾 Persistance Intelligente
- **Auto-sauvegarde** : Sauvegarde toutes les 30 secondes
- **Historique versioned** : Garde les 10 dernières présentations
- **Récupération de session** : Restauration automatique après crash
- **Export/Import** : Sauvegarde complète des données utilisateur
- **Migration automatique** : Mise à jour des formats de données

### 🛡️ Gestion d'Erreurs Avancée
```javascript
// Système de retry intelligent
const retryConfig = {
  maxRetries: 3,
  backoffFactor: 2,        // Délai exponentiel
  initialDelay: 1000,      // 1s, puis 2s, puis 4s
  retryableErrors: [       // Erreurs temporaires
    'RATE_LIMIT_EXCEEDED',
    'SERVICE_UNAVAILABLE',
    'NETWORK_ERROR'
  ]
}
```

### ⚡ Optimisations Performance
- **🎨 CSS3 Hardware Acceleration** : Animations GPU-accélérées
- **📦 Code Splitting** : Chargement optimisé des composants
- **🔄 State Management** : Hooks optimisés avec useMemo/useCallback
- **📱 Responsive Images** : Adaptation automatique résolutions
- **⚡ Vite HMR** : Hot Module Replacement ultra-rapide

### 🎯 Accessibilité (A11Y)
- **⌨️ Navigation clavier** : Support complet raccourcis
- **🔍 Screen readers** : ARIA labels et semantic HTML
- **🎨 Contrastes élevés** : Respect WCAG 2.1 AA
- **📱 Mobile-first** : Interface tactile optimisée
- **🎭 Focus management** : Navigation modale intelligente

## 📱 Compatibilité et Prérequis

### Navigateurs Supportés
| Navigateur | Version Minimale | Fonctionnalités |
|------------|------------------|-----------------|
| **Chrome** | 100+ | ✅ Toutes fonctionnalités |
| **Firefox** | 100+ | ✅ Toutes fonctionnalités |
| **Safari** | 16+ | ✅ Toutes fonctionnalités |
| **Edge** | 100+ | ✅ Toutes fonctionnalités |
| **Mobile Chrome** | 100+ | ✅ Interface adaptée |
| **Mobile Safari** | 16+ | ✅ Interface adaptée |

### Résolutions Optimisées
- **🖥️ Desktop** : 1920x1080 (16:9) - Résolution native
- **💻 Laptop** : 1366x768, 1440x900 - Adaptation fluide
- **📱 Tablette** : 1024x768 (4:3) - Interface responsive
- **📱 Mobile** : 375x667+ - Interface tactile optimisée

### Fonctionnalités Navigateur Requises
- ✅ **ES2022+** : Modules, async/await, optional chaining
- ✅ **CSS3** : Grid, Flexbox, Custom Properties, Animations
- ✅ **APIs Web** : localStorage, Fetch API, Intersection Observer
- ✅ **JavaScript** : Classes, Destructuring, Template Literals

## 🤝 Contribution et Développement

### Technologies Utilisées
```json
{
  "dependencies": {
    "react": "^19.1.0",                    // Framework UI moderne
    "react-dom": "^19.1.0",               // DOM renderer
    "react-hook-form": "^7.56.3",         // Gestion formulaires
    "react-router-dom": "^7.6.1",         // Routing client-side
    "framer-motion": "^12.15.0",          // Animations fluides
    "lucide-react": "^0.510.0",           // Icônes modernes
    "tailwindcss": "^4.1.7",              // CSS utility-first
    "clsx": "^2.1.1",                     // Conditional classes
    "tailwind-merge": "^3.3.0",           // Class deduplication
    "zod": "^3.24.4"                      // Validation schémas
  },
  "radixUI": {
    "@radix-ui/react-dialog": "^1.1.13",  // Modales accessibles
    "@radix-ui/react-tabs": "^1.1.11",    // Onglets
    "@radix-ui/react-select": "^2.2.4",   // Sélecteurs
    "@radix-ui/react-tooltip": "^1.2.6"   // Tooltips
  }
}
```

### Architecture de Développement
```bash
# Environnement de développement
pnpm run dev          # Serveur Vite avec HMR
pnpm run build        # Build production optimisé
pnpm run preview      # Test du build local
pnpm run lint         # Analyse qualité code

# Hooks de développement
git add .
git commit -m "feat: nouvelle fonctionnalité"
pnpm run lint         # Validation automatique
```

### Standards de Code
- **📝 ESLint 9** : Configuration moderne avec rules React
- **🎨 Prettier** : Formatage automatique du code
- **🔧 Conventional Commits** : Messages de commit standardisés
- **📦 pnpm Workspaces** : Gestion optimisée des dépendances

### Guide de Contribution
1. **🍴 Fork** du repository principal
2. **🌿 Branch feature** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **💻 Développement** : Respect des standards de code
4. **🧪 Tests** : Validation fonctionnelle complète
5. **📝 Documentation** : Mise à jour README et commentaires
6. **🔄 Pull Request** : Description détaillée des changements

### Roadmap et Améliorations Futures
- 🔮 **IA Multi-modèles** : Support Claude, GPT-4, Llama
- 🎥 **Export vidéo** : Génération de présentations animées
- 🌍 **Internationalisation** : Support multi-langues
- 🔄 **Collaboration temps réel** : Édition collaborative
- 📊 **Analytics** : Métriques de présentation
- 🎨 **Thèmes personnalisés** : Éditeur de thèmes visuels

## 📄 Licence et Légal

### Licence MIT
```
MIT License

Copyright (c) 2025 Générateur de Présentations Slidev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

### Crédits et Remerciements
- **🤖 Google Gemini** : API d'intelligence artificielle
- **⚛️ React Team** : Framework et ecosystem
- **🎨 Radix UI** : Primitives UI accessibles
- **💨 Tailwind CSS** : Framework CSS utility-first
- **⚡ Vite** : Build tool moderne et rapide
- **🎭 Framer Motion** : Bibliothèque d'animations

## 🆘 Support et Dépannage

### Problèmes Courants

#### 🔑 Problèmes d'API
```bash
# Erreur : "Invalid API Key"
1. Vérifiez votre clé sur https://aistudio.google.com/app/apikey
2. Rechargez la page et ressaisissez la clé
3. Vérifiez votre connexion internet

# Erreur : "Rate limit exceeded"
1. Attendez 1-2 minutes avant de réessayer
2. L'application retry automatiquement
3. Vérifiez les quotas de votre compte Gemini
```

#### 🐛 Problèmes Techniques
```bash
# Erreur de build
pnpm install --force    # Réinstallation des dépendances
pnpm run dev            # Redémarrage du serveur

# Problème de performance
# Vider le cache du navigateur (Ctrl+Shift+R)
# Vérifier les extensions navigateur conflictuelles
```

### Canaux de Support
1. **📖 Documentation** : Consultez les fichiers MD du projet
2. **🐛 Issues GitHub** : Rapportez bugs et suggestions
3. **💬 Discussions** : Questions et partage d'expériences
4. **📧 Contact** : Support technique pour problèmes critiques

### Logs et Diagnostic
```javascript
// Console développeur (F12) pour diagnostic
console.log('[APP] Version:', '2.0');
console.log('[API] Status:', apiStatus);
console.log('[Storage]:', localStorage.getItem('slidev-data'));
```

---

**🚀 Créé avec ❤️ et l'IA Google Gemini**

> *Application moderne React pour la génération de présentations Slidev avec intelligence artificielle*

