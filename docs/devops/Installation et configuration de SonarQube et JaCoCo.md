---
sidebar_position: 5
---

## Architecture de SonarQube

![img](img\architecture-scanning.png)

Source de l'image (https://scm.thm.de/sonar/documentation/architecture/architecture-integration/)

1. Le serveur SonarQube démarre 3 processus :
   - `WebServer` c'est un serveur web qui fournit l'interface utilisateur.

   - `SearchServer` c'est un serveur de recherche basé sur `Elasticsearch`, permet d'effectuer des recherches à partir de l'interface utilisateur.

   - `Compute Engine Server` c'est le serveur responsable du traitement des rapports d'analyse de code et de les enregistrer dans la base de données SonarQube.

2. La base de données SonarQube stocke la configuration de l'instance de SonarQube, ainsi que les rapports de qualité des projets, etc.

3. Les plugins SonarQube étendent les fonctionnalités de base.

4. Les scanners SonarQube qui peuvent être exécutés sur les serveurs de build et d'intégration continue pour analyser les projets et fournir des rapports de qualité.

## Installez SonarQube server

Nous allons installer SonarQube server avec docker, dans le serveur `masterserver` démarrez un conteneur docker avec SonarQube

```bash
docker run -d --name sonarqube --restart always -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

Par défaut SonarQube utilise une base de données H2. En production il est recommandé de le configurer avec une base de données externe telle que PostgreSQL, MySQL, Microsoft SQL Server, ou Oracle Database.

Il est également conseillé de monter les volumes `sonarqube_data`, `sonarqube_logs` et `sonarqube_extensions` lorsque vous exécutez SonarQube dans un conteneur Docker, cela permet d'assurer la persistance des données. Vous pouvez trouver toutes les instructions de configuration de SonarQube avec Docker et Docker Compose à partir de ce [lien](https://docs.sonarsource.com/sonarqube/latest/setup-and-upgrade/install-the-server/installing-sonarqube-from-docker/).

`SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true` permet de désactiver le serveur de recherche dont nous n'aurons pas besoin pour ce cours.

Une fois le conteneur démarré, SonarQube est accessible sur le serveur `masterserver` à l'adresse IP 192.168.1.137 et sur le port 9000. Nous avons déjà défini un nom de domaine local pour le `masterserver`, donc nous pouvons y accéder directement depuis le navigateur web avec `prod.local:9000`.



![image-20240103142358842](img\image-20240103142358842.png)

Les identifiants par défaut sont `admin admin`. Lors de votre première connexion à SonarQube, il vous sera demandé de les modifier.

## Installez SonarQube Scanner

Le rôle du scanner SonarQube, comme je l'ai déjà expliqué, est d'analyser le projet, de collecter les informations  sur la qualité du code et d'envoyer le rapport au serveur SonarQube. Il existe plusieurs scanners pour différents systèmes de build tels que Gradle, Maven, Ant, .NET, Jenkins, etc.

Pour notre cas c'est Maven, on peut l'intégrer directement à notre projet avec le [plugin](https://mvnrepository.com/artifact/org.sonarsource.scanner.maven/sonar-maven-plugin) `SonarQube Scanner For Maven`

Ajoutez la dépendance du plugin dans le fichier pom.xml dans la section build => plugins :

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.sonarsource.scanner.maven</groupId>
            <artifactId>sonar-maven-plugin</artifactId>
            <version>3.9.1.2184</version>
        </plugin>
    </plugins>
</build>
```

## Contrôlez la qualité du code et la couverture de vos tests

### L'authentification anonyme

Par défaut, l'accès anonyme au serveur SonarQube ou aux projets via l'API n'est généralement pas autorisé. Pour accéder à SonarQube, une authentification est requise, soit en utilisant le login et le mot de passe d'un utilisateur, soit en fournissant un token d'accès.

Vous pouvez activer/désactiver l'authentification anonyme depuis l'onglet "Administration" => "Security"

![image-20240103171232209](img\image-20240103171232209.png)

Pour garantir la sécurité l'authentification anonyme ne doit pas être autorisé, l'utilisation d'un token d'accès est souvent recommandée, car cela évite de partager les identifiants de l'utilisateur, ce qui renforce la sécurité.

### Générez un token d'accès

Pour générer un nouveau token d'accès, accédez à "My Account"  => "Security" => "Tokens".

![image-20240103215223881](img\image-20240103215223881.png)

1. Donnez un nom au token pour le différencier.
2. Choisissez le type "Global Analysis Token", le type permet de définir un niveau d'accès :
   - `User Token` : Associé à un utilisateur spécifique et hérite de ses permissions.
   - `Project Token` : Lié à un projet spécifique et n'a que les autorisations nécessaires pour ce projet.
   - `Global Token` :  Indépendant des utilisateurs, donne un accès global à tous les projets.
3. Choisissez la durée de validité du token dans la section "Expires in". Vous pouvez sélectionner une durée spécifique (par exemple, 30 jours, 90 jours) ou choisir "No Expiration" pour un token sans expiration.
4. Cliquez sur "Generate" pour générer le token

![image-20240103220643041](img\image-20240103220643041.png)

Copiez le token quelque part, car il ne sera plus visible si vous fermez la fenêtre !

### Créez un projet local

1. Créez un projet local dans SonarQube "projects"  => "Create a local project"

![image-20240103213134152](img\image-20240103213134152.png)

2. Sélectionnez "user the global setting"

![image-20240103213324833](img\image-20240103213324833.png)

3. Dans la prochaine étape vous pouvez choisir la méthode d'analyse, sélectionnez "Locally" 

   ![image-20240103221145556](img\image-20240103221145556.png)

4. Dans "Provide a token", choisissiez "use existing token" et collez le token généré précédemment 

5. Finalement, choisissiez Maven comme un outil de build pour exécuter analyse du code :

   ![image-20240103222758684](img\image-20240103222758684.png)

SonarQube nous fournit déjà la commande Maven à exécuter dans notre projet pour lancer l'analyse avec Sonar Scanner. Copiez-la pour tester.

Avant d'exécuter la commande, il est important de noter que le scanner peut être lancé simplement avec la commande `mvn clean verify sonar:sonar` sans arguments !

Mais pour envoyer les résultats d'analyse, le scanner nécessite les informations suivantes :

1. `projectKey` : la clé du projet sur le serveur SonarQube pour son identification.
2. `projectName` : le nom du projet sur le serveur SonarQube.
3. `host.url` : l'URL du serveur SonarQube.
4. `token` : un token assurant un accès sécurisé au serveur.

Par défaut, il recherche la configuration du projet dans le fichier `settings.xml` de Maven, comprenant l'URL du serveur, le token nécessaire pour l'authentification ou le login/password, ainsi que le `projectKey`, correspondant à l'`artifactId` dans le fichier `pom.xml`, et le `projectName` dans l'élément `name`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	...
    <groupId>fr.mossaab</groupId>
    <artifactId>devops-project-samples</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>devops-project-samples</name>
    <description>devops-project-samples</description>
	...
</project>
```

Mais nous pouvons passer tous ces paramètres sous forme d'arguments, et d'ailleurs, c'est ce que nous propose SonarQube pour tester :

```bash
mvn clean verify sonar:sonar \
  -Dsonar.projectKey=devops-project-samples \
  -Dsonar.projectName='devops-project-samples' \
  -Dsonar.host.url=http://prod.local:9000 \
  -Dsonar.token=sqa_8f117f6e6633bb15a069fd78920cb35fd4325273
```

Le `projectKey` et le `projectName` ne sont pas obligatoires. Comme je viens de l'expliquer, le scanner tentera de les déduire à partir du fichier `pom.xml`. Si le projet n'existe pas, il sera créé automatiquement. Cependant, cela dépend de l'autorisation accordée par le token d'accès !

### Lancez l'analyse du projet avec Sonar Scanner

Lancez la commande précédemment copiée à partir de la racine de votre projet, comme vous avez l'habitude de le faire avec les autres commandes Maven.

Remarque : Si vous exécutez la commande avec CMD et que vous rencontrez des problèmes, veillez à encadrer les paramètres entre guillemets doubles afin d'éviter toute interprétation incorrecte des caractères spéciaux, comme dans l'url : `-D"sonar.host.url=http://prod.local:9000"`. En revanche, avec PowerShell, l'utilisation de guillemets doubles n'est pas nécessaire.

Si tout se passe bien vous devriez voir "ANAYSIS SUCESSFUL" avec le lien vers le projet dans SonarQube

![image-20240104012858405](img\image-20240104012858405.png)

Accédez au SonarQube depuis votre navigateur pour voir le rapport d'analyse envoyé par le Scanner.

![image-20240104011934964](img\image-20240104011934964.png)

Vous pouvez parcourir les bugs, les vulnérabilités ainsi que les 'Code Smells', qui sont des indicateurs de parties du code pouvant être améliorées en termes de lisibilité, de maintenabilité ou de performances.

### SonarQube Quality gates

Les Quality Gates sont des mécanismes configurables qui nous permettent de définir des règles spécifiques pour évaluer la qualité du code. Ces règles peuvent inclure des critères tels que la duplication de code, la couverture par les tests, et d'autres aspects essentiels de la qualité du code. Ainsi, le statut "Passed" indique que le code respecte ces règles prédéfinies, assurant ainsi un niveau de qualité satisfaisant pour la production.

Pour une expérience pratique, nous allons introduire une méthode vide `public void emptyVoid(){}` dans le code, puis relancer le scanner afin d'observer l'effet de cette modification sur les résultats de l'analyse.

Voici le résultat, cette fois le statut des Quality gates est "Failed"

![image-20240104021618002](img\image-20240104021618002.png)

Cliquez sur le projet, puis sur 'Issues' pour accéder à la liste des problèmes. Vous pouvez constater que l'ajout de la méthode vide est déjà signalé par SonarQube

![image-20240104022033120](img\image-20240104022033120.png)

Les Quality Gates peuvent être configurés depuis l'onglet "Quality Gates" dans SonarQube

SonarQube applique des règles par défaut à tous les projets, mais permet une personnalisation pour adapter ces règles aux besoins spécifiques de chaque projet.

![image-20240104023853532](img\image-20240104023853532.png)



### Évaluez la couverture de vos tests

Si vous faites du TDD, vous commencez par écrire des tests avant de coder la fonctionnalité. Cependant, pendant l'implémentation réelle de la fonctionnalité, vous pourriez écrire du code au-delà du périmètre initial du test, en incluant des cas particuliers et des exceptions.

Par conséquent, bien que vous ayez créé des tests initiaux, ils pourraient ne pas couvrir toutes les instructions du code nouvellement écrit. La couverture de code par les tests signifie simplement qu'une ligne de code a été exécutée par au moins un test. Il est donc possible que toutes les branches du code ne soient pas testées, laissant des parties du code non couvertes.

C'est pourquoi il est important de combiner le TDD avec une analyse de la couverture de code pour s'assurer que la plupart, voire toutes, les parties du code sont effectivement testées. Cela contribue à garantir une meilleure qualité et fiabilité du code

### Mesurez la couverture des tests avec JaCoCo

SonarQube ne génère pas le rapport de couverture lui-même. À la place, vous devez configurer un outil tiers pour produire le rapport lors de build, Comme JaCoCo qui est pris en charge nativement par SonarQube.

Nous allons utiliser le plugin Maven JaCoCo pour générer des rapports de couverture de code lors de build.

Commencez par ajouter l'appel au plugin à votre fichier pom.xml dans la section build => plugins (pensez à vérifier sur [mvnrepository.com](https://mvnrepository.com/artifact/org.jacoco/jacoco-maven-plugin) s'il existe une version plus récente du plugin) :

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <id>jacoco-initialize</id>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
            <phase>test-compile</phase>
        </execution>
        <execution>
            <id>jacoco-site</id>
            <phase>verify</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

 Cette déclaration permet de déclencher JaCoCo durant le build et de rédiger un rapport après l'exécution des tests.

Ensuite, en ligne de commandes, lancez la commande :

```bash
mvn clean install
```

À la fin de l'exécution de la commande, vous pouvez voir que JaCoCo a généré un rapport qui se trouve par défaut dans le dossier target/site/jacoco.

![image-20240104193956295](img\image-20240104193956295.png)



Ouvrez dans votre navigateur le fichier index.html, et vous obtenez un rapport cliquable :

![image-20240104190002292](img\image-20240104190002292.png)

Par défaut, le Scanner vérifie automatiquement le rapport enregistré sous `target/site/jacoco/jacoco.xml` et l'envoie au SonarQube.

Relancez le Scanner toujours par la même commande :

```bash
mvn clean verify sonar:sonar \
  -Dsonar.projectKey=devops-project-samples \
  -Dsonar.projectName='devops-project-samples' \
  -Dsonar.host.url=http://prod.local:9000 \
  -Dsonar.token=sqa_8f117f6e6633bb15a069fd78920cb35fd4325273
```

Vérifiez votre projet pour vous assurer que le pourcentage de la couverture de code a bien été mis à jour !

![image-20240104194427580](img\image-20240104194427580.png)

### Utilisez SonarLint dans votre IDE

SonarLint est un plugin ou une extension pour les IDE, il est disponible pour IntelliJ IDEA, Eclipse et Visual Studio Code. Son objectif principal est d'apporter les fonctionnalités d'analyse statique de code de SonarQube directement dans l'IDE, offrant ainsi une vérification continue de la qualité du code pendant le développement.

Installez le plugin SonarLint dans votre IDE pour tester, dans Intellij vous pouvez le faire en accédant à "File" => "Settings" => "Plugins"

SonarLint analyse automatiquement le code en temps réel.

![image-20240104195859997](img\image-20240104195859997.png)

### Analysez le code avec SonarScanner CLI

Le SonarScanner CLI est utilisé quand aucun système de build n'est spécifié, nous allons déjà tester le Scanner pour Maven avec la commande `mvn clean verify sonar:sonar` en passant les arguments nécessaires, maintenant nous allons tester l'analyse de code avec SonnarScanner CLI.

Téléchargez SonarScannerCLI depuis le [site officiel](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/) et ajoutez le chemin de dossier "bin" aux variables d'environnements 

Pour Windows : 

![image-20240104214723339](img\image-20240104214723339.png)



Le fichier de configuration globale se trouve sous `chemin_vers_sonarScanner/conf/sonar-scanner.properties` :

```properties
#Configure here general information about the environment, such as SonarQube server connection details for example
#No information about specific project should appear here

#----- Default SonarQube server
#sonar.host.url=http://localhost:9000

#----- Default source code encoding
#sonar.sourceEncoding=UTF-8
```

Vous pouvez également ajouter à un fichier de configuration local spécifique à votre projet à la racine. Créez le fichier `sonar-project.properties` :

```properties
sonar.host.url=http://prod.local:9000
sonar.projectKey=devops-project-samples
sonar.projectName=devops-project-samples
sonar.login=sqa_8f117f6e6633bb15a069fd78920cb35fd4325273
sonar.java.binaries=target/classes
```

Exécutez la commande `sonar-scanner` pour tester :

![image-20240104215823858](img\image-20240104215823858.png)

À la fin de l'exécution, vous obtiendrez le même résultat "ANALYSIS SUCCESSFUL" qu'avec la commande `mvn sonar:sonar`.

![image-20240104220545143](img\image-20240104220545143.png)

En résumé, nous avons vu deux méthodes pour lancer le Sonar Scanner !