---
sidebar_position: 1
tags:
  - Angular16
  - JWT
  - RefreshToken
  - Authentification
  - Autorisation
  - HttpOnlyCookies
  - RoleBasedAccessControl
---

# Angular 16 : Mettre en place l'authentification et l'autorisation basée sur les rôles

L'authentification et l'autorisation sont des éléments essentiels de toute application web moderne. Dans [l'article](https://www.linkedin.com/pulse/spring-security-authentification-autorisation-avec-jwt-frifita) précédent, nous avons exploré comment implémenter un système d'authentification robuste en utilisant JWT (JSON Web Tokens) avec Spring Boot et Spring Security. Nous avons ainsi créé une API REST sécurisée. Le code source est disponible sur Github.

Dans ce nouvel article, nous allons aller plus loin en montrant comment mettre en pratique cette authentification et autorisation basée sur les rôles du côté client en utilisant Angular, l'un des frameworks JavaScript les plus populaires. En outre, nous allons introduire une amélioration cruciale : l'envoi du jeton JWT sous forme de cookie HTTP Only.

## Quel est le meilleur endroit pour stocker les tokens Côté Client ?

Après une authentification réussie de l'utilisateur, notre API Spring Boot renvoie une réponse HTTP au format JSON.

```json
{
    "id": 1,
    "email": "user@gmail.com",
    "roles": [
        "READ_PRIVILEGE",
        "WRITE_PRIVILEGE",
        "ROLE_USER"
    ],
    "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTY5NzExMjg0OSwiZXhwIjoxNjk3MTEzNzQ5fQ.B0yFwrgLoDsVOmfN6Gyr5zLlDq4Wnjha0jchwkqySjE",
    "refresh_token": "NDBmMTUzM2UtODJlYi00NzQxLWIzN2ItODFhNWE0MzllMGM2",
    "token_type": "BEARER"
}
```

Le client a la responsabilité de stocker les informations de l'utilisateur, notamment l'`access_token` et le `refresh_token`, dans un endroit sécurisé.

Il est courant que les développeurs choisissent de sauvegarder ces jetons soit dans le stockage local (localStorage) soit dans des cookies, de manière à les transmettre au backend pour authentifier l'utilisateur lors de futures requêtes.

Cependant, il est essentiel de prendre en compte les vulnérabilités potentielles associées à ces choix :

**Le localStorage est vulnérable aux attaques XSS**

En cas d'injection de code malveillant dans votre application, un attaquant pourrait potentiellement accéder aux données stockées dans le localStorage, y compris les tokens.

*Comment cela est-il possible ?*

Sans entrer dans les détails des méthodes spécifiques d'injection de code malveillant, il est important de comprendre que les attaques XSS (Cross-Site Scripting) surviennent lorsque des acteurs malveillants réussissent à introduire du code JavaScript nuisible dans une application web. Un exemple concret de cette vulnérabilité réside dans l'utilisation fréquente de bibliothèques JavaScript tierces pour des fonctionnalités courantes, telles que l'affichage d'alertes. Par exemple :

```html
<script src="https://cdn-malveillant.com/monalerte.js"></script>
```

Ces bibliothèques sont souvent importées en ligne, et si elles sont compromises par des pirates, leur code source peut être modifié. En conséquence, votre application devient vulnérable, car les attaquants peuvent lire et extraire les informations sensibles stockées dans le localStorage. La sécurité de vos utilisateurs est ainsi sérieusement compromise.

**Les cookies traditionnels sont vulnérables à la fois aux attaques XSS (Cross-Site Scripting) et aux attaques CSRF (Cross-Site Request Forgery)**

*Comment cela est possible ?*

**Attaques XSS :** Les cookies sont accessibles par JavaScript.

**Attaques CSRF :** Les cookies, y compris les cookies de session, sont généralement inclus automatiquement dans chaque requête HTTP. L'attaque se produit lorsque des demandes effectuées par l'intermédiaire d'un site malveillant forcent des utilisateurs authentifiés sur d'autres sites Web à soumettre une demande au site malveillant, obtenant ainsi l'accès à leurs informations d'identification.

*Quelle est la solution ?*

Il faut savoir que les mesures de sécurité change d'une application à l'autre et qu'il n'existe pas la bonne et la mauvaise approche mais vraiment ca dépend des exigences de sécurité de votre application. Selon mon expérience je ne vous conseille pas de stocker les informations sensibles de vos utilisateurs dans le localStorage mais plutôt dans des cookies HTTP only  !

## L'Avantage du Cookie HTTP Only avec Secure=true et SameSite=Strict

Maintenant que nous comprenons les vulnérabilités associées au stockage de tokens dans le localStorage ou dans des cookies traditionnels, il est temps d'explorer pourquoi le choix des cookies HTTP Only avec les paramètres `Secure=true` et `SameSite=Strict` est une approche plus sécurisée pour stocker nos `access_token` et `refresh_token`.

Les cookies HTTP Only ne sont pas accessibles via JavaScript côté client.

En définissant `Secure=true`, les cookies ne seront transmis que via HTTPS.

`SameSite` propose 3 politiques différentes, qui seront définies par les valeurs suivantes (sensibles à la casse) : `None`, `Strict` et `Lax`.

Dans notre cas, avec `access_token` et `refresh_token`, nous opterons pour l'attribut `SameSite=Strict`.

L'attribut `SameSite=Strict` limite le risque d'attaques CSRF : les cookies ne seront pas inclus dans la requête vers un site tiers.

**Exemple :** Un utilisateur est sur "monsite.com" et clique sur un lien redirigeant vers "exemple.com". Si les cookies sont définis comme `SameSite="Strict"`, les cookies ne seront pas inclus dans la requête vers "exemple.com", assurant ainsi une protection maximale contre les attaques CSRF et limitant les risques d'attaque XSS.

Cependant, cela peut entraîner des limitations dans certaines situations, car certains scénarios, tels que le partage de liens vers des ressources, peuvent ne pas fonctionner comme prévu. je vous laisse explorer les autres options sur ce [lien](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Set-Cookie) pour trouver la configuration qui convient le mieux à vos besoins spécifiques.

**Remarques :**

- Il est important d'adapter les mesures de sécurité en fonction des besoins spécifiques de votre application et des exigences en matière de sécurité.
- Ces options ne doivent pas constituer votre unique défense contre les attaques.
- Ne stockez pas les tokens dans le localStorage à moins que vous puissiez garantir une sécurité maximale contre les attaques XSS !
- Gardez à l'esprit que les cookies sont limités à 4 ko, donc assurez-vous que votre JWT n'excède pas cette taille si vous voulez utiliser des cookies HTTP only pour gérer l'authentification.

## **Modification de l'API Spring Boot pour Intégrer la Gestion de Cookies en Session HTTP Only**

Dans cette section, nous allons apporter des modifications dans l'API REST que nous avons développée dans [l'article](https://www.linkedin.com/pulse/spring-security-authentification-autorisation-avec-jwt-frifita) précédent pour intégrer la gestion des tokens  `access_token` et  `refresh_token` en utilisant des cookies HTTP Only.

Vous pouvez passer directement à la section dédiée à Angular si vous le souhaitez. Le code source complet de l'API est disponible sur GitHub.

### Modification du JwtService et du refreshTokenService

Nous allons ajouter les trois méthodes suivantes :

```java
package fr.mossaab.security.service;   
	...
   ResponseCookie generateJwtCookie(String jwt);
   String getJwtFromCookies(HttpServletRequest request);
   ResponseCookie getCleanJwtCookie();
```

#### **Génération d'un Cookie JWT Sécurisé**

La méthode `generateJwtCookie` permet d'encapsuler le jwt dans un cookie HTTP only :

```java
public ResponseCookie generateJwtCookie(String jwt) {
    return ResponseCookie.from(jwtCookieName, jwt)
            .path("/")
            .maxAge(24 * 60 * 60) // 24 hours in s
            .httpOnly(true) 
            .secure(true)
            .sameSite("Strict") 
            .build();
}
```

*Explorons les détails de cette méthode*

Cette méthode est responsable de la génération d'un cookie sécurisé pour stocker le jeton JWT côté client qui sera envoyé dans le Header de la réponse HTTP, elle crée un objet de type `org.springframework.http.ResponseCookie` avec la configuration suivante :

- `path` : Spécifie le chemin pour lequel le cookie est valide.  En définissant le path sur "/", le cookie est accessible depuis n'importe quelle URL de notre application
- `maxAge` : Durée de validité du cookie en secondes
- `httpOnly` : Marquer le cookie comme http-only
- `secure` : Le cookie est envoyé uniquement via HTTPS
- `sameSite` : Spécifie la politique SameSite

#### **Récupération du JWT à partir des Cookies**

La méthode `getJwtFromCookies` permet d'extraire le JWT inclut dans la requête HTTP :

```java
public String getJwtFromCookies(HttpServletRequest request) {
    Cookie cookie = WebUtils.getCookie(request, jwtCookieName);
    if (cookie != null) {
        return cookie.getValue();
    } else {
        return null;
    }
}
```

#### **Suppression du Cookie JWT**

Pour déconnecter l'utilisateur, il suffit de renvoyer au client le cookie jwt vide.

La méthode `getCleanJwtCookie` permet de le créer tout simplement :

```java
@Override
public ResponseCookie getCleanJwtCookie() {
    return ResponseCookie.from(jwtCookieName, "")
            .path("/")
            .build();
}
```

En suivant le même principe que pour le `JwtService`, le `RefreshTokenService` doit également être modifié pour intégrer les mêmes méthodes :

```java
package fr.mossaab.security.service.impl;
	...
   @Override
    public ResponseCookie generateRefreshTokenCookie(String token) {
        return ResponseCookie.from(refreshTokenName, token)
                .path("/")
                .maxAge(refreshExpiration/1000) // 15 days in s
                .httpOnly(true)
            	.secure(true)
                .sameSite("Strict")
                .build();
    }
    @Override
    public String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, refreshTokenName);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return "";
        }
    }
    @Override
    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }

    @Override
    public ResponseCookie getCleanRefreshTokenCookie() {
        return ResponseCookie.from(refreshTokenName, "")
                .path("/")
                .build();
    }
```

### Intégration de la récupération du Cookie JWT dans le Filtre JwtAuthenticationFilter

Le filtre `JwtAuthenticationFilter` permet d'extraire le JWT du header "Authorization". Dans cette section, nous allons enrichir ce filtre en lui permettant de récupérer également le JWT depuis les cookies.

Voici ce qu'il faut modifier : 

```java
    ...
       
    @Override
    protected void doFilterInternal(
           @NonNull HttpServletRequest request,
           @NonNull HttpServletResponse response,
           @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // try to get JWT in cookie or in Authorization Header
        String jwt = jwtService.getJwtFromCookies(request);
        final String authHeader = request.getHeader("Authorization");

        if((jwt == null &&
            (authHeader ==  null || !authHeader.startsWith("Bearer "))) || request.getRequestURI().contains("/auth")){
            filterChain.doFilter(request, response);
            return;
        }

        // If the JWT is not in the cookies but in the "Authorization" header
        if (jwt == null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // after "Bearer "
        }
        final String userEmail =jwtService.extractUserName(jwt);
        
        ...
            
    }
```

Lorsque le filtre intercepte la requête, il essaie de récupérer le JWT, soit en utilisant la méthode que nous avons ajoutée au service JwtService avec l'appel `getJwtFromCookies(request)` pour obtenir le JWT à partir des cookies, soit du Header "Authorization", comme nous l'avons précédemment fait.

### Modification du contrôleur AuthenticationController

Après une authentification réussie de l'utilisateur, notre API renvoie une réponse JSON qui contient les tokens `access_token` et `refresh_token`.

Cependant, ce qui nous manque ici, c'est la possibilité d'envoyer les tokens sous forme de cookies

```java
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(request);
       
        ResponseCookie jwtCookie = jwtService
            .generateJwtCookie(authenticationResponse.getAccessToken());
        ResponseCookie refreshTokenCookie = refreshTokenService
            .generateRefreshTokenCookie(authenticationResponse.getRefreshToken());
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE,refreshTokenCookie.toString())
                .body(authenticationResponse);
    }
```

Les cookies `JwtCookie` et `refreshTokenCookie` sont générés à partir de la réponse `authenticationResponse` et inclus dans la réponse HTTP.

Maintenant il faut avoir la possibilité de rafraichir le `access_token` quand il expire.

Pour maintenir ce que nous avons fait dans [l'article](https://www.linkedin.com/pulse/spring-security-authentification-autorisation-avec-jwt-frifita) précédent, j'ai ajouté un nouveau end-point : `/refresh-token-cookie`

```java
    @PostMapping("/refresh-token-cookie")
    public ResponseEntity<Void> refreshTokenCookie(HttpServletRequest request) {
        String refreshToken = refreshTokenService.getRefreshTokenFromCookies(request);
        
        RefreshTokenResponse refreshTokenResponse = refreshTokenService
                .generateNewToken(new RefreshTokenRequest(refreshToken));
        
        ResponseCookie NewJwtCookie = jwtService.generateJwtCookie(refreshTokenResponse.getAccessToken());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, NewJwtCookie.toString())
                .build();
    }
```

Lorsque le client envoie une requête à cet endpoint, notre méthode tente de récupérer le `refresh_token` à partir des cookies de la requête. Ensuite, elle génère un nouveau cookie `NewJwtCookie` contenant le nouveau jeton d'accès à partir du `refresh_token`. Enfin, la méthode renvoie une réponse HTTP 200 (OK) au client, avec le nouveau cookie inclus dans l'en-tête de la réponse.

*Remarque : la méthode `generateNewToken` peut générer des exceptions si le `refresh_token` n'est pas valide (comme expliqué dans l'article précédent). Dans un tel cas, elle renvoie une réponse HTTP 403 (forbidden)*

## Implémentation de l'Authentification et de l'Autorisation dans Angular 16

L'application Angular que nous allons construire est un exemple minimal mais complet. Notre objectif est de mettre en place un système d'authentification basé sur les JWT et les cookies HTTP-Only, tout en abordant l'autorisation basée sur les rôles.

**Les end-points que nous allons utiliser sont :** 

- POST `api/v1/auth/authenticate` pour authentifier les utilisateurs
- POST `api/v1/auth/logout` pour déconnecter les utilisateurs 
- POST `api/v1/auth/refresh-token-cookie` pour rafraichir le JWT
- POST `api/v1/user/resource` qui renvoie un message avec  un code HTTP 200 si l'utilisateur est authentifié, possède le rôle USER ou ADMIN avec le droit d'écriture (`WRITE_PRIVILEGE`)
- GET `api/v1/admin/resource` elle renvoie un message avec HTTP 200 si l'utilisateur est authentifié, possède le rôle ADMIN avec le droit de lecture (`READ_PRIVILEGE`)

**Les fonctionnalités à développer sont :**

- Création d'une page login
- Création d'une page Home accessible aux utilisateurs avec le rôle ADMIN ou USER
- Création d'une page Admin accessible uniquement aux utilisateurs avec le rôle ADMIN
- Auto-Login permet aux utilisateurs authentifiés de rester connectés sans avoir à saisir à chaque fois leurs informations d'identification
- Auto-Logout permet la déconnexion automatique pour améliorer la sécurité de la session utilisateur
- Création d'une barre de navigation dynamique qui s'affiche en fonction des rôles des utilisateurs. La barre de navigation offrira des liens spécifiques en fonction du rôle de l'utilisateur
- Rafraîchissement Automatique du JWT : Cette fonctionnalité garantira que les utilisateurs restent connectés de manière transparente en actualisant automatiquement leur JWT.

### Création du projet Angular

#### Prérequis :

Node.js et npm : Assurez-vous que Node.js est installé sur votre système, car il est nécessaire pour exécuter Angular CLI. Vous pouvez télécharger Node.js à partir du site officiel : https://nodejs.org/.

1. Angular CLI : `npm install -g @angular/cli`
2. Création d'un nouveau projet Angular : `ng new [nom_projet]`
3. Installation de Bootstrap : `npm install bootstrap --save`
4. Intégration de Bootstrap dans le projet Angular en modifiant le fichier `angular.json` :

```json
"styles": [
  "src/styles.scss",
  "node_modules/bootstrap/dist/css/bootstrap.min.css"
],
"scripts":[
"node_modules/bootstrap/dist/js/bootstrap.bundle.js"
]
```

***Remarque :** Les étapes de configuration de Bootstrap dans ce tutoriel sont fournies à titre indicatif. Vous êtes libre de choisir d'autres frameworks ou bibliothèques CSS, ou de personnaliser davantage la configuration en fonction de vos préférences et des exigences de votre projet. Le but est de vous montrer le processus de configuration de base, et vous pouvez l'adapter en conséquence.*

Générez les composants et les services suivants :

```
ng g s _services/auth
ng g s _services/storage
ng g s _services/user

ng g interceptor _helpers/http
ng g g _helpers/auth

ng g i _models/user.model
ng g i _models/role.model

ng g c login
ng g c header
ng g c admin
ng g c home
ng g c errors/access-denied
```

Ajoutez le `router-outlet` dans le composant principale de l'application `app.component.html` qui servira de conteneur pour afficher le contenu des composants associés aux différentes routes lorsque la navigation se produit

```html
<router-outlet></router-outlet>
```

Voici la structure de notre application Angular :

![](img\angular-project-structure.PNG)

### Création des modèles User et Role

Pour mieux structurer les données manipulées par notre application, créez les interfaces `User` et `Role` sous le répertoire `_models`.

```typescript
import {Role} from "./role.model";

export interface User {
  id: number,
  email: string,
  role: Role
}
```

```typescript
export interface Role {
  name: string,
  permissions: string[]
}
```

Comme vous pouvez le constater, un utilisateur possède un rôle, tandis qu'un rôle se caractérise par un nom et un tableau de chaînes représentant les autorisations.

Les `access_token` et `refresh_token` ne sont pas définis dans les propriétés de l'utilisateur, car ils seront stockés dans les cookies HTTP-only. En revanche, les autres propriétés seront stockées dans le localStorage du navigateur puisque ils ne contiennent pas de données sensibles.

### Création du service Storage

Créez le service `StorageService` :

```bash
ng g s _services/storage
```

`StorageService`  gère le stockage, la récupération et la supression des informations de l'utilisateur authentifié (`User`) dans le localStorage du navigateur. Cela permet de maintenir la persistance des données de l'utilisateur entre les sessions de navigation.

```typescript
import { Injectable } from '@angular/core';
import {User} from "../_models/user.model";

const USER_KEY = 'authenticated-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  saveUser(user : User){
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  getSavedUser() : User | null {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  clean(): void {
    window.localStorage.clear();
  }
}

```

Le `localStorage` est facilement manipulé à l'aide des méthodes `setItem`, `getItem` et `removeItem`, qui fonctionnent avec un couple clé-valeur.

L'objet User est enregistré au format JSON en utilisant `JSON.stringify(user)`.

### Comprendre le mécanisme d'authentification avec des cookies HTTP-only

![image-20231016173244505](img\image-20231016173244505.png)

Lorsque l'utilisateur s'authentifie, le service `AuthService` prend en charge l'appel à notre API pour effectuer l'authentification. En cas de succès, le serveur renvoie une réponse avec le code HTTP 200 contenant les informations de l'utilisateur. Le rôle du `AuthService` est ensuite de déléguer la persistance de ces informations (ID, email, rôles) au `StorageService`, qui les stocke dans le `localStorage`.

Le serveur, quant à lui, transmet le `access_token` et le `refresh_token` via des cookies HTTP-only. Le client doit ainsi conserver ces cookies et les inclure dans les futures demandes adressées au serveur. Cette démarche garantit la continuité de l'authentification de l'utilisateur lors de ses interactions ultérieures.

Ce qu'il est essentiel de retenir de tout cela :

- Les informations (ID, email, rôles) sont stockées dans le `localStorage`.
- Les tokens (access_token, refresh_token) sont conservés dans des cookies HTTP-only.

### Création du service Authentification 

L'objectif principal du service `AuthService` est de gérer l'authentification de l'utilisateur et de fournir un moyen d'accéder aux informations de l'utilisateur authentifié dans toute l'application.

Pour atteindre cet objectif, nous utiliserons les observables de `RxJS`, une bibliothèque JavaScript populaire utilisée par Angular pour la programmation réactive avec ses observables. Le principe de base d'un observable est assez simple :

- Un Observable est un objet qui émet des valeurs du même type au fil du temps.
- Il peut également émettre une erreur à tout moment, après quoi il est considéré comme terminé et ne produira plus de valeurs.
- Nous observons un Observable et réagissons à ses émissions en utilisant sa méthode `subscribe()`.

C'est précisément l'intérêt de cette approche ! Nous allons créer un Observable qui sera utilisé pour stocker l'objet User et avertir les autres composants lorsque l'utilisateur se connecte et se déconnecte de l'application.

En Angular, un service décoré avec `@Injectable({ providedIn: 'root' })` est un singleton, ce qui signifie qu'il sera créé une seule fois pour toute l'application et sera disponible pour être injecté dans tous les composants. Cela nous permet de centraliser la gestion de l'état de l'utilisateur dans le service d'authentification, assurant ainsi sa cohérence et sa mise à jour partout dans l'application.

Pour extraire (ID, email, rôles) de la réponse créer l'interface `AuthResponseData`

```typescript
export interface AuthResponseData {
  id : number,
  email : string,
  roles : string[],
}
```

Les autres attributs seront ignorés automatiquement.

Injectez le `HttpClient` et le `StorageService` dans le constructeur du service. Le service `AuthService` dépend du `HttpClient` pour effectuer des requêtes HTTP vers l'API d'authentification.

```typescript
constructor(
  private http: HttpClient,
  private storageService: StorageService
) { }
```

*Assurez-vous d'importer le module `HttpClientModule` dans votre application. Vous pouvez le faire dans le fichier `app.module.ts` de votre application.*

Comme nous l'avons déjà expliqué, le `AuthService` doit stocker l'utilisateur actuellement authentifié dans un Observable, et dans ce cas, nous choisissons d'utiliser un `BehaviorSubject`.

Le `BehaviorSubject` est un type d'Observable qui conserve la dernière valeur émise, ce qui en fait une excellente option pour stocker l'état de l'utilisateur connecté. De plus, il peut être initialisé avec une valeur par défaut, comme `null`, garantissant ainsi qu'une valeur initiale est toujours disponible, même avant l'authentification de l'utilisateur.

Créez l'objet `BehaviorSubject` `AuthenticatedUser$` et initialisez-le à `null`.

```typescript
AuthenticatedUser$  = new BehaviorSubject<User | null>(null);
```

`AuthenticatedUser$` commence avec une valeur nulle, ce qui signifie qu'au départ, aucun utilisateur n'est authentifié.

Ensuite, il est nécessaire de créer une méthode `login` qui est au cœur du processus d'authentification :

```typescript
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";
import {User} from "../_models/user.model";
import {StorageService} from "./storage.service";


export interface AuthResponseData {
  id : number,
  email : string,
  roles : string[],
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AuthenticatedUser$  = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  login(email : string, password: string) {
    return this.http.request<AuthResponseData>('post','http://localhost:8086/api/v1/auth/authenticate',
      {
        body : {email, password},
        withCredentials : true
      }).pipe(
        catchError(err => {
          let errorMessage = 'An unknown error occurred!';
          if(err.error.message === 'Bad credentials') {
            errorMessage = 'The email address or password you entered is invalid'
          }
            return throwError(() =>  new Error(errorMessage))
        }),
        tap(
          user => {
            const extractedUser : User = {
              email: user.email,
              id: user.id,
              role : {
                name : user.roles.find(role => role.includes('ROLE')) || '',
                permissions : user.roles.filter(permission => !permission.includes('ROLE'))
              }
            }
            this.storageService.saveUser(extractedUser);
            this.AuthenticatedUser$.next(extractedUser);
          }
        )
    );
  }
}
```

la méthode login utilise la méthode `http.request` du service `HttpClient` d'Angular pour envoyer une requete HTTP post au serveur. Elle renvoie un Observable de type `HttpResponse` ce qui nous permet d'utiliser les opérateurs RxJS tels que `pipe`, `map`, `catchError`, et `tap` pour effectuer des opérations sur l'Observable renvoyé par `http.request` et traiter la réponse de la requête HTTP.

Les informations d'identification de l'utilisateur (email et password) sont transmises dans le `body` de la requête HTTP.

L'option `withCredentials: true` est définie pour permettre le partage de cookies avec le serveur. En raison des politiques de sécurité relatives aux cookies dans les navigateurs, ils ne sont pas automatiquement inclus lorsque les domaines (et les ports) sont différents. En spécifiant cette option, vous autorisez explicitement le partage de cookies entre l'application Angular et l'API.

La méthode `pipe` est utilisée pour chaîner des opérations sur l'Observable.

L'opérateur `catchError` est utilisé pour intercepter et gérer les erreurs renvoyées par l'API. Il est fortement recommandé de gérer les erreurs au niveau des services, car cela représente une bonne pratique de développement. Cette approche permet de centraliser la gestion des erreurs pour un service donné, assurant ainsi la cohérence de la gestion des erreurs dans toute l'application.

Le type de l'erreur renvoyé est `HttpErrorResponse` qui est un objet JSON, voici son contenu sur le console : 

![image-20231016221545010](img\image-20231016221545010.png)

Nous pouvons donc accèder aux informations associées pour mieux comprendre et gérer l'erreur.

Dans notre cas, nous utilisons une condition `if (err.error.message === 'Bad credentials')` pour identifier le type d'erreur. L'objet "error" que vous voyez est un objet que nous avons créé dans notre API pour être renvoyé en cas d'erreur.

Pour obtenir plus de détails sur les réponses possibles de l'end-point `/api/v1/auth/authenticate`, je vous encourage à consulter la documentation de l'API via l'URL `/swagger-ui/index.html`. Cela vous permettra d'explorer les différentes réponses possibles et de comprendre la structure des objets d'erreur renvoyés par l'API.

![image-20231016225628911](img\image-20231016225628911.png)

C'est pourquoi chaque API peut renvoyer un objet d'erreur différent en fonction de sa logique métier et de sa structure de données. Il est essentiel de consulter la documentation de l'API pour comprendre le type de réponse d'erreur attendu.

Si tout se passe bien, la méthode `pipe` continue avec l'opération `tap`. Cette opération est utilisée pour effectuer des actions sur les données de la réponse HTTP.

Dans notre cas, elle extrait les informations de l'utilisateur depuis la réponse de la requête, les données que nous attendons sont de type `AuthResponseData`  ce qui facilite leur traitement et du coup la création d'un objet User.

Cet objet utilisateur est ensuite sauvegardé dans le localStorage pour assurer la persistance des données entre les sessions, et il est ensuite émis dans l'observable `AuthenticatedUser$`.

Nous explorerons ensuite la manière de souscrire à cet observable pour rester au courant des modifications de l'état de l'utilisateur connecté, nous permettant ainsi d'adapter nos actions en conséquence.

### Module de routage d'application

Le module de routage d'application (`AppRoutingModule`) est un élément essentiel d'Angular qui permet de gérer la navigation et de définir quel composant s'affiche lorsque différentes URL sont accédées. Dans notre application, il est utilisé pour diriger les utilisateurs vers la page de connexion (**login**), la page d'accueil (**home**), la page d'administration (**admin**), ou encore la page d'accès refusé (**forbidden**), en fonction de leur statut d'authentification et de leurs rôles.

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {authGuard} from "./_helpers/auth.guard";
import {AccessDeniedComponent} from "./errors/access-denied/access-denied.component";
import {AdminComponent} from "./admin/admin.component";

const routes: Routes = [
  {
    path: '',
    redirectTo:'/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent ,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN','ROLE_USER']}
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: 'forbidden',
    component: AccessDeniedComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Pour protéger les routes, nous utilisons le système de `guards` d'Angular avec l'utilisation de `canActivate: [authGuard]`. L'`authGuard` est un guard que nous implémenterons dans la section suivante, et il permet d'autoriser l'accès uniquement aux utilisateurs authentifiés ayant le rôle requis par la route.

La propriété `data` est un objet qui contient une clé `roles`, laquelle a pour valeur un tableau de rôles. Elle est utilisée pour spécifier les rôles requis afin d'accéder à une route particulière.

**En résumé :**

- La route `home` est accessible uniquement aux utilisateurs authentifiés qui ont le rôle `ROLE_ADMIN` ou `ROLE_USER`.
- Lorsqu'aucune URL n'est fournie (`path: ''`), l'utilisateur est redirigé vers `/home`.
- La route `admin` est accessible uniquement aux utilisateurs authentifiés qui ont le rôle `ROLE_ADMIN`.
- La route `login` est accessible à tout le monde.
- La route `forbidden` permet d'afficher un composant qui affiche un message d'accès non autorisé en cas d'erreur HTTP 403.

### Garde d'authentification

Le guard `authGuard` est un composant essentiel de notre application Angular qui joue un rôle clé dans la sécurité des routes. Il est utilisé pour restreindre l'accès aux différentes parties de l'application en fonction de l'état de l'utilisateur connecté et des rôles associés. Le code du `authGuard` est le suivant :

```typescript
import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../_services/auth.service";
import {map, take} from "rxjs";

export const authGuard: CanActivateFn = (
  route,
  state
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.AuthenticatedUser$.pipe(
    take(1), // take the first one and then unsubscribe automatically
    map(user => {
      // check if route is restricted by role
      const { roles } = route.data;
      if(user && user.role && roles.includes(user.role.name)) {
       return true;
      }
      if(user) {
       return  router.createUrlTree(['/forbidden']);
      }
      return  router.createUrlTree(['/login']);
    })
  )
};
```

***Remarque** : Nous utilisons les gardes de route fonctionnels introduits dans la version 14.2 d'Angular, qui sont basés sur des fonctions plutôt que sur des classes. Avant cette version, la seule manière de créer des gardes de route était basée sur des classes qui implémentaient l'interface `CanActivate`, maintenant `deprecated` dans la version actuelle 16. Cependant, le principe reste le même : la route est activée si la fonction `CanActivateFn` retourne vrai.*

Pour vérifier si un utilisateur est actuellement authentifié, nous observons l'`AuthenticatedUser$` fourni par le service `AuthService`. Il est important de noter que `AuthenticatedUser$` est un `BehaviorSubject` qui renvoie la valeur `null` par défaut.

L'utilisation de l'opérateur `take(1)` garantit que nous observons uniquement la première valeur émise par l'observable, puis nous nous désabonnons automatiquement. Cela est suffisant car nous n'avons besoin que de la première valeur pour prendre une décision concernant l'accès à la route.

Ensuite, nous utilisons l'opérateur `map` de RxJS pour transformer l'objet `User` en une décision (vrai ou faux) :

- Si l'utilisateur est authentifié et a le rôle requis, l'accès est autorisé (`return true`).
- Si l'utilisateur est authentifié mais n'a pas le rôle requis, il est redirigé vers la page d'accès refusé (`/forbidden`).
- Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion (`/login`)



### Création de la page login

Le composant login gère le formulaire de connexion, la validation des données d'identification et l'authentification des utilisateurs, assurant ainsi un accès sécurisé à l'application.

**login.component.ts**

```typescript
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../_services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {

  errorMessage! : string;
  AuthUserSub! : Subscription;

  constructor(private authService : AuthService, private router : Router) {
  }

  ngOnInit() {
    this.AuthUserSub = this.authService.AuthenticatedUser$.subscribe({
      next : user => {
        if(user) {
          this.router.navigate(['home']);
        }
      }
    })
  }

  onSubmitLogin(formLogin: NgForm) {
    if(!formLogin.valid){
      return;
    }
    const email = formLogin.value.email;
    const password = formLogin.value.password;

    this.authService.login(email, password).subscribe({
      next : userData => {
        this.router.navigate(['home']);
      },
      error : err => {
        this.errorMessage = err;
        console.log(err);
      }

    })
  }
  ngOnDestroy() {
    this.AuthUserSub.unsubscribe();
  }
}
```

Lorsque la page login est initialisée (`ngOnInit`), un abonnement (`subscribe`) est créé à l'observable `AuthenticatedUser$` du service d'authentification (`AuthService`).

Le but est de vérifier si un utilisateur est déjà connecté et qu'il accède à la page login, il est immédiatement redirigé vers la page d'accueil (home) sans avoir besoin de se reconnecter. Cela améliore l'expérience utilisateur en évitant une double authentification inutile.

Il est important de désabonner d'un observable que vous avez créé dans vos composants Angular lorsque vous avez fini de les utiliser dans `ngOnDestroy()`. Contrairement à `HttpClient`, Angular ne gère pas automatiquement le désabonnement de vos observables personnalisés.

La méthode `onSubmitLogin` est appelée lorsque l'utilisateur soumet le formulaire de connexion. Dans notre exemple, nous utilisons l'approche `Template Driven Form`.

Cette méthode s'abonne à l'observable retourné par `this.authService.login`,  auquel elle transmet le login et le password. Lorsque la requête d'authentification réussit, la fonction `next` est déclenchée, et l'utilisateur est redirigé vers la page d'accueil (`this.router.navigate(['home'])`), indiquant que l'authentification a réussi.

En cas d'erreur lors de la requête d'authentification, la fonction `error` est déclenchée. L'erreur (`err`) est capturée et stockée dans la variable `errorMessage`, qui sera affichée dans le template pour informer l'utilisateur de l'échec de l'authentification.

*Remarque : `errorMessage` contient le message d'erreur personnalisé que nous avons défini dans `auhService`  dans le bloc `catchError` de la méthode login*

**login.component.html**

```html
<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Login</h4>
          <div class="alert alert-danger" *ngIf="errorMessage">
            <p>{{errorMessage}}</p>
          </div>
          <form #formLogin="ngForm" (ngSubmit)="onSubmitLogin(formLogin)">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Email Address"
                ngModel
                #email="ngModel"
                name="email"
                required
                email>
              <div *ngIf="email.errors && formLogin.submitted" class="text-danger">
                Email is required!
              </div>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
                ngModel
                #password="ngModel"
                name="password"
                required
                minlength="6">
                <div *ngIf="password.errors && formLogin.submitted" class="text-danger">
                  <div *ngIf="password.errors['required']">Password is required</div>
                  <div *ngIf="password.errors['minlength']" >
                    Password must be at least 6 characters
                  </div>
                </div>
            </div>
            <button  type="submit" class="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
```

Le modèle de la page login est constitué d'un formulaire HTML simple avec deux champs (email et mot de passe) comprenant des règles de validation. Pour implémenter cette logique, nous avons opté pour l'approche des "Template Driven Forms" d'Angular.

### Création d'une barre de navigation dynamique

**header.component.html**

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand">Angular JWT Auth</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-		controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item" >
          <a class="nav-link" aria-current="page"  routerLink="/home" routerLinkActive="active">Home</a>
        </li>
        <li class="nav-item" *ngIf="showAdminBoard">
          <a class="nav-link" routerLink="/admin" routerLinkActive="active" >Admin Board</a>
        </li>
      </ul>
      <form class="d-flex">
        <button class="btn btn-outline-danger" type="submit" (click)="handleLogout()">logout</button>
      </form>
    </div>
  </div>
</nav>
```

Notre barre de navigation est un simple menu de navigation Bootstrap qui permet de passer d'une page à l'autre, "Home" et "Admin". Étant donné que la page "Admin" est uniquement accessible aux utilisateurs ayant le rôle admin, la visibilité de l'onglet "Admin" dépend du rôle de l'utilisateur grâce à l'utilisation de `*ngIf="showAdminBoard"`.

Nous avons aussi un bouton de déconnexion qui déclenche la fonction `handleLogout()` lorsqu'il est cliqué.

**header.component.ts**

```typescript
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  constructor(private authService : AuthService) {
  }
  showAdminBoard = false;
  AuthUserSub! : Subscription;
  ngOnInit(): void {
   this.AuthUserSub = this.authService.AuthenticatedUser$.subscribe({
      next : user => {
        if(user) {
          this.showAdminBoard = user.role.name === 'ROLE_ADMIN';
        }
      }
    })
  }

  handleLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.AuthUserSub.unsubscribe();
  }

}
```

La variable `showAdminBoard` est initialement définie sur "false". Lors de l'initialisation du composant, nous récupérons simplement l'utilisateur actuellement authentifié pour vérifier s'il possède le rôle d'administrateur (ROLE_ADMIN). En fonction de cette vérification, nous mettons à jour la variable `showAdminBoard`. Cette variable est utilisée dans le template pour refléter dynamiquement les changements : elle permet d'afficher ou de masquer l'onglet "Admin" en fonction du rôle de l'utilisateur connecté.

La méthode `handleLogout()` appelle la méthode `logout()` du service `authService`.

### Implémentation de la méthode logout dans le service authService

Ajoutez la méthode `logout` dans le service `authService`. Elle fait appel à l'endpoint `logout` de l'API, qui renvoie les cookies `access_token` et `refresh_token` vides.

 Si la requête est réussie :

- Les données d'utilisateur stockées dans `localStorage` sont effacées.
- L'observable `AuthenticatedUser$` est mis à jour avec la valeur `null`, indiquant que l'utilisateur est déconnecté.
- L'utilisateur est redirigé vers la page de connexion (`/login`) 

```typescript
 logout(){
    this.http.request('post','http://localhost:8086/api/v1/auth/logout',{
      withCredentials: true
    }).subscribe({
      next: () => {
        this.storageService.clean();
        this.AuthenticatedUser$.next(null);
        this.router.navigate(['/login']);
      }
    })
  }
```

### Création du service User

Dans l'API et dans notre `AuthorizationController`, nous avons deux end-points qui affichent un message en fonction des permissions et du rôle de l'utilisateur.

![image-20231017165513726](img\image-20231017165513726.png)

![image-20231017165642243](img\image-20231017165642243.png)

Le service `userService` permet de les invoquer :

```typescript
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }


  getUserPublicContent() {
  return  this.http.request('post','http://localhost:8086/api/v1/user/resource', {
      withCredentials: true,
      responseType : "text"
    })
  }

  getAdminPublicContent() {
    return  this.http.request('get','http://localhost:8086/api/v1/admin/resource', {
      withCredentials: true,
      responseType : "text"
    })
  }
}
```

### Création de la page Home

Le composant `HomeComponent` est responsable de l'affichage de la page d'accueil de l'application. Il interagit avec le service `UserService` pour récupérer le message renvoyé par ` getUserPublicContent()`  et avec  `AuthService`, pour récupérer les informations de l'utilisateur connecté.

**home.component.ts**

```typescript
import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";
import {AuthService} from "../_services/auth.service";
import {User} from "../_models/user.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  pubContent : string = '';
  user! : User;
  AuthUserSub! : Subscription;
  constructor(
    private userService : UserService,
    private authService : AuthService
  ) {
  }
  ngOnInit(): void {
    this.AuthUserSub = this.authService.AuthenticatedUser$.subscribe({
      next : user => {
        if(user) this.user = user;
      }
    })

    this.userService.getUserPublicContent().subscribe({
      next : data => {
        this.pubContent = data;
      },
      error : err => console.log(err)
    })
  }
  ngOnDestroy() {
    this.AuthUserSub.unsubscribe();
  }
}
```

**home.component.html**

Il sert principalement à afficher la barre de navigation (`<app-header></app-header>`, qui inclut le composant `HeaderComponent`), ainsi que les informations récupérées.

```html
<app-header></app-header>
<div class="container">
  <div class="row m-5">
    <div class="col">
      <div class="card">
        <div class="card-header">
          Connected user information :
        </div>
        <div class="card-body">
          <div *ngIf="user">
            <p>ID: {{user.id}}</p>
            <p>Email: {{user.email}}</p>
            <p>Role: {{user.role.name}} </p>
            <strong>Permissions:</strong>
            <ul>
              <li *ngFor="let p of user.role.permissions">
                {{ p }}
              </li>
            </ul>
          </div>
          Message :<p>{{pubContent}}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Création de la page Admin

La page admin, accessible uniquement par l'utilisateur disposant du rôle admin, permet d'afficher le message renvoyé par la méthode `getAdminPublicContent()` du service `userService`.

**admin.components.ts**

```typescript
import {Component, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  adminPubContent!: string;
  constructor(private userService : UserService) {
  }
  ngOnInit(): void {
    this.userService.getAdminPublicContent().subscribe({
      next : data => {
        this.adminPubContent = data;
      },
      error : err => console.log(err)
    })
  }
}
```

**admin.components.html**

```html
<app-header></app-header>
<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">Admin Dashboard</div>
        <div class="card-body">
          <p *ngIf="adminPubContent">{{adminPubContent}}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Implémentation de la méthode refreshToken dans le service authService

Ajoutez la méthode refreshToken au service `authService` :

```typescript
  refreshToken(){
    return this.http.request('post', 'http://localhost:8086/api/v1/auth/refresh-token-cookie', {
      withCredentials: true
    })
  }
```

Pour demander un nouveau `access_token`, nous pouvons simplement envoyer une requête vers l'endpoint `api/v1/auth/refresh-token-cookie` avec l'option `withCredentials: true`. L'API va recevoir les cookies HTTP-only `access_token` et `refresh_token`, et en fonction de la validité du `refresh_token`, l'API va renvoyer soit un nouveau `access_token` avec un code HTTP 200, soit une erreur avec un code HTTP 403.

Et si nous recevons une erreur 403, dans ce cas, il est nécessaire de déconnecter l'utilisateur. Pour ce faire, nous utilisons les intercepteurs HTTP.

### Gestion des Erreurs avec les Intercepteurs HTTP Angular

L'intercepteur joue un rôle essentiel dans la gestion de l'authentification et de la sécurité au sein de notre application Angular. Il est responsable de l'interception de toutes les requêtes HTTP sortantes.

Notre objectif principal est de gérer les requêtes en fonction du contexte de l'utilisateur authentifié. Lorsqu'un utilisateur est authentifié, l'intercepteur est configuré pour réagir de la manière suivante en cas d'erreur HTTP :

1. Pour une erreur **403 (accès refusé)** : Cela signifie que l'utilisateur n'a pas l'autorisation d'accéder à une ressource particulière. Par exemple, si un utilisateur avec le rôle "user" tente d'accéder directement à la page admin en saisissant l'URL "/admin," l'intercepteur empêche l'accès.
2. Pour une erreur **401 (non autorisé)** : Cela indique que le token  `access_token` a expiré, ce qui signifie que l'utilisateur n'a plus accès. Dans ce cas, l'intercepteur tente de rafraîchir le token en appelant la méthode `refreshToken()` du service `AuthService`.
   - Si le rafraîchissement réussit, la requête est renvoyée avec le nouveau `access_token`.
   - Si le rafraîchissement échoue, par exemple avec une erreur 403 (accès refusé), l'utilisateur est déconnecté car le `refresh_token` est invalide.

Enfin, pour toutes les autres erreurs inattendues, elles sont renvoyées au service appelant afin d'être traitées ultérieurement.

Voici le code de l'intercepteur :

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpErrorResponse,
} from '@angular/common/http';
import {catchError, concatMap, Observable, switchMap, take, throwError} from 'rxjs';
import {AuthService} from "../_services/auth.service";
import {Router} from "@angular/router";

@Injectable()
export class HttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.AuthenticatedUser$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return next.handle(request);
        }
        return next.handle(request).pipe(
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              switch (err.status) {
                case 403:
                  this.router.navigate(['forbidden']);
                  break;
                case 401: // handle 401 unauthorized error : try to refresh JWT
                  return this.authService.refreshToken().pipe(
                    concatMap(() => next.handle(request)),
                    catchError(err => {
                      if (err.status === 403) {
                        this.authService.logout();
                      }
                      return throwError(() => err);
                    })
                  )
              }
            }
            return throwError(() => err);
          })
        );
      })
    );
  }
}
```

`next.handle(request)` est un observable qui représente une requête HTTP asynchrone, et `this.authService.refreshToken()` est également un observable, utilisé pour effectuer un rafraîchissement asynchrone de l'`access_token`.

Il est donc essentiel de gérer les opérations asynchrones de manière contrôlée.

Le choix d'utiliser l'opérateur `switchMap` était pertinent en raison de l'observable `this.authService.AuthenticatedUser$`, qui n'émet qu'une seule valeur grâce à `take(1)`. Avec `switchMap`, toute nouvelle valeur émise par cet observable annule automatiquement les requêtes HTTP en cours, garantissant ainsi un changement instantané lorsque l'état d'authentification de l'utilisateur change.

`concatMap` est utilisé pour maintenir l'ordre des requêtes, assurant que les requêtes HTTP sont gérées de manière séquentielle. Cela garantit que `next.handle(request)` ne sera exécuté qu'une fois que `this.authService.refreshToken()` est terminé.

Enfin déclarez l'intercepteur dans `app.module.ts` pour qu'il soit utilisé par l'application : 

```typescript
  providers: [{provide : HTTP_INTERCEPTORS, useClass : HttpInterceptor, multi: true}]
```

L'option `multi: true` permet d'ajouter cet intercepteur à la liste d'intercepteurs HTTP, car il peut y en avoir plusieurs. Si elle est définie sur `false`, cela remplacerait tous les intercepteurs existants au lieu d'en ajouter un de plus.

### Création du composant access-denied

Le composant `access-denied` affiche simplement un message d'erreur avec un bouton permettant de rediriger l'utilisateur vers la page Home.

```html
<div class="d-flex align-items-center justify-content-center vh-100">
  <div class="text-center">
    <h1 class="display-1 fw-bold">403</h1>
    <p class="fs-3"> <span class="text-danger">Oops!</span> Access Denied.</p>
    <p class="lead">
      The page you're trying to access is restricted.
    </p>
    <a href routerLink="/home" class="btn btn-primary">Go Home</a>
  </div>
</div>
```

### Mise en place de l'auto-login

L'auto-login, ou "authentification automatique," est en effet un mécanisme qui permet à un utilisateur d'être reconnecté automatiquement à une application sans avoir à saisir manuellement ses identifiants (comme son email et son mot de passe) à chaque visite ultérieure. Ce mécanisme améliore l'expérience utilisateur en rendant le processus d'authentification plus transparent et pratique.

Techniquement, dans notre application Angular, si l'utilisateur quitte son navigateur ou son onglet sans se déconnecter et qu'il revient ultérieurement, nous pouvons le reconnecter automatiquement en utilisant les informations stockées dans le `localStorage`.

Ajoutez la méthode `autoLogin()` dans le service `authService` :

```typescript
  autoLogin() {
    const userData = this.storageService.getSavedUser();
    if (!userData) {
      return;
    }
    this.AuthenticatedUser$.next(userData);
  }
```

La méthode `autoLogin()` restaure automatiquement l'état d'authentification de l'utilisateur en utilisant l'objet User préalablement sauvegardé dans le `localStorage` et l'émet dans `AuthenticatedUser$`.

Elle doit être appelée au démarrage de l'application, de préférence dans le composant racine `AppComponent`. Cela garantit que l'état d'authentification de l'utilisateur est restauré dès le chargement de l'application :

```typescript
import {Component, OnInit} from '@angular/core';
import {AuthService} from "./_services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'angular-auth';

  constructor(private authService : AuthService) {}
    
  ngOnInit() {
    this.authService.autoLogin();
  }
}
```

Veuillez noter que si l'`access_token` expire, l'intercepteur tentera automatiquement de demander un nouveau. Si cette tentative échoue, l'utilisateur sera redirigé vers la page login où il devra se reconnecter. Cette situation peut être considérée comme une forme d'auto-login, car l'utilisateur est redirigé vers la page login pour obtenir un nouveau `access_token`.

## Démonstration

Échec de la connexion

![image-20231018144534277](img\image-20231018144534277.png)

Exemple d'authentification réussie avec un utilisateur ayant le rôle USER, la page home s'affiche par défaut.

La barre de navigation n'affiche que l'onglet Home.



![image-20231018144918466](img\image-20231018144918466.png)



Deux requêtes sont envoyées à l'API avec un code HTTP 200 : la première est pour l'authentification, la deuxième est pour récupérer le message à partir de l'end-point sécurisé.

![image-20231018145039994](img\image-20231018145039994.png)



Dans la réponse de la requête d'authentification, nous pouvons constater que nous avons bien reçu les cookies envoyés par l'API.

![image-20231018145415340](img\image-20231018145415340.png)



Dans la requête demandant l'accès à l'end-point sécurisé, nous pouvons clairement voir que notre application Angular a inclus les cookies contenant les `access_token` et `refresh_token`.

![image-20231018145633521](img\image-20231018145633521.png)



Nous pouvons également observer que les cookies sont stockés dans le navigateur avec les options HttpOnly, Secure et SameSite strict.

![image-20231018145839650](img\image-20231018145839650.png)



Les informations de l'utilisateur authentifié sont également bien enregistrées dans le `localStorage`.

![image-20231018145946686](img\image-20231018145946686.png)



Si l'`access_token` a expiré et que l'utilisateur a interagi avec l'application (dans ce cas, en actualisant la page Home), nous pouvons constater que la requête visant à récupérer le message depuis l'end-point sécurisé a échoué avec un code HTTP 401. À ce moment, l'intercepteur a envoyé une deuxième requête pour actualiser l'`access_token`, et la réponse était accompagnée d'un code HTTP 200. La navigation se poursuit sans demander à l'utilisateur de se reconnecter.

![image-20231018160146964](img\image-20231018160146964.png)



Si le `refresh_token` n'est plus valide, nous pouvons voir que la réponse de la requête de rafraîchissement arrive avec le code HTTP 403. Dans ce cas, l'utilisateur est déconnecté automatiquement et redirigé vers la page login.

![image-20231018161030539](img\image-20231018161030539.png)

**Remarque** : Pour éviter d'attendre l'expiration de l'`access_token`, du `refresh_token`, vous pouvez simplement les supprimer. Cela vous permettra de simuler les tests que nous avons effectués à chaque étape.

Si l'utilisateur tente d'accéder à la page admin en tapant directement l'URL `/admin` :

![image-20231018160322594](img\image-20231018160322594.png)

Exemple d'authentification réussie avec un utilisateur ayant le rôle ADMIN.

Cette fois, nous pouvons constater qu'un nouvel onglet `Admin Board` s'affiche dans la barre de navigation.

![image-20231018161314142](img\image-20231018161314142.png)



Voici le contenu de la page de connexion, qui affiche simplement le message récupéré depuis l'end-point sécurisé.

![image-20231018161403580](img\image-20231018161403580.png)

## Code source de l'application

Voici le lien vers le code source de l'application : https://github.com/MossaabFrifita/angular-16-jwt-authentication-authorization

## Conclusion

La gestion de l'authentification est un élément essentiel de toute application web sécurisée, et grâce aux connaissances acquises dans cet article, vous serez en mesure de développer des applications Angular plus sûres et plus fiables. Bonne mise en œuvre de l'authentification dans vos projets !