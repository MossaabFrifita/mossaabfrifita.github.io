---
sidebar_position: 9
---

## Contrôle de version sémantique (SemVer)

Le [Contrôle de version sémantique](https://semver.org/lang/fr/) (SemVer) est un schéma de gestion des versions largement utilisé dans le développement logiciel. Il suit un format de trois parties : MAJOR (majeure), MINOR (mineure), et PATCH (correctif). Ces numéros de version sont utilisés pour indiquer les changements apportés à un logiciel, et chaque partie a une signification spécifique :

1. **MAJOR (majeure) :** Augmentée pour les changements incompatibles avec les versions antérieures.
2. **MINOR (mineure) :** Augmentée pour les ajouts compatibles avec les versions antérieures.
3. **PATCH (correctif) :** Augmentée pour les corrections de bugs compatibles avec les versions antérieures

Le **SemVer** a une limitation en ce qui concerne la représentation de l'état réel du logiciel sur un système de déploiement continu (CD). Il se concentre principalement sur la versionnage du code source en fonction des changements fonctionnels, mais il ne couvre pas nécessairement tous les aspects de l'état du logiciel en production.

## Contrôle de version continu (CV)

Le Contrôle de version continu (CV) est un schéma de contrôle de version qui vise à générer un numéro de version unique pour chaque version logicielle en prenant en compte divers facteurs tels que la date, l'heure, la branche, la validation, le numéro de build ou l'environnement. L'objectif est de fournir un moyen efficace de suivre l'historique et la provenance du logiciel, tout en facilitant des déploiements rapides et fréquents sur des systèmes de déploiement continu (CD).

Cependant, il est important de noter que le Contrôle de version continu présente des défis potentiels. L'un des principaux défis est la perte de la signification sémantique des numéros de version. 

## Gestion des versions hybrides


Pour simplifier notre processus de gestion des versions et le rendre plus efficace, nous allons fusionner les avantages de SemVer et de CV. Nous utiliserons à la fois un composant sémantique et un composant continu dans le numéro de version.

À chaque build, nous récupérerons la version du projet à partir du fichier pom.xml. Ensuite, nous ajouterons l'environnement cible en fonction de la branche Git, par exemple, `dev` ou `prod`.

Nous ajouterons également le numéro de build (Jenkins attribue automatiquement un numéro de build qui s'auto-incrémente).

Enfin, nous inclurons l'ID du commit Git.

Cette approche nous permettra de bénéficier à la fois de la clarté sémantique des versions pour comprendre les changements fonctionnels et de la spécificité des numéros de version continus pour suivre de près les déploiements et l'historique du code.

La version sera représentée selon le format suivant :

```bash
Version=MAJEUR.MINEUR.CORRECTIF-ENV.NumeroBuild.CommitGit-Id
```
