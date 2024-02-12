---
sidebar_position: 6
---


Docker est utilisé à tous les niveaux de l'infrastructure (CI / Développement / Production). 

Dans la démarche DevOps, les images Docker sont utilisées pour faciliter le déploiement des applications, car elles permettent de packager l'application avec toutes ses dépendances dans une image Docker. Cette image peut ensuite être exécutée sur différents environnements.

Dans notre pipeline CI/CD, après la construction, nous allons utiliser Docker pour créer l'image. À ce stade, nous allons simplement tester la création et l'exécution de l'image Docker de notre application. Nous verrons par la suite comment automatiser tout cela avec Jenkins.

## Créez votre image docker à l'aide de Dockerfile

La première chose que vous devez faire est de créer un fichier nommé  `Dockerfile` à la racine du projet, puis de définir dans celui-ci l'image que vous allez utiliser comme base, grâce à l'instruction `FROM` :

```dockerfile
FROM amazoncorretto:17-alpine
COPY target/*.jar /opt/app/devops-project-samples.jar
EXPOSE 7070
ENTRYPOINT ["java","-jar","/opt/app/devops-project-samples.jar"]
```

Notre image se base sur `amazoncorretto:17-alpine` qui est une distribution d'OpenJDK fournie par Amazon.

`COPY *.jar` signifie que tous les fichiers JAR du répertoire source `target` sont copiés vers le répertoire de destination `/opt/app/` dans l'image Docker. Cette approche évite de spécifier statiquement le nom du fichier, ce qui est une bonne pratique puisque si le nom du fichier JAR évolue avec chaque version, il n'est pas nécessaire de modifier le Dockerfile à chaque mise à jour de notre application. Cela rend le processus de construction de l'image Docker plus flexible dans notre pipeline CI/CD.

**Nous aborderons plus en détail le versioning en livraison continue plus tard dans le cours.**

L'instruction `EXPOSE 7070` permet d'exposer le port `7070` du conteneur, qui correspond au port que nous avons configuré pour Tomcat dans le fichier `application.yml`. Elle n'est pas obligatoire mais c'est bonne pratique pour documenter le port que votre application expose.

Finalement, l'instruction `ENTRYPOINT` spécifie la commande par défaut qui sera exécutée lorsque le conteneur est démarré.

## Lancez votre conteneur personnalisé

Avant de commence, assurez-vous que la VM `masterserver` est allumée.

Dans un terminal, à la racine du projet, lancez `docker build` pour construire l'image. Si vous ne spécifiez pas de tag, l'image le tag par défaut `latest`

```bash
docker build -t devops-project-samples .
```

L'argument `-t` permet de donner un nom à votre image Docker. Cela permet de retrouver plus facilement votre image par la suite.

Le `.` est le répertoire où se trouve le Dockerfile ; dans notre cas, à la racine de notre projet.

Voici la trace d'exécution :

```bash
PS E:\workspace\maven-projects\devops-project-samples> docker build -t devops-project-samples .
Sending build context to Docker daemon  20.81MB
Step 1/4 : FROM amazoncorretto:17-alpine
17-alpine: Pulling from library/amazoncorretto
c926b61bad3b: Already exists
0f42aa8d4054: Already exists
Digest: sha256:97077b491447b095b0fe8d6d6863526dec637b3e6f8f34e50787690b529253f3
Status: Downloaded newer image for amazoncorretto:17-alpine
 ---> d7275522a516
Step 2/4 : COPY target/*.jar /opt/app/devops-project-samples.jar
 ---> bae4d20d0614
Step 3/4 : EXPOSE 7070
 ---> Running in 7f1fc6139abf
Removing intermediate container 7f1fc6139abf
 ---> 73d03d6cf045
Step 4/4 : ENTRYPOINT ["java","-jar","/opt/app/devops-project-samples.jar"]
 ---> Running in 51a9c6d2cfe3
Removing intermediate container 51a9c6d2cfe3
 ---> 4d6ed12f3be4
Successfully built 4d6ed12f3be4
Successfully tagged devops-project-samples:latest
```

Vous pouvez vérifier avec la commande `docker images` que notre image a bien été crée.

```bash
PS E:\workspace\maven-projects\devops-project-samples> docker images
REPOSITORY                        TAG                             IMAGE ID       CREATED         SIZE
devops-project-samples            latest                          4d6ed12f3be4   3 minutes ago   309MB
```

Maintenant, vous pouvez lancer votre conteneur avec la commande `docker run` :

```bash
PS E:\workspace\maven-projects\devops-project-samples> docker run --name devops-app -d -p 7000:7070 devops-project-samples
de97c6eb9beb6e4fbc38700ebfb7513b2a385c86650c388d20c3beef828b1967
```

Lancez la commande `docker ps` pour vérifier que le conteneur est en cours d'exécution en arrière-plan (c'est grâce à l'option `-d`).

```bash
PS E:\workspace\maven-projects\devops-project-samples> docker ps
CONTAINER ID   IMAGE                   COMMAND                 CREATED         STATUS         PORTS                                                                                                                             NAMES
de97c6eb9beb   devops-project-samples  "java -jar /opt/app/…"  12 seconds ago  Up 7 seconds   0.0.0.0:7000->7070/tcp, :::7000->7070/tcp                                                                                         devops-app
```

Maintenant, depuis votre navigateur, accédez à `prod.local:7000` pour vérifier que l'application est bien accessible. Le port `7000` correspond à celui de notre machine hôte que nous avons mappé avec le port `7070` exposé par le conteneur grâce à l'option `-p 7000:7070`.



![image-20240105175442130](img\image-20240105175442130.png)

Finalement, vous pouvez supprimer le conteneur ainsi que l'image Docker, nous n'en aurons plus besoin. C'était pour tester !

```bash
PS E:\workspace\maven-projects\devops-project-samples> docker stop devops-app
devops-app
PS E:\workspace\maven-projects\devops-project-samples> docker rm devops-app
devops-app
PS E:\workspace\maven-projects\devops-project-samples> docker rmi devops-project-samples
Untagged: devops-project-samples:latest
Deleted: sha256:4d6ed12f3be4077e2391005f655f28b11765831f52e17e924f6a8dfcc079143a
Deleted: sha256:73d03d6cf045dd503d935ae446be8dd05e97b5b13129c7b2c1eca30d0e20d42d
Deleted: sha256:bae4d20d06144b045f200a6d71ec23fa30adf1e7dab5082a6444f73af79a9e41
Deleted: sha256:bd6818c4e59a487bf91477092fc3b25ded08abcdec25e000312e34024591879f
```