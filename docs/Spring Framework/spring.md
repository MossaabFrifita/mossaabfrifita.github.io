---
sidebar_position: 1
tags:
  - SpringSecurity
  - JWT
  - RefreshToken
  - Authentification
  - Autorisation
  - SécuritéWeb
  - Spring
  - SpringBoot
  - Java
  - api
---
# Spring Security : Authentification et Autorisation avec JWT

Cet article est un retour d’expérience sur l'intégration de Spring Security dans une application Java basée sur Spring Boot.

Cet article n'est pas une formation ou un cours complet de Spring Security, mais plutôt un guide visant à vous aider à mettre en place une authentification basée sur JWT (JSON WEB TOKEN). Il couvre certains aspects nécessaires de la sécurité informatique, ainsi que des définitions et des principes qui vous aideront à vous familiariser avec Spring Security.

Dans cet article, nous allons créer un exemple concret d'API REST basé sur Spring boot qui couvre les bases essentielles d'authentification et d'autorisation en Spring Security avec JWT.

Spring Security est un Framework qui offre une couche de sécurité pour les applications Java Spring, en particulier avec Spring Boot. Il permet de configurer Spring pour prévenir les attaques en ayant recours à très peu, voire à aucune configuration.

La sécurité des applications Web de manière générale est très importante et à ne pas négliger, en tant que développeur informatique, il est essentiel d'avoir un minimum de compétences en matière de sécurité pour garantir la protection des données sensibles.

# Définitions et concepts de bases

Notre objectif est de contrôler l'accès à une API REST Spring Boot en mettant en place un mécanisme de sécurité. Le contrôle d'accès comprend généralement deux étapes distinctes : l'authentification et l'autorisation.

Nous allons faire appel à Spring Security pour controler l'accès à notre API, mais voyons d'abord la différence entre l'authentification et l'autorisation.

## Focus sur l'authentification 

L'utilisateur doit être authentifié avant d'accéder aux différentes ressources de l'application. Il existe plusieurs manières de faire l'authentification dans notre cas, nous devons mettre en place un mécanisme permettant de fournir à l'utilisateur une clé d'authentification, qu'il devra présenter à chaque interaction avec le serveur nécessitant un accès sécurisé.

Il existe différentes formes d'authentification, dont l'authentification basique basée sur le login et le mot de passe. Pour notre future API REST, nous allons choisir une approche **Stateless**, où l'API n'enregistrera pas l'état de l'utilisateur entre les requêtes. Cependant, il est important de noter que d'autres applications peuvent utiliser un système d'authentification **Stateful**, où l'état de l'utilisateur est conservé entre les requêtes, par exemple en utilisant des sessions.

### Authentification Stateful

L'authentification **Stateful** repose sur l'utilisation de sessions, qui représentent une période de temps pendant laquelle un utilisateur est authentifié et peut interagir avec le site. Lorsque l'utilisateur se connecte pour la première fois via son navigateur en utilisant ses identifiants, le serveur ouvre une session avec un ID unique et une durée de validité pour représenter l'utilisateur connecté. Pour maintenir l'état de la session côté client, le serveur envoie un cookie contenant l'identifiant de session au navigateur de l'utilisateur. Le navigateur stocke ensuite ce cookie et l'envoie automatiquement au serveur avec chaque requête ultérieure pour maintenir la continuité de la session.

Lorsque le serveur reçoit une requête avec le cookie, il fait la correspondance entre l'identifiant de session et les données de session associées. Cela lui permet de vérifier si l'utilisateur est toujours authentifié et si la session est toujours valide.

Ce qu'il faut retenir de tout ça :

Si les données de la session sont enregistrés côté serveur d'authentification et qu'une copie est enregistrée côté client sous forme de cookies , alors cela correspond à une authentification de type **Stateful.** Cette approche permet de maintenir un état de session du côté du serveur.

Ce type d'authentification ne sera pas implémenté dans cet article.

### Authentification Stateless

L'API n'a pas besoin de maintenir la session côté serveur. Comme mentionné précédemment, les données de session sont enregistrées dans un jeton d'authentification qui est envoyé au client une fois qu'il est correctement authentifié. Le client utilise ensuite ce jeton pour l'associer à chaque requête envoyée au serveur. Cela correspond à une authentification de type Stateless.

Il n'est pas nécessaire de stocker le jeton côté serveur. Nous explorerons plus en détail ultérieurement comment le serveur peut vérifier et valider ce jeton d'accès.

## Focus sur l'autorisation

L'autorisation est basée sur les rôles, ce qui signifie qu'après l'authentification, nous pouvons contrôler qui a le droit d'effectuer certaines tâches. Par exemple, un utilisateur administrateur peut accéder et modifier les données, tandis qu'un utilisateur visiteur ne peut que les lire. Il est important de souligner que cette autorisation peut être plus granulaire, permettant de définir les droits de lecture sur des données spécifiques plutôt que sur l'ensemble des données.

## L’utilisation d’un JWT

Un JSON Web Token (JWT) est en effet un objet JSON qui contient des paires clé-valeur. Il est généralement encodé et représenté sous forme d'une chaîne de caractères. Dans le contexte de l'authentification, un JWT peut contenir des informations telles qu'un username, une liste de droits d'accès et une date d'expiration. Lorsqu'un JWT contenant ces informations est inclus dans une requête, il est possible d'indiquer à Spring Security d'utiliser ce JWT comme preuve d'authentification.

Le JWT encapsule les informations de session de l'utilisateur ainsi que d'autres informations supplémentaires. Pour structurer ces informations, le JWT est composé de trois parties distinctes (header, payload, signature) qui sont encodées en base64URL et séparées par des points (.) :

1. **Header** : c'est la première partie d'un JWT, elle contient des informations sur le type de jeton et l'algorithme de signature utilisé : "alg" : l'algorithme de signature utilisé pour signer le jeton "typ" : le type de jeton

2. **Payload** : contient les revendications appelées "Claims" qui représentent les informations spécifiques à l'utilisateur et aux métadonnées supplémentaires. Il existe trois type de revendications :

   **Revendications enregistrées (Registered Claims)** : Ce sont des revendications prédéfinies par le standard JWT qui ne sont pas obligatoires, mais recommandées pour représenter des informations couramment utilisées. Par exemple, "iss" (émetteur), "sub" (sujet), "exp" (date d'expiration) et "iat" (date de création).

   **Revendications privées (Private Claims)** : Ce sont des revendications personnalisées définies par l'émetteur et le destinataire du jeton pour échanger des informations spécifiques à leur application.

   **Revendications publiques (Public Claims)** : Ce sont des revendications personnalisées qui sont définies dans des registres publics pour assurer l'interopérabilité entre différentes applications.

3. **Signature** : la signature est utilisée pour garantir que le jeton n'a pas été modifié par des tiers non autorisés. La signature est calculée en utilisant le Header + les Claims encodées en Base64Url + une clé secrète (dans le cas d'un algorithme de signature symétrique) ou une paire de clés (dans le cas d'un algorithme de signature asymétrique).

La signature est ajoutée en tant que troisième partie du JWT, également encodée en Base64Url.

En résumé, la combinaison de ces trois parties **Header.Payload.Signature** forme le JWT. Voici un exemple :

![image-20230716224835601](img\image-20230716224835601.png)

Cette structure permet de transporter les informations nécessaires de manière sécurisée et compacte dans le JWT, sans avoir besoin de stocker des informations de session côté serveur.

## L'utilisation d'un refreshToken

Le JWT a une durée de validité relativement courte, pour garantir une sécurité maximale, Cependant s'il est expiré l'utilisateur doit s'authentifier à nouveau et donc re saisir son login et son mot de passe pour demander un autre JWT. Le refreshToken vient résoudre ce problème, il peut être utilisé pour demander un nouveau jeton d'accès sans nécessiter de nouvelles informations d'identification de la part de l'utilisateur.

Le refreshToken est tout simplement un jeton de rafraichissement qui a une durée de validité plus longue que le jeton d'accès. Il est utilisé spécifiquement pour obtenir un nouveau jeton d'accès lorsque le jeton actuel expire. Le jeton de rafraîchissement est généralement associé à une session utilisateur persistante et est stocké de manière sécurisée côté serveur.

Voici comment nous allons mettons cela en pratique :

1. Lorsque l'utilisateur se connecte et réussit l'authentification, le serveur génère un jeton d'accès et un jeton de rafraîchissement et les envoie au client(application ou service) et le jeton de rafraîchissement est stocké côté serveur.
2. Lorsque le jeton d'accès expire, au lieu de demander à l'utilisateur de se reconnecter avec ses informations d'identification, le client envoie le jeton de rafraîchissement au serveur.
3. Le serveur vérifie si le jeton de rafraîchissement est valide et correspond à un utilisateur connecté. Si c'est le cas, le serveur génère un nouveau jeton d'accès avec une durée de validité limitée et le renvoie au client.
4. Le client utilise alors ce nouveau jeton d'accès pour accéder aux ressources protégées.

Le refreshToken permet de renforcer la sécurité de l'ensemble du processus d'authentification et d'autorisation. Par exemple, si le client souhaite se déconnecter d'une session, il lui suffit de révoquer le refreshToken associé au JWT, ce qui forcera le client à demander à l'utilisateur de s'authentifier lorsque le JWT expire.

Un autre cas très pratique est lorsqu'il y a un changement dans les autorisations d'un utilisateur. Dans ce cas, nous pouvons révoquer tous les refresh tokens associés aux sessions ouvertes de l'utilisateur, ce qui forcera aussi le client à demander à l'utilisateur de s'authentifier à nouveau lorsque le JWT expire. Ainsi, le client pourra obtenir les nouvelles autorisations.

# Comprendre l'architecture de Spring Security 



![](img\springSecuirtyArch.drawio.png)



En me basant sur le diagramme ci-dessus, je vais vous expliquer l'architecture de Spring Security et son mode de fonctionnement.

Spring Security repose sur un concept central pour le traitement des requêtes HTTP : les filtres. Il utilise une chaîne de filtres pour intercepter les requêtes entrantes, ce qui permet de mettre en œuvre la gestion de l'authentification, de l'autorisation et de la protection contre les attaques.

**DelegatingFilterProxy** est une implémentation de l'interface jakarta.servlet.Filter fournie par le framework Spring pour intégrer les filtres de servlet dans l'infrastructure de Spring. 

Techniquement, lorsqu'on utilise des filtres de servlet, on doit évidemment les déclarer en tant que classe de filtre dans notre configuration ou web.xml, sinon le conteneur de servlet les ignorera. Le **DelegatingFilterProxy** de Spring assure le lien entre web.xml et le contexte de l'application. Il agit comme un point d'entrée unique pour les filtres de servlet dans une application web basée sur Spring

Lorsque **DelegatingFilterProxy** reçoit une requête, il délègue la responsabilité du traitement à un filtre spécifique configuré dans la configuration de l'application.

**FilterChainProxy** est une classe spécifique à Spring Security qui gère la chaîne de filtres de sécurité dans une application Spring Security. Elle agit comme un filtre principal qui intercepte toutes les requêtes entrantes et les achemine à travers une chaîne de filtres de sécurité configurés.

La configuration des filtres de sécurité dans **FilterChainProxy** se fait généralement à l'aide du bean **SecurityFilterChain**.

**SecurityFilterChain** permet de configurer précisément les règles de sécurité en spécifiant quels filtres doivent être appliqués dans quel ordre pour chaque chemin d'accès ou URL spécifique. Cela offre une grande flexibilité pour adapter les règles de sécurité en fonction des besoins spécifiques de l'application.

Dans notre exemple, nous allons modifier la configuration de Spring en fournissant une instance de **SecurityFilterChain** qui répond aux exigences de sécurité de notre API.

Spring nous fournit une liste de filtres qui sont exécutés dans un certain ordre. Il n'est pas nécessaire de connaître tous les filtres implémentés par Spring, car ce n'est pas l'objectif de cet article. Cependant, vous pouvez consulter la documentation officielle pour obtenir plus de détails à ce sujet. Néanmoins, je vais expliquer quelques filtres que j'ai inclus dans l'architecture.

- **UsernamePasswordAuthenticationFilter** : Son rôle est de gérer l'authentification basée sur un formulaire. Plus précisément, ce filtre est responsable de l'analyse d'une soumission de formulaire d'authentification contenant un couple nom d'utilisateur/mot de passe. Pour notre système d'authentification stateless, ce filtre n'est pas utile et peut être exclu afin de se concentrer sur le filtre **JwtAuthenticationFilter**.
- **JwtAuthenticationFilter** : C'est un filtre personnalisé qui est responsable de la validation des JWT. Il permet d'intercepter chaque requête HTTP, vérifier la présence d'un JWT, extraire puis le valider avant de passer la main aux autres filtres de la chaîne.
- **ExceptionTranslationFilter** : C'est un filtre important dans Spring Security. Son rôle principal est de gérer les exceptions liées à la sécurité qui se produisent lors du traitement des requêtes et de les traduire en réponses HTTP appropriées. Par exemple, il peut renvoyer une réponse 403 (interdit) si une exception de type **AccessDeniedException** se produit.
- **AuthorizationFilter** (FilterSecurityInterceptor - déprécié depuis la version 5.5) : Il effectue les vérifications d'autorisation basées sur les rôles de l'utilisateur connecté (nous en verrons plus dans la pratique). À noter que ce filtre est configuré avec un **AccessDecisionManager** qui prend la décision finale concernant l'autorisation d'une requête en se basant sur les attributs de sécurité et les décisions prises par les **AccessDecisionVoters**.



**UsernamePasswordAuthenticationToken** est une implémentation de l'interface **Authentication** spécifique à l'authentification basée sur le nom d'utilisateur et le mot de passe. Il hérite de la classe abstraite **AbstractAuthenticationToken** et représente l'identité de l'utilisateur à authentifier.

**Authentication** encapsule les détails de l'authentification tels que le nom d'utilisateur, les rôles, les autorisations, etc.

Voici à quoi ressemble l'objet **Authentication** : 

```json
{
    "authorities": [
        {
            "authority": "UPDATE_PRIVILEGE"
        },
        {
            "authority": "DELETE_PRIVILEGE"
        },
        {
            "authority": "READ_PRIVILEGE"
        },
        {
            "authority": "WRITE_PRIVILEGE"
        },
        {
            "authority": "ROLE_ADMIN"
        }
    ],
    "details": null,
    "authenticated": true,
    "principal": {
        "id": 1,
        "firstname": "mossaab",
        "lastname": "frifita",
        "email": "frifita1@gmail.com",
        "password": "$2a$10$laYzRwXuWpueMZyJfxmOu.MsG9wAaoKjnbuoPW3xvZ9za2G.IwCfm",
        "role": "ADMIN",
        "enabled": true,
        "accountNonLocked": true,
        "accountNonExpired": true,
        "credentialsNonExpired": true,
        "authorities": [
            {
                "authority": "UPDATE_PRIVILEGE"
            },
            {
                "authority": "DELETE_PRIVILEGE"
            },
            {
                "authority": "READ_PRIVILEGE"
            },
            {
                "authority": "WRITE_PRIVILEGE"
            },
            {
                "authority": "ROLE_ADMIN"
            }
        ],
        "username": "frifita1@gmail.com"
    },
    "credentials": null,
    "name": "frifita1@gmail.com"
}
```



**SecurityContextHolder** est utilisé pour accéder au **SecurityContext** et effectuer des opérations sur celui-ci, telles que la récupération de l'objet **Authentication**, la définition d'un nouvel objet **Authentication** ou la suppression du contexte de sécurité. Son objectif est de représenter l'état d'authentification de l'utilisateur.

**AuthenticationManger** est le point d'entrée du processus d'authentification. son rôle est d'authentifier l'utilisateur émetteur de la requête. C'est une interface qui possède une seule méthode **authenticate** qui renvoie un objet **Authentication**

L'implémentation par défaut fournie par Spring est la classe **ProviderManager**. Elle est responsable de l'orchestration des différents **AuthenticationProviders** utilisés pour valider une demande d'authentification. Lorsqu'une demande d'authentification est reçue, le ProviderManager itère sur la liste des AuthenticationProviders configurés et délègue la responsabilité de l'authentification à l'un d'entre eux. Le ProviderManager tente les différents providers (par exemple LDAP, base de données) jusqu'à ce qu'une authentification réussie soit obtenue ou jusqu'à ce qu'il n'y ait plus de providers à essayer.

Un **Provider** est une implémentation de **AuthenticationProvider** qui définit comment l'utilisateur doit être authentifié. Dans notre exemple, nous allons utiliser le **DAOAuthenticationProvider** fourni par Spring.

Sachez que vous pouvez créer votre propre fournisseur en fournissant simplement une implémentation de l'interface **AuthenticationProvider**.

**DAOAuthenticationProvider** est utilisé pour l'authentification basée sur le couple nom d'utilisateur/mot de passe stocké dans une base de données. Il utilise **UserDetailsService** pour récupérer les informations de l'utilisateur et **PasswordEncoder** pour comparer le mot de passe fourni avec celui stocké.

Si le provider  a réussi à authentifier l'utilisateur, il retourne un objet **Authentication**. En cas d'échec (nom d'utilisateur ou mot de passe invalide), une **AuthenticationException** est levée.

**AuthenticationEntryPoint** c'est un gestionnaire des erreurs d'authentification, on peut dire que c'est un handler en quelque sorte. Il est responsable de la gestion des exceptions liées à l'authentification et de la création des réponses appropriées à renvoyer au client lorsque ces exceptions se produisent. Il peut être configuré pour renvoyer différentes réponses d'erreur personnalisées en fonction du type et du code d'erreur. Par exemple le code HTTP 401 (unauthorized) ou 403 (Forbidden)

Faisons un petit récapitulatif pour vous aider à mémoriser ce qu'on vient d'expliquer :

![](img\authManager.drawio.png)

**UserDetailsService** est une interface qui propose une méthode **loadByUsername** pour récupérer un utilisateur par son nom d'utilisateur. Elle retourne un objet implémentant l'interface **UserDetails**.

Spring Security nous propose la classe **User**, qui est une implémentation par défaut de l'interface **UserDetails**. Comme vous pouvez le voir sur le diagramme, la classe **User** fournit des propriétés importantes telles que le nom d'utilisateur, le mot de passe et les autorités nécessaires pour la vérification des autorisations lors du processus d'authentification.

Il est possible de surcharger la classe **User** ou d'implémenter directement l'interface **UserDetails** si l'on souhaite ajouter des informations supplémentaires spécifiques à notre application. Ainsi, pour que notre classe utilisateur soit un utilisateur de Spring Security, elle doit soit étendre la classe **User**, ou bien implémenter l'interface **UserDetails** (qui étend également la classe **User**).

Enfin, l'interface **PasswordEncoder** est proposée par Spring Security pour encoder et comparer les mots de passe. Elle offre également deux implémentations, **StandardPasswordEncoder** et **BCryptPasswordEncoder**.

Spring Security recommande l'utilisation de **BCryptPasswordEncoder**, comme indiqué dans la documentation officielle.

![](img\bCrypt.PNG)

Avant de passer à l'implémentation, je préfère que nous jetions un coup d'œil sur le mécanisme d'authentification et d'autorisation dans Spring Security.

## Comprendre le mécanisme de l'authentification et l'autorisation



![](img\springAuthAut.drawio.png)

En se basant sur le digramme ci-dessus on peut en conclure deux scénarios : 

1. Lorsque l'on souhaite authentifier un utilisateur par le couple/usrename et lui envoyer les données de sa session sous forme d'un JWT
2. Lorsqu'un utilisateur tente d'accéder à une ressource protégée qui peut nécessite ou non des autorisations spécifiques

### Authentification d'un utilisateur

Lorsqu'un utilisateur soumet une requête HTTP d'authentification, elle traverse la chaîne de filtres jusqu'à atteindre le contrôleur chargé de l'authentification. Ensuite, le contrôleur demande au service d'authentification de vérifier les informations fournies par l'utilisateur.

 Voici les étapes simplifiées d'authentification d'un utilisateur dans Spring Security avec JWT :

1. L'utilisateur soumet ses informations d'identification (nom d'utilisateur et mot de passe) via un formulaire de connexion ou une requête API.
2. Le filtre **JwtAuthenticationFilter** intercepte la demande d'authentification.
3. Dans **JwtAuthenticationFilter**, l'authentification de l'utilisateur est effectuée en vérifiant les informations d'identification fournies.
4. Si l'authentification réussit, un objet **UsernamePasswordAuthenticationToken** est créé pour représenter l'identité de l'utilisateur authentifié.
5. Le contrôleur reçoit la demande d'authentification réussie et utilise un service approprié pour générer une réponse à l'utilisateur
6. Le service crée un jeton d'accès JWT en incluant les informations nécessaires (par exemple, le nom d'utilisateur, les autorisations, la durée de validité) et en le signant avec une clé secrète.
7. La réponse contenant le jeton d'accès JWT est renvoyée à l'utilisateur.

Dans ce scénario, on pourrait dire que l'authentification se fait entièrement dans le service d'authentification, car les filtres ne sont pas directement impliqués dans le processus.

### Demander une ressource nécessitant l'authentification

Pour accéder à une ressource protégée dans notre système d'authentification Stateless, il est nécessaire de fournir un JWT valide qui atteste les autorisations requises.

La requête va être intercepté par le filtre `JwtAuthenticationFilter` qui va exporter le JWT 

1. Un utilisateur envoie une requête HTTP pour accéder à une ressource protégée dans notre application.
2. La requête est interceptée par le `JwtAuthenticationFilter`, qui vérifie la présence d'un JWT dans l'en-tête `Authorization`.
3. Si le JWT est présent, le `JwtAuthenticationFilter` extrait et valide le JWT en utilisant une clé secrète ou publique. 
4. Si le JWT est valide, le `JwtAuthenticationFilter` extrait les informations d'identification (comme le username) du JWT.
5. On récupère ensuite les détails de l'utilisateur en utilisant son username depuis la BDD.
6. Si l'utilisateur n'existe pas ou si d'autres critères de validation supplémentaires liés aux besoins spécifiques de l'application ne sont pas satisfaits, une exception peut être levée.
7. Si l'authentification est réussie, Le `JwtAuthenticationFilter` crée ensuite un objet `UsernamePasswordAuthenticationToken` contenant les informations d'identification de l'utilisateur.
8. L'objet `UsernamePasswordAuthenticationToken` est stocké dans le SecurityContext, géré par le `SecurityContextHolder`.
9. La requête continue son chemin et traverse la chaîne de filtres jusqu'à ce qu'elle atteigne le contrôleur
10. Si l'authentification échoue à l'une des étapes, une exception est levée.

# Implémentation

Tout cela est très bien en théorie, mais rien de mieux que la pratique pour mettre en œuvre tout ce que nous avons vu. 

L'objectif est de créer une API REST Spring boot sécurisée par Spring security avec JWT (Json Web Token).

### Les endpoints

Voici les endpoints que notre API doit exposés :

- POST /api/v1/auth/register => permet de créer un nouveau compte utilisateur
- POST /api/v1/auth/authenticate => authentification
- POST /api/v1/auth/refresh-token => permet d'actualiser le token
- GET /api/v1/admin/resource => permet d'accèder à une ressource protégée qui nécessite le rôle admin et le droit de lecture
- DELETE /api/v1/admin/resource => permet d'accèder à une ressource protégée qui nécessite le rôle admin et le droit de suppression
- POST /api/v1/user/resource => permet d'accèder à une ressource protégée qui nécessite le rôle user et le droit de création
- PUT /api/v1/user/resource => permet d'accèder à une ressource protégée qui nécessite le rôle user et le droit de modification

### Initialisation du projet

Afin de ne pas alourdir l'article, l'objectif est de se concentrer sur Spring Security. Je vais passer certaines étapes classiques que chaque développeur Java devrait savoir faire, comme la création d'un projet Spring Boot, et je vais sauter également les lignes de code qui ne sont pas particulièrement importantes. Vous pouvez trouver le projet complet sur [GitHub](https://github.com/MossaabFrifita/spring-boot-3-security-6-jwt), mais je vous recommande vivement de ne pas simplement copier-coller le code. Essayez plutôt de manipuler les choses par vous-même et n'hésitez pas à apporter vos propres modifications pour améliorer certaines parties ou ajouter de nouvelles fonctionnalités.

La première étape est de créer un projet spring boot et ajouter la dépendance de spring Security, lombok et postgresql ou bien tout autre SGBD de votre choix. Au moment où j'écris cet article on est à la version 3.1 de Spring boot qui nécessite au minimum Java 17.

Une fois le projet créé, importez-le dans votre IDE préféré et essayez de le démarrer. Normalement, vous devriez voir s'afficher par défaut une page de connexion générée automatiquement par Spring Security. Si vous consultez la console, vous verrez que Spring a généré un mot de passe par défaut pour l'utilisateur "user" lors du démarrage de l'application. Notez que vous pouvez personnaliser cette page, mais dans le cas de notre API, nous n'en aurons pas besoin.

### Création des énumérations

Sous le package "enums", créez l'énumération **Privilege** qui définit explicitement les autorisations qui seront attribuées à chaque rôle :

```java
package fr.mossaab.security.enums;

public enum Privilege {
    READ_PRIVILEGE,
    WRITE_PRIVILEGE,
    DELETE_PRIVILEGE,
    UPDATE_PRIVILEGE;
}
```

Créez également l'énumération **Role** :

```java
package fr.mossaab.security.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static fr.mossaab.security.enums.Privilege.*;

@RequiredArgsConstructor
public enum Role {
    ADMIN(
            Set.of(READ_PRIVILEGE,WRITE_PRIVILEGE,UPDATE_PRIVILEGE,DELETE_PRIVILEGE)
    ),
    USER(
            Set.of(READ_PRIVILEGE)
    );

    @Getter
    private final Set<Privilege> privileges;

    public List<SimpleGrantedAuthority> getAuthorities(){
        List<SimpleGrantedAuthority> authorities = getPrivileges()
                .stream()
                .map(privilege -> new SimpleGrantedAuthority(privilege.name()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_"+this.name()));
        return authorities;
    }
}

```

Pour chaque rôle, on définit un ensemble de privilèges dans le constructeur, ce qui permet d'initialiser le rôle avec ses autorisations.

La méthode `getAuthorities()` retourne une liste d'objets `SimpleGrantedAuthority` obtenue en transformant la (Set) de privilèges.

Pour que Spring Security puisse effectuer des vérifications de rôles et d'autorisations, il faut lui fournir une liste de `SimpleGrantedAuthority`

**SimpleGrantedAuthority** est une implémentation couramment utilisée de l'interface `GrantedAuthority`. Les objets `SimpleGrantedAuthority` sont utilisés pour encapsuler le nom d'une autorité ou d'un rôle dans le système.

Le préfixe "ROLE" est une convention utilisée par Spring Security pour différencier les rôles des autres types d'autorités.

En résumé, une **Authority**  n'est qu'une simple chaine de caractères encapsulée dans  **SimpleGrantedAuthority**. un Rôle n’est ni plus ni moins qu’une **Authority** précédée du préfixe “ROLE_”

Créez aussi l'énumération **TokenType**

```java
package fr.mossaab.security.enums;

public enum TokenType {
    BEARER
}
```

Le type d'authentification Bearer est utilisé dans les protocoles basés sur les tokens tels que JWT et OAuth 2.0. Lorsque on utilise l'authentification Bearer, le client inclut le token d'accès dans l'en-tête de la requête HTTP(Headers) , généralement dans l'en-tête d'autorisation, avec le préfixe "Bearer ". Par exemple : "Authorization: Bearer token".

### Création de l'entité User

Créez la classe User qui implémente `UserDetails` sous le package entities

```java
package fr.mossaab.security.entities;

import fr.mossaab.security.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "_user")
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
```

La classe User est utilisée pour représenter un utilisateur dans Spring Security. Elle fournit les informations nécessaires pour l'authentification et l'autorisation, ainsi que les autorités associées à l'utilisateur.

### Création de l'entité RefreshToken

Comme mentionné précédemment dans cet article, en enregistrant les Refresh Tokens dans la base de données, il devient plus facile de gérer leur état, notamment pour les révoquer si nécessaire. Par exemple, si un utilisateur perd son appareil ou souhaite se déconnecter de manière proactive, le Refresh Token peut être marqué comme révoqué dans la base de données, empêchant ainsi son utilisation future. On peut aussi contrôler le nombre de sessions ouvertes par l'utilisateur.

Voici la classe RefreshToken

```java
package fr.mossaab.security.entities;

import fr.mossaab.security.enums.TokenType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;

    public boolean revoked;
```

### Création des Repositories User et RefreshToken

Maintenant, nos entités nécessitent un Repository pour la persistance et l'accès aux données en base de données. Créez-les dans le package repository.

```java
package fr.mossaab.security.repository;

import fr.mossaab.security.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

```

```Java
package fr.mossaab.security.repository;

import fr.mossaab.security.entities.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

}

```

### Définition des payloads

Notre API a besoin de définir les payloads pour les requêtes et les réponses.

- Les requêtes : 

  - `AuthenticationRequest` : permet d'encapsuler les données de la requête d'authentification

    ```java
    package fr.mossaab.security.payload.request;
    
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class AuthenticationRequest {
        private String email;
        private String password;
    }
    ```

    

  - `RefreshTokenRequest` : permet d'encapsuler les données de la requête de rafraîchissement du token.

    ```java
    package fr.mossaab.security.payload.request;
    
    import lombok.Data;
    
    @Data
    public class RefreshTokenRequest {
        private String refreshToken;
    }
    ```

    

  - `RegisterRequest`: permet d'encapsuler les données de la requête d'inscription

    ```java
    package fr.mossaab.security.payload.request;
    
    import fr.mossaab.security.enums.Role;
    import fr.mossaab.security.validation.StrongPassword;
    import jakarta.validation.constraints.Email;
    import jakarta.validation.constraints.NotBlank;
    import jakarta.validation.constraints.NotNull;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class RegisterRequest {
    
        @NotBlank(message = "firstname is required")
        private String firstname;
        @NotBlank(message = "lastname is required")
        private String lastname;
        @NotBlank(message = "email is required")
        @Email(message = "email format is not valid")
        private String email;
        @NotBlank(message = "password is required")
        @StrongPassword
        private String password;
        @NotNull
        private Role role;
    }
    ```

    

- Les réponses :

  - `AuthenticationResponse` : permet d'encapsuler les données de la réponse d'authentification

    ```java
    package fr.mossaab.security.payload.response;
    
    import com.fasterxml.jackson.annotation.JsonProperty;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import java.util.List;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class AuthenticationResponse {
        private  Long id;
        private String email;
        private List<String> roles;
    
        @JsonProperty("access_token")
        private String accessToken;
        @JsonProperty("refresh_token")
        private String refreshToken;
        @JsonProperty("token_type")
        private String tokenType;
    
    }
    ```

    

  - `RefreshTokenResponse`:  permet d'encapsuler les données de la réponse de rafraîchissement du token.

    ```java
    package fr.mossaab.security.payload.response;
    
    import com.fasterxml.jackson.annotation.JsonProperty;
    import fr.mossaab.security.enums.TokenType;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class RefreshTokenResponse {
    
        @JsonProperty("access_token")
        private String accessToken;
        @JsonProperty("refresh_token")
        private String refreshToken;
        @JsonProperty("token_type")
        private String tokenType = TokenType.BEARER.name();
    
    }
    ```

    

### Implémentation du Service JwtService

Le `JwtService` est une interface qui définit des méthodes permettant de générer, extraire et valider les JWT. Cette interface joue un rôle essentiel dans la gestion des JWT et fournit des fonctionnalités importantes pour les manipuler.

Les méthodes principales de cette classe sont :

- `extractUserName(String token)` : Cette méthode extrait le nom d'utilisateur à partir du JWT.
- `generateToken(UserDetails userDetails)` : Cette méthode génère un nouveau JWT à partir des informations de l'utilisateur fourni.
- `isTokenValid(String token, UserDetails userDetails)` : Cette méthode vérifie si un JWT est valide en comparant le nom d'utilisateur extrait du JWT avec le nom d'utilisateur fourni par `UserDetails`. Elle vérifie également si le JWT a expiré.

On a besoin de la bibliothèque `io.jsonwebtoken` pour générer et valider les JWT. Ajoutez les dépendances suivantes dans vote pom.xml :

```xml
<!-- ===== jjwt ===== -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
</dependency>
```

Elle utilise également des propriétés configurées dans le fichier de configuration (application.yml), telles que la clé secrète et les durées d'expiration des JWT.

Créez l'implémentation `JwtServiceImpl` du service `JwtService` :

```java
package fr.mossaab.security.service.impl;

import fr.mossaab.security.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @Override
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails,jwtExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

```

La méthode `extractAllClaims` est responsable de l'extraction de toutes les claims d'un token. elle permet de valider la signature à l'aide de la clé secrète, puis renvoyer tous Claims ou lever une exception si le token n'est pas valide. Voici les exceptions qui peuvent être levées : 

- `ExpiredJwtException` : Cette exception est levée lorsque le token JWT est expiré et n'est plus valide.
- `UnsupportedJwtException` : Cette exception est levée lorsque le token JWT est malformé ou utilise un algorithme de signature non pris en charge.
- `MalformedJwtException` : Cette exception est levée lorsque le token JWT est mal formé ou invalide.
- `SignatureException` : Cette exception est levée lorsque la signature du token JWT ne peut pas être vérifiée.
- `IllegalArgumentException` : Cette exception est levée lorsqu'un argument invalide est passé à une méthode.

### Implémentation du Service AuthenticationService

L'interface `AuthenticationService` fournit des méthodes pour l'enregistrement d'un nouveau utilisateur (`register`) et l'authentification d'un utilisateur (`authenticate`).

Créez `AuthenticationServiceImpl` qui est une classe qui implémente l'interface `AuthenticationService`

```java
package fr.mossaab.security.service.impl;

import fr.mossaab.security.enums.TokenType;
import fr.mossaab.security.payload.request.AuthenticationRequest;
import fr.mossaab.security.payload.request.RegisterRequest;
import fr.mossaab.security.payload.response.AuthenticationResponse;
import fr.mossaab.security.service.AuthenticationService;
import fr.mossaab.security.service.JwtService;
import fr.mossaab.security.entities.User;
import fr.mossaab.security.repository.UserRepository;
import fr.mossaab.security.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service @Transactional
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    
    @Override
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        user = userRepository.save(user);
        var jwt = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user.getId());

        var roles = user.getRole().getAuthorities()
                .stream()
                .map(SimpleGrantedAuthority::getAuthority)
                .toList();

        return AuthenticationResponse.builder()
                .accessToken(jwt)
                .email(user.getEmail())
                .id(user.getId())
                .refreshToken(refreshToken.getToken())
                .roles(roles)
                .tokenType( TokenType.BEARER.name())
                .build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));

        var user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid email 		or password."));
        var jwt = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user.getId());
        return AuthenticationResponse.builder()
                .accessToken(jwt)
                .email(user.getEmail())
                .id(user.getId())
                .refreshToken(refreshToken.getToken())
                .tokenType( TokenType.BEARER.name())
                .build();
    }
}

```

 `AuthenticationServiceImpl` a besoin d'un :

- `PasswordEncoder` pour encoder le mot de passe de l'utilisateur lors de l'enregistrement.
- `JwtService` qu'on a déjà fourni une implémentation pour générer le JWT lors de l'enregistrement et le valider lors de l'authentification.
- `UserRepository` pour accéder aux données des utilisateurs en base de données.
- `l'AuthenticationManager` pour effectuer l'authentification de l'utilisateur lors de l'appel à la méthode `authenticate` qui reçoit un `UsernamePasswordAuthenticationToken` comme on l'a vu dans la partie théorique. 
- `RefreshTokenService` pour créer un token de rafraîchissement lors de l'enregistrement et de l'authentification.

Dans la méthode `register`, on crée un nouvel utilisateur en utilisant les informations fournies dans la demande (`RegisterRequest`), puis on le sauvegarde en base de données. Ensuite, on génère un token JWT pour l'utilisateur, on crée un token de rafraîchissement et on renvoie une réponse d'authentification contenant les informations nécessaires.

Dans la méthode `authenticate`, on utilise l'`AuthenticationManager` pour valider les informations d'authentification de l'utilisateur (on verra par la suite comment configurer `l'AuthenticationManager`). Si l'authentification est réussie, on récupère l'utilisateur correspondant à l'adresse e-mail fournie, on génère un token JWT et un token de rafraîchissement, puis on renvoie une réponse d'authentification avec les informations appropriées.

Maintenant l'étape suivante est de fournir une implémentation du service `RefreshTokenService`

### Implémentation du Service RefreshTokenService

RefreshTokenService est responsable de la création, la vérification et la régénération des tokens de rafraîchissement

Il a besoin d'un :

- `UserRepository` pour récupérer l'utilisateur par son ID et vérifier qu'il fait partie de notre système.
- `RefreshTokenRepository` pour gérer le RefreshToken en base de données.
- `JwtService` pour générer de nouveaux tokens JWT lors de la régénération.
- Attribut qui récupère la durée d'expiration des RefreshTokens  à partir de la configuration.

Créez l'implémentation  RefreshTokenServiceImpl :

```java
package fr.mossaab.security.service.impl;

import fr.mossaab.security.entities.RefreshToken;
import fr.mossaab.security.entities.User;
import fr.mossaab.security.enums.TokenType;
import fr.mossaab.security.exception.TokenException;
import fr.mossaab.security.payload.request.RefreshTokenRequest;
import fr.mossaab.security.payload.response.RefreshTokenResponse;
import fr.mossaab.security.repository.RefreshTokenRepository;
import fr.mossaab.security.repository.UserRepository;
import fr.mossaab.security.service.JwtService;
import fr.mossaab.security.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;
    
    @Override
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        RefreshToken refreshToken = RefreshToken.builder()
                .revoked(false)
                .user(user)
                .token(Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes()))
                .expiryDate(Instant.now().plusMillis(refreshExpiration))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if(token == null){
            log.error("Token is null");
            throw new TokenException(null, "Token is null");
        }
        if(token.getExpiryDate().compareTo(Instant.now()) < 0 ){
            refreshTokenRepository.delete(token);
            throw new TokenException(token.getToken(), "Refresh token was expired. Please make a new authentication request");
        }
        return token;
    }

    @Override
    public RefreshTokenResponse generateNewToken(RefreshTokenRequest request) {
        User user = refreshTokenRepository.findByToken(request.getRefreshToken())
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .orElseThrow(() -> new TokenException(request.getRefreshToken(),"Refresh token does not exist"));

        String token = jwtService.generateToken(user);
        return RefreshTokenResponse.builder()
                .accessToken(token)
                .refreshToken(request.getRefreshToken())
                .tokenType(TokenType.BEARER.name())
                .build();
    }
}
```

La méthode `createRefreshToken` est responsable de la création d'un nouveau RefreshToken pour un utilisateur spécifié (récupéré à par son ID). Elle génère un token unique à l'aide de `UUID.randomUUID()`, l'encode en Base64, définit la date d'expiration en fonction de la durée configurée, puis enregistre le token en base de données.

La méthode `verifyExpiration` est utilisée pour vérifier si le RefreshToken est expiré. Si le token est nul ou est expiré, une exception de type `TokenException` est levée. On verra aussi par la suite comment cette exception et comment la gérer.

La méthode `generateNewToken` est appelée lorsqu'un utilisateur souhaite générer un nouveau token en utilisant un RefreshToken existant. Elle récupère le token de la base de données, vérifie s'il est expiré, récupère l'utilisateur associé au token, génère un nouveau token JWT à l'aide du `JwtService`, puis renvoie la réponse.

### Gestion des exceptions 

Dans la couche services nous avons utilisé une exception personnalisée de type`TokenException` 

Créez la classe `TokenException` qui étend `RuntimeException` sous le package `exception`

```java
package fr.mossaab.security.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class TokenException extends RuntimeException {

    public TokenException(String token, String message) {
        super(String.format("Failed for [%s]: %s", token, message));
    }

}
```

Créez également classe `ErrorResponse` qui va encapsuler les informations d'une réponse d'erreur qui sera envoyé à l'utilisateur

```java
package fr.mossaab.security.handlers;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ErrorResponse {
    private int status;
    private String error;
    private Instant timestamp;
    private String message;
    private String path;
}
```

Voici une explication des attributs de la classe :

- `status` : C'est le code de statut de l'erreur HTTP par exemple (401,403).
- `error` : Une chaîne de caractères représentant le type d'erreur.
- `timestamp` : Le moment où l'erreur s'est produite.
- `message` :  Le message détaillé décrivant l'erreur.
- `path` : L'URI de la requête qui a déclenché l'erreur.

Ensuite, nous avons besoin d'un Handler qui intercepte les exceptions levées et fournit une réponse personnalisée en utilisant notre classe `ErrorResponse` que nous venons de créer :

```java
package fr.mossaab.security.handlers;


import fr.mossaab.security.exception.TokenException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class TokenControllerHandler {

    @ExceptionHandler(value = TokenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<ErrorResponse> handleRefreshTokenException(TokenException ex, WebRequest request){
       final ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now())
                .error("Invalid Token")
                .status(HttpStatus.FORBIDDEN.value())
                .message(ex.getMessage())
                .path(request.getDescription(false))
                .build();
        return new ResponseEntity<>(errorResponse,HttpStatus.FORBIDDEN);
    }
}
```

`@RestControllerAdvice` est une annotation qui indique à Spring qu'il s'agit d'un composant global qui intercepte les exceptions levées par les contrôleurs et fournit une réponse appropriée.

La méthode `handleRefreshTokenException` est annotée avec `@ExceptionHandler` pour spécifier qu'elle doit être exécutée lorsqu'une exception de type `TokenException` est levée.

Lorsqu'une `TokenException` est levée, cette méthode est appelée pour la gérer. Elle reçoit l'exception (`ex`) et l'objet `WebRequest` associé à la requête en cours.

La méthode crée une instance d'`ErrorResponse` avec les détails de l'erreur, ensuite, elle retourne une `ResponseEntity` contenant l'objet `ErrorResponse` et le code de statut HTTP correspondant (ici, `HttpStatus.FORBIDDEN`).

### Création des contrôleurs Rest

Maintenant que notre couche service est développée, il est temps de créer les contrôleurs. Pour notre API, nous avons besoin d'un contrôleur qui sera responsable de l'authentification et d'un autre qui simule l'accès à des ressources protégées.

Créez alors `AuthenticationController` qui contient trois méthodes : `register` qui gère la requête d'inscription, `authenticate`  qui gère la requête d'authentification et `refreshToken` pour actualiser le JWT

```java
package fr.mossaab.security.controller;

import fr.mossaab.security.payload.request.AuthenticationRequest;
import fr.mossaab.security.payload.request.RefreshTokenRequest;
import fr.mossaab.security.payload.request.RegisterRequest;
import fr.mossaab.security.payload.response.AuthenticationResponse;
import fr.mossaab.security.payload.response.RefreshTokenResponse;
import fr.mossaab.security.service.AuthenticationService;
import fr.mossaab.security.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final RefreshTokenService refreshTokenService;


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(refreshTokenService.generateNewToken(request));
    }



}

```

L'annotation `@Valid` indique à Spring que `RegisterRequest` doit être validé. Je ne vais pas entrer dans les détails de la validation des beans, car ce n'est pas le sujet de cet article.

Ce contrôleur est annoté avec `@RestController` pour indiquer qu'il est responsable de la gestion des requêtes REST, et les différentes méthodes sont annotées avec `@PostMapping` pour spécifier le type de requête HTTP qu'elles traitent.

Créez `AuthorizationController` qui va simuler l'accès aux ressources protégées 

Le but est de simuler l'accès aux endpoints protégés qui nécessitent des autorisations spécifiques. Comme vous vous en souvenez, nous avons défini les endpoints suivants :

- GET /api/v1/admin/resource => permet d'accèder à une ressource protégée qui nécessite le rôle admin et le droit de lecture
- DELETE /api/v1/admin/resource => permet d'accèder à une ressource protégée qui nécessite le rôle admin et le droit de suppression
- POST /api/v1/user/resource => permet d'accèder à une ressource protégée qui nécessite le rôle user et le droit de création
- PUT /api/v1/user/resource => permet d'accèder à une ressource protégée qui nécessite le rôle user et le droit de modification

Nous allons créer 4 méthodes dans `AuthorizationController`  pour les exposer :

1. `sayHelloWithRoleAdminAndReadAuthority()`: Cette méthode `GET` nécessite le rôle `ADMIN` et l'autorité de lecture (`READ_PRIVILEGE`) pour y accéder. 
2. `sayHelloWithRoleAdminAndDeleteAuthority()`: Cette méthode `DELETE` nécessite le rôle `ADMIN` et l'autorité de suppression (`DELETE_PRIVILEGE`) pour y accéder.
3. `sayHelloWithRoleUserAndCreateAuthority()`: Cette méthode `POST` nécessite le rôle `USER` et l'autorité de création (`CREATE_PRIVILEGE`) pour y accéder. Elle renvoie une réponse indiquant que l'utilisateur a accès à une ressource protégée nécessitant le rôle utilisateur et l'autorité de création.
4. `sayHelloWithRoleUserAndUpdateAuthority()`: Cette méthode `PUT` nécessite le rôle `USER` et l'autorité de mise à jour (`UPDATE_PRIVILEGE`) pour y accéder. 

Chaque méthode renvoie simplement un message de succès.

```java
package fr.mossaab.security.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
public class AuthorizationController {



    @GetMapping("/admin/resource")
    @PreAuthorize("hasAuthority('READ_PRIVILEGE') and hasRole('ADMIN')")
    public ResponseEntity<String> sayHelloWithRoleAdminAndReadAuthority() {
        return ResponseEntity.ok("Hello, you have access to a protected resource that requires admin role and read authority.");
    }

    @DeleteMapping("/admin/resource")
    @PreAuthorize("hasAuthority('DELETE_PRIVILEGE') and hasRole('ADMIN')")
    public ResponseEntity<String> sayHelloWithRoleAdminAndDeleteAuthority() {
        return ResponseEntity.ok("Hello, you have access to a protected resource that requires admin role and delete authority.");
    }
    @PostMapping("/user/resource")
    @PreAuthorize("hasAuthority('CREATE_PRIVILEGE') and hasRole('USER')")
    public ResponseEntity<String> sayHelloWithRoleUserAndCreateAuthority() {
        return ResponseEntity.ok("Hello, you have access to a protected resource that requires user role and create authority.");
    }
    @PutMapping("/user/resource")
    @PreAuthorize("hasAuthority('UPDATE_PRIVILEGE') and hasRole('USER')")
    public ResponseEntity<String> sayHelloWithRoleUserAndUpdateAuthority() {
        return ResponseEntity.ok("Hello, you have access to a protected resource that requires user role and update authority.");
    }
```


L'annotation `@PreAuthorize` est une fonctionnalité de Spring Security qui permet de sécuriser l'accès aux méthodes en utilisant des expressions basées sur le langage d'expression (SpEL). Cette annotation peut être appliquée au niveau de la méthode ou au niveau de la classe.

En utilisant `@PreAuthorize`, vous pouvez spécifier les règles de sécurité qui doivent être satisfaites pour accéder à une méthode. Les expressions SpEL fournissent une syntaxe expressive pour décrire les autorisations requises, telles que `hasAuthority`, `hasRole`, `hasAnyRole`, `hasPermission`, etc. Ces expressions peuvent faire référence aux informations sur l'utilisateur actuellement authentifié, comme ses rôles, ses autorisations et d'autres attributs.

L'application de l'annotation `@PreAuthorize` au niveau de la méthode signifie que la règle de sécurité s'applique uniquement à cette méthode spécifique. En revanche, l'application de l'annotation au niveau de la classe signifie que la règle de sécurité s'applique à toutes les méthodes de la classe. 

Pour comprendre comment Spring gère cela en interne, comme je l'ai déjà expliqué, une fois l'authentification réussie, un objet de type `Authentication` est stocké dans le `SecurityContext`. Comme je vous l'ai également montré précédemment, cet objet `Authentication` contient les autorités de l'utilisateur connecté, c'est-à-dire les informations sur les rôles et les privilèges qu'il possède.

Le filtre `AuthorizationFilter` est le dernier filtre dans la chaîne de filtres de Spring Security. C'est la responsabilité de ce filtre d'autoriser ou non l'accès aux méthodes des contrôleurs, ainsi que de bloquer l'accès et de lever une exception en cas d'accès non autorisé. Le `AuthorizationFilter` intervient après les filtres d'authentification et évalue les autorisations nécessaires en fonction des règles de sécurité configurées. Ainsi, il prend une décision finale concernant l'autorisation et bloque l'accès si nécessaire.

Quand une exception d'authentification `AuthenticationException`, le filtre `ExceptionTranslationFilter`  va lancer l'`AuthenticationEntryPoint`

L'implémentation par défaut de l'interface `AuthenticationEntryPoint` dans Spring Security est la classe `Http403ForbiddenEntryPoint`. Cette classe est utilisée par défaut pour gérer les exceptions d'authentification et renvoyer une réponse avec le code d'état HTTP 403 (Accès refusé).

La classe `Http403ForbiddenEntryPoint` implémente la méthode `commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)` de l'interface `AuthenticationEntryPoint`. Dans cette méthode, elle configure la réponse HTTP avec le code d'état 403 et un message d'erreur standard indiquant l'accès refusé.

Voici la classe `Http403ForbiddenEntryPoint` fournis par Spring

```java
public class Http403ForbiddenEntryPoint implements AuthenticationEntryPoint {

	private static final Log logger = LogFactory.getLog(Http403ForbiddenEntryPoint.class);

	/**
	 * Always returns a 403 error code to the client.
	 */
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException arg2)
			throws IOException {
		logger.debug("Pre-authenticated entry point called. Rejecting access");
		response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
	}

}
```

### Réponses HTTP : 403 Forbidden vs 401 Unauthorized

Il y a une distinction importante entre les codes d'état HTTP 401 Unauthorized et 403 Forbidden en ce qui concerne les erreurs d'authentification et d'autorisation.

Le code 401 Unauthorized est utilisé pour les erreurs d'authentification, indiquant que l'utilisateur n'est pas correctement authentifié ou doit réessayer l'authentification.  L'utilisateur doit tenter une nouvelle tentative d'authentification pour accéder à la ressource demandée.

Le code 403 Forbidden est utilisé pour les erreurs d'autorisation, indiquant que l'utilisateur est authentifié, mais n'est pas autorisé à accéder à la ressource demandée.

Pour résumer, si vous recevez une réponse avec le code 401, vous pouvez essayer une deuxième fois, mais si vous recevez une réponse avec le code 403, il est inutile d'insister. L'application vous indique simplement qu'elle vous reconnaît, mais que vous n'avez pas les droits d'accéder à la ressource, à moins que vos droits ne changent.

### Gérer les erreurs d'authentification avec AuthenticationEntryPoint

L'interface `AuthenticationEntryPoint` est utilisée pour gérer les erreurs d'authentification  (`AuthenticationException`). Comme je l'ai expliqué précédemment, lorsque un utilisateur non authentifié tente d'accéder à une ressource protégée, l'implémentation de `AuthenticationEntryPoint` est invoquée pour gérer cette situation.

Créez la classe `Http401UnauthorizedEntryPoint` sous le package `config` qui implémente `AuthenticationEntryPoint`

```java
package fr.mossaab.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import fr.mossaab.security.handlers.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;


@Component @Slf4j
public class Http401UnauthorizedEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        log.error("Unauthorized error: {}", authException.getMessage());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ErrorResponse body = ErrorResponse.builder()
                .status(HttpServletResponse.SC_UNAUTHORIZED)
                .error("Unauthorized")
                .timestamp(Instant.now())
                .message(authException.getMessage())
                .path(request.getServletPath())
                .build();
        final ObjectMapper mapper = new ObjectMapper();
        // register the JavaTimeModule, which enables Jackson to support Java 8 and higher date and time types
        mapper.registerModule(new JavaTimeModule());
        // ask Jackson to serialize dates as strings in the ISO 8601 format
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS,false);
        mapper.writeValue(response.getOutputStream(), body);
    }
}
```

La méthode `commence` est appelée lorsque l'authentification échoue et reçoit en paramètres l'objet `HttpServletRequest`, l'objet `HttpServletResponse` et l'exception `AuthenticationException`.

`response.setContentType(MediaType.APPLICATION_JSON_VALUE)` et `response.setStatus(HttpServletResponse.SC_UNAUTHORIZED)` configurent la réponse HTTP en spécifiant le type de contenu comme JSON et le code HTTP comme 401 (Accès non autorisé)

L'objet `ErrorResponse`  permet d'encapsuler les détails de l'erreur. 

Enfin,  `ObjectMapper` permet de sérialiser l'objet  `ErrorResponse`  et l'écrit dans la réponse HTTP

### Gérer les erreurs d'autorisation avec AccessDeniedHandler

`AccessDeniedHandler` est une interface utilisée pour gérer les erreurs d'autorisation. Lorsqu'un utilisateur authentifié tente d'accéder à une ressource pour laquelle il n'a pas les autorisations requises, nous devons alors fournir une implémentation de `AccessDeniedHandler` qui sera invoquée pour gérer cette situation

Le handler que nous allons créer sera utilisé par `ExceptionTranslationFilter` pour gérer une exception de type `AccessDeniedException`

Créez la casse `CustomAccessDeniedHandler` qui implémente `AccessDeniedHandler`

```java
package fr.mossaab.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import fr.mossaab.security.handlers.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

@Component @Slf4j
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        log.error("Access denied error: {}", accessDeniedException.getMessage());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        ErrorResponse body = ErrorResponse.builder()
                .status(HttpServletResponse.SC_FORBIDDEN)
                .error("Forbidden")
                .timestamp(Instant.now())
                .message(accessDeniedException.getMessage())
                .path(request.getServletPath())
                .build();
        final ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS,false);
        mapper.writeValue(response.getOutputStream(), body);
    }
}
```

C'est la même implémentation de `AuthenticationEntryPoint`, la seule différence est que nous avons modifié le code HTTP pour passer de 401 à 403.

Maintenant il nous reste de créer le filter qui va intercepter les requêtes HTTP et essayer d'authentifier l'utilisateur.

### Filtrer les requêtes HTTP

Au début, nous avons mentionné que les requêtes demandant l'accès aux ressources protégées doivent être interceptées par un filtre personnalisé. Ce filtre tente d'authentifier l'utilisateur en se basant sur le JWT fourni. S'il réussit à authentifier l'utilisateur, il laisse ensuite la main aux autres filtres de la chaîne de filtres de Spring Security, tels que le `AuthorizationFilter`, qui prendra la décision d'autoriser ou non l'accès de l'utilisateur à la ressource.

Notre filtre personnalisé est une classe qui implémente `OncePerRequestFilter` qui est une classe abstraite fournie par Spring qui facilite la création de filtres pour les requêtes HTTP. Cette classe garantit que le filtre est exécuté une seule fois pour chaque requête HTTP entrante.

Créez la classe `JwtAuthenticationFilter` qui hérite la classe `OncePerRequestFilter`

```java
package fr.mossaab.security.config;

import fr.mossaab.security.service.JwtService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
           @NonNull HttpServletRequest request,
           @NonNull HttpServletResponse response,
           @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        if(authHeader ==  null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }
        final String jwt = authHeader.substring(7); // after "Bearer "
        final String userEmail =jwtService.extractUserName(jwt);

        if(StringUtils.isNotEmpty(userEmail)
                && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if(jwtService.isTokenValid(jwt, userDetails)){
                //update the spring security context by adding a new UsernamePasswordAuthenticationToken
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                context.setAuthentication(authToken);
                SecurityContextHolder.setContext(context);
            }
        }
        filterChain.doFilter(request,response);
    }
}
```

Voici une explication détaillée du code :

- Le filtre vérifie si le header "Authorization" est présent dans la requête et commence par "Bearer ". S'il ne correspond pas à ces critères, le filtre laisse passer la requête sans aucune modification.
- Si le header "Authorization" est présent et correspond au format "Bearer ", le filtre extrait le JWT de la chaîne du header.
- À l'aide du service `JwtService`, le filtre extrait le username (email) à partir du JWT.
- Ensuite, le filtre vérifie si le username n'est pas vide et si l'authentification n'a pas déjà été effectuée pour cette requête. Si ces conditions sont remplies, le filtre demande au service `userDetailsService` de charger les détails de l'utilisateur correspondant au nom d'utilisateur.
- Si le service `userDetailsService` ne parvient pas à trouver l'utilisateur, une exception sera levée.
- Le filtre utilise ensuite le service `JwtService` pour valider le JWT en le comparant aux détails de l'utilisateur chargés précédemment.
- Si le JWT est valide, le filtre met à jour le contexte de sécurité de Spring en ajoutant une instance de `UsernamePasswordAuthenticationToken` contenant les détails de l'utilisateur authentifié.
- Finalement, le filtre passe la requête au filtre suivant dans la chaîne de filtres en appelant `filterChain.doFilter(request, response)`.

Il nous reste la dernière étape avant de tester c'est la configuration de Spring Security

### Configuration de Spring Security

Sous le package config, commencez par créer une classe `ApplicationSecurityConfig` et ajouter l'annotation `@Configuration` pour indiquer à Spring que c'est une classe de configuration.

Les beans requis sont les suivants :

1. Une implémentation de `UserDetailsService`, notamment de la méthode `loadByUsername`.
2. Une implémentation de `PasswordEncoder`, par exemple `BCryptPasswordEncoder` utilisé par défaut.
3. L'`AuthenticationProvider` utilisant `DaoAuthenticationProvider` avec l'implémentation de `UserDetailsService` et `PasswordEncoder`.
4. L'`AuthenticationManager` obtenu à partir de `AuthenticationConfiguration`.

Voici la classe `ApplicationSecurityConfig` :

```java
package fr.mossaab.security.config;

import fr.mossaab.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationSecurityConfig {
    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService(){
        return username -> userRepository.findByEmail(username)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
```

Nous allons maintenant créer la classe `SecurityConfiguration` qui responsable de configurer les règles de sécurité pour les requêtes HTTP et spécifier les filtres et les gestionnaires nécessaires pour l'authentification et les autorisations dans notre application. Elle définit également les règles d'autorisation pour les ressources de l'API

Dans cette classe, nous devons fournir le bean `SecurityFilterChain`, comme je l'ai expliqué et mentionné dans le diagramme d'architecture de Spring au début de cet article.

Créez la classe `SecurityConfiguration` avec une méthode `securityFilterChain` qui prend en paramètre `HttpSecurity` et renvoie le bean `SecurityFilterChain`.

```java
package fr.mossaab.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final Http401UnauthorizedEntryPoint unauthorizedEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(unauthorizedEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(request ->
                        request
                                .requestMatchers(
                                        "/api/v1/auth/**"
                                ).permitAll()
                               //.requestMatchers("/api/v1/admin/resource").hasRole("ADMIN") replaced with annotation in AuthorizationController      
                                .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider).addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}

```

Voici une explique de la méthode`securityFilterChain()` : 

Cette méthode crée un bean `SecurityFilterChain` qui définit les règles de sécurité pour les requêtes HTTP. Elle utilise la méthode de configuration `http` pour spécifier les autorisations d'accès aux ressources.

- `csrf(AbstractHttpConfigurer::disable)`: Désactive la protection CSRF. Comme expliqué précédemment, en mode Stateless, cette protection est inutile dans notre cas.
- `exceptionHandling()`: Gère les exceptions liées à l'authentification et aux autorisations. Ici, nous avons spécifié les deux implémentations que nous avons créées, `CustomAccessDeniedHandler` et `Http401UnauthorizedEntryPoint`.
- `authorizeHttpRequests()`: Définit les règles d'autorisation pour les requêtes HTTP. Dans notre cas, l'accès est autorisé pour les requêtes vers "/api/v1/auth/**", qui est le chemin d'accès vers notre contrôleur d'authentification, et nécessite une authentification pour toutes les autres requêtes.
- `sessionManagement()`: Définit la gestion des sessions en mode Stateless, où la création de session est désactivée.
- `authenticationProvider()`: Spécifie l'`AuthenticationProvider` utilisé pour l'authentification, fourni par notre classe `ApplicationSecurityConfig` que nous venons de créer.
- `addFilterBefore()`: Ajoute notre filtre personnalisé `JwtAuthenticationFilter` avant le `UsernamePasswordAuthenticationFilter` pour gérer l'authentification basée sur le JWT.

Ces configurations permettent de définir les règles de sécurité de notre application Spring Security en désactivant CSRF, gérant les exceptions, spécifiant les autorisations d'accès et la gestion des sessions, ainsi que l'ajout de notre filtre personnalisé pour l'authentification basée sur le JWT.

Les règles d'autorisation sont gérées à l'aide des annotations directement au niveau des contrôleurs, c'est pourquoi nous avons ajouté l'annotation `@EnableMethodSecurity`. Cependant, vous avez également la possibilité de gérer les autorisations de manière globale dans le bean `SecurityFilterChain` en utilisant les `requestMatchers`. Par exemple, vous pouvez spécifier que l'accès à "/api/v1/admin/resource" nécessite le rôle "ADMIN" avec `.requestMatchers("/api/v1/admin/resource").hasRole("ADMIN")`. De même, vous pouvez autoriser uniquement la méthode HTTP POST sur certaines URL en utilisant `.requestMatchers(HttpMethod.POST,"/api/v1/admin/resource").hasRole("ADMIN")`. Cette approche vous permet de gérer les autorisations de manière plus granulaire en spécifiant les URL et les méthodes HTTP associées aux autorisations requises.

Il est important de noter que Spring Security offre de nombreuses possibilités de personnalisation. Je vous encourage à explorer la documentation officielle pour en savoir plus. Cependant, la configuration que nous avons mise en place est suffisante pour notre API.

## Démonstration de l'application

Avant de tester l'application, voici notre fichier `application.yml` (vous pouvez également utiliser `application.properties`) :

```yml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://localhost:5432/db_security
    username: postgres
    password: ${POSTGRES_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: create
    show-sql: true
    properties:
      hibernate:
        format_sql: true
    database: postgresql
    database-platform: org.hibernate.dialect.PostgreSQLDialect
server:
  port: 8086
application:
  security:
    jwt:
      secret-key: 586B633834416E396D7436753879382F423F4428482B4C6250655367566B5970
      expiration: 86400000 # a day
      refresh-token:
        expiration: 604800000 # 7 days
```

Nous allons maintenant tester l'accès à notre application en utilisant  `Postman` qui est une application permettant de tester des API

**L'ajout de deux utilisateurs, l'un avec le rôle USER et l'autre avec le rôle ADMIN** 

![admin-register](img\admin-register.PNG)



![register](img\register.PNG)



**L'authentification d'un utilisateur**

![user_auth](img\user_auth.PNG)

**Échec de l'authentification ** 

![invalid-email](img\invalid-email.PNG)

**L'accès à une ressource protégée qui nécessite un JWT valide** 

L'utilisateur doit avoir le rôle admin avec le droit de lecture :

![admin-access-protected](img\admin-access-protected.PNG)

Si nous essayons d'accéder à la même ressource, mais cette fois avec le JWT de l'utilisateur ayant le rôle USER :

![forbidden-user-admin](img\forbidden-user-admin.png)

**L'accès L'accès à une ressource protégée avec un JWT expiré :**

![user-jwt-expired](img\user-jwt-expired.PNG)

**Demander un nouveau JWT à partir d'un refreshToken valide :** 

![user-refreshtoken](img\user-refreshtoken.PNG)

**Demander un nouveau JWT à partir d'un refreshToken invalide :** 

![invalidRefreshToken](img\invalidRefreshToken.PNG)

**Demander un nouveau JWT à partir d'un refreshToken expiré :** 

![expired-refreshtoken](img\expired-refreshtoken.PNG)



## Conclusion

Cet article nous a présenté l'utilisation de Spring Security pour sécuriser une application Spring Boot. Nous avons exploré divers concepts tels que l'authentification, l'autorisation et l'utilisation de JWT. Grâce à Spring Security, nous avons pu mettre en place une couche de sécurité robuste pour protéger nos ressources et gérer les droits d'accès des utilisateurs.

Le code complet de l'implémentation présentée dans cet article est disponible sur [GitHub](https://github.com/MossaabFrifita/spring-boot-3-security-6-jwt)

En utilisant les principes de Spring Security et en comprenant ses fonctionnalités clés, vous pouvez renforcer la sécurité de votre application et protéger les ressources sensibles contre les accès non autorisés.

N'oubliez pas de toujours garder à l'esprit les meilleures pratiques de sécurité lors du développement d'applications et de continuer à vous informer sur les nouvelles tendances et les mises à jour de Spring Security pour maintenir votre application sécurisée.

Soyez assuré que Spring Security offre une solution puissante et flexible pour répondre à vos besoins de sécurité, et il reste un choix populaire pour sécuriser les applications basées sur Spring Boot.