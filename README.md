# Pipeline Zen - CRM Minimaliste

> Un CRM épuré pour suivre prospects et clients sans se noyer dans un océan de deals expirés.

## 🎯 Vision

Pipeline Zen offre un cockpit épuré pour suivre prospects et clients, identifier rapidement les profils "haute valeur", visualiser leur progression et déclencher les bonnes actions... avant que la procrastination ne gagne.

## ✨ Fonctionnalités

### 📋 Carnet de contacts
- Fiche contact unique (prospect/client)
- Tags libres, statut (froid, tiède, chaud)
- Scoring visuel (★ 1-5) calculé sur engagement + historique
- Recherche instantanée + filtres sauvegardés

### 🔄 Pipeline de transactions
- Vue Kanban horizontale avec 6 étapes :
  1. **Prospect** (30 jours max)
  2. **Relation engagée** (14 jours max)
  3. **Rendez-vous pris** (7 jours max)
  4. **Proposition en cours** (21 jours max)
  5. **Fermé - gagné**
  6. **Fermé - perdu**
- Archivage automatique des deals expirés
- Génération automatique de tâches de relance

### ✅ Gestionnaire de tâches
- To-do liste unifiée ("Aujourd'hui", "Retard", "À venir")
- Tâches liées à un contact ou une transaction
- Fonctionnalité "Snooze" (+1j, +3j)

### 🎨 UX/UI - Esprit Apple
- Sobriété lumineuse : fonds clairs, typographie système
- Large Titles dans chaque vue
- Gestes rapides (swipe, tap long)
- Accessibilité by design

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd pipeline-zen-crm

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

- **Framework** : Next.js 14 (App Router)
- **UI** : React + TypeScript
- **Styling** : Tailwind CSS
- **Base de données** : IndexedDB (via Dexie)
- **Icons** : Lucide React
- **Dates** : date-fns

## 📁 Structure du projet

```
src/
├── app/                    # App Router Next.js
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants UI de base
│   ├── contacts/         # Module contacts
│   ├── pipeline/         # Module pipeline
│   ├── tasks/           # Module tâches
│   └── navigation/      # Navigation
├── hooks/               # Hooks React personnalisés
├── lib/                # Utilitaires et base de données
├── types/              # Types TypeScript
└── ...
```

## 🎛 Règles métier

| Règle | Comportement |
|-------|-------------|
| **Date d'entrée → Date limite** | Calcul automatique selon le paramètre "Durée max" de la colonne |
| **Échéance dépassée** | Archive la carte + crée tâche "Suivre [Nom] – étape expirée" |
| **Scoring contact** | +1 pt si réponse e-mail ; +1 pt si meeting ; +2 pts si devis accepté |
| **Pipeline sain** | Badge rouge si > 20% de cartes expirées sur 30 jours glissants |

## 📊 Critères de succès

- ✅ 90% des utilisateurs créent un deal et une tâche < 10 min après inscription
- ✅ < 5% de cartes expirées restent sans tâche associée  
- ✅ Taux de complétion des tâches > 70% sur 30 jours

## 🗺 Roadmap

### Phase 0 ✅ : Prototype local
- Stockage : mémoire du navigateur (IndexedDB)
- Interface utilisateur complète
- Logique métier implémentée

### Phase 1 🔄 : Version contrôlée  
- Dépôt GitHub public pour suivi
- Migration des données vers Supabase
- Déploiement Vercel

### Phase 2 📋 : Améliorations
- Auth sociale
- Graphiques avancés  
- Exports CSV
- Intégration e-mail

## 🎨 Design System

Le design s'inspire des Human Interface Guidelines d'Apple avec :
- Typographie système SF Pro Display
- Espacements harmonieux (8px grid)
- Contrastes AA+ pour l'accessibilité
- Animations fluides et naturelles
- Support du Dark Mode (à venir)

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir le guide de contribution pour plus de détails.

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

---

*"Pas besoin d'un pipeline XXL si les prospects dorment dans le fond du tiroir."*