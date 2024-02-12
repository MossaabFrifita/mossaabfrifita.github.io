---
sidebar_position: 4
---


Le but de ce cours est de mettre en place une démarche DevOps. Pour cela, nous allons créer une petite application Spring Boot minimaliste, capable de renvoyer un message "Hello" lorsqu'on accède au chemin `/`.

Créez un projet Spring Boot Maven, choisissez le nom que vous souhaitez, définissez le type de packaging sur Jar, sélectionnez la version de Java 17 et ajoutez la dépendance Spring Web, c'est tout ce dont nous aurons besoin.

Ajoutez un contrôleur REST qui renvoie un message "Hello" lorsqu'on accède à la racine de l'application :

```java
package fr.mossaab.devopsprojectsamples;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class DevopsProjectSamplesApplication {

    public static void main(String[] args) {
        SpringApplication.run(DevopsProjectSamplesApplication.class, args);
    }

    @GetMapping
    public String sayHello(){ return "Hello from devops project !";}
}
```

N'oubliez pas de configurer le port du serveur Tomcat dans le fichier `application.properties` ou `application.yml` avec la propriété `server.port`.

```yaml
server:
  port: 7070
```

Démarrez votre application. Vous devriez voir ce message :

![image-20240103023603064](img\image-20240103023603064.png)
