---
sidebar_position: 2
---

Tout au long de ce cours, nous aurons besoin de **4 serveurs Linux** :

- **master-server** : un serveur Ubuntu sur lequel vous installerez Jenkins, SonarQube, Docker et Nexus.
- **node-manager** : un serveur CentOS sur lequel vous installerez Ansible.
- **test-server** : un serveur CentOS sur lequel vous déploierez l'API pour l'environnement TEST.
- **prod-server** : un serveur CentOS sur lequel vous déploierez l'API pour l'environnement PROD.

Nous allons utiliser VirtualBox pour créer les différents serveurs. Il est disponible pour Windows, Linux et macOS.

Dans mon cas, c'est un système Windows, mais vous avez le choix de travailler avec n'importe quel système ; la démarche reste la même. L'objectif est d'apprendre comment créer une pipeline CI/CD.

Vous pouvez également opter pour une plateforme cloud telle qu'AWS, GCP ou Azure, si vous y avez accès et que vous êtes à l'aise avec. Ou encore, si vous souhaitez déployer votre application au sein de votre entreprise, rapprochez-vous de votre **adminsys**  pour créer les serveurs nécessaires et obtenir les adresses IP avec leurs **comptes route**. Dans ce cas vous pouvez sauter la prochaine étape.

Pour ne pas alourdir le cours, je ne vais pas inclure les détails d'installation de certains logiciels qui sont très simples !

### Installez les serveurs et préparez l'architecture

1. Téléchargez et installez la version de [VirtualBox](https://www.virtualbox.org/) adaptée à votre système d'exploitation (Windows, macOS, Linux).
2. Téléchargez une image ISO Ubuntu Server depuis le [site officiel](https://ubuntu.com/download/server).
3. Téléchargez une image ISO CentOS depuis le [site officiel](https://www.centos.org/download/).
4. Lancez VirtualBox et créez une VM basée sur Ubuntu, représentant le `master-server`. Je vous conseille d'ajouter suffisamment de RAM à cette VM, au moins 4 Go, idéalement 8 Go, car Jenkins, SonarQube, Docker et Nexus seront installés dessus.
5. Créez une VM basée sur CentOS, représentant le serveur `node-manager`.
6. Choisissez le mode d'accès réseau `bridge` pour toutes les VM. Nous souhaitons que tous les serveurs puissent communiquer entre eux et être accessibles depuis la machine hôte.
7. Clonez la VM `node-manager` deux fois pour créer les serveurs `test-server` et `prod-server` (n'oubliez pas de choisir l'option "Générer de nouvelles adresses MAC pour toutes les interfaces réseau").

### Démarrez les serveurs et vérifiez la configuration réseau 

Démarrer tous les serveurs et tapez la commande `ip a` dans le terminal de chacun pour afficher les interfaces réseau et identifier celle avec l'adresse IP locale qui lui a été attribuée.

**master-server :**

```bash
mossaab@masterserver:~$ ip a

3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:c3:4b:92 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.137/24 brd 192.168.1.255 scope global noprefixroute enp0s8
       valid_lft forever preferred_lft forever
    inet6 fe80::a00:27ff:fec3:4b92/64 scope link
       valid_lft forever preferred_lft forever
```

**node-manager :**

```bash
[root@nodemanager ~]# ip a

3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:09:27:56 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.173/24 brd 192.168.1.255 scope global noprefixroute dynamic enp0s8
       valid_lft 27323sec preferred_lft 27323sec
    inet6 2a01:e0a:5b1:6410:96ea:6a0b:bacd:22cc/64 scope global noprefixroute dynamic
       valid_lft 85992sec preferred_lft 85992sec
    inet6 fe80::f355:6725:548c:3135/64 scope link noprefixroute
       valid_lft forever preferred_lft forever

```

**test-server :**

```bash
[root@testserver ~]# ip a
3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:ad:03:c4 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.26/24 brd 192.168.1.255 scope global noprefixroute dynamic enp0s8
       valid_lft 29735sec preferred_lft 29735sec
    inet6 2a01:e0a:5b1:6410:1dc4:369f:b724:f62/64 scope global noprefixroute dynamic
       valid_lft 86003sec preferred_lft 86003sec
    inet6 fe80::404f:3367:f198:49cf/64 scope link noprefixroute
       valid_lft forever preferred_lft forever

```

**prod-server :**

```bash
[root@prodserver ~]# ip a
3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:2c:fe:54 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.66/24 brd 192.168.1.255 scope global noprefixroute dynamic enp0s8
       valid_lft 29700sec preferred_lft 29700sec
    inet6 2a01:e0a:5b1:6410:f653:6794:2ba8:2545/64 scope global noprefixroute dynamic
       valid_lft 85968sec preferred_lft 85968sec
    inet6 fe80::ae10:55e:9b68:24d0/64 scope link noprefixroute
       valid_lft forever preferred_lft forever

```

Dans mon cas, voici les adresses IP qui ont été attribués aux VMs :

- master-server : 192.168.1.137
- node-manager : 192.168.1.173
- test-server : 192.168.1.26
- prod-server : 192.168.1.66

### Se connecter en SSH aux serveurs

En règle générale, les distributions Linux orientées serveur, comme Ubuntu Server, ont souvent le serveur SSH (`openssh-server`) installé par défaut. Cela permet aux utilisateurs de se connecter à distance à la machine via SSH. Cependant les versions Desktop peuvent ne pas inclure le serveur SSH par défaut. 

Pour la VM  `master-server` si vous avez installer Ubuntu Desktop plutôt que Ubuntu server vous pouvez installer le serveur SSH avec les commandes suivantes :

```
sudo apt-get update
sudo apt-get install openssh-server
```

Nous pouvons bien évidemment travailler directement sur les terminaux, mais personnellement, j'opte pour l'utilisation de [MobaXterm](https://mobaxterm.mobatek.net/download.html) pour mes connexions en SSH aux machines distantes. Dans la plupart des scénarios, l'accès physique aux machines n'est pas toujours possible, rendant essentielle la connexion en SSH pour la gestion à distance.

Bien sûr, vous avez également la possibilité d'utiliser d'autres solutions telles que PuTTY ou simplement l'invite de commandes.

Connectez-vous aux différentes machines via SSH. Vous pouvez également effectuer un ping pour vérifier que tous les serveurs peuvent communiquer entre eux.

![image-20240102141438898](img\image-20240102141438898.png)

 Faites un ping aussi depuis la machine hôte pour vérifier que le server `masterserver` est accessible.

```bash
λ ping 192.168.1.137

Envoi d’une requête 'Ping'  192.168.1.137 avec 32 octets de données :
Réponse de 192.168.1.137 : octets=32 temps<1ms TTL=64
Réponse de 192.168.1.137 : octets=32 temps<1ms TTL=64

Statistiques Ping pour 192.168.1.137:
    Paquets : envoyés = 2, reçus = 2, perdus = 0 (perte 0%),
Durée approximative des boucles en millisecondes :
    Minimum = 0ms, Maximum = 0ms, Moyenne = 0ms
```

### Modifiez les noms des machines et ajoutez un nom de domaine local

Dans l'absolu, il est recommandé d'utiliser **les noms de machines plutôt que les adresses IP**. Les noms des serveurs devraient toujours être enregistrés dans un serveur DNS. Cependant, pour les besoins de ce cours, nous allons les configurer localement en utilisant le fichier `/etc/hosts`. Ce fichier permet d'établir des correspondances entre les noms des serveurs et leurs adresses IP.

Voici ma configuration :

Sur le `nodemanager` :

```bash
[root@nodemanager ~]# cat /etc/hostname
nodemanager
[root@nodemanager ~]# cat /etc/hosts
127.0.0.1   localhost nodemanager
::1         localhost nodemanager
```

Sur le `testserver` :

```bash
[root@testserver ~]# cat /etc/hostname
testserver
[root@testserver ~]# cat /etc/hosts
127.0.0.1   localhost testserver
::1         localhost testserver
```

Sur le `prodserver` :

```bash
[root@prodserver ~]# cat /etc/hostname
prodserver
[root@prodserver ~]# cat /etc/hosts
127.0.0.1   localhost prodserver
::1         localhost prodserver
```

Pour le `master-server` qui héberge Jenkins, SonarQube et Nexus je vous recommande d'ajouter un nom de domaine local dans votre machine hôte pour se simplifier la vie plus tard.

J'ai donc ajouté un nom de domaine local `prod.local` qui pointe vers l'adresse IP du server.

Sur le `masterserver` :

```
mossaabfr@masterserver:~$ cat /etc/hostname
masterserver
mossaabfr@masterserver:~$ cat /etc/hosts
127.0.0.1       localhost
127.0.1.1       masterserver
192.168.1.137 	prod.local
```

Sur ma machine hôte Windows, j'ai ajouté le nom de domaine dans `C:\Windows\System32\drivers\etc\hosts` (à ouvrir avec un éditeur de texte en mode administrateur)

```bash
#
127.0.0.1 localhost
::1 localhost
192.168.1.137 prod.local
```

Note : Assurez-vous que l'adresse IP `192.168.1.X` correspond à celle de votre `masterserver`. Ces configurations permettront à votre machine hôte de résoudre le nom de domaine `prod.local` vers l'adresse IP spécifiée lorsqu'elle communique avec le `masterserver`.

### Configurer une adresse IP statique (facultatif)

L'adresse IP d'une interface réseau est attribuée automatiquement via le protocole **DHCP** (Dynamic Host Configuration Protocol). Cela signifie que l'adresse IP peut changer à chaque redémarrage du serveur.

Pour garantir que l'adresse IP du serveur `masterserver` reste constante vous pouvez attribuez manuellement une adresse IP fixe à l'interface réseau.

Sur la machine `masterserver` identifier le nom de l'interface réseau utilisé pour l'adresse IP local avec la commande `ip a`. Notez son nom : dans mon cas elle s'appelle `enp0s8`

Depuis la version 17.10, Ubuntu a adopté `Netplan` comme outil de gestion de la configuration réseau. `Netplan` utilise des fichiers de configuration au format YAML, généralement stockés dans le répertoire `/etc/netplan/`, pour décrire la configuration réseau du système.

Le dossier `/etc/netplan` contient déjà un fichier de configuration par défaut :

```bash
mossaabfr@masterserver:~$ ls /etc/netplan
01-network-manager-all.yaml
mossaabfr@masterserver:~$ cat /etc/netplan/01-network-manager-all.yaml
# Let NetworkManager manage all devices on this system
network:
  version: 2
  renderer: NetworkManager
```

La ligne `renderer: NetworkManager` indique le programme qui va appliquer les instructions de ce fichier de configuration (`NetworkManager` est utilisé sur les versions `Destkop` `renderer: networkd` est plutôt utilisé sur les versions `server`).

Pour attribuer une IP statique à l'interface `enp0s8`, créez le fichier  `/etc/netplan/02-lan-statique.yaml` :

```yaml
network:
 version: 2
 renderer: NetworkManager
 ethernets:
   enp0s8:
     dhcp4: no
     dhcp6: no
     addresses: [192.168.1.137/24]
     gateway4: 192.168.1.1
     nameservers:
       addresses: [127.0.0.53]
```

Une fois le fichier enregistré, vous pouvez appliquer la nouvelle configuration par la commande :

```bash
sudo netplan apply
```