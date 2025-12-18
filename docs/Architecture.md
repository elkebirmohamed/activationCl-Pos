
# Architecture et Décisions Techniques - POS.AI

## 1. Philosophie du projet
L'application repose sur le principe de **"Zero-Latency UX"**. Chaque interaction est conçue pour être instantanée. L'architecture est purement frontend (SPA), déléguant la génération de licences au backend via des Webhooks PayPal.

## 2. Technologies Utilisées
- **Framework Frontend** : React 19 (Hooks, Concurrent Rendering).
- **Langage** : TypeScript 5.6.
- **Outil de Build** : Vite 6.
- **Styling** : Tailwind CSS 3.4.
- **Paiement** : SDK PayPal Smart Buttons.
- **Déploiement** : Vercel.

## 3. Évolutions Majeures & Optimisations
### 3.1 Résilience du SDK PayPal
Pour contrer les problèmes de chargement réseau ou de blocage (ad-blockers), une logique de **"Lazy Loading with Retry"** a été implémentée :
- Le script n'est chargé qu'au besoin.
- Un bouton de réessai manuel apparaît en cas d'erreur `script.onerror`.
- L'état visuel du bouton principal s'adapte dynamiquement (Syncing -> Ready -> Pay).

### 3.2 Flux "Passer à l'achat"
- Validation stricte des champs avant d'autoriser l'affichage des boutons PayPal.
- Injection du `Machine ID` dans le `custom_id` PayPal pour corrélation automatique.

## 4. Sécurité & Configuration (CheckPoint)
### 4.1 Gestion des Clés API
Le Client ID PayPal est géré de manière hybride pour garantir le fonctionnement en toute circonstance :
1. **Priorité Vercel** : L'application cherche d'abord la variable `VITE_PAYPAL_CLIENT_ID` dans les variables d'environnement du projet sur Vercel.
2. **Clé de Secours (Fallback)** : Si la variable est absente, une clé "Live" validée est incluse en dur dans le code pour éviter toute rupture de service.

### 4.2 Environnement Live
Le déploiement final doit impérativement utiliser une clé de production ("Live") issue du portail [PayPal Developer](https://developer.paypal.com/). Le passage en mode réel est effectif dès que le montant de `59.90 EUR` est configuré dans le `createOrder`.

## 5. Résolution des Conflits de Rendu
L'utilisation de `React.StrictMode` pouvait provoquer un double chargement du bouton PayPal, entraînant une erreur "Unexpected Error". L'architecture actuelle utilise une référence `Ref` pour nettoyer le conteneur DOM (`innerHTML = ''`) avant chaque rendu du bouton, garantissant une stabilité totale.
