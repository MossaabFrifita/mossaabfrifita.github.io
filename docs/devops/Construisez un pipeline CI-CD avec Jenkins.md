---
sidebar_position: 10
---

Jusqu'à présent, nous avons utilisé Maven pour construire notre application Spring Boot, Docker pour la containeriser dans un environnement isolé, SonarQube pour tester la qualité de notre code, et Nexus comme registre privé pour stocker et partager les images Docker. De plus, nous avons mis en place deux environnements, `staging` et `production`, pour déployer l'application avec Ansible.

Ces étapes sont nécessaires à chaque modification du code. Afin d'automatiser ce processus, nous allons mettre en œuvre un pipeline CI/CD avec Jenkins.

## Installez Jenkins

Il existe plusieurs manière d'installer Jenkins, vous pouvez consulter la [documentation officielle](https://www.jenkins.io/doc/book/installing/), dans ce cours je vais l'installer directement sur le serveur `masterserver`.

Jenkins a besoin de Java pour fonctionner, installez `openjdk 17` :

```bash
sudo apt-get update && apt-get -y install openjdk-17-jdk
```

```bash
mossaabfr@masterserver:~$ java --version
openjdk 17.0.9 2023-10-17
OpenJDK Runtime Environment (build 17.0.9+9-Ubuntu-122.04)
OpenJDK 64-Bit Server VM (build 17.0.9+9-Ubuntu-122.04, mixed mode, sharing)
```

Installez ensuite la version LTS de Jenkins :

```bash
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins
```

Activez et démarrez le service Jenkins :

```bash
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

Par défaut Jenkins est accessible par le port `8080`, pour moi c'est `prod.local:8080`.

Lors de la première connexion à Jenkins, un mot de passe administrateur vous sera demandé. Vous pouvez le récupérer en consultant le contenu du fichier `initialAdminPassword` :

```bash
cat /var/lib/jenkins/secrets/initialAdminPassword
```

Après avoir fourni le mot de passe, suivez les étapes d'initialisation suivantes :

1. Choisissez l'option "install suggested plugins" pour installer les plugins recommandés.
2. Créez un utilisateur administrateur lorsque cela vous est demandé.
3. Enfin, configurez l'URL de votre serveur Jenkins. Dans mon cas, l'URL serait `http://prod.local:8080`.

## Qu'est-ce qu'un pipeline Jenkins ?

Un pipeline dans Jenkins est un ensemble d'étapes organisées de manière séquentielle, que le serveur Jenkins exécute pour accomplir les différentes tâches nécessaires au processus CI/CD telles que la compilation du code source, les tests, l'analyse statique du code, la construction d'artefacts, le déploiement sur des environnements spécifiques, etc.

Jenkins propose deux méthodes pour définir des pipelines : la méthode script et la méthode déclarative. Dans ce cours, nous allons utiliser **la méthode déclarative** qui offre une approche plus structurée et lisible pour définir les pipelines. Elle permet aux utilisateurs de décrire le flux de travail global de manière déclarative, en spécifiant les étapes, les paramètres et les conditions d'exécution sans la nécessité d'écrire un script complet.

### Structure de Base

La méthode déclarative permet de définir les étapes du pipeline en créant un fichier texte appelé `Jenkinsfile` et en utilisant une syntaxe compatible avec `Groovy` . Il commence généralement par une déclaration du pipeline, suivie d'une section "agent" spécifiant l'agent sur lequel les étapes seront exécutés. Voici un exemple de structure de base :

```groovy
pipeline {
    agent any
    
    stages {
        stage('Etape 1') {
            steps {
                // Actions spécifiques de l'étape 1
            }
        }
        stage('Etape 2') {
            steps {
                // Actions spécifiques de l'étape 2
            }
        }
    }
    
    post {
        // Actions à effectuer après l'exécution des étapes principales
    }
}
```

Vous pouvez tester la création d'un pipeline avec un exemple classique 'Hello World' :

1. Sur le tableau de bord, cliquez sur 'Nouvel item', choisissez un nom, par exemple, "demoPipeline", et dans le type, choisissez `Pipeline`.

![image-20240121233926961](img\image-20240121233926961.png)

2. Ensuite, dans la section "Pipeline", choisissez l'exemple de 'Hello World'.

![image-20240121231005520](img\image-20240121231005520.png)



3. Sauvegardez le pipeline et cliquez sur 'Lancer un build' pour exécuter le pipeline manuellement. Après le build, vous pouvez consulter l'historique. Jenkins attribue un numéro unique, s'auto-incrémentant à chaque nouveau build.



![image-20240121231205880](img\image-20240121231205880.png)

Pour notre application Spring Boot, nous allons inclure directement le fichier `Jenkinsfile` avec le code source, ce qui est d'ailleurs une meilleure pratique. De plus, vous allez configurer Jenkins pour détecter automatiquement les modifications du code source et déclencher le build.

## Versionnez votre code source

Nous allons utiliser Git et GitHub pour versionner le code source de notre petite application Spring Boot.

1. Créez un fichier vide pour le moment nommé `Jenkinsfile` à la racine du projet
2. Poussez le projet sur GitHub :

```
git init
git add .
git commit -m "initial commit"
git remote add origin git@github.com:MossaabFrifita/devops-jenkins-ci-cd.git
git branch -M main
git push -u origin main
```

## Créez un pipeline Jenkins 

1. Créez un nouveau pipeline pour notre application, choisissez le type `pipeline` et spécifiez le nom, par exemple `devops-project-samples`.

![image-20240122111102223](img\image-20240122111102223.png)



2. Dans la définition du pipeline, choisissez  `Pipeline script from SCM`et entrez l'URL de votre dépôt GitHub.

![image-20240122111432219](img\image-20240122111432219.png)



3. Ensuite, dans les 'branches à construire', ajoutez deux branches : `main` et `develop`. À chaque modification du code source, nous allons déployer la branche `main` sur le serveur de production (`prodserver`) et la branche `develop` sur le serveur de test (`testserver`).

![image-20240122111651668](img\image-20240122111651668.png)

4. Enfin, sauvegardez le pipeline.

## Créez la branche de développement (develop)

Vous allez créez la branche `develop` à partir de votre branche principe `main` pour commencer à écrire le pipeline :

```bash
git checkout -b develop
```

## Définissez les étapes du pipeline

Les étapes du pipeline doivent être écrites dans le fichier `Jenkinsfile` que vous avez créé. Si vous utilisez IntelliJ comme IDE, vous pouvez le configurer pour qu'il reconnaisse le type de fichier. Cela peut inclure la coloration syntaxique, l'auto-complétion et d'autres fonctionnalités pour faciliter l'écriture et la gestion du pipeline.

Dans l'onglet 'File '=> 'settings '=> 'editor '=> 'file type' => 'groovy ': ajoutez le pattern 'Jenkinsfile'

![image-20240207123143066](img\image-20240207123143066.png)

### Définissez les variables d'environnement

Nous aurons besoin de définir des variables d'environnement spécifiques qui seront utilisées dans le pipeline :

- `BRANCHE_DEV` définit le nom de la branche de développement qui sera déployée sur le `testserver`.
- `BRANCHE_PROD` définit le nom de la branche de production qui sera déployée sur le `prodserver`.
- `NEXUS_DOCKER_REGISTRY` définit l'URL du registre Docker privé.
- `DOCKER_IMAGE_NAME` définit le nom de l'image Docker à construire.
- `DOCKER_IMAGE_TAG` définit le tag de l'image Docker.

> Remarque : Jenkins expose des variables d'environnement accessibles via la variable globale `env`, telles que `BUILD_ID` et `JOB_NAME`. Vous pouvez en savoir plus dans la documentation officielle sur [l'utilisation des variables d'environnement](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#using-environment-variables).

Ajoutez le bloc `environment` à votre pipeline :

```groovy
pipeline {
    agent any
    environment {
        BRANCHE_DEV = 'origin/develop'
        BRANCHE_PROD = 'origin/main'
        NEXUS_DOCKER_REGISTRY = "http://prod.local:5003"
        DOCKER_IMAGE_NAME = "api-demo"
        DOCKER_IMAGE_TAG = "prod.local:5003"
    }
}
```

### Récupérez le code source

Ce stage sert à récupérer le code source du projet depuis le référentiel Git :

```groovy
stage('Checkout') {
    steps {
        checkout scm
        echo 'Pulling... ' + env.GIT_BRANCH
    }
}
```

La variable environnement  `env.GIT_BRANCH` contient le nom de la branche à partir de laquelle le code est récupéré.

### Exécutez les tests unitaires

Ce stage permet d'exécuter les tests unitaires avec Maven, il faut que Maven soit installé sur le serveur `masterserver`

Pour ce cours je l'ai installé directement depuis le terminal avec la commande `sudo apt-get install maven`, vous pouvez aussi l'installer automatiquement via l'interface graphique de Jenkins, en accédant à  'Administrer Jenkins > Tools'

![image-20240207174128816](img\image-20240207174128816.png)

> Si vous installez Maven depuis Jenkins, vous devrez spécifier la version de Maven que vous souhaitez utiliser dans votre pipeline dans la section Tools. Vous pouvez suivre ce [lien](https://www.jenkins.io/blog/2017/02/07/declarative-maven-project/) dans la documentation officielle pour plus d'informations à ce sujet.

Ajoutez le stage des tests unitaires à votre pipeline :

```groovy
stage('Tests') {
    steps {
        sh 'mvn test'
    }
}
```

### Testez la qualité de votre code avec SonarQube

A chaque exécution du pipeline, nous voulons nous assurer que le code respecte bien les règles de qualité définies dans SonarQube. Vous avez déjà testé l'analyse de code. Maintenant, dans votre pipeline, vous allez intégrer SonarQube.

### Intégrez SonarQube avec Jenkins

1. Installez le plugin `SonarQube Scanner` depuis 'Administrer Jenkins > Plugins' :

![image-20240207182947526](img\image-20240207182947526.png)

> Comme indiqué dans la section de SonarQube, pour pouvoir envoyer le rapport d'analyse au serveur, il faut un token d'autorisation. Vous pouvez utiliser celui que vous avez généré, ou en générer un nouveau si vous ne l'avez pas noté.

3. Dans 'Administrer Jenkins > Credentials,' cliquez sur 'Domains (global)' ensuite 'Add credentials'

![image-20240207183837645](img\image-20240207183837645.png)

4. Ensuite, ajoutez un credentials de type `Secret text` et donnez-lui un ID, par exemple `sonar-token`

![image-20240207183359090](img\image-20240207183359090.png)



5. Pour pouvoir communiquer avec le serveur SonarQube dans le pipeline, vous devez le configurer dans 'Administrer Jenkins > System' :

   - Choisissez un nom de votre choix, par exemple `sonar-server`.

   - Ajoutez l'URL du serveur. Dans mon cas, il est installé sur le `masterserver` et donc accessible via `http://prod.local:9000`.

   - Sélectionnez le token d'authentification que vous avez créé.

![image-20240207224745544](img\image-20240207224745544.png)

### SonarQube Webhooks

Les webhooks de SonarQube permettent de notifier des services externes lorsque l'analyse d'un projet est terminée. Une requête HTTP POST, contenant un payload JSON, est envoyée à chaque URL configurée comme webhook. Cela permet à Jenkins de recevoir le résultat de l'analyse et de mettre fin au build si les règles de qualité du code ne sont pas respectées.

### SonarQube Scanner pour Jenkins

Après avoir configuré le serveur SonarQube, le plugin offre deux fonctionnalités que vous allez utiliser dans votre pipeline :

- `withSonarQubeEnv` : Permet de configurer l'environnement du pipeline pour utiliser les paramètres de connexion au serveur SonarQube que vous avez configuré.
- `waitForQualityGate` : Permet de mettre en pause l'exécution du pipeline jusqu'à ce que SonarQube termine l'analyse du projet. Elle écoute sur l'URL `Jenkins_instance_url/sonarqube-webhook` pour recevoir le résultat de l'analyse du code.

Du côté de SonarQube, pour le projet `devops-project-samples`, vous allez configurer un webhook qui pointe vers `/sonarqube-webhook` :

1. Dans le serveur SonarQube, sélectionnez le projet `devops-project-samples`, puis allez dans 'Project Settings > Webhooks'

![image-20240208110903053](img\image-20240208110903053.png) 

2. Cliquez sur 'Create' pour créer un nouveau Webhook :

   - Entrez un nom, par exemple `JenkinsWebhooks`.
   - Entrez l'URL du serveur Jenkins. J'ai utilisé directement l'adresse IP du serveur `masterserver` au lieu du nom de domaine `prod.local`, car le serveur SonarQube s'exécute dans un conteneur Docker et ne peut pas résoudre le nom de domaine que j'ai configuré manuellement sur le serveur, à moins que je ne le configure également. J'ai donc simplement utilisé l'adresse IP pour la démo.

3. Cliquez sur 'Create' pour sauvgarder.

   ![image-20240208111312483](img\image-20240208111312483.png)



Voici un exemple d'une requête POST envoyée au serveur Jenkins contenant les informations sur le résultat de l'analyse, y compris le statut

![image-20240208101107955](img\image-20240208101107955.png)

Il est maintenant temps d'ajouter le stage SonarQube dans votre pipeline :

```groovy
stage('Sonarqube Analysis') {
    steps {
        script {
            withSonarQubeEnv('sonar-server') {
                sh "mvn sonar:sonar -Dintegration-tests.skip=true -Dmaven.test.failure.ignore=true"
            }
            timeout(time: 1, unit: 'MINUTES') {
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                }
            }
        }

    }
}
```

La fonction `timeout` permet de définir une limite de temps pour l'exécution du bloc de code qui suit. Si le serveur SonarQube ne répond pas dans le délai spécifié, le pipeline ne reste pas bloqué dans la fonction `waitForQualityGate()` et passe à l'étape suivante. Ensuite, si le statut retourné par la fonction `waitForQualityGate()` n'est pas "OK", une erreur est déclenchée pour interrompre le pipeline.

### Packagez le projet avec Maven

Dans ce stage, vous allez simplement packager l'application Spring Boot en un Jar avec Maven et archiver le Jar généré :

```groovy
stage('Maven Build and Package') {
    steps {
        script {
            sh 'mvn clean package -DskipTests'
        }
    }
    post {
        success {
            archiveArtifacts 'target/*.jar'
        }
    }
}
```

### Générez la version du projet à chaque build

Pour mieux gérer le versioning lors de la livraison continue, nous devons générer la version du projet à chaque exécution du pipeline.

Petit rappel : la version correspond à :

```apl
MAJEUR.MINEUR.CORRECTIF-ENV.NumeroBuild.CommitGit-Id
```

- `MAJEUR.MINEUR.CORRECTIF` : Cette partie sera récupérée à partir du fichier POM.xml.
- `ENV` est soit `prod` ou `dev`, en fonction de la branche GIT courante à partir de laquelle Jenkins récupère le code.
- `NumeroBuild` peut être obtenu avec `env.BUILD_NUMBER`.
- L'ID du commit le plus récent sur la branche actuelle peut être obtenu avec `git rev-parse HEAD`.

Pour lire le fichier pom.xml du projet, nous avons besoin de la fonction `readMavenPom` du [plugin](https://www.jenkins.io/doc/pipeline/steps/pipeline-utility-steps) `Pipeline Utility Steps`. Elle retourne un objet de type `Model` du package `org.apache.maven.model.Model` ([Documentation Maven Model](https://maven.apache.org/components/ref/3.3.9/maven-model/apidocs/org/apache/maven/model/Model.html)).

En utilisant cet objet, nous pouvons manipuler diverses propriétés du projet Maven. Voici quelques-unes des méthodes disponibles :

- **getVersion() :** Retourne la version actuelle de l'artefact produit par le projet.
- **setVersion(String version) :** Permet de définir la version courante de l'artefact produit par le projet.
- **getArtifactId() :** Retourne l'identifiant de l'artefact.
- **setArtifactId(String artifactId) :** Permet de définir l'identifiant de l'artefact.
- **getName() :** Retourne le nom du projet.
- **setName(String name) :** Permet de définir le nom du projet.

1. Installez le plugin `Pipeline Utility Steps`

   ![image-20240208134323703](img\image-20240208134323703.png)

2. Dans le fichier Jenkins et après la section `pipeline { }`, ajoutez la fonction suivante qui prend en paramètre le nom de l'environnement et retourne la version :

```groovy
def getEnvVersion(envName) {
    def pom = readMavenPom file: 'pom.xml'
    // get the current development version
    artifactVersion = "${pom.version}"
    def gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
    def versionNumber;
    if (gitCommit == null) {
        versionNumber =artifactVersion+"-${envName}."+env.BUILD_NUMBER;
    } else {
        versionNumber =artifactVersion+"-${envName}."+env.BUILD_NUMBER+'.'+gitCommit.take(8);
    }
    print 'build ${environnement} versions...'
    print versionNumber
    return versionNumber
}
```



### Conteneurisez l'application et envoyez l'image Docker vers Nexus

Dans ce stage, vous allez créer une image docker de votre application Spring Boot, la tager avec la version et l'enregistrer dans le registre docker privé de Nexus

Pour pouvoir se connecter au registre Nexus, ajoutez un nouveau Credentials de type Nom d'utilisateur et mot de passe.

Donne lui un ID, par exemple `nexus-credentials`

![image-20240208135724443](img\image-20240208135724443.png)

Dans le bloc `environnement`, ajoutez la variable suivante :

```groovy
NEXUS_CREDENTIALS_ID = "nexus-credentials"
```

Ensuite, ajoutez le stage suivant :

```groovy
stage('Docker Build and Push to Nexus') {
    steps {
        script {
            envName = "dev"
            if(env.GIT_BRANCH == BRANCHE_PROD) {
                envName = "prod"
            }
            envVersion  =  getEnvVersion(envName)
            withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'USER', passwordVariable: 'PASSWORD')]){
                sh 'echo $PASSWORD | docker login -u $USER --password-stdin $NEXUS_DOCKER_REGISTRY'
                sh 'docker system prune -af'
                sh "docker build -t $DOCKER_IMAGE_TAG/$DOCKER_IMAGE_NAME:$envVersion --no-cache --pull ."
                sh "docker push $DOCKER_IMAGE_TAG/$DOCKER_IMAGE_NAME:$envVersion"
            }
        }
    }
}
```

La condition `if` permet de déterminer l'environnement cible en fonction de la branche GIT.

`envVersion` stocke la version obtenue en appelant la fonction `getEnvVersion()`.

`withCredentials([...]) { ... }` utilise les identifiants fournis pour se connecter au registre Docker.

Les instructions suivantes sont de simples commandes shell pour se connecter au registre, nettoyer les éléments inutilisés dans le système Docker comme les images précédemment construites, construire la nouvelle image Docker et la pousser vers le registre Nexus.

Finalement, pour pouvoir utiliser docker dans le pipeline jenkins, installez le plugin `Docker Pipeline`

Ensuite, ajoutez l'utilisateur Jenkins au groupe Docker

Le groupe Docker est un groupe d'utilisateurs sur un système Linux qui a le droit d'interagir avec le démon Docker. Lorsqu'un utilisateur est ajouté au groupe Docker, cela lui donne la permission d'exécuter des commandes Docker sans avoir à utiliser `sudo` :

Dans le serveur `masterserver` :

```bash
sudo usermod -aG docker jenkins
```

Redémarrez Jenkins :

```shell
sudo service jenkins restart
```



### Déployez l'application avec Ansible

Pour déployer l'application, il suffit de se connecter au serveur Ansible `nodemanager` et lancer le playbook `deploy_playbook.yml` que vous avez créé.

Vous allez donc se connecter en SSH au `nodemanager`.

Dans le `masterserver`, générez une paire de clés SSH :

```bash
ssh-keygen -o -t rsa
```

Vous aurez donc la clé publique et privée :

```bash
mossaabfr@masterserver:~$ ls .ssh/
id_rsa  id_rsa.pub
```

Utilisez `ssh-copy-id` pour copier la clé publique sur le `nodemanager`, puis testez que vous pouvez bien vous connecter en SSH :

```bash
mossaabfr@masterserver:~/.ssh$ ssh-copy-id -i id_rsa.pub user-ansible@192.168.1.173
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "id_rsa.pub"
The authenticity of host '192.168.1.173 (192.168.1.173)' can't be established.
ED25519 key fingerprint is SHA256:of8XJ1A+0vYWv+GUwrLlTLo+Gw3WIBmX3ejD5N32eqw.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
user-ansible@192.168.1.173's password:

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'user-ansible@192.168.1.173'"
and check to make sure that only the key(s) you wanted were added.

mossaabfr@masterserver:~/.ssh$ ssh user-ansible@192.168.1.173
Last login: Sat Jan 13 22:47:34 2024 from 192.168.1.196
[user-ansible@nodemanager ~]$
```

Installez le plugin [SSH Agent Plugin](https://plugins.jenkins.io/ssh-agent) pour pouvoir établir une connexion SSH au `nodemanager` dans votre pipeline.

![image-20240208153315843](img\image-20240208153315843.png)

Dans 'Admintrer Jenkins > Credentials', ajoutez un nouveau credentials de type `SSH Username with private key` 

![image-20240208154337935](img\image-20240208154337935.png)



Donnez-lui un ID, par exemple `ansible-node-manager`, et copiez la clé privée en utilisant la commande `cat id_rsa` dans le champ 'Private Key'

Pour tester la connexion SSH au `nodemanager` avant de modifier votre pipeline, vous pouvez créer un autre pipeline :

```groovy
pipeline {
    agent any
    stages {
        stage('ssh cnx') {
            steps {
                sshagent(credentials: ['ansible-node-manager']) {
                      sh '[ -d ~/.ssh ] || mkdir ~/.ssh && chmod 0700 ~/.ssh'
                      sh 'ssh-keyscan -t rsa,dsa 192.168.1.173 >> ~/.ssh/known_hosts'
                      sh 'ssh user-ansible@192.168.1.173'      
                }
            }
        }
    }
}
```

La commande `ssh-keyscan` permet d'ajouter automatiquement le `fingerprint` au fichier `known_hosts` de l'utilisateur Jenkins afin de faciliter les connexions SSH ultérieures sans être invité à valider manuellement la clé chaque fois.

Exécutez le pipeline pour tester la connexion SSH :

![image-20240208155100533](img\image-20240208155100533.png)

Maintenant, vous allez ajouter deux étapes : une pour déployer l'application sur le `prodserveur` uniquement si la branche actuelle est `main`, et l'autre pour déployer l'application sur le `testserver` uniquement si la branche actuelle est `develop`.

**Pour l'environnent de test :**

```groovy
stage('Ansible job staging') {
    when {
        expression { env.GIT_BRANCH == BRANCHE_DEV }
    }
    steps {
        script {
            def targetVersion = getEnvVersion("dev")
            sshagent(credentials: ['ansible-node-manager']) {
                sh "ssh user-ansible@192.168.1.173 'cd ansible-projects/devops-ansible-deployment && ansible-playbook -i 00_inventory.yml -l staging deploy_playbook.yml --vault-password-file ~/.passvault.txt -e \"docker_image_tag=${targetVersion}\"'"
            }
        }
    }
}
```


Dans cette étape, après la connexion au `nodemanager`, nous nous déplaçons dans le dossier `ansible-projects/devops-ansible-deployment`, qui est l'emplacement de notre projet Ansible, et nous exécutons simplement le playbook `deploy_playbook.yml`.

L'option `-l` permet de spécifier le groupe d'hôtes cible. Dans cette étape, c'est le groupe `staging` qui contient le serveur `testserver`.

L'option `-e` permet de passer la valeur de la variable `docker_image_tag`. Par défaut dans Ansible, dans le fichier `all.yml`, nous l'avons définie sur `latest`. Dans le pipeline, il faut passer le tag de l'image Docker construite.

**Pour l'environnement de production :**

En général, effectuer un merge sur la branche principale "main" ou "master" correspond à une nouvelle version ou une release du logiciel. Dans le contexte du CI/CD, il est nécessaire de pousser un tag sur Git afin de marquer cette version spécifique. Cela permet de garder une trace claire des versions publiées et facilite le déploiement automatique ou la gestion des versions ultérieures.

En plus, en cas de problème ou de besoin de revenir à une version antérieure, le fait d'avoir des tags pour chaque version publiée facilite grandement le rollback. Vous pouvez simplement revenir au tag de la version précédente pour restaurer l'état du code à ce moment-là.

Pour pouvoir pousser le tag sur GitHub, une authentification est nécessaire. La manière la plus simple pour notre pipeline est d'établir une liaison SSH entre Jenkins et GitHub.

Dans Jenkins, comme pour Ansible, créez un Credentials de type `SSH Username with private key`, en lui donnant un ID tel que `github-credentials`, par exemple. Copiez ensuite la clé privée que vous avez déjà générée et utilisée pour Ansible

![image-20240209125229387](img\image-20240209125229387.png)

Dans GitHub, ajoutez la clé publique dans 'Settings > SSH and GPG keys'

![image-20240209124621230](img\image-20240209124621230.png)



Finalement, dans votre pipeline ajoutez le stage nécessaire pour déployer l'application sur la production :

```groovy
stage('Ansible job production') {
    when {
        expression { env.GIT_BRANCH == BRANCHE_PROD }
    }
    steps {
        script {
            def targetVersion = getEnvVersion("prod")
            sshagent(credentials: ['github-credentials']) {
                sh "git tag -f v${targetVersion}"
                sh "git push origin --tags HEAD:develop"
            }
            sshagent(credentials: ['ansible-node-manager']) {
                sh "ssh user-ansible@192.168.1.173 'cd ansible-projects/devops-ansible-deployment && ansible-playbook -i 00_inventory.yml -l production deploy_playbook.yml --vault-password-file ~/.passvault.txt -e \"docker_image_tag=${targetVersion}\"'"
            }
        }
    }
}
```

Pendant cette étape, si la branche actuelle est la branche de production, nous récupérons la version, créons un tag et le poussons vers GitHub. Ensuite, nous lançons le playbook Ansible sur le groupe `production`, en spécifiant le tag de l'image Docker créée.

Voici le contenu du fichier Jenkins final pour notre pipeline :

```groovy
pipeline {
    agent any
    environment {
        BRANCHE_DEV = 'origin/develop'
        BRANCHE_PROD = 'origin/main'
        NEXUS_DOCKER_REGISTRY = "http://prod.local:5003"
        NEXUS_CREDENTIALS_ID = "nexus-credentials"
        DOCKER_IMAGE_NAME = "devops-project-samples"
        DOCKER_IMAGE_TAG = "prod.local:5003"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Pulling... ' + env.GIT_BRANCH
            }
        }

        stage('Tests') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Sonarqube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('sonar-server') {
                        sh "mvn sonar:sonar -Dintegration-tests.skip=true -Dmaven.test.failure.ignore=true"
                    }
                    timeout(time: 1, unit: 'MINUTES') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        }
                    }
                }

            }
        }

        stage('Maven Build and Package') {
            steps {
                script {
                    sh 'mvn clean package -DskipTests'
                }
            }
            post {
                success {
                    archiveArtifacts 'target/*.jar'
                }
            }
        }
        stage('Docker Build and Push to Nexus') {
            steps {
                script {
                    envName = "dev"
                    if(env.GIT_BRANCH == BRANCHE_PROD) {
                        envName = "prod"
                    }
                    envVersion  =  getEnvVersion(envName)
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'USER', passwordVariable: 'PASSWORD')]){
                        sh 'echo $PASSWORD | docker login -u $USER --password-stdin $NEXUS_DOCKER_REGISTRY'
                        sh 'docker system prune -af'
                        sh "docker build -t $DOCKER_IMAGE_TAG/$DOCKER_IMAGE_NAME:$envVersion --no-cache --pull ."
                        sh "docker push $DOCKER_IMAGE_TAG/$DOCKER_IMAGE_NAME:$envVersion"
                    }
                }
            }
        }
        stage('Ansible job staging') {
            when {
                expression { env.GIT_BRANCH == BRANCHE_DEV }
            }
            steps {
                script {
                    def targetVersion = getEnvVersion("dev")
                    sshagent(credentials: ['ansible-node-manager']) {
                        sh "ssh user-ansible@192.168.1.173 'cd ansible-projects/devops-ansible-deployment && ansible-playbook -i 00_inventory.yml -l staging deploy_playbook.yml --vault-password-file ~/.passvault.txt -e \"docker_image_tag=${targetVersion}\"'"
                    }
                }
            }
        }

        stage('Ansible job production') {
            when {
                expression { env.GIT_BRANCH == BRANCHE_PROD }
            }
            steps {
                script {
                    def targetVersion = getEnvVersion("prod")
                    sshagent(credentials: ['github-credentials']) {
                        sh "git tag -f v${targetVersion}"
                        sh "git push origin --tags HEAD:develop"
                    }
                    sshagent(credentials: ['ansible-node-manager']) {
                        sh "ssh user-ansible@192.168.1.173 'cd ansible-projects/devops-ansible-deployment && ansible-playbook -i 00_inventory.yml -l production deploy_playbook.yml --vault-password-file ~/.passvault.txt -e \"docker_image_tag=${targetVersion}\"'"
                    }
                }
            }
        }
    }
}
def getEnvVersion(envName) {
    def pom = readMavenPom file: 'pom.xml'
    // get the current development version
    artifactVersion = "${pom.version}"
    def gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
    def versionNumber;
    if (gitCommit == null) {
        versionNumber =artifactVersion+"-${envName}."+env.BUILD_NUMBER;
    } else {
        versionNumber =artifactVersion+"-${envName}."+env.BUILD_NUMBER+'.'+gitCommit.take(8);
    }
    print 'build ${environnement} versions...'
    print versionNumber
    return versionNumber
}
```



Pour que le pipeline se lance automatiquement, vous devez choisir un mécanisme de déclenchement. Vous allez configurer le pipeline Jenkins pour surveiller en continu les changements sur le dépôt GitHub. Lorsqu'un changement est détecté, Jenkins démarre automatiquement le pipeline.

Pour ce faire, sélectionnez le projet dans Jenkins, puis accédez à Configuration. Dans la section 'Déclencheurs de build', cochez 'Scrutation de l'outil de gestion de version' et saisissez `* * * * *`. Cette configuration signifie que Jenkins vérifie chaque minute s'il y a de nouvelles modifications. Vous pouvez cliquer sur le point d'interrogation pour obtenir plus d'informations.

![image-20240209130755937](img\image-20240209130755937.png)

Après avoir sauvegardé la modification, vous remarquerez que Jenkins lance un premier build. Cependant, étant donné que le fichier Jenkinsfile est vide pour le moment, il n'exécutera aucune action.

![image-20240209131924584](img\image-20240209131924584.png)



Maintenant, effectuez un `git commit` et un `push` de la branche `develop`. Ensuite, modifiez la version du projet dans le fichier `pom.xml`, par exemple en la mettant à `1.1.1-RELEASE`.

Dans Jenkins, vous pouvez désormais constater que le pipeline a été automatiquement lancé. De plus, comme vous avez poussé la modification uniquement sur la branche `develop`, le stage `Ansible job production` ne sera pas déclenché.

Si vous n'avez pas autorisé l'utilisation de la méthode `getVersion()`, elle pourrait nécessiter une approbation explicite dans Jenkins. En effet, si ces méthodes ne sont pas approuvées au préalable, des problèmes tels que `org.jenkinsci.plugins.scriptsecurity.sandbox.RejectedAccessException` 

```bash
[Pipeline] End of Pipeline
Also:   org.jenkinsci.plugins.workflow.actions.ErrorAction$ErrorId: 7d88c948-32d7-4fa8-be0f-343fd56935b6
org.jenkinsci.plugins.scriptsecurity.sandbox.RejectedAccessException: Scripts not permitted to use method org.apache.maven.model.Model getVersion
	at org.jenkinsci.plugins.scriptsecurity.sandbox.whitelists.StaticWhitelist.rejectMethod(StaticWhitelist.java:229)
```

Pour résoudre ce problème, vous pouvez autoriser l'utilisation de cette méthode dans Jenkins. Vous pouvez le faire en suivant ces étapes :

1. Allez dans la configuration Jenkins ('Administrer Jenkins').
2. Recherchez la section "In-process Script Approval".
3. Vous devriez voir une liste d'approbations en attente. Recherchez l'approbation liée à la méthode `getVersion` de la classe `org.apache.maven.model.Model` et approuvez-la.

![image-20240210134906524](img\image-20240210134906524.png)

> L'approbation de scripts dans Jenkins est une mesure de sécurité mise en place pour empêcher l'exécution involontaire ou malveillante de certaines méthodes ou classes Java dans les scripts Groovy utilisés dans Jenkins Pipelines. Cela permet de protéger l'environnement Jenkins contre l'exécution de scripts potentiellement dangereux.



Voici le résultat du lancement du pipeline :

![image-20240209115936993](img\image-20240209115936993.png)

Sur le serveur `testserver`, vérifiez que l'application a été correctement déployée :

```bash
[root@testserver ~]# docker ps
CONTAINER ID   IMAGE                                                                 COMMAND                  CREATED       STATUS       PORTS                    NAMES
519efeb67f07   prod.local:5003/devops-project-samples:1.1.1-RELEASE-dev.3.b712e91b   "java -jar /opt/app/…"   2 hours ago   Up 2 hours   0.0.0.0:7070->7070/tcp   springbootapp
```

Vous pouvez également visualiser les images Docker téléchargées :

```bash
[root@testserver ~]# docker images
REPOSITORY                               TAG                             IMAGE ID       CREATED                  SIZE
prod.local:5003/devops-project-samples   1.1.1-RELEASE-dev.3.b712e91b    996e0754f64b   Less than a second ago   309MB
prod.local:5003/devops-project-samples   0.0.1-SNAPSHOT-dev.2.79a67f5f   64091d71adc5   Less than a second ago   309MB
```

Maintenant, dans GitHub, créez un pull request pour merger la branche `develop` dans `main`. Cette fois-ci, Jenkins doit déployer l'application en production et pousser le tag sur GitHub.



![image-20240209120440444](img\image-20240209120440444.png)

Vérifiez également sur le `prodserver` que l'application a été déployée :

```groovy
[root@prodserver ~]# docker ps
CONTAINER ID   IMAGE                                                                  COMMAND                  CREATED       STATUS       PORTS                    NAMES
b881d0705103   prod.local:5003/devops-project-samples:1.1.1-RELEASE-prod.4.40e193ff   "java -jar /opt/app/…"   2 hours ago   Up 2 hours   0.0.0.0:7070->7070/tcp   springbootapp
[root@prodserver ~]# docker images
REPOSITORY                               TAG                             IMAGE ID       CREATED                  SIZE
prod.local:5003/devops-project-samples   1.1.1-RELEASE-prod.4.40e193ff   b5ce181d1c22   Less than a second ago   309MB
```

Sur GitHub, vous pouvez constater qu'un nouveau tag a été ajouté, faisant référence exactement à la version déployée en production.

![image-20240209120803945](img\image-20240209120803945.png)
