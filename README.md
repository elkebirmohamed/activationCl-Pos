# POS.AI Activation Portal

## Description
Une application web ultra-légère conçue pour l'activation sécurisée des terminaux de point de vente (POS) de la suite POS.AI. L'interface est optimisée pour une saisie manuelle rapide et un paiement immédiat via PayPal.

## Fonctionnalités Clés
- **Saisie d'ID Machine** : Validation en temps réel de l'identifiant matériel.
- **Paiement Intégré** : Intégration native du SDK PayPal Smart Buttons.
- **Support Multilingue** : Français et Anglais gérés nativement.
- **Thème Adaptatif** : Support complet du mode sombre (Dark Mode) basé sur les préférences système.

## Stack Technique
- **Core** : React 19, TypeScript 5.6
- **Build & Dev** : Vite 6 (ESM Natif)
- **Styles** : Tailwind CSS (Utility-first)
- **Icônes** : Lucide React
- **Paiement** : PayPal SDK v1
- **Déploiement** : Vercel (Edge Network)

## Structure du Projet
- `/components` : Composants métier (Formulaire, Success View, Admin).
- `/components/ui` : Composants d'interface réutilisables (InputField).
- `/services` : Services de traduction et de communication API.
- `/docs` : Documentation d'architecture et Roadmap.

## Notes de Déploiement
L'application a été optimisée pour Vercel en supprimant les dépendances complexes (comme les scanners QR basés sur le flux caméra) afin de garantir une compatibilité maximale sur tous les navigateurs mobiles et terminaux POS.