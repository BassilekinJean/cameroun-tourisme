# 🚀 Guide d'installation CamerTrip en local

## Option 1 : Téléchargement manuel (Recommandé)

### 1. Créer la structure de base

```bash
mkdir CamerTrip
cd CamerTrip
mkdir -p src/components src/styles
```

### 2. Fichiers de configuration à créer

#### `package.json` (racine)
Copiez depuis le message précédent

#### `vite.config.ts` (racine)
Copiez depuis le message précédent

#### `tsconfig.json` (racine)
Copiez depuis le message précédent

#### `tsconfig.node.json` (racine)
Copiez depuis le message précédent

#### `index.html` (racine)
Copiez depuis le message précédent

#### `src/main.tsx`
Copiez depuis le message précédent

### 3. Fichiers React

Dans Figma Make, pour CHAQUE fichier :
1. Cliquez sur le fichier dans la liste
2. Sélectionnez tout (Ctrl+A / Cmd+A)
3. Copiez (Ctrl+C / Cmd+C)
4. Collez dans le fichier correspondant sur votre ordinateur

**Fichiers à copier :**

- `/App.tsx` → `src/App.tsx`
- `/styles/globals.css` → `src/styles/globals.css`
- `/components/Header.tsx` → `src/components/Header.tsx`
- `/components/Hero.tsx` → `src/components/Hero.tsx`
- `/components/FeaturedBanner.tsx` → `src/components/FeaturedBanner.tsx`
- `/components/ActivitiesSection.tsx` → `src/components/ActivitiesSection.tsx`
- `/components/DestinationsGrid.tsx` → `src/components/DestinationsGrid.tsx`
- `/components/TravellersChoice.tsx` → `src/components/TravellersChoice.tsx`
- `/components/Newsletter.tsx` → `src/components/Newsletter.tsx`
- `/components/Footer.tsx` → `src/components/Footer.tsx`
- `/components/DestinationPage.tsx` → `src/components/DestinationPage.tsx`
- `/components/ActivityPage.tsx` → `src/components/ActivityPage.tsx`
- `/components/ActivityFormModal.tsx` → `src/components/ActivityFormModal.tsx`
- `/components/AuthModal.tsx` → `src/components/AuthModal.tsx`
- `/components/BookingModal.tsx` → `src/components/BookingModal.tsx`

**NOTE:** Vous n'avez PAS besoin de copier les fichiers dans `/components/ui/` et `/components/figma/` - ils seront téléchargés automatiquement lors de l'installation.

### 4. Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### 5. Ouvrir dans le navigateur

Allez sur http://localhost:5173

---

## Option 2 : Utiliser GitHub (Plus rapide)

Si vous avez Git installé, je peux vous aider à créer un dépôt GitHub et vous aurez juste à cloner le projet.

---

## ⚠️ Problèmes courants

### Erreur "Cannot find module"
```bash
npm install
```

### Erreur avec Tailwind
Vérifiez que `vite.config.ts` contient bien le plugin Tailwind

### Le site ne s'affiche pas
Vérifiez la console du navigateur (F12) pour voir les erreurs

---

## 📝 Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes, partagez le message d'erreur exact.
