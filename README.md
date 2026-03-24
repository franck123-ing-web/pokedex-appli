# Pokedex App 

Une application mobile React Native/Expo qui permet de consulter les Pokémon, leurs caractéristiques, et de gérer ses favoris et son historique de consultation.  

L'application utilise l'API publique [PokéAPI](https://pokeapi.co/) pour récupérer toutes les données.



##  Fonctionnalités

- Liste des 50 premiers Pokémon avec images, nom, types et ID.
- Recherche avancée par **nom**, **type**, ou **ID**.
- Favoris : ajouter ou retirer un Pokémon de sa liste de favoris.
- Historique : consulter les derniers Pokémon vus (jusqu’à 50).
- Détail d’un Pokémon avec :
  - Image, nom et ID
  - Types
  - Taille et poids
  - Statistiques (HP, Attaque, Défense, etc.) avec barre graphique
  - Bouton cœur pour ajouter aux favoris
- Stockage local avec `AsyncStorage` pour **favoris** et **historique**, persistant entre les sessions.



##  Technologies utilisées

- **React Native** (TypeScript)  
- **Expo** pour simplifier le développement mobile  
- **Expo Router** pour la navigation entre les écrans  
- **AsyncStorage** pour le stockage local  
- **LinearGradient** pour un design moderne  
- **PokéAPI** comme source de données  



##  Installation

1. Cloner le projet :


git clone https://github.com/franck123-ing-web/pokedex-appli.git

cd pokedex-app

# 2. Installer les dépendances : 

npm install

# 3. Lancer l’application

npx expo start --tunnel

Expo ouvrira le Metro Bundler.
on pourras tester sur simulateur iOS/Android ou via l’application Expo Go sur ton téléphone.

## Design
Interface moderne avec gradient et couleurs vives.
Barre de recherche avec croix pour annuler la recherche.
Liste avec cartes de Pokémon, incluant le cœur pour les favoris.
Détail avec stats représentées graphiquement.

## Stockage local
Favoris : sauvegardé avec AsyncStorage sous la clé "favorites".
Historique : sauvegardé avec AsyncStorage sous la clé "history" (max 50 Pokémon)

## Liens utiles

https://pokeapi.co/
 : API utilisée pour récupérer les données
 
https://reactnative.dev/
 : Documentation officielle
 
https://docs.expo.dev/
 : Documentation officielle

