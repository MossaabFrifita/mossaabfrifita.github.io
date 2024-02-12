---
sidebar_position: 3
---



Installez Docker sur `masterserver` en suivant le lien d'installation pour [Ubuntu](https://docs.docker.com/engine/install/ubuntu/) ou en suivant les étapes suivantes :

1. Exécutez la commande suivante pour désinstaller tous les packages en conflit :

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

2. Configurez le référentiel apt de Docker :

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

3. Installez les packages Docker :

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Si vous souhaitez exécuter des commandes Docker directement depuis votre machine hôte (dans mon cas, Windows), vous avez besoin de `docker cli` pour communiquer avec Docker Engine installé sur le serveur, tel que le `masterserver` dans notre cas. C'est particulièrement utile, car cela permet de créer et d'exécuter des images Docker directement depuis l'IDE dans notre environnement de développement.

Pour ce faire, c'est très simple : il suffit d'exposer le Docker Engine via son API REST.

## Exposer Docker Engine via l'API REST

Pour permettre l'accès à l'API REST de Docker Engine dans `masterserver`, suivez ces étapes :

1. Modifiez le fichier `/lib/systemd/system/docker.service`.
2. Ajoutez l'option `-H=tcp://0.0.0.0:2375` au paramètre `ExecStart` :

```bash
ExecStart=/usr/bin/dockerd -H fd:// -H=tcp://0.0.0.0:2375  --containerd=/run/containerd/containerd.sock
```

Note :Lorsque vous utilisez `0.0.0.0` comme adresse IP pour Docker, cela signifie que Docker écoute sur toutes les interfaces réseau disponibles sur le système. En production, il est généralement conseillé de limiter l'écoute à une interface spécifique et d'utiliser des mécanismes de sécurité tels que TLS pour sécuriser les communications avec le démon Docker.

3. Redémarrez le service Docker pour appliquer les modifications : `sudo systemctl restart docker`

Pour installer Docker CLI sur Windows, installez [Chocolatey](https://chocolatey.org/install)  qui est un gestionnaire de packages pour Windows.

Dans l'invite de commandes, exécutez la commande suivante :

```
choco install docker-cli
```

Créez une variable d'environnement `DOCKER_HOST tcp://192.168.1.137:2375` pour spécifier l'adresse du serveur sur lequel Docker est installé. Dans notre cas c'est le `masterserver`.

![image-20240102200340516](img\image-20240102200340516.png)

Cela permet à Docker CLI de se connecter à distance à l'instance Docker sur le serveur `masterserver`.

Depuis le terminal de votre machine hôte tapez `docker --version` pour vérifier que vous avez bien accès au docker engine :

```bash
C:\Users\Utilisateur\Desktop\Mossaab\donw\cmder_mini
λ docker --version
Docker version 24.0.7, build afdd53b
```