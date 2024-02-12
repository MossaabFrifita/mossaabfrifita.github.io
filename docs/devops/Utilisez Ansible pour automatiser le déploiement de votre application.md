---
sidebar_position: 8
---


Ansible est un outil de gestion de configuration qui permet d'automatiser des tâches avec des scripts d'automatisation.

L'un des principes fondamentaux de la démarche DevOps est d'éliminer les processus manuels, les tâches répétitives et les sources d'erreurs lors du déploiement d'applications, assurant ainsi une livraison continue et une intégration continue.

Avec l'utilisation d'Ansible, vous avez la capacité de scripter et d'automatiser le déploiement, tout en gérant automatiquement les tâches d'administration.

Intégré à notre pipeline CI/CD, il simplifie le déploiement automatique de notre application Spring Boot en fonction de l'environnement cible (Production ou Staging).

## Mode de fonctionnement 

Ansible fonctionne en mode `push`, ce qui consiste à contrôler les serveurs cibles (**nodes**) depuis un poste de contrôle appelé **node manager**.

- Le node manager est une machine disposant d'Ansible installé, capable de contrôler les nodes à travers sa connexion SSH. Cela peut être n'importe quelle machine Linux, mais pas Windows.
- Les nodes sont les machines sur lesquelles Ansible effectue les installations. Ils peuvent avoir n'importe quel système d'exploitation, tant qu'ils sont accessibles par SSH et disposent d'une version de Python installée.

Ansible est un outil `agentless`, ce qui signifie qu'il n'installe pas d'agent sur les nodes ; il utilise uniquement SSH et Python.

Les tâches à exécuter sont rédigées dans des fichiers de configuration au format YAML.

## Identifiez votre architecture technique pour Ansible

Votre architecture de déploiement est constituée de 3 serveurs (2 nodes et 1 node manager) :

- `prodserver` : Il s'agit de l'environnement de Production où notre application sera déployée et utilisée par les utilisateurs finaux.
- `testserver` : Il s'agit de l'environnement de Staging où les nouvelles fonctionnalités, les mises à jour ou les correctifs sont testés avant d'être déployés en production.
- `nodemanager` : Il s'agit du serveur de contrôle sur lequel Ansible sera installé. Depuis ce serveur, les opérations de configuration et de déploiement seront lancées à distance sur les serveurs `prodserver` et `testserver`.

## Créez un simple utilisateur

Pour éviter de travailler en tant que **root** sur le node manager (ce qui n'est vraiment pas recommandé, car le compte root a des privilèges illimités), vous allez créer un utilisateur standard, par exemple **user-ansible**, avec les privilèges sudo :

1. Créez l'utilisateur avec la commande : `adduser user-ansible`.
2. Définissez un mot de passe pour cet utilisateur : `passwd user-ansible`.
3. Ajoutez l'utilisateur dans le groupe wheel : `usermod -a -G wheel user-ansible`.

Maintenant que l’utilisateur est créé, vous pouvez l’utiliser avec la commande suivante :

```bash
[root@nodemanager ~]# su - user-ansible
[user-ansible@nodemanager ~]$
```

*Remarque : La ligne de commande commence par un **#** quand vous êtes en **root**, et par un **$** quand vous êtes en utilisateur standard.*

## Installez Ansible

Vous allez installer Ansible sur votre serveur Centos `nodemanager`, dans mon cas son adresse IP est : `192.168.1.173`

Sur le `nodemanager`, lancez la commande suivante pour installer Ansible

```bash
sudo yum install ansible
```

Remarque : Ansible peut être installé via **pip** de **Python** dans un **[virtualenv](https://www.redhat.com/sysadmin/python-venv-ansible)** ou non. L'avantage du virtualenv est de pouvoir installer plusieurs versions d'Ansible sur le même système de manière isolée, et d'activer l'environnement de travail que vous souhaitez.

Vérifiez la version d'Ansible installée : 

```bash
[user-ansible@nodemanager ~]$ ansible --version
ansible 2.9.27
  config file = /etc/ansible/ansible.cfg
  configured module search path = [u'/home/user-ansible/.ansible/plugins/modules', u'/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python2.7/site-packages/ansible
  executable location = /bin/ansible
  python version = 2.7.5 (default, Nov 14 2023, 16:14:06) [GCC 4.8.5 20150623 (Red Hat 4.8.5-44)]
```

## Créez votre environnement de travail

Vous allez configurer votre environnement de développement afin de travailler à distance depuis votre machine locale. Ceci vous permettra d'utiliser un IDE tel que VS Code qui est très populaire et apprécié par de nombreux DevOps.

Si vous préférez, vous avez également la possibilité d'utiliser un éditeur de texte simple comme vi, vim, nano, etc., directement sur le serveur.

Pour une meilleure organisation de votre travail, je vous recommande de créer un dossier dédié regroupant l'ensemble de vos projets Ansible. Par exemple, sous le répertoire personnel de **user-ansible**, créez un dossier nommé **ansible-projects**.

```bash
[user-ansible@nodemanager ~]$ pwd
/home/user-ansible
[user-ansible@nodemanager ~]$ mkdir ansible-projects
[user-ansible@nodemanager ~]$ cd ansible-projects/
[user-ansible@nodemanager ansible-projects]$
```

### Développez à distance avec SSH dans VS Code

En utilisant la fonctionnalité SSH de VS Code, vous pouvez développer votre code sur un serveur distant plutôt que sur votre machine locale. Vous allez utiliser cette fonctionnalité pour vous connecter au dossier "ansible-projects" que vous avez créé sur le `nodemanager`, écrire les scripts et exécuter directement les commandes Ansible depuis votre machine locale.

1. [Téléchargez](https://code.visualstudio.com/download) et installez VS Code dans votre machine local.
2. Installez l'extension "Remote - SSH"
3. Cliquez sur "Remote Expolorer", puis sur le bouton "+" pour ajouter une nouvelle connexion ssh :

![image-20240111205709313](img\image-20240111205709313.png) 

4. Entrez l'adresse SSH du serveur `nodemanager`, utilisez l'utilisateur que vous avez créé "user-ansible" : 

![image-20240111210034061](img\image-20240111210034061.png)

5. Choisissez l'emplacement de votre fichier de configuration SSH. VS Code l'utilise pour sauvegarder les informations du serveur, vous permettant ainsi de reprendre automatiquement votre session ultérieurement.

![image-20240111210525558](img\image-20240111210525558.png)  

6. Cliquez sur la petite icône verte en bas à droite, puis sélectionnez "Connect to Host" et choisissez l'hôte que vous venez de configurer. Ensuite, saisissez le mot de passe de l'utilisateur "user-ansible".

![image-20240111211230093](img\image-20240111211230093.png)



7. Dans l'explorateur de fichiers dans la barre latérale, cliquez sur "open folder" et saisissez le chemin de votre dossier de travail : `/home/user-ansible/ansible-projects`

![image-20240111211727770](img\image-20240111211727770.png)

Vous pouvez maintenant travailler directement sur le dossier "ansible-projects", vous pouvez aussi ouvrir le terminal de votre session SSH où vous pouvez lancer les commandes Ansible !

![image-20240111212752044](img\image-20240111212752044.png)

## Ansible Inventory (l'inventaire des nodes)

Pour fonctionner, Ansible a besoin d'un fichier d'inventaire. Ce fichier contient la liste des nodes et de leurs variables, décrivant simplement votre infrastructure, c'est-à-dire les serveurs sur lesquels les tâches Ansible seront exécutées.

Il est possible de définir le fichier d'inventaire Ansible de trois manières différentes :

- Format INI statique.
- Format YAML statique.
- Format JSON (de manière dynamique).

> Remarque : Les deux premières méthodes statiques (INI et YAML) sont généralement recommandées lorsque vous travaillez avec des serveurs physiques dont la configuration est relativement stable. En revanche, le script dynamique est souvent préféré pour lister les serveurs virtuels créés dans un environnement cloud, où la création, la suppression et la modification de machines virtuelles peuvent être fréquentes et dynamiques.



Par défaut, Ansible recherche le fichier d'inventaire dans le chemin `/etc/ansible/hosts`. Ce chemin est préconfiguré dans `/etc/ansible/ansible.cfg`. Cependant, vous pouvez spécifier un emplacement différent pour votre fichier d'inventaire en utilisant l'option `-i` lors de l'exécution des commandes Ansible.

## Créez le fichier inventaire Ansible

Créez un sous dossier nommé par exemple `devops-ansible-deployment` dirctement depuis VS Code ou bien avec le terminal :

```bash
[user-ansible@nodemanager ansible-projects]$ ls
devops-ansible-deployment
[user-ansible@nodemanager ansible-projects]$ cd devops-ansible-deployment/
[user-ansible@nodemanager devops-ansible-deployment]$
```

Créez un fichier `00_inventory.ini`, puis ajoutez la définition de deux serveurs `prodserver` et `testserver` : 

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ cat 00_inventory.ini
prodserver ansible_host=192.168.1.66 ansible_user=root ansible_ssh_pass=123321
testserver ansible_host=192.168.1.26 ansible_user=root ansible_ssh_pass=123321
```

`ansible_host` indique l'adresse IP du serveur. Dans l’absolu, il est recommandé d'utiliser **les noms de machine plutôt que les adresses IP**. Les noms de machine devraient toujours être enregistrés dans un serveur DNS. Cependant, pour cette section qui se concentre sur la pratique d'Ansible, vous pouvez utiliser les adresses IP, ou bien les enregistrer dans le fichier `/etc/hosts` comme nous l'avons fait pour le serveur `mastererver`.

`ansible_user` et `ansible_ssh_pass` permettent de définir l'utilisateur à utiliser pour se connecter en SSH ainsi que le mot de passe. Les variables de connexion ne sont pas obligatoires ; vous pouvez les passer directement en ligne de commande lors de l'exécution des commandes Ansible :

- `--user UTILISATEUR_A_UTILISER`  
- `--ask-pass` ou `-k` (k minuscule) : indique à Ansible de demander le mot de passe SSH

> Remarque : Si vous ne spécifiez pas d'utilisateur, Ansible utilise l'utilisateur courant, dans votre cas `user-ansible`. Pour le moment, nous allons utiliser `root` (nous n'avons pas d'autre choix, c'est le seul compte dont nous disposons).



## Type d'instances dans l'inventaire d'Ansible

Dans le fichier inventaire d'Ansible, vous pouvez définir deux types d'instances : les hôtes (hosts) et les groupes (groupes).

- Les hosts sont les machines à l'échelle individuelle tel que `prodserver`, `testserver`.
- Les groupes vous permettent de regrouper plusieurs hôtes sous un même nom, exemple `dbserver`, `webserver`.

Par exemple si vous voulez organiser vos serveurs en deux groupes `production` et `staging` : 

```
[production]
prodserver ansible_host=192.168.1.66 ansible_user=root ansible_ssh_pass=123321

[staging]
testserver ansible_host=192.168.1.26 ansible_user=root ansible_ssh_pass=123321
```

Le but est de pouvoir cibler les tâches à exécuter avec Ansible pour un groupe ou un hôte spécifique, ou bien pour toutes les machines à travers le groupe `all`.

Le groupe par défaut est `all`, ce qui signifie que vous vous adressez à toutes les machines. En format INI, vous n'êtes pas obligé de spécifier explicitement ce groupe.

Modifiez votre fichier `00_inventory.ini` pour ajouter les deux groupes, "production" et "staging". Cela nous permettra de cibler :

- Le serveur `prodserver`
- Tous les serveurs du groupe `production`
- Le serveur `testserver`
- Tous les serveurs du groupe `staging`
- Tous les serveurs avec le groupe `all`

Nous explorerons ces éléments en pratique par la suite.

## Les modules

Un module Ansible est un programme utilisé pour exécuter une tâche ou une commande spécifique. Chaque tâche dans Ansible est associée à un module unique qui définit la fonction à accomplir. Ces modules peuvent prendre des arguments, ce qui permet une personnalisation de l'exécution de la tâche en fonction des besoins spécifiques. Vous pouvez trouver la liste des modules dans la [documentation officielle](https://docs.ansible.com/ansible/2.9/modules/list_of_all_modules.html), ou bien via les commandes `ansible-doc -l` et `ansible-doc <module>` pour obtenir les détails spécifiques de chaque module.

Les tâches peuvent être lancées à l'aide des deux commandes suivantes : `ansible` et `ansible-playbook`, que vous utiliserez par la suite.

## Vérifiez la communication avec les nodes

Vous allez utiliser le module `ping` pour tester l'accessibilité des deux serveurs, `prodserver` et `testserver`, que vous avez définis dans le fichier d'inventaire via Ansible.

### Utilisez Ansible en mode impératif (ad-hoc) avec la commande Ansible

Ansible offre la commande `ansible` pour exécuter des commandes en mode ad-hoc (impératif). Ce mode permet d'exécuter des commandes séparées afin d'effectuer des actions spécifiques sur les serveurs cibles. Il est principalement utilisé dans des environnements de développement pour effectuer des tests ou pour se familiariser avec de nouveaux modules ou bien en production pour exécuter des tâches non répétitives.

La structure générale de la commande ad-hoc est la suivante :

```bash
ansible <PATTERN> -i <INVENTORY> -m <MODULE_NAME> -a <MODULE_ARGS> -b
```

L'argument `<PATTERN>` permet de spécifier le nom du serveur ou du groupe de serveurs sur lequel la tâche sera exécutée. Exemple `all`, `prodserver`, `staging`

- `-i` ou `--inventory` : spécifie le chemin vers le fichier d'inventaire,
- `-m` ou `--module-name` : indique le nom du module Ansible,
- `-a` ou `--args` : représente l'ensemble des arguments à passer au module,
- `-b` ou `--become` : certains modules nécessitent l'élévation des privilèges (sudo) pour être exécutés.

Testez le module ping sur le serveur `test` avec la commande `ansible testserver -m ping -i 00_inventory.ini`:

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible testserver -m ping -i 00_inventory.ini
testserver | FAILED! => {
    "msg": "Using a SSH password instead of a key is not possible because Host Key checking is enabled and sshpass does not support this.  Please add this host's fingerprint to your known_hosts file to manage this host."
}
```

Le statut est `FAILED` ! Ansible n'arrive pas à se connecter via SSH.

Quand vous vous connectez la première fois en SSH avec un serveur, il peut être nécessaire d'accepter et d'enregistrer la **fingerprint** dans le fichier `known_hosts`. Par la suite, cette vérification sera automatiquement effectuée lors des connexions ultérieures. 

Vous pouvez désactiver cette vérification dans la configuration d'Ansible. Cela est détaillé dans la [documentation officielle](https://docs.ansible.com/ansible/latest/inventory_guide/connection_details.html#managing-host-key-checking), mais je vous recommande de vous connecter manuellement aux serveurs `prodserver` et `testserver` pour enregistrer la **fingerprint** :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ssh root@192.168.1.26
The authenticity of host '192.168.1.26 (192.168.1.26)' can't be established.
ECDSA key fingerprint is SHA256:Nnd1qW32K8lOp94/sAqfDgrkqcY+9Z9KFuLSc1tbmJk.
ECDSA key fingerprint is MD5:c5:79:3b:ed:a6:04:f9:62:4d:86:a6:48:dc:78:e1:89.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.1.26' (ECDSA) to the list of known hosts.
root@192.168.1.26's password:
Last login: Fri Dec 22 03:28:03 2023 from 192.168.1.196
[root@testserver ~]# exit
déconnexion
Connection to 192.168.1.26 closed.
```

 Relancez la commande ansible. cette fois vous devez voir `SUCCESS` :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible testserver -m ping -i 00_inventory.ini
prodserver | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}
```

Testez la commande pour cibler les hôtes ou les groupes :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible prodserver -m ping -i 00_inventory.ini
prodserver | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    }, 
    "changed": false, 
    "ping": "pong"
}
[user-ansible@nodemanager devops-ansible-deployment]$ ansible all -m ping -i 00_inventory.ini
prodserver | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    }, 
    "changed": false, 
    "ping": "pong"
}
testserver | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    }, 
    "changed": false, 
    "ping": "pong"
}
[user-ansible@nodemanager devops-ansible-deployment]$ ansible production -m ping -i 00_inventory.ini
prodserver | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    }, 
    "changed": false, 
    "ping": "pong"
}
```

### Utilisez Ansible en mode déclaratif (ansible-playbook)

Un playbook Ansible est une séquence d'instructions ou jeux d'instruction en anglais `play` définies dans un fichier YAML. Il spécifie un ensemble de tâches à effectuer sur un groupe de serveurs ciblés. Lorsque vous exécutez un playbook Ansible, les `play` sont exécutés dans l'ordre indiqué, de haut en bas, et les tâches de chaque `play` sont également exécutées dans cet ordre. C'est un moyen puissant et déclaratif d'automatiser la gestion de configuration et le déploiement sur plusieurs serveurs.

Comparé au mode ad-hoc, les playbooks vous offrent la possibilité de conserver le code dans un fichier YAML et de le réutiliser à chaque fois. Par exemple, nous allons créer un playbook pour déployer notre application Spring Boot à chaque lancement de build dans la pipeline CI/CD que nous allons créer à la fin de ce cours.

Si vous n'êtes pas familier avec le format YAML, prenez une petite pause pour comprendre sa syntaxe sur la [documentation officielle](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html#yaml-syntax) d'Ansible par exemple.

### La structure d'un playbook

La structure minimale pour un playbook Ansible est la suivante :

1. Un bloc général, pouvant comporter un nom pour le playbook, les hôtes ou groupes concernés, des variables, des options, etc.
2. Ensuite, des blocs spécifiques tels que des **tasks**, des **rôles** et des **handlers**.

Chaque ligne à l'intérieur de ces blocs est indentée de **deux espaces** pour indiquer la hiérarchie des éléments dans le fichier YAML.

```yaml
- name: Nom du playbook
  hosts: groupe_hotes_cibles
  become: true  # Option : Indique que les tâches doivent être exécutées en tant qu'utilisateur sudo (root)

  vars:
    variable1: valeur1
    variable2: valeur2

  tasks:
    - name: Tâche 1
      module_name:
        parametre1: valeur1
        parametre2: valeur2

    - name: Tâche 2
      autre_module:
        parametre1: valeur1
        parametre2: valeur2
```

Vous allez créer un playbook pour tester la communication avec les nœuds, donc vous allez utiliser le même module 'ping' que celui que vous avez utilisé avec le mode ad-hoc.

Dans le même dossier `devops-ansible-deployment` créez le fichier `my-first-playbook.yml`

![image-20240112140055518](img\image-20240112140055518.png)

Ici, tous les groupes sont concernés. Vous avez une seule tâche, 'Test de ping', qui utilise le module `ping`.

Lancez le playbook avec la commande `ansible-playbook`, suivi du nom du playbook et de l'option `-i inventory.ini` pour spécifier le chemin du fichier d'inventaire :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-playbook my-first-playbook.yaml -i inventory.ini

PLAY [Test de connectivité avec les serveurs cibles] ****************************************************************************************************************************************************************

TASK [Gathering Facts] **********************************************************************************************************************************************************************************************
ok: [prodserver]
ok: [testserver]

TASK [Test de ping] *************************************************************************************************************************************************************************************************
ok: [testserver]
ok: [prodserver]

PLAY RECAP **********************************************************************************************************************************************************************************************************
prodserver                 : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
testserver                 : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```

Vous pouvez constater qu'Ansible affiche la liste des tâches exécutées avec leur état (ok, changed, unreachable, failed).

La tâche 'Gathering Facts' est automatiquement lancée par Ansible. Elle permet de collecter plusieurs variables sur chaque nœud (adresse IP, version de l’OS, etc.). Ces variables peuvent ensuite être utilisées dans les scripts.

## Utilisez l'extension VS Code Ansible

L'avantage d'utiliser une IDE comme VS Code pour écrire les playbooks à distance, au lieu d'un simple éditeur de texte, est de profiter de l'extension Ansible maintenue par `Red Hat`. Elle offre :

- La coloration syntaxique
- L'auto-complétion des noms de modules et des options via le raccourci [CTRL] + [Espace]
- La validation du code avec `ansible-lint`

Installez l'extension depuis 'File' > 'Settings' > 'Extensions', puis cliquer sur configurer :

![image-20240112214136155](img\image-20240112214136155.png)

Étant donné que vous êtes connecté en SSH au serveur `nodeserver`, vous avez la possibilité de configurer l'extension pour le serveur distant. Ajoutez le chemin vers Ansible et Python 3. Pour connaître ces chemins, vous pouvez utiliser les commandes `which ansible` et `which python3` depuis votre terminal.

![image-20240112212928589](img\image-20240112212928589.png)

`ansible-lint` est un outil open source destiné à l'analyse statique des playbooks Ansible. Il vérifie la conformité de vos playbooks avec les meilleures pratiques recommandées par la communauté Ansible et identifie d'éventuelles erreurs ou problèmes potentiels. Vous pouvez également configurer son chemin ; par défaut, il est activé. Si vous débutez avec Ansible, je vous recommande de commencer par écrire des playbooks sans utiliser `ansible-lint` afin de vous familiariser avec la syntaxe et les concepts d'Ansible.

![image-20240112213049046](img\image-20240112213049046.png)



## Passez au format YAML avec le fichier d'inventaire

Souvent, le format YAML est préféré pour le fichier d'inventaire, car il offre une meilleure lisibilité de l'organisation de vos nœuds. De plus, tous les autres fichiers d'Ansible sont écrits en YAML. Dans mon cas, je préfère également utiliser le format YAML pour l'inventaire. Dans cette section, vous allez modifier votre fichier `00_inventory.ini` en `00_inventory.yaml`. C'est l'occasion de travailler avec les deux types de fichiers !

```yaml
all:
  children:
    production:
      hosts:
        prodserver:
          ansible_host: 192.168.1.66
          ansible_user: root
          ansible_ssh_pass: 123321
    staging:
      hosts:
        testserver:
          ansible_host: 192.168.1.26
          ansible_user: root
          ansible_ssh_pass: 123321
```

Voici la structure du fichier d'inventaire au format YAML :

Le groupe `all` englobe tous les hôtes. (il doit être défini explicitement avec le format YAML).

Ensuite, les groupes enfants (`children`) englobent les deux sous-groupes `production` et `staging`.

Chaque groupe définit une liste de `hosts`.

## Les variables en Ansible

Les variables rendent les playbooks plus flexibles et adaptables. Ansible remplace la variable par sa valeur lorsqu'une tâche est exécutée.

Il existe au total une vingtaine de méthodes différentes pour définir une variable dans Ansible. Elles sont traitées selon un ordre de priorité ([consultez la documentation officielle sur les priorités des variables Ansible](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#understanding-variable-precedence)).

Voici quelques exemples de façons de définir une variable :

- Dans l'inventaire avec `vars`.
- Dans la section `vars` d'un playbook.
- Dans les dossiers group_vars et host_vars à la racine du projet à l'aide de fichiers YAML.
- Au niveau de la commande `ansible-playbook` avec l'argument `-e` ou `--extra-vars`.

Pour comprendre et pratiquer, faisons quelques exemples.

### Définissez les variables dans le fichier d'inventaire

Ajoutez dans la section `vars` une variable nommée `var1` avec la valeur 'var1 from inventory' dans votre fichier `00_inventory.yaml` :

```yaml
all:
  children:
    production:
      hosts:
        prodserver:
          ansible_host: 192.168.1.66
          ansible_user: root
          ansible_ssh_pass: 123321
      vars:
        var1: "var1 from inventory"
    staging:
      hosts:
        testserver:
          ansible_host: 192.168.1.26
          ansible_user: root
          ansible_ssh_pass: 123321
      vars:
        var1: "var1 from inventory"
```

Dans votre playbook `my-first-playbook.yaml`, ajoutez une tâche qui utilise le module `debug` pour afficher la valeur de cette variable :

```yaml
- name: Test de connectivité avec les serveurs cibles
  hosts: all
  tasks:
    - name: Test de ping
      ping:
    - name: Valeur de la variable var1
      debug:
        msg: "{{ var1 }}"
```

Exécutez le playbook avec la commande ` ansible-playbook my-first-playbook.yaml -i 00_inventory.yml` :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-playbook my-first-playbook.yaml -i 00_inventory.yml 

PLAY [Test de connectivité avec les serveurs cibles] *****************************************************************************************************************

TASK [Gathering Facts] ***********************************************************************************************************************************************
ok: [prodserver]
ok: [testserver]

TASK [Test de ping] **************************************************************************************************************************************************
ok: [prodserver]
ok: [testserver]

TASK [affichage] *****************************************************************************************************************************************************
ok: [prodserver] => {
    "msg": "var1 from inventory"
}
ok: [testserver] => {
    "msg": "var1 from inventory"
}

PLAY RECAP ***********************************************************************************************************************************************************
prodserver                 : ok=3    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
testserver                 : ok=3    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```

### Définissez les variables dans le playbook

Maintenant, ajoutez la variable `var1` dans le playbook :

```yaml
- name: Test de connectivité avec les serveurs cibles
  hosts: all
  vars:
    var1: "var1 from playbook"
  tasks:
    - name: Test de ping
      ping:
    - name: Valeur de la variable var1
      debug:
        msg: "{{ var1 }}"

```

Exécutez le playbook avec la même commande. Vous pouvez constater que cette fois, la valeur affichée est 'var1 from playbook', indiquant ainsi que les variables définies au niveau du playbook ont priorité sur celles définies dans l'inventaire.

```yaml
TASK [Valeur de la variable var1] ************************************************************************************************************************************
ok: [prodserver] => {
    "msg": "var1 from playbook"
}
ok: [testserver] => {
    "msg": "var1 from playbook"
}
```

### Passez les variables à partir de la ligne de commande

L'ordre de priorité le plus élevé se situe au niveau de la commande `ansible-playbook`. Lancez la commande suivante pour effectuer le test :

```bash
ansible-playbook my-first-playbook.yaml -e "var1='var1 from cmd'"  -i 00_inventory.yml 
```

### Structurez vos variables avec les répertoires host_vars et group_vars

La pratique recommandée pour fournir des variables dans l'inventaire est de les définir dans des fichiers situés dans deux répertoires distincts : `host_vars` et `group_vars` :

- host_vars : Ce répertoire contient des fichiers YAML spécifiques à chaque hôte, par exemple `prodserver.yml` `testserver.yml`
- group_vars :  Ce répertoire contient des fichiers YAML spécifiques à chaque groupe d'hôtes, par exemple `all.yml` `production.yml` `staging.yml`

> Remarque : Le nom du fichier YAML dans les répertoires `host_vars` et `group_vars` doit correspondre au nom de l'hôte ou du groupe auquel les variables sont destinées. Cela permet à Ansible d'associer automatiquement les variables du fichier avec l'hôte ou le groupe correspondant dans l'inventaire. Si non vous pouvez créer un dossier portant le nom de l'hôte, et à l'intérieur, vous pouvez choisir le nom que vous préférez pour votre fichier YAML de variables.

Dans les fichiers YAML, les variables se définissent de la manière suivante :

```yaml
nom_variable: valeur_variable
```



## Créez un utilisateur standard et déployer une clé SSH sur les nodes

Vous allez suivre les bonnes pratiques en créant un **utilisateur standard** afin de ne pas travailler directement avec le compte **root**.

Pour le `nodemanager`, nous avons créé l'utilisateur `user-ansible`. Jusqu'à présent, nous avons utilisé le compte root pour nous connecter aux nœuds, mais cela était dans le but de vous expliquer les principes d'Ansible ; c'était le seul compte dont nous disposions.

L'objectif est de créer un utilisateur `user-ansible` sur tous les nœuds `testserver` et `prodserver`. Vous pouvez le nommer autrement, mais l'avantage de choisir le même nom de compte est de ne pas spécifier le `username` lors de la connexion SSH.

Cet utilisateur doit également avoir le privilège sudo.

De plus, pour se connecter en SSH, il est recommandé d'utiliser une paire de clés plutôt que d'utiliser un mot de passe.

Voici donc le chemin expliquant la connexion SSH entre le `nodemanager` et les nodes. Le même compte `user-ansible` du serveur `nodemanager` doit être créé sur les nodes :

![Diagramme sans nom.drawio(1)](img\Diagramme sans nom.drawio(1).png)

**Pour accomplir cette tâche vous avez besoin de :** 

1. Se connecter au serveur `prodserver` , créer l'utilisateur `user-ansible` et l'ajouter au groupe `wheel` pour lui donner le privilège sudo.
2. Se connecter au serveur `testserver` , créer l'utilisateur `user-ansible` et l'ajouter au groupe `wheel` pour lui donner le privilège sudo.
3. Générer une paire de clés avec `ssh-keygen `
4. Copier la clé publique sur les serveurs `prodserver` et `testserver` avec la commande `ssh-copy-id ` par exemple.

Etant donné que nous travaillons avec Ansible, il est très pratique et utile de créer un playbook qui automatise la création d'un utilisateur sur les nodes, c'est là l'intérêt. Puisque notre code est réutilisable, lors de l'ajout d'une nouvelle node à notre infrastructure, nous pouvons simplement lancer le playbook !

Sous le dossier  `devops-ansible-deployment` :

1. Créez le fichier `all.yml` sous `group_vars/all`
2. Créez le fichier `create_ansible_user.yml` sous `playbooks`

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ tree
.
├── 00_inventory.yml
├── group_vars
│   └── all
│       └── all.yml
└── playbooks
    └── create_ansible_user.yml
```

Dans le fichier `all.yml`, ajoutez les variables suivantes :

```yaml
ansible_user: "user-ansible"
ansible_user_group: "wheel"
```

- La variable `ansible_user` définit le nom du compte de l'utilisateur que vous allez créer sur les nœuds.
- La variable `ansible_user_group` définit le groupe de l'utilisateur `wheel` (pour CentOS) afin qu'il puisse exécuter des commandes avec les privilèges de root.

Nous avons également besoin de définir un mot de passe pour cet utilisateur, mais il doit être chiffré. Il ne faut surtout pas le laisser en clair. Pour cela, vous allez utiliser Ansible Vault pour chiffrer les données sensibles dans le fichier `all.yml`.

> Ansible Vault est un outil d'Ansible permettant de chiffrer de manière sécurisée les données sensibles, telles que les mots de passe, afin de renforcer la sécurité et la gestion centralisée dans les configurations automatisées.

### Chiffrez les données sensibles avec Ansible Vault

Lancez la commande `ansible-vault create group_vars/all/vault.yml` pour créer un fichier chiffré ; Ansible vous demandera de saisir un mot de passe. Ensuite, ouvrez le fichier créé pour l'éditer, et ajoutez la variable `ansible_user_pass` définissant le mot de passe de l'utilisateur, par exemple `123321`. Il est recommandé d'utiliser un mot de passe robuste, notamment en environnement professionnel, bien que pour l'exemple, j'ai choisi le simple mot de passe `123321`. Vous avez la liberté de choisir le mot de passe qui convient à votre contexte.

N'oubliez pas le mot de passe que vous avez choisi pour chiffrer le fichier vault.yml ; sans lui, il vous sera impossible de déchiffrer le fichier ou de lire les valeurs des variables.

Ansible propose plusieurs actions à passer avec la commande `ansible-vault`, parmi lesquelles : 

1. `create` : permet de créer un nouveau fichier chiffré en spécifiant un mot de passe.
2. `decrypt` : elle est utilisée pour déchiffrer un fichier chiffré et rendre son contenu lisible.
3. `edit` : permet de modifier le contenu d'un fichier chiffré de manière sécurisée en déchiffrant temporairement et en rechiffrant automatiquement lors de l'enregistrement.
4. `view` : permet de consulter le contenu d'un fichier chiffré sans nécessiter de déchiffrement explicite.
5. `encrypt` : elle est utilisée pour chiffrer un fichier existant.

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-vault create group_vars/all/vault.yml
New Vault password: 
Confirm New Vault password: 
```

Voici le contenu du fichier `vault.yml` après le chiffrement :

```bash
$ANSIBLE_VAULT;1.1;AES256
61666561393532663537346566363566373130653265313962313063366539383565643863386532
6566343363326339613739356339353133333036383434320a373466356231313564333361363961
33383938316533643835366531663532656539386166643766316465383638383539616633633733
6435613161363037310a663832663537356362653366386165316665646338346335313362373066
35623465356432393837366630303663666133343334333131313239303464623530
```

> Pour modifier le fichier Il est recommandé d'utiliser `edit` au lieu de `decrypt/encrypt` afin de ne pas oublier de rechiffrer le fichier après modification.

Visualisez le contenu de votre fichier `vault.yml` avec l'action `view` de `ansible-vault` et l'option `--ask-vault` :

```
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-vault view group_vars/all/vault.yml --ask-vault
Vault password: 
ansible_user_pass: 123321
```

L'option `--ask-vault` permet de demander à l'utilisateur de fournir le mot de passe utilisé lors du chiffrement. Vous pouvez également l'utiliser avec les commandes `ansible` et `ansible-playbook`.

Alternativement, vous pouvez sauvegarder le mot de passe dans un fichier texte, par exemple, sous le dossier home de l'utilisateur, et indiquer à Ansible le chemin vers ce fichier avec l'option `--vault-password-file ~/.passvault.txt` :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-vault view group_vars/all/vault.yml --vault-password-file ~/.passvault.txt
ansible_user_pass: 123321
```

Une autre méthode consiste à fournir le chemin du fichier en utilisant la variable d'environnement `ANSIBLE_VAULT_PASSWORD_FILE` :

```
export ANSIBLE_VAULT_PASSWORD_FILE=~/.passvault.txt
```

> Le fichier contenant le mot de passe doit être bien sécurisé et ne pas être accessible à tout le monde.

Exportez le chemin vers le fichier contenant le mot de passe. Cela vous sera utile par la suite pour lancer les commandes Ansible sans interaction manuelle, surtout dans le cadre de notre pipeline CI/CD.

Pour persister l'exportation de la variable d'environnement `ANSIBLE_VAULT_PASSWORD_FILE=~/.passvault.txt`, vous pouvez l'ajouter au fichier  `~/.bash_profile` :

```bash
[user-ansible@nodemanager ~]$ cat .bash_profile
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/.local/bin:$HOME/bin

export PATH

export ANSIBLE_VAULT_PASSWORD_FILE=~/.passvault.txt

```

Maintenant, dans votre fichier `all.yml`, ajoutez la variable `ansible_user_pass`. Sa valeur sera une référence vers la variable définie dans `vault.yml` :

```bash
ansible_user: "user-ansible"
ansible_user_group: "wheel"
ansible_user_pass: "{{ vault_ansible_user_pass }}"
```

En effet, l'ajout de la référence `ansible_user_pass: "{{ vault_ansible_user_pass }}"` n'est pas obligatoire, mais elle vous offre une visibilité claire quant à l'utilisation de variables chiffrées. Puisque le fichier Vault est chiffré, si vous ne spécifiez pas de référence dans votre fichier `all.yml`, vous ne pouvez pas voir où cette variable est définie.

### Créez le compte utilisateur avec Ansible Playbook

Voici le contenu du playbook `create_ansible_user.yml` qui automatise les étapes de création d'un nouvel utilisateur mentionnées au début de cette section :

```yaml
- name: Create a new user
  hosts: all

  tasks:
  - name: Create ~/.ssh directory if none exists
    file:
      path: "/home/{{ ansible_user }}/.ssh"
      state: directory
      mode: "0700"
    run_once: yes
    delegate_to: localhost

  - name: Generate SSH key
    openssh_keypair:
      path: "/home/{{ansible_user}}/.ssh/id_rsa"
      type: rsa
      size: 4096
      state: present
      force: no
    run_once: yes
    delegate_to: localhost

  - name: Create a new user
    user:
      name: "{{ ansible_user }}"
      shell: /bin/bash
      groups: "{{ ansible_user_group }}"
      append: yes
      password: "{{ ansible_user_pass | password_hash('sha512') }}"
    become: yes

  - name: Add user to the sudoers
    copy:
      dest: "/etc/sudoers.d/{{ ansible_user }}"
      content: "{{ ansible_user }}  ALL=(ALL)  NOPASSWD: ALL"
    become: yes

  - name: Deploy SSH Key
    authorized_key: 
      user: "{{ ansible_user }}"
      key: "{{ lookup('file', '/home/{{ansible_user}}/.ssh/id_rsa.pub') }}"
      state: present
    become: yes

```

Le playbook cible tous les hôtes avec le groupe `all` et définit 5 tâches :

1. On utilise le module `file` pour créer le répertoire `~/.ssh`. `delegate_to: localhost` exécute cette tâche localement sur le `nodemanager`, elle doit donc être exécutée qu'une seule fois grâce à `run_once: yes`. Cela est d'autant plus important, car deux nœuds, `prodserver` et `testserver`, sont définis.
2. On génère la paire de clés SSH avec le module `openssh_keypair`. Son chemin est dans le dossier home de l'utilisateur, et on utilise la variable `name: "{{ ansible_user }}"` définie dans les group_vars, qui est `user-ansible`.
3. On crée l'utilisateur avec le module `user`. Le mot de passe `ansible_user_pass` est celui stocké dans le fichier `vault.yml`, et il doit être hashé avec `password_hash('sha512')`.
4. On utilise le module `copy` pour créer un fichier dans `/etc/sudoers.d/` autorisant l'utilisateur à utiliser sudo sans mot de passe.
5. Finalement, on utilise le module `authorized_key` pour copier la clé publique sur les nœuds. Le `lookup file` permet de chercher la clé publique générée dans le dossier home de l'utilisateur.

> Le state `present` indique que le fichier doit exister sur le node cible. Si le fichier n'existe pas, Ansible le créera. Si le fichier existe déjà, Ansible ne fera rien, car l'état (`state`) est déjà conforme à ce qui est spécifié (`present`). L'autre état possible est `absent`. Si vous souhaitez supprimer le fichier, vous pouvez consulter la documentation de chaque module pour connaître les valeurs possibles du paramètre `state`.

Lancez votre playbook :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-playbook -i 00_inventory.yml playbooks/create_ansible_user.yml

PLAY [Create a new user] *****************************************************************************************************************************************************************************************

TASK [Gathering Facts] **********************************************************************************************************************************************************************************************
ok: [testserver]
ok: [prodserver]

TASK [Create ~/.ssh directory if none exists] *****************************************************************************************************************************************************************
ok: [prodserver -> localhost]

TASK [generate SSH key] *********************************************************************************************************************************************************************************************
ok: [prodserver -> localhost]

TASK [create a new user] ********************************************************************************************************************************************************************************************
changed: [testserver]
changed: [prodserver]

TASK [add user to the sudoers] **************************************************************************************************************************************************************************************
changed: [prodserver]
changed: [testserver]

TASK [Deploy SSH Key] ***********************************************************************************************************************************************************************************************
changed: [testserver]
changed: [prodserver]

PLAY RECAP **********************************************************************************************************************************************************************************************************
prodserver                 : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
testserver                 : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```



Vous pouvez constater que le compte utilisateur a été créé avec succès !

Testez alors la connexion SSH aux deux serveurs `prodserver` et `testserver` depuis le terminal du serveur `nodemanager`. Vous devriez vous connecter sans spécifier le mot de passe :

```bash
[user-ansible@nodemanager ~]$ ssh 192.168.1.26
Last login: Mon Jan  8 17:51:18 2024 from 192.168.1.173
[user-ansible@testserver ~]$ exit
déconnexion
Connection to 192.168.1.26 closed.
[user-ansible@nodemanager ~]$ ssh 192.168.1.66
Last login: Mon Jan  8 17:51:57 2024 from 192.168.1.173
[user-ansible@prodserver ~]$ exit
déconnexion
Connection to 192.168.1.66 closed.
[user-ansible@nodemanager ~]$
```



Maintenant, dans votre fichier `00_inventory.yml`, vous pouvez supprimer les paramètres `ansible_user` et `ansible_ssh_pass`. Vous n'en aurez plus besoin dorénavant, Ansible utilisera la paire de clés SSH pour se connecter aux nodes, ainsi que l'utilisateur `user-ansible`.

```yaml
all:
  children:
    production:
      hosts:
        prodserver:
          ansible_host: 192.168.1.66
    staging:
      hosts:
        testserver:
          ansible_host: 192.168.1.26
```



## Installez docker sur les nodes avec Ansible Playbook

Notre application Spring Boot est conteneurisée avec Docker. Ainsi, pour le déploiement, nous avons besoin de Docker installé sur les nodes `prodserver` et `testserver`.

Vous allez également utiliser un playbook pour installer Docker sur les nodes. Créez un playbook `docker_install.yml` sous le dossier `playbooks/`

Voici son contenu :

```yaml
- name: Install docker Engine on CentOS
  hosts: all
  become: true
  tasks:

  - name: Remove docker if installed from CentOS repo
    yum:
      name:
        - docker
        - docker-client
        - docker-client-latest
        - docker-common
        - docker-latest
        - docker-latest-logrotate
        - docker-logrotate
        - docker-engine
      state: removed
  - name: Install yum utils
    yum:
      name:
        - yum-utils
        - device-mapper-persistent-data
        - lvm2
      state: latest      

  - name: Add Docker repo
    get_url:
      url: https://download.docker.com/linux/centos/docker-ce.repo
      dest: /etc/yum.repos.d/docker-ce.repo

  - name: Install Docker Engine
    yum:
      name:
        - docker-ce
        - docker-ce-cli
        - containerd.io
        - docker-buildx-plugin
        - docker-compose-plugin
      state: latest
  - name: Start Docker service
    service:
      name: docker
      state: started
      enabled: yes
    
  - name: "Add user {{ ansible_user }} to docker group"
    user:
      name: "{{ ansible_user }}"
      groups: docker
      append: yes
```

Dans ce playbook, j'ai simplement traduit les étapes d'installation de Docker Engine sur CentOS, telles qu'indiquées dans [la documentation officielle](https://docs.docker.com/engine/install/centos/) de Docker, en tant que tâches Ansible.

La dernière tâche, `Add user {{ ansible_user }} to docker group`, permet d'ajouter l'utilisateur `user-ansible` que nous avons créé au groupe Docker. Cela lui permettra d'interagir avec le moteur Docker sans avoir besoin des privilèges `sudo`.

Lancez le playbook :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-playbook -i 00_inventory.yml playbooks/docker-install.yml 

PLAY [Install docker Engine on CentOS] ******************************************************************************************************************************************************************************

TASK [Gathering Facts] **********************************************************************************************************************************************************************************************
ok: [testserver]
ok: [prodserver]

TASK [Remove docker if installed from CentOS repo] ******************************************************************************************************************************************************************
ok: [prodserver] => (item=[u'docker', u'docker-client', u'docker-client-latest', u'docker-common', u'docker-latest', u'docker-latest-logrotate', u'docker-logrotate', u'docker-engine'])
ok: [testserver] => (item=[u'docker', u'docker-client', u'docker-client-latest', u'docker-common', u'docker-latest', u'docker-latest-logrotate', u'docker-logrotate', u'docker-engine'])

TASK [Install yum utils] ********************************************************************************************************************************************************************************************
changed: [prodserver] => (item=[u'yum-utils', u'device-mapper-persistent-data', u'lvm2'])
changed: [testserver] => (item=[u'yum-utils', u'device-mapper-persistent-data', u'lvm2'])

TASK [Add Docker repo] **********************************************************************************************************************************************************************************************
changed: [testserver]
changed: [prodserver]

TASK [Install Docker Engine] ****************************************************************************************************************************************************************************************
changed: [prodserver] => (item=[u'docker-ce', u'docker-ce-cli', u'containerd.io', u'docker-buildx-plugin', u'docker-compose-plugin'])
changed: [testserver] => (item=[u'docker-ce', u'docker-ce-cli', u'containerd.io', u'docker-buildx-plugin', u'docker-compose-plugin'])

TASK [Start Docker service] *****************************************************************************************************************************************************************************************
changed: [testserver]
changed: [prodserver]

TASK [Add user user-ansible to docker group] ************************************************************************************************************************************************************************
changed: [prodserver]
changed: [testserver]

PLAY RECAP **********************************************************************************************************************************************************************************************************
prodserver                 : ok=7    changed=5    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
testserver                 : ok=7    changed=5    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
```

Sur les nodes, vous pouvez vérifier que Docker a bien été installé :

```bash
[user-ansible@prodserver ~]$ docker --version
Docker version 24.0.7, build afdd53b

[user-ansible@testserver ~]$ docker --version
Docker version 24.0.7, build afdd53b
```



## Configurez docker pour le déploiement 


Pour déployer l'application Spring Boot, nous récupérerons l'image Docker publiée sur le registre privé (Nexus3). Dans cette étape, nous utiliserons la version `latest` comme version par défaut. Ensuite, dans notre pipeline CI/CD, nous aborderons l'automatisation de la gestion des versions.

Cependant, rappelez-vous que le registre privé n'est accessible que via HTTP. Il est donc nécessaire de configurer Docker sur chaque serveur pour autoriser la communication avec les registres non sécurisés. Nous avons déjà effectué cette configuration manuellement pour Docker sur le `masterserver`. À présent, vous allez tirer parti d'Ansible pour automatiser cette tâche !

Petit rappel : pour autoriser la communication avec les registres non sécurisés, il suffit de les ajouter au fichier `daemon.json` sous `/etc/docker`.

Avec Ansible, pour copier le fichier sur les nœuds, vous pouvez utiliser le module `copy` ou `template`. Nous opterons pour l'utilisation du module `template`.

> L'utilisation de templates au lieu du module `copy` dans Ansible offre une flexibilité à l'aide du moteur de templates Jinja2.
>
> Jinja2 se présente comme un système de templates puissant, applicable non seulement directement dans vos playbooks grâce aux filtres, mais aussi pour la génération dynamique de fichiers par exemple (le remplacement dynamique des variables).
>
> Consultez la documentation officielle sur [les templates Jinja avec Ansible](https://docs.ansible.com/ansible/2.9/user_guide/playbooks_templating.html) pour en savoir plus

Créez le fichier `daemon.json.j2` sous le dossier playbooks > templates :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ tree
.
├── 00_inventory.yml
├── group_vars
│   └── all
│       ├── all.yml
│       └── vault.yml
└── playbooks
    ├── create_ansible_user.yml
    ├── docker_install.yml
    └── templates
        └── daemon.json.j2
```

Voici son contenu :

```json
[user-ansible@nodemanager devops-ansible-deployment]$ cat playbooks/templates/daemon.json.j2 
{
  "insecure-registries": ["http://prod.local:5002", "http://prod.local:5003"]
}
```

Dans le dossier playbooks, créez un le playbook `docker_config.yaml`

```yaml
- name: Configure Docker daemon.json for insecure registries
  hosts: all
  become: true
  tasks:
    - name: Create daemon.json
      template:
        src: templates/daemon.json.j2
        dest: /etc/docker/daemon.json
      notify: Restart Docker Service

    - name: add domaine to /etc/hosts
      lineinfile:
        path: /etc/hosts
        line: "192.168.1.137 prod.local"

  handlers:
    - name: Restart Docker Service
      systemd:
        name: docker
        state: restarted
```

Le module `template` prend en compte la source, qui est le fichier que vous venez de créer, ainsi que la destination vers laquelle il sera copié. Il est ensuite nécessaire de redémarrer Docker pour qu'il prenne en compte ces modifications. `notify` permet de déclencher le `handler` 'Restart Docker Service', qui utilise tout simplement le module `systemd` pour redémarrer le service Docker.

Vous pouvez également profiter de ce playbook de configuration pour ajouter le nom de domaine local `prod.local` qui pointe vers le `masterserver` où nous allons installer Nexus.

Il ne vous reste plus qu'à tester. Exécutez alors le playbook :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-playbook -i 00_inventory.yml playbooks/docker_config.yml 

PLAY [Configure Docker daemon.json for insecure registries] *********************************************************************************************************************************************************

TASK [Gathering Facts] **********************************************************************************************************************************************************************************************
ok: [prodserver]
ok: [testserver]

TASK [Create daemon.json] *******************************************************************************************************************************************************************************************
changed: [prodserver]
changed: [testserver]

TASK [add domaine to /etc/hosts] ************************************************************************************************************************************************************************************
changed: [prodserver]
changed: [testserver]

RUNNING HANDLER [Restart Docker Service] ****************************************************************************************************************************************************************************
changed: [prodserver]
changed: [testserver]

PLAY RECAP **********************************************************************************************************************************************************************************************************
prodserver                 : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
testserver                 : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```

Vous pouvez vérifier sur les nodes que le fichier a été bien ajouté :

```json
[user-ansible@testserver ~]$ cat /etc/docker/daemon.json
{
  "insecure-registries": ["http://prod.local:5002", "http://prod.local:5003"]
}
```

Pour le nom de domaine également, vous pouvez effectuer un ping pour vérifier que tout fonctionne comme prévu.

```bash
[user-ansible@testserver ~]$ cat /etc/hosts
127.0.0.1   localhost testserver
::1         localhost testserver
192.168.1.137 prod.local
[user-ansible@testserver ~]$ ping prod.local
PING prod.local (192.168.1.137) 56(84) bytes of data.
64 bytes from prod.local (192.168.1.137): icmp_seq=1 ttl=64 time=0.345 ms
64 bytes from prod.local (192.168.1.137): icmp_seq=2 ttl=64 time=0.584 ms
64 bytes from prod.local (192.168.1.137): icmp_seq=3 ttl=64 time=0.963 ms
^C
--- prod.local ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2041ms
rtt min/avg/max/mdev = 0.345/0.630/0.963/0.256 ms

```



## Déployez votre application

La dernière étape dans cette section consiste à automatiser le déploiement de votre application avec Ansible.

Vous aurez besoin de vous connecter au registre Docker privé. L'identifiant et le mot de passe de l'utilisateur doivent être enregistrés dans un endroit sécurisé. Effectuez ensuite une modification (`edit`) du fichier `vault.yml` pour ajouter `nexus_registry_username` et `nexus_registry_password` :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-vault edit group_vars/all/vault.yml
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-vault view group_vars/all/vault.yml
ansible_user_pass: 123321
nexus_registry_username: admin
nexus_registry_password: 123321
```

Utilisez le même compte que celui que vous avez utilisé dans la section Nexus. Dans mon cas, j'utilise toujours le compte "admin" pour la démo. Cependant, en entreprise, il est recommandé de créer un compte utilisateur dédié et de gérer les autorisations en conséquence.

Dans votre fichier `all.yml`ajouter les variables suivantes :

1. nexus_registry_username
2. nexus_registry_password
3. nexus_registry_url
4. docker_image_name
5. docker_image_tag
6. docker_container_name
7. docker_container_port

```yaml
ansible_user: "user-ansible"
ansible_user_group: "wheel"
ansible_user_pass: "{{ vault_ansible_user_pass }}"

nexus_registry_username: "{{ vault_nexus_registry_username }}"
nexus_registry_password: "{{ vault_nexus_registry_password }}"
nexus_registry_url: "prod.local:5003"

docker_image_name: "devops-project-samples"
docker_image_tag: "latest"
docker_container_name: "springbootapp"
docker_container_port: "7070"
```

Dans la section précédente, nous avons construit l'image `devops-project-samples` en version `latest`. Dans notre pipeline CI/CD, nous pourrons redéfinir `docker_image_tag` pour spécifier la version de l'image Docker créée lors du processus de build.

**Les étapes nécessaires pour déployer l'application :**

Avec un playbook Ansible, vous allez automatiser les étapes suivantes :

1. Arrêter le conteneur s'il existe et le supprimer.
2. Supprimer l'ancienne image Docker.
3. S'authentifier au registre privé.
4. Récupérer la nouvelle image Docker.
5. Démarrer le conteneur.

Créez alors le fichier `deploy_playbook.yml`à la racine de votre fichier :

```yaml
- name: deploy app
  hosts: all
  
  tasks:
    - name: Stop and remove existing container
      docker_container:
        name: "{{ docker_container_name }}"
        state: absent
      ignore_errors: yes  # Ignore if the container does not exist

    - name: Prune unused Docker images
      command: docker image prune -f

    - name: Log in to Nexus registry
      docker_login:
        registry_url: "{{ nexus_registry_url }}"
        username: "{{ nexus_registry_username }}"
        password: "{{ nexus_registry_password }}"
        reauthorize: yes

    - name: Pull the image from Nexus registry
      docker_image:
        name: "{{ nexus_registry_url }}/{{ docker_image_name }}"
        source: pull
        tag: "{{ docker_image_tag }}"

    - name: Start the new container
      docker_container:
        name: "{{ docker_container_name }}"
        image: "{{ nexus_registry_url }}/{{ docker_image_name }}:{{ docker_image_tag }}"
        ports:
          - "{{ docker_container_port }}:7070"
        state: started
```

Ensuite, lancez l'exécution du playbook :

```bash
[user-ansible@nodemanager devops-ansible-deployment]$ ansible-playbook -i 00_inventory.yml deploy_playbook.yml 

PLAY [Manage Docker image from a private Nexus registry] ************************************************************************************************************************************************************

TASK [Gathering Facts] **********************************************************************************************************************************************************************************************
ok: [prodserver]
ok: [testserver]

TASK [Stop and remove existing container] ***************************************************************************************************************************************************************************
ok: [prodserver]
ok: [testserver]

TASK [Prune unused Docker images] ***********************************************************************************************************************************************************************************
changed: [prodserver]
changed: [testserver]

TASK [Log in to Nexus registry] *************************************************************************************************************************************************************************************
[WARNING]: The value ******** (type int) in a string field was converted to u'********' (type string). If this does not look like what you expect, quote the entire value to ensure it does not change.
changed: [testserver]
changed: [prodserver]

TASK [Pull the image from Nexus registry] ***************************************************************************************************************************************************************************
ok: [prodserver]
ok: [testserver]

TASK [Start the new container] **************************************************************************************************************************************************************************************
changed: [prodserver]
changed: [testserver]

PLAY RECAP **********************************************************************************************************************************************************************************************************
prodserver                 : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
testserver                 : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```



Il est temps de vérifier  que notre application est déployée, faites un `docker ps` sur les nodes pour vérifier que le conteneur est en train d'exécution 

```bash
[user-ansible@testserver ~]$ docker ps
CONTAINER ID   IMAGE                                           COMMAND                  CREATED         STATUS         PORTS                    NAMES
2324c87eb469   prod.local:5003/devops-project-samples:latest   "java -jar /opt/app/…"   4 minutes ago   Up 4 minutes   0.0.0.0:7070->7070/tcp   springbootapp

```

Vous pouvez donc accéder à l'application avec l'adresse IP du node et le port `7070`. Voici la réponse du `testserver` :



![image-20240114173746864](img\image-20240114173746864.png)



Sur le `prodserver` :

```bash
[user-ansible@prodserver ~]$ docker ps
CONTAINER ID   IMAGE                                           COMMAND                  CREATED         STATUS         PORTS                    NAMES
a7775d71725e   prod.local:5003/devops-project-samples:latest   "java -jar /opt/app/…"   5 minutes ago   Up 5 minutes   0.0.0.0:7070->7070/tcp   springbootapp

```



![image-20240114173649623](img\image-20240114173649623.png)

**C'est tout bon !** Notre application est déployée sur les deux serveurs. Si vous relancez le playbook, elle sera donc redéployée !

