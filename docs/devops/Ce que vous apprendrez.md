---
sidebar_position: 1
tags:
  - DevOps
  - CI/CD
  - pipeline
  - Jenkins
  - Ansible
  - SonarQube
  - Nexus 3
  - Docker
  - Spring
  - Java
---

Dans ce cours, vous apprendrez à mettre en place un pipeline CI/CD DevOps complet dans un environnement Windows/Linux. Vous utiliserez des outils essentiels tels que Jenkins, SonarQube, Nexus, Docker et Ansible pour automatiser et améliorer votre processus de développement logiciel.

## À qui ce cours s'adresse-t-il ?

Ce cours s'adresse aux développeurs souhaitant intégrer des pratiques DevOps et d'automatisation dans leurs projets de développement. Que vous soyez débutant ou expérimenté, ce cours vous guidera à travers la mise en place d'un pipeline CI/CD robuste et efficace.

## Contexte du projet

Avant de commencer, voici un peu de contexte pour comprendre l'objectif de ce cours. Vous développez une API Java Spring Boot et souhaitez la déployer sur différents environnements en suivant la démarche DevOps. L'objectif est de profiter des avantages de l'intégration continue et de la livraison/déploiement continu :  fluidité du travail entre les dev et les ops, rapidité d’intégration, flexibilité, rapidité d’itération…

**L'intégration continue** implique la génération et le test automatiques du code à chaque modification du code source d'une application.

**La livraison continue** étend ce concept en assurant que les développeurs disposent en permanence d'un artefact de génération prêt pour le déploiement. Ainsi, l'application est préparée pour être déployée manuellement en production à tout moment.

Quant au **déploiement continu**, il représente une extension de la livraison continue, permettant un déploiement automatisé de l'application. Cependant, ce processus nécessite que toutes les étapes soient validées avant d'effectuer le déploiement.

## Découvrez les outils utilisés

**Docker** : Docker est un système de conteneurisation utilisé pour encapsuler l'application Spring Boot dans un environnement isolé. Cette approche facilite le déploiement de l'application sur différents environnements.

**SonarQube** : SonarQube est une plateforme d'analyse statique de code qui évalue la qualité du code source d'un projet. Elle identifie les problèmes de qualité, les vulnérabilités de sécurité et les erreurs de programmation, tout en proposant des recommandations pour améliorer la lisibilité, la maintenabilité et la fiabilité du code. Dans notre pipeline CI/CD, SonarQube nous permet de mesurer en continu la qualité du code source.

**Jenkins** : Jenkins est un outil d'intégration continue open-source largement utilisé dans le développement logiciel. Il est utilisé pour créer notre pipeline CI/CD.

**Nexus 3 Repository** : Nexus est un gestionnaire de dépôts qui centralise la gestion de tous les artefacts générés et utilisés par les logiciels de l’organisation.

**Ansible** : Ansible est un outil d'automatisation informatique qui permet de configurer des systèmes, de déployer des logiciels et d'orchestrer des tâches informatiques avancées, telles que les déploiements continus. Dans ce cours, nous l'utilisons pour déployer de manière continue l'application dans les environnements cibles.

## Découvrez le fonctionnement de ce cours

Dans cette section, nous explorerons chaque outil de manière isolée afin de comprendre en détail son fonctionnement. Chaque outil, y compris Jenkins, Nexus, SonarQube et Ansible, sera présenté individuellement. Nous examinerons en profondeur leurs fonctionnalités, leur configuration et leur utilisation dans le contexte de notre cours, en mettant particulièrement l'accent sur leur intégration facile avec Jenkins. Cette approche vous permettra de vous familiariser pleinement avec chaque aspect, en vous fournissant les connaissances nécessaires pour tirer pleinement parti de ces outils dans vos propres projets, en particulier dans la mise en place de votre pipeline CI/CD.

## Prérequis

Je vous recommande d'avoir quelques connaissances sur Git, de savoir utiliser des conteneurs comme Docker et d'avoir des notions de base sur le système Linux. Bien qu'elles ne soient pas obligatoires, ces compétences vous seront utiles !

De plus,Il est conseillé d'avoir un ordinateur disposant d'au moins 16 Go de RAM pour assurer des performances optimales lors de l'exécution des outils et des processus décrits dans ce cours.

## Architecture technique du projet



![](img\cicd-arch.drawio.png)


## Liens vers les Projets Utilisés

Voici les liens GitHub des projets utilisés dans ce cours :

- [devops-project-samples](https://github.com/MossaabFrifita/devops-jenkins-ci-cd)
- [devops-ansible-deployment](https://github.com/MossaabFrifita/devops-ansible-deployment) 








