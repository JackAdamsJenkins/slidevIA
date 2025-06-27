# 🎯 Générateur de Présentations Slidev avec Gemini v2.0

> Outil web React.js avancé pour créer des présentations professionnelles au format Slidev avec l'IA Gemini

## ✨ Nouveautés v2.0

🎉 **Version majeure avec de nombreuses améliorations !**

- 🖥️ **Résolution normalisée 1920x1080** pour toutes les présentations
- ✨ **Animations fluides** et transitions professionnelles
- 📝 **Génération et modification du plan** avant la création finale
- 🎛️ **Choix du nombre de slides** (1-50 ou automatique)
- 🖥️ **Historique PC corrigé** avec interface optimisée
- ✏️ **Édition manuelle complète** des slides
- 🔧 **Affichage Markdown corrigé** (titres, listes, formatage)
- 🎤 **Notes présentateur** générées automatiquement
- 🎭 **Mode présentateur professionnel** avec timer et contrôles

[📖 Voir le détail des nouvelles fonctionnalités](./NOUVELLES-FONCTIONNALITES.md)

## 🚀 Fonctionnalités Principales

### 🎨 Interface Moderne
- Design glassmorphism avec gradients
- Animations fluides et micro-interactions
- Interface responsive (desktop/mobile)
- Indicateurs visuels de statut

### 🤖 IA Intégrée
- Génération automatique de plans détaillés
- Création de contenu riche en Markdown
- Notes présentateur contextuelles
- Styles de présentation personnalisables

### 🛠️ Outils Avancés
- Éditeur de slides avec aperçu temps réel
- Mode présentateur dual-screen
- Timer intégré et raccourcis clavier
- Historique et sauvegarde automatique

### 📱 Workflow Optimisé
1. **Configuration** : API + Prompt + Paramètres
2. **Plan** : Génération et modification du plan
3. **Génération** : Création des slides avec IA
4. **Édition** : Modification manuelle complète
5. **Présentation** : Mode présentateur professionnel

## 🔧 Installation

```bash
# Cloner ou extraire le projet
cd slidev-generator

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm run dev
```

## 🎯 Utilisation

### 1. Configuration
- Obtenez votre clé API Gemini sur [Google AI Studio](https://aistudio.google.com/app/apikey)
- Saisissez votre clé API (validation automatique)
- Décrivez le sujet de votre présentation
- Configurez les paramètres (nombre de slides, style, etc.)

### 2. Génération du Plan
- Cliquez sur "Générer le plan"
- Modifiez le plan selon vos besoins
- Réorganisez, ajoutez ou supprimez des slides
- Validez avec "Générer la présentation"

### 3. Édition
- Modifiez individuellement chaque slide
- Ajoutez des notes présentateur
- Prévisualisez en temps réel
- Réorganisez l'ordre des slides

### 4. Présentation
- Lancez le mode présentateur
- Utilisez les raccourcis clavier
- Contrôlez le timer intégré
- Naviguez avec les notes

## ⌨️ Raccourcis Clavier (Mode Présentation)

| Touche | Action |
|--------|--------|
| `→` `Espace` | Slide suivante |
| `←` | Slide précédente |
| `F` | Basculer plein écran |
| `P` | Mode présentateur |
| `N` | Afficher/masquer notes |
| `T` | Démarrer/arrêter timer |
| `R` | Reset timer |
| `Échap` | Quitter |

## 🎨 Paramètres de Génération

### Nombre de Slides
- **Automatique** : 5-8 slides optimales
- **Personnalisé** : 1 à 50 slides

### Styles de Présentation
- **Professionnel** : Ton formel et structuré
- **Éducatif** : Pédagogique et explicatif
- **Créatif** : Innovant et original
- **Technique** : Détaillé et précis
- **Business** : Orienté résultats

### Options de Contenu
- Notes présentateur automatiques
- Slide de conclusion
- Slide de titre personnalisée
- Niveau de détail ajustable

## 📁 Structure du Projet

```
slidev-generator/
├── src/
│   ├── components/           # Composants React
│   │   ├── SlideViewer.jsx          # Visualiseur de slides
│   │   ├── SlideEditor.jsx          # Éditeur de slides
│   │   ├── PresentationMode.jsx     # Mode présentateur
│   │   ├── PresentationHistory.jsx  # Historique
│   │   ├── PresentationPlanEditor.jsx # Éditeur de plan
│   │   └── GenerationSettings.jsx   # Paramètres
│   ├── hooks/               # Hooks personnalisés
│   │   ├── useErrorHandler.js       # Gestion d'erreurs
│   │   ├── useApiKeyValidator.js    # Validation API
│   │   ├── useNetworkStatus.js      # Statut réseau
│   │   └── useLocalStorage.js       # Persistance locale
│   ├── App.jsx             # Composant principal
│   └── App.css             # Styles et animations
├── README.md               # Documentation
├── NOUVELLES-FONCTIONNALITES.md # Détail des améliorations
└── package.json           # Configuration
```

## 🔐 Sécurité et Confidentialité

- **100% Front-end** : Aucun serveur backend
- **Données locales** : Stockage dans le navigateur uniquement
- **API directe** : Communication directe avec Gemini
- **Clé API sécurisée** : Encodage base64 local

## 🌟 Fonctionnalités Avancées

### Persistance Locale
- Sauvegarde automatique des présentations
- Historique des 10 dernières créations
- Brouillons auto-sauvegardés
- Export/import des données

### Gestion d'Erreurs
- Retry automatique avec backoff exponentiel
- Messages d'erreur contextuels
- Validation en temps réel
- Indicateurs de statut réseau

### Optimisations
- Animations CSS3 accélérées
- Lazy loading des composants
- State management optimisé
- Interface responsive

## 📱 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (dernières versions)
- **Appareils** : Desktop, tablette, mobile
- **Résolutions** : Optimisé pour 1920x1080, adaptatif
- **Accessibilité** : Navigation clavier, contrastes élevés

## 🤝 Contribution

Le projet est open source et accueille les contributions :

1. Fork du repository
2. Création d'une branche feature
3. Développement et tests
4. Pull request avec description

## 📄 Licence

MIT License - Libre d'utilisation et de modification

## 🆘 Support

Pour toute question ou problème :

1. Consultez la [documentation des nouvelles fonctionnalités](./NOUVELLES-FONCTIONNALITES.md)
2. Vérifiez votre clé API Gemini
3. Testez votre connexion réseau
4. Consultez la console développeur pour les erreurs

---

**Créé avec ❤️ et l'IA Gemini**

