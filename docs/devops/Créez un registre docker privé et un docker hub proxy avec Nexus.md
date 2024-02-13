---
sidebar_position: 7
---

Au lieu de stocker nos images Docker privées générées lors des builds sur un registry public tel que Docker Hub, nous allons mettre en place un registry privé avec Nexus (docker hosted). Nous allons également en profiter pour créer un proxy vers le Docker Hub public (docker proxy). Un dépôt proxy Docker dans Nexus agit comme un intermédiaire entre notre environnement de développement (ou CI/CD) et Docker Hub. Nexus stocke localement les images Docker provenant de Docker Hub, réduisant ainsi le temps de téléchargement en cas de demandes répétées et permet aux développeurs d'accéder plus rapidement aux dépendances nécessaires à leurs projets.

Nous mettons donc en place deux registres avec Nexus :

1. Un registre d'images Docker privé
2. Un registre Docker public pour accélérer les pulls

Voici le principe de fonctionnement expliqué avec le diagramme ci-dessous :

![concept.drawio](img\concept.drawio.png)

## Installez Nexus Repository Manager

Nous allons installer Nexus dans un conteneur Docker avec `Docker compose` dans la VM `masterserver`

Le Docker Compose est un fichier YAML, contrairement au Dockerfile. Il permet de décrire l'ensemble de la configuration de l'application, les relations entre les images Docker, ainsi que l'ordre de démarrage de ces dernières.

Créez un fichier docker-compose.yaml dans votre espace de travail sur la machine hôte ou directement sur `masterserver`. Si vous souhaitez créer le fichier sur votre machine hôte, tout comme avec Docker CLI, installez Docker Compose.

Sur Windows, vous pouvez l'installer avec Chocolatey

```bash
choco install docker-compose
```

Voici le contenu du fichier Docker Compose : 

```yaml
version: "3.7"
services:
  nexus:
    image: sonatype/nexus3
    expose:
      - 8081
      - 8082
      - 8083
    restart: always
    volumes:
      - "nexus-work:/sonatype-work"
    ports:
      - "5001:8081"
      - "5002:8082"
      - "5003:8083"
volumes:
  nexus-work: {}
```

Les ports exposés sont les suivants :

- 8081 : le port par défaut de Nexus pour accéder à son interface graphique.
- 8082 : le port que nous allons choisir pour le registre public.
- 8083 : le port que nous allons choisir pour le registre privé.

Ces ports du conteneur (8081, 8082 et 8083) sont mappés sur les ports 5001, 5002 et 5003 de la machine hôte (`masterserver`), respectivement. Vous êtes libre de choisir d'autres ports en fonction de leur disponibilité et de vos préférences !

Le volume "nexus-work" est monté sur le chemin "/sonatype-work" à l'intérieur du conteneur. Cela permet de persister les données générées par Nexus, comme les artefacts et la configuration.

Placez-vous à la racine du dossier où vous avez créé votre fichier Docker Compose et exécutez la commande suivante :

```
docker compose up -d
```

Faites un `docker ps` pour vérifier que le conteneur est en cours d'exécution et que les ports sont correctement mappés :

```
E:\workspace\dockerize\sonatype-nexus
λ docker ps
CONTAINER ID   IMAGE                             COMMAND                  CREATED       STATUS      PORTS
               NAMES
bbe83eb3d218   sonatype/nexus3                   "/opt/sonatype/nexus…"   6 days ago    Up 5 days   0.0.0.0:5001->8081/tcp, :::5001->8081/tcp, 0.0.0.0:5002->8082/tcp, :::5002->8082/tcp, 0.0.0.0:5003->8083/tcp, :::5003->8083/tcp   sonatype-nexus-nexus-1
```

Accédez à l'interface web de Nexus depuis votre navigateur via l'adresse `prod.local:5001`.



![image-20240106125224705](img\image-20240106125224705.png)

Cliquez sur "Sign in" pour vous authentifier. Le compte administrateur est créé automatiquement. Le nom d'utilisateur est `admin` et le mot de passe se trouve dans le fichier `/nexus-data/admin.password`.

Pour l'afficher tapez cette commande dans `masterserver` qui permet d'exécuter la commande cat à l'intérieur du conteneur nexus:

```bash
docker exec -i sonatype-nexus-nexus-1 cat /nexus-data/admin.password
```

## Configurez docker pour accepter les registres non sécurisés

Par défaut, Docker n'accepte pas la communication avec des registres non sécurisés, c'est-à-dire via HTTP. Cependant, notre domaine local `prod.local` utilise uniquement le protocole HTTP. Par conséquent, nous devons configurer Docker pour lui permettre de communiquer avec des registres non sécurisés.

Nous allons créer deux registres : le registre public, qui utilise le port `5002` de notre machine hôte, et le registre privé, qui utilise le port `5003`.

Vous allez donc ajouter l'adresse de ces deux registres à la liste des "insecure-registries" dans la configuration de Docker. Cela informe Docker qu'il peut se connecter à ces registres sans utiliser HTTPS.

La liste des registres non sécurisés peut être ajoutée sous format JSON dans le fichier `/etc/docker/daemon.json` :

```bash
root@masterserver:/# cat /etc/docker/daemon.json
{
  "insecure-registries" : ["http://prod.local:5002","http://prod.local:5003"]
}
```

Enregistrez le fichier et redémarrez le service docker

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

Petite information : pour vos propres serveurs et si vous avez un vrai nom de domaine enregistré, vous pouvez utiliser "Let's Encrypt" pour obtenir des certificat SSL/TLS gratuit !

## Créez un docker hub proxy 

### Créez un stockage blob pour le registre public

Le stockage blob permet de stocker les images docker.

1. Cliquez sur l'icône de configuration (engrenage).

2. Accédez à "Blob Stores".

3. Créez un nouveau Blob Store de type "File".

4. Vous pouvez lui donner le nom de votre choix, mais un bon choix est "docker-hub".

5. Cliquez sur "Save".

   ![image-20240106174647326](img\image-20240106174647326.png)

### Activez "Docker Bearer Token Relam"

`Docker Bearer Token Realm` est une mesure de sécurité nécessaire pour gérer l'authentification des pulls anonymes.

1. Cliquez sur "Security > Realms".

2. Ajoutez le "Docker Bearer Token Realm".

3. Cliquez sur "Save".

   ![image-20240106221518161](img\image-20240106221518161.png)

### Créez un registre docker hub proxy

1. Cliquez sur "Repositories".
2. Cliquez sur "Create Repository" et sélectionnez "docker (proxy)".
3. Donnez-lui un nom, exemple "docker-hub"
4. Cochez "HTTP" et attribuez-lui le port 8082 (c'est le port que nous avons choisi pour le registre public).
5. Cochez "Allow anonymous docker pull".
6. Sous Proxy > Remote Storage, saisissez cette URL : [https://registry-1.docker.io](https://registry-1.docker.io/)
7. Sous Docker Index, sélectionnez "Use Docker Hub".
8. Sous Storage > Blob Store, choisissez le Blob Store que vous avez créé précédemment ("docker-hub").
9. Cliquez sur "Create Repository".



Voilà, vous avez créé un registre docker hub de type proxy !

![image-20240106221918648](img\image-20240106221918648.png)

Maintenant, il est temps de tester tout cela. Vous allez donc tester un pull d'une image docker depuis le docker hub proxy :

Avec Docker Hub, si vous souhaitez récupérer une image du serveur `nginx`, par exemple, vous pouvez le faire avec la commande `docker pull nginx`. Maintenant, pour passer par le proxy Docker Hub que vous avez créé, lancez la commande `docker pull prod.local:5002/nginx` dans votre terminal :

```
root@masterserver:/home/mossaabfr# docker pull prod.local:5002/nginx
Using default tag: latest
latest: Pulling from nginx
af107e978371: Pull complete
336ba1f05c3e: Pull complete
8c37d2ff6efa: Pull complete
51d6357098de: Pull complete
782f1ecce57d: Pull complete
5e99d351b073: Pull complete
7b73345df136: Pull complete
Digest: sha256:2bdc49f2f8ae8d8dc50ed00f2ee56d00385c6f8bc8a8b320d0a294d9e3b49026
Status: Downloaded newer image for prod.local:5002/nginx:latest
prod.local:5002/nginx:latest
```

Petit rappel : le port `5002` est celui qui a été mappé avec le port `8082` sur lequel nous avons configuré le registre public.

Depuis le bouton "Browse", vous pouvez accéder à votre proxy Docker Hub, et vous constaterez que l'image **nginx** a bien été enregistrée par Nexus. La prochaine fois que vous effectuerez un pull depuis Nexus, il fournira directement l'image depuis le **cache**, sans avoir besoin de faire appel au Docker Hub public.

![image-20240106223523578](img\image-20240106223523578.png)

## Créez un registre docker privé

### Créez un stockage blob pour le registre privé

De la même manière que pour le registre public, vous savez maintenant comment faire. Créez un stockage blob, nommé par exemple "docker-private", que vous allez utiliser pour stocker les images privées.

### Créez un registre privé (docker-hosted)

1. Cliquez sur "Repositories".
2. Cliquez sur "Create Repository" et sélectionnez "docker (hosted)".
3. Donnez-lui un nom, exemple "docker-private"
4. Cochez "HTTP" et attribuez-lui le port 8083 (c'est le port que nous avons choisi pour le registre privé).
5. Sous Docker Index, sélectionnez "Use Docker Hub".
6. Sous Storage > Blob Store, choisissez le Blob Store que vous avez créé précédemment ("docker-private").
7. Cliquez sur "Create Repository".

Voilà, vous avez maintenant créé votre registre docker privé !

![image-20240107021614047](img\image-20240107021614047.png) 



Pour tester notre registre Docker privé, nous allons créer une image de notre application Spring Boot et la pousser vers le registre privé.

Vous avez créé un proxy Docker Hub, profitez-en ! Modifiez votre Dockerfile pour effectuer le pull depuis le registre Nexus. Ajoutez son URL `prod.local:5002/` devant le nom de l'image, de la même manière que pour la commande `docker pull`

```dockerfile
FROM prod.local:5002/amazoncorretto:17-alpine
COPY target/*.jar /opt/app/devops-project-samples.jar
EXPOSE 7070
ENTRYPOINT ["java","-jar","/opt/app/devops-project-samples.jar"]
```

Quand vous construisez une image Docker et que vous voulez la pousser vers un registre privé, son nom doit être préfixé par l'URL de ce dernier.

Depuis la racine de votre projet, exécuter la commande suivante pour faire le build de l'image : 

```bash
 docker build -t prod.local:5003/devops-project-samples:latest .
```

Vérifiez que votre image a bien été créée :

```bash
PS E:\workspace\maven-projects\devops-project-samples> docker images
REPOSITORY                               TAG                             IMAGE ID       CREATED         SIZE  
prod.local:5003/devops-project-samples   latest                          9b8294df572b   2 minutes ago   309MB 
```

Pour effectuer un push de l'image, similaire à Docker Hub, vous devez vous authentifier. Vous pouvez utiliser le compte admin pour tester, mais en production, il est recommandé de créer des utilisateurs avec des rôles spécifiques plutôt que d'utiliser directement le compte admin.

Commencez alors par exécuter la commande `docker login` pour vous connecter au registre privé :

```bash
PS E:\workspace\maven-projects\devops-project-samples> docker login prod.local:5003
Username: admin
Password:               

Login Succeeded
```

Poussez l'image docker de votre application avec la commande `docker push` :

```bash
PS E:\workspace\maven-projects\devops-project-samples> docker push prod.local:5003/devops-project-samples:latest
The push refers to repository [prod.local:5003/devops-project-samples]
8a716a5d01c6: Pushed
7e661cbcb912: Layer already exists
9fe9a137fd00: Layer already exists
latest: digest: sha256:2bcea3be4dc37856bfd0d90ad643c947bcf8c55c5ea3530ecdb12c75789cfea8 size: 953
```

Vérifiez dans "Browse"  > "docker-private" que votre image a bien été enregistrée !

![image-20240107024638141](img\image-20240107024638141.png)
