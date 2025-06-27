# Guide d'Utilisation - Générateur de Présentations Slidev

## 🎯 Vue d'ensemble

Ce guide vous accompagne pas à pas dans l'utilisation du générateur de présentations Slidev avec l'IA Gemini.

## 📋 Prérequis

### 1. Obtenir une clé API Gemini

1. Rendez-vous sur [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Sélectionnez un projet Google Cloud ou créez-en un nouveau
5. Copiez la clé API générée (format : `AIza...`)

⚠️ **Important** : Gardez votre clé API secrète et ne la partagez jamais publiquement.

### 2. Lancer l'application

```bash
# Démarrer le serveur de développement
cd slidev-generator
pnpm run dev
```

Ouvrez votre navigateur sur `http://localhost:5173`

## 🚀 Utilisation Étape par Étape

### Étape 1 : Configuration de l'API

1. **Saisir la clé API**
   - Collez votre clé API Gemini dans le champ "Clé API Gemini"
   - Le champ est de type "password" pour masquer la clé
   - La clé est stockée temporairement dans votre navigateur

2. **Vérification**
   - Aucune vérification n'est faite avant la génération
   - Une clé invalide sera détectée lors de l'appel API

### Étape 2 : Définir le Sujet

1. **Saisir le prompt**
   - Décrivez clairement le sujet de votre présentation
   - Soyez spécifique pour obtenir de meilleurs résultats
   - Exemples de prompts efficaces :

```
✅ Bons exemples :
- "Les bases de la photographie numérique pour débutants"
- "L'histoire de l'intelligence artificielle de 1950 à 2024"
- "Stratégies de marketing digital pour PME"
- "Introduction à la programmation Python"

❌ Exemples trop vagues :
- "Photographie"
- "IA"
- "Marketing"
```

2. **Conseils pour un bon prompt**
   - Précisez le niveau (débutant, intermédiaire, avancé)
   - Mentionnez le contexte (professionnel, éducatif, personnel)
   - Indiquez la durée souhaitée implicitement

### Étape 3 : Génération

1. **Lancer la génération**
   - Cliquez sur le bouton "Générer"
   - Un indicateur de chargement apparaît
   - La génération prend généralement 5-15 secondes

2. **Gestion des erreurs**
   - **Clé API manquante** : "Veuillez saisir votre clé API Gemini"
   - **Prompt vide** : "Veuillez saisir un prompt pour la présentation"
   - **Erreur API 403** : Clé API invalide ou quota dépassé
   - **Erreur réseau** : Vérifiez votre connexion internet

### Étape 4 : Visualisation

1. **Aperçu des slides**
   - Les slides apparaissent dans le panneau de droite
   - Design professionnel avec fond dégradé
   - Support du markdown (gras, italique, listes)

2. **Navigation**
   - **Boutons** : "Précédent" et "Suivant"
   - **Indicateurs** : Points cliquables en bas
   - **Raccourcis clavier** : Flèches gauche/droite (si implémenté)

3. **Informations affichées**
   - Numéro de slide actuelle
   - Nombre total de slides
   - Titre de la présentation

### Étape 5 : Export et Utilisation

1. **Copier le code Slidev**
   - Bouton "Copier Slidev" : copie le markdown dans le presse-papiers
   - Format compatible avec Slidev
   - Inclut les métadonnées et la configuration

2. **Télécharger le fichier**
   - Bouton "Télécharger" : sauvegarde un fichier `.md`
   - Nom par défaut : `presentation.md`
   - Prêt à utiliser avec Slidev

3. **Utiliser avec Slidev**
```bash
# Installer Slidev (une seule fois)
npm install -g @slidev/cli

# Lancer la présentation
slidev presentation.md

# Ou directement depuis le dossier
cd slidev-generator
slidev exemple-presentation.md
```

## 🎨 Personnalisation Avancée

### Modifier le Template Slidev

Le fichier généré utilise cette configuration par défaut :

```yaml
---
theme: default
background: https://source.unsplash.com/1920x1080/?technology
class: text-center
highlighter: shiki
lineNumbers: false
transition: slide-left
---
```

Vous pouvez modifier ces paramètres dans le fichier téléchargé :

- **theme** : `default`, `seriph`, `apple-basic`, etc.
- **background** : URL d'image ou couleur
- **transition** : `slide-left`, `fade`, `slide-up`, etc.

### Thèmes Slidev Populaires

```bash
# Installer des thèmes supplémentaires
npm install @slidev/theme-seriph
npm install @slidev/theme-apple-basic
npm install @slidev/theme-bricks
```

## 🔧 Dépannage

### Problèmes Courants

**1. "Erreur API: 403"**
- Cause : Clé API invalide ou quota dépassé
- Solution : Vérifiez votre clé API sur Google AI Studio

**2. "Réponse API invalide"**
- Cause : Problème de réseau ou réponse malformée
- Solution : Réessayez avec un prompt plus simple

**3. "Erreur CORS"**
- Cause : Restrictions de sécurité du navigateur
- Solution : Utilisez HTTPS en production

**4. Slides vides ou incomplètes**
- Cause : Prompt trop vague ou complexe
- Solution : Reformulez le prompt de manière plus spécifique

### Optimisation des Résultats

**Pour de meilleures présentations :**

1. **Soyez spécifique** dans vos prompts
2. **Mentionnez le nombre de slides** souhaité
3. **Précisez le public cible**
4. **Indiquez le style** (formel, décontracté, technique)

**Exemple de prompt optimisé :**
```
"Créez une présentation de 6 slides sur les bases de la cybersécurité 
pour des employés non-techniques d'une PME. Incluez des exemples 
pratiques et des conseils actionables."
```

## 📊 Limites et Contraintes

### Limites Techniques

- **Quota API** : Limité par votre compte Google Cloud
- **Taille des slides** : Contenu généré automatiquement, peut nécessiter des ajustements
- **Langues** : Optimisé pour le français, mais fonctionne en anglais
- **Images** : Pas de génération d'images, uniquement du texte

### Bonnes Pratiques

1. **Sauvegardez vos clés API** de manière sécurisée
2. **Testez différents prompts** pour trouver le style qui vous convient
3. **Relisez et ajustez** le contenu généré si nécessaire
4. **Respectez les quotas** de l'API Gemini

## 🆘 Support

Pour obtenir de l'aide :

1. **Consultez la documentation** Slidev officielle
2. **Vérifiez les issues** GitHub du projet
3. **Créez une nouvelle issue** pour signaler un bug
4. **Consultez la documentation** de l'API Gemini

## 📚 Ressources Utiles

- [Documentation Slidev](https://sli.dev/)
- [Google AI Studio](https://aistudio.google.com/)
- [Thèmes Slidev](https://sli.dev/themes/gallery.html)
- [Syntaxe Markdown](https://www.markdownguide.org/)

---

**Bon développement de vos présentations ! 🎉**

