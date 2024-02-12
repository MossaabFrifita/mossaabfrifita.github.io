"use strict";(self.webpackChunkmy_blog=self.webpackChunkmy_blog||[]).push([[9779],{8489:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>t,default:()=>u,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var r=s(5893),a=s(1151);const i={sidebar_position:5},t=void 0,o={id:"devops/Installation et configuration de SonarQube et JaCoCo",title:"Installation et configuration de SonarQube et JaCoCo",description:"Architecture de SonarQube",source:"@site/docs/devops/Installation et configuration de SonarQube et JaCoCo.md",sourceDirName:"devops",slug:"/devops/Installation et configuration de SonarQube et JaCoCo",permalink:"/docs/devops/Installation et configuration de SonarQube et JaCoCo",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Cr\xe9ez une simple application Spring Boot",permalink:"/docs/devops/Cr\xe9ez une simple application Spring Boot"},next:{title:"Conteneurisez l'application Spring Boot avec Docker",permalink:"/docs/devops/Conteneurisez l'application Spring Boot avec Docker"}},l={},c=[{value:"Architecture de SonarQube",id:"architecture-de-sonarqube",level:2},{value:"Installez SonarQube server",id:"installez-sonarqube-server",level:2},{value:"Installez SonarQube Scanner",id:"installez-sonarqube-scanner",level:2},{value:"Contr\xf4lez la qualit\xe9 du code et la couverture de vos tests",id:"contr\xf4lez-la-qualit\xe9-du-code-et-la-couverture-de-vos-tests",level:2},{value:"L&#39;authentification anonyme",id:"lauthentification-anonyme",level:3},{value:"G\xe9n\xe9rez un token d&#39;acc\xe8s",id:"g\xe9n\xe9rez-un-token-dacc\xe8s",level:3},{value:"Cr\xe9ez un projet local",id:"cr\xe9ez-un-projet-local",level:3},{value:"Lancez l&#39;analyse du projet avec Sonar Scanner",id:"lancez-lanalyse-du-projet-avec-sonar-scanner",level:3},{value:"SonarQube Quality gates",id:"sonarqube-quality-gates",level:3},{value:"\xc9valuez la couverture de vos tests",id:"\xe9valuez-la-couverture-de-vos-tests",level:3},{value:"Mesurez la couverture des tests avec JaCoCo",id:"mesurez-la-couverture-des-tests-avec-jacoco",level:3},{value:"Utilisez SonarLint dans votre IDE",id:"utilisez-sonarlint-dans-votre-ide",level:3},{value:"Analysez le code avec SonarScanner CLI",id:"analysez-le-code-avec-sonarscanner-cli",level:3}];function d(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"architecture-de-sonarqube",children:"Architecture de SonarQube"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"img",src:s(2392).Z+"",width:"1934",height:"509"})}),"\n",(0,r.jsxs)(n.p,{children:["Source de l'image (",(0,r.jsx)(n.a,{href:"https://scm.thm.de/sonar/documentation/architecture/architecture-integration/",children:"https://scm.thm.de/sonar/documentation/architecture/architecture-integration/"}),")"]}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Le serveur SonarQube d\xe9marre 3 processus :"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"WebServer"})," c'est un serveur web qui fournit l'interface utilisateur."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"SearchServer"})," c'est un serveur de recherche bas\xe9 sur ",(0,r.jsx)(n.code,{children:"Elasticsearch"}),", permet d'effectuer des recherches \xe0 partir de l'interface utilisateur."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"Compute Engine Server"})," c'est le serveur responsable du traitement des rapports d'analyse de code et de les enregistrer dans la base de donn\xe9es SonarQube."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"La base de donn\xe9es SonarQube stocke la configuration de l'instance de SonarQube, ainsi que les rapports de qualit\xe9 des projets, etc."}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Les plugins SonarQube \xe9tendent les fonctionnalit\xe9s de base."}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Les scanners SonarQube qui peuvent \xeatre ex\xe9cut\xe9s sur les serveurs de build et d'int\xe9gration continue pour analyser les projets et fournir des rapports de qualit\xe9."}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"installez-sonarqube-server",children:"Installez SonarQube server"}),"\n",(0,r.jsxs)(n.p,{children:["Nous allons installer SonarQube server avec docker, dans le serveur ",(0,r.jsx)(n.code,{children:"masterserver"})," d\xe9marrez un conteneur docker avec SonarQube"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker run -d --name sonarqube --restart always -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest\n"})}),"\n",(0,r.jsx)(n.p,{children:"Par d\xe9faut SonarQube utilise une base de donn\xe9es H2. En production il est recommand\xe9 de le configurer avec une base de donn\xe9es externe telle que PostgreSQL, MySQL, Microsoft SQL Server, ou Oracle Database."}),"\n",(0,r.jsxs)(n.p,{children:["Il est \xe9galement conseill\xe9 de monter les volumes ",(0,r.jsx)(n.code,{children:"sonarqube_data"}),", ",(0,r.jsx)(n.code,{children:"sonarqube_logs"})," et ",(0,r.jsx)(n.code,{children:"sonarqube_extensions"})," lorsque vous ex\xe9cutez SonarQube dans un conteneur Docker, cela permet d'assurer la persistance des donn\xe9es. Vous pouvez trouver toutes les instructions de configuration de SonarQube avec Docker et Docker Compose \xe0 partir de ce ",(0,r.jsx)(n.a,{href:"https://docs.sonarsource.com/sonarqube/latest/setup-and-upgrade/install-the-server/installing-sonarqube-from-docker/",children:"lien"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true"})," permet de d\xe9sactiver le serveur de recherche dont nous n'aurons pas besoin pour ce cours."]}),"\n",(0,r.jsxs)(n.p,{children:["Une fois le conteneur d\xe9marr\xe9, SonarQube est accessible sur le serveur ",(0,r.jsx)(n.code,{children:"masterserver"})," \xe0 l'adresse IP 192.168.1.137 et sur le port 9000. Nous avons d\xe9j\xe0 d\xe9fini un nom de domaine local pour le ",(0,r.jsx)(n.code,{children:"masterserver"}),", donc nous pouvons y acc\xe9der directement depuis le navigateur web avec ",(0,r.jsx)(n.code,{children:"prod.local:9000"}),"."]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240103142358842",src:s(1687).Z+"",width:"813",height:"327"})}),"\n",(0,r.jsxs)(n.p,{children:["Les identifiants par d\xe9faut sont ",(0,r.jsx)(n.code,{children:"admin admin"}),". Lors de votre premi\xe8re connexion \xe0 SonarQube, il vous sera demand\xe9 de les modifier."]}),"\n",(0,r.jsx)(n.h2,{id:"installez-sonarqube-scanner",children:"Installez SonarQube Scanner"}),"\n",(0,r.jsx)(n.p,{children:"Le r\xf4le du scanner SonarQube, comme je l'ai d\xe9j\xe0 expliqu\xe9, est d'analyser le projet, de collecter les informations  sur la qualit\xe9 du code et d'envoyer le rapport au serveur SonarQube. Il existe plusieurs scanners pour diff\xe9rents syst\xe8mes de build tels que Gradle, Maven, Ant, .NET, Jenkins, etc."}),"\n",(0,r.jsxs)(n.p,{children:["Pour notre cas c'est Maven, on peut l'int\xe9grer directement \xe0 notre projet avec le ",(0,r.jsx)(n.a,{href:"https://mvnrepository.com/artifact/org.sonarsource.scanner.maven/sonar-maven-plugin",children:"plugin"})," ",(0,r.jsx)(n.code,{children:"SonarQube Scanner For Maven"})]}),"\n",(0,r.jsx)(n.p,{children:"Ajoutez la d\xe9pendance du plugin dans le fichier pom.xml dans la section build => plugins :"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-xml",children:"<build>\r\n    <plugins>\r\n        <plugin>\r\n            <groupId>org.sonarsource.scanner.maven</groupId>\r\n            <artifactId>sonar-maven-plugin</artifactId>\r\n            <version>3.9.1.2184</version>\r\n        </plugin>\r\n    </plugins>\r\n</build>\n"})}),"\n",(0,r.jsx)(n.h2,{id:"contr\xf4lez-la-qualit\xe9-du-code-et-la-couverture-de-vos-tests",children:"Contr\xf4lez la qualit\xe9 du code et la couverture de vos tests"}),"\n",(0,r.jsx)(n.h3,{id:"lauthentification-anonyme",children:"L'authentification anonyme"}),"\n",(0,r.jsx)(n.p,{children:"Par d\xe9faut, l'acc\xe8s anonyme au serveur SonarQube ou aux projets via l'API n'est g\xe9n\xe9ralement pas autoris\xe9. Pour acc\xe9der \xe0 SonarQube, une authentification est requise, soit en utilisant le login et le mot de passe d'un utilisateur, soit en fournissant un token d'acc\xe8s."}),"\n",(0,r.jsx)(n.p,{children:'Vous pouvez activer/d\xe9sactiver l\'authentification anonyme depuis l\'onglet "Administration" => "Security"'}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240103171232209",src:s(5163).Z+"",width:"1054",height:"577"})}),"\n",(0,r.jsx)(n.p,{children:"Pour garantir la s\xe9curit\xe9 l'authentification anonyme ne doit pas \xeatre autoris\xe9, l'utilisation d'un token d'acc\xe8s est souvent recommand\xe9e, car cela \xe9vite de partager les identifiants de l'utilisateur, ce qui renforce la s\xe9curit\xe9."}),"\n",(0,r.jsx)(n.h3,{id:"g\xe9n\xe9rez-un-token-dacc\xe8s",children:"G\xe9n\xe9rez un token d'acc\xe8s"}),"\n",(0,r.jsx)(n.p,{children:'Pour g\xe9n\xe9rer un nouveau token d\'acc\xe8s, acc\xe9dez \xe0 "My Account"  => "Security" => "Tokens".'}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240103215223881",src:s(4659).Z+"",width:"992",height:"245"})}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Donnez un nom au token pour le diff\xe9rencier."}),"\n",(0,r.jsxs)(n.li,{children:['Choisissez le type "Global Analysis Token", le type permet de d\xe9finir un niveau d\'acc\xe8s :',"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"User Token"})," : Associ\xe9 \xe0 un utilisateur sp\xe9cifique et h\xe9rite de ses permissions."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Project Token"})," : Li\xe9 \xe0 un projet sp\xe9cifique et n'a que les autorisations n\xe9cessaires pour ce projet."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Global Token"})," :  Ind\xe9pendant des utilisateurs, donne un acc\xe8s global \xe0 tous les projets."]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.li,{children:'Choisissez la dur\xe9e de validit\xe9 du token dans la section "Expires in". Vous pouvez s\xe9lectionner une dur\xe9e sp\xe9cifique (par exemple, 30 jours, 90 jours) ou choisir "No Expiration" pour un token sans expiration.'}),"\n",(0,r.jsx)(n.li,{children:'Cliquez sur "Generate" pour g\xe9n\xe9rer le token'}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240103220643041",src:s(204).Z+"",width:"983",height:"267"})}),"\n",(0,r.jsx)(n.p,{children:"Copiez le token quelque part, car il ne sera plus visible si vous fermez la fen\xeatre !"}),"\n",(0,r.jsx)(n.h3,{id:"cr\xe9ez-un-projet-local",children:"Cr\xe9ez un projet local"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:'Cr\xe9ez un projet local dans SonarQube "projects"  => "Create a local project"'}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240103213134152",src:s(6510).Z+"",width:"688",height:"557"})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:'S\xe9lectionnez "user the global setting"'}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240103213324833",src:s(7820).Z+"",width:"603",height:"210"})}),"\n",(0,r.jsxs)(n.ol,{start:"3",children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:'Dans la prochaine \xe9tape vous pouvez choisir la m\xe9thode d\'analyse, s\xe9lectionnez "Locally"'}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240103221145556",src:s(6460).Z+"",width:"1328",height:"636"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:'Dans "Provide a token", choisissiez "use existing token" et collez le token g\xe9n\xe9r\xe9 pr\xe9c\xe9demment'}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Finalement, choisissiez Maven comme un outil de build pour ex\xe9cuter analyse du code :"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240103222758684",src:s(535).Z+"",width:"1246",height:"505"})}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"SonarQube nous fournit d\xe9j\xe0 la commande Maven \xe0 ex\xe9cuter dans notre projet pour lancer l'analyse avec Sonar Scanner. Copiez-la pour tester."}),"\n",(0,r.jsxs)(n.p,{children:["Avant d'ex\xe9cuter la commande, il est important de noter que le scanner peut \xeatre lanc\xe9 simplement avec la commande ",(0,r.jsx)(n.code,{children:"mvn clean verify sonar:sonar"})," sans arguments !"]}),"\n",(0,r.jsx)(n.p,{children:"Mais pour envoyer les r\xe9sultats d'analyse, le scanner n\xe9cessite les informations suivantes :"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"projectKey"})," : la cl\xe9 du projet sur le serveur SonarQube pour son identification."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"projectName"})," : le nom du projet sur le serveur SonarQube."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"host.url"})," : l'URL du serveur SonarQube."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"token"})," : un token assurant un acc\xe8s s\xe9curis\xe9 au serveur."]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Par d\xe9faut, il recherche la configuration du projet dans le fichier ",(0,r.jsx)(n.code,{children:"settings.xml"})," de Maven, comprenant l'URL du serveur, le token n\xe9cessaire pour l'authentification ou le login/password, ainsi que le ",(0,r.jsx)(n.code,{children:"projectKey"}),", correspondant \xe0 l'",(0,r.jsx)(n.code,{children:"artifactId"})," dans le fichier ",(0,r.jsx)(n.code,{children:"pom.xml"}),", et le ",(0,r.jsx)(n.code,{children:"projectName"})," dans l'\xe9l\xe9ment ",(0,r.jsx)(n.code,{children:"name"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-xml",children:'<?xml version="1.0" encoding="UTF-8"?>\r\n<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\r\n         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">\r\n\t...\r\n    <groupId>fr.mossaab</groupId>\r\n    <artifactId>devops-project-samples</artifactId>\r\n    <version>0.0.1-SNAPSHOT</version>\r\n    <name>devops-project-samples</name>\r\n    <description>devops-project-samples</description>\r\n\t...\r\n</project>\n'})}),"\n",(0,r.jsx)(n.p,{children:"Mais nous pouvons passer tous ces param\xe8tres sous forme d'arguments, et d'ailleurs, c'est ce que nous propose SonarQube pour tester :"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"mvn clean verify sonar:sonar \\\r\n  -Dsonar.projectKey=devops-project-samples \\\r\n  -Dsonar.projectName='devops-project-samples' \\\r\n  -Dsonar.host.url=http://prod.local:9000 \\\r\n  -Dsonar.token=sqa_8f117f6e6633bb15a069fd78920cb35fd4325273\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Le ",(0,r.jsx)(n.code,{children:"projectKey"})," et le ",(0,r.jsx)(n.code,{children:"projectName"})," ne sont pas obligatoires. Comme je viens de l'expliquer, le scanner tentera de les d\xe9duire \xe0 partir du fichier ",(0,r.jsx)(n.code,{children:"pom.xml"}),". Si le projet n'existe pas, il sera cr\xe9\xe9 automatiquement. Cependant, cela d\xe9pend de l'autorisation accord\xe9e par le token d'acc\xe8s !"]}),"\n",(0,r.jsx)(n.h3,{id:"lancez-lanalyse-du-projet-avec-sonar-scanner",children:"Lancez l'analyse du projet avec Sonar Scanner"}),"\n",(0,r.jsx)(n.p,{children:"Lancez la commande pr\xe9c\xe9demment copi\xe9e \xe0 partir de la racine de votre projet, comme vous avez l'habitude de le faire avec les autres commandes Maven."}),"\n",(0,r.jsxs)(n.p,{children:["Remarque : Si vous ex\xe9cutez la commande avec CMD et que vous rencontrez des probl\xe8mes, veillez \xe0 encadrer les param\xe8tres entre guillemets doubles afin d'\xe9viter toute interpr\xe9tation incorrecte des caract\xe8res sp\xe9ciaux, comme dans l'url : ",(0,r.jsx)(n.code,{children:'-D"sonar.host.url=http://prod.local:9000"'}),". En revanche, avec PowerShell, l'utilisation de guillemets doubles n'est pas n\xe9cessaire."]}),"\n",(0,r.jsx)(n.p,{children:'Si tout se passe bien vous devriez voir "ANAYSIS SUCESSFUL" avec le lien vers le projet dans SonarQube'}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104012858405",src:s(6331).Z+"",width:"924",height:"369"})}),"\n",(0,r.jsx)(n.p,{children:"Acc\xe9dez au SonarQube depuis votre navigateur pour voir le rapport d'analyse envoy\xe9 par le Scanner."}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104011934964",src:s(1989).Z+"",width:"986",height:"194"})}),"\n",(0,r.jsx)(n.p,{children:"Vous pouvez parcourir les bugs, les vuln\xe9rabilit\xe9s ainsi que les 'Code Smells', qui sont des indicateurs de parties du code pouvant \xeatre am\xe9lior\xe9es en termes de lisibilit\xe9, de maintenabilit\xe9 ou de performances."}),"\n",(0,r.jsx)(n.h3,{id:"sonarqube-quality-gates",children:"SonarQube Quality gates"}),"\n",(0,r.jsx)(n.p,{children:'Les Quality Gates sont des m\xe9canismes configurables qui nous permettent de d\xe9finir des r\xe8gles sp\xe9cifiques pour \xe9valuer la qualit\xe9 du code. Ces r\xe8gles peuvent inclure des crit\xe8res tels que la duplication de code, la couverture par les tests, et d\'autres aspects essentiels de la qualit\xe9 du code. Ainsi, le statut "Passed" indique que le code respecte ces r\xe8gles pr\xe9d\xe9finies, assurant ainsi un niveau de qualit\xe9 satisfaisant pour la production.'}),"\n",(0,r.jsxs)(n.p,{children:["Pour une exp\xe9rience pratique, nous allons introduire une m\xe9thode vide ",(0,r.jsx)(n.code,{children:"public void emptyVoid(){}"})," dans le code, puis relancer le scanner afin d'observer l'effet de cette modification sur les r\xe9sultats de l'analyse."]}),"\n",(0,r.jsx)(n.p,{children:'Voici le r\xe9sultat, cette fois le statut des Quality gates est "Failed"'}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104021618002",src:s(1585).Z+"",width:"979",height:"190"})}),"\n",(0,r.jsx)(n.p,{children:"Cliquez sur le projet, puis sur 'Issues' pour acc\xe9der \xe0 la liste des probl\xe8mes. Vous pouvez constater que l'ajout de la m\xe9thode vide est d\xe9j\xe0 signal\xe9 par SonarQube"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104022033120",src:s(9848).Z+"",width:"1026",height:"179"})}),"\n",(0,r.jsx)(n.p,{children:'Les Quality Gates peuvent \xeatre configur\xe9s depuis l\'onglet "Quality Gates" dans SonarQube'}),"\n",(0,r.jsx)(n.p,{children:"SonarQube applique des r\xe8gles par d\xe9faut \xe0 tous les projets, mais permet une personnalisation pour adapter ces r\xe8gles aux besoins sp\xe9cifiques de chaque projet."}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104023853532",src:s(5074).Z+"",width:"1176",height:"598"})}),"\n",(0,r.jsx)(n.h3,{id:"\xe9valuez-la-couverture-de-vos-tests",children:"\xc9valuez la couverture de vos tests"}),"\n",(0,r.jsx)(n.p,{children:"Si vous faites du TDD, vous commencez par \xe9crire des tests avant de coder la fonctionnalit\xe9. Cependant, pendant l'impl\xe9mentation r\xe9elle de la fonctionnalit\xe9, vous pourriez \xe9crire du code au-del\xe0 du p\xe9rim\xe8tre initial du test, en incluant des cas particuliers et des exceptions."}),"\n",(0,r.jsx)(n.p,{children:"Par cons\xe9quent, bien que vous ayez cr\xe9\xe9 des tests initiaux, ils pourraient ne pas couvrir toutes les instructions du code nouvellement \xe9crit. La couverture de code par les tests signifie simplement qu'une ligne de code a \xe9t\xe9 ex\xe9cut\xe9e par au moins un test. Il est donc possible que toutes les branches du code ne soient pas test\xe9es, laissant des parties du code non couvertes."}),"\n",(0,r.jsx)(n.p,{children:"C'est pourquoi il est important de combiner le TDD avec une analyse de la couverture de code pour s'assurer que la plupart, voire toutes, les parties du code sont effectivement test\xe9es. Cela contribue \xe0 garantir une meilleure qualit\xe9 et fiabilit\xe9 du code"}),"\n",(0,r.jsx)(n.h3,{id:"mesurez-la-couverture-des-tests-avec-jacoco",children:"Mesurez la couverture des tests avec JaCoCo"}),"\n",(0,r.jsx)(n.p,{children:"SonarQube ne g\xe9n\xe8re pas le rapport de couverture lui-m\xeame. \xc0 la place, vous devez configurer un outil tiers pour produire le rapport lors de build, Comme JaCoCo qui est pris en charge nativement par SonarQube."}),"\n",(0,r.jsx)(n.p,{children:"Nous allons utiliser le plugin Maven JaCoCo pour g\xe9n\xe9rer des rapports de couverture de code lors de build."}),"\n",(0,r.jsxs)(n.p,{children:["Commencez par ajouter l'appel au plugin \xe0 votre fichier pom.xml dans la section build => plugins (pensez \xe0 v\xe9rifier sur ",(0,r.jsx)(n.a,{href:"https://mvnrepository.com/artifact/org.jacoco/jacoco-maven-plugin",children:"mvnrepository.com"})," s'il existe une version plus r\xe9cente du plugin) :"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-xml",children:"<plugin>\r\n    <groupId>org.jacoco</groupId>\r\n    <artifactId>jacoco-maven-plugin</artifactId>\r\n    <version>0.8.11</version>\r\n    <executions>\r\n        <execution>\r\n            <id>jacoco-initialize</id>\r\n            <goals>\r\n                <goal>prepare-agent</goal>\r\n            </goals>\r\n            <phase>test-compile</phase>\r\n        </execution>\r\n        <execution>\r\n            <id>jacoco-site</id>\r\n            <phase>verify</phase>\r\n            <goals>\r\n                <goal>report</goal>\r\n            </goals>\r\n        </execution>\r\n    </executions>\r\n</plugin>\n"})}),"\n",(0,r.jsx)(n.p,{children:"Cette d\xe9claration permet de d\xe9clencher JaCoCo durant le build et de r\xe9diger un rapport apr\xe8s l'ex\xe9cution des tests."}),"\n",(0,r.jsx)(n.p,{children:"Ensuite, en ligne de commandes, lancez la commande :"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"mvn clean install\n"})}),"\n",(0,r.jsx)(n.p,{children:"\xc0 la fin de l'ex\xe9cution de la commande, vous pouvez voir que JaCoCo a g\xe9n\xe9r\xe9 un rapport qui se trouve par d\xe9faut dans le dossier target/site/jacoco."}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104193956295",src:s(8262).Z+"",width:"463",height:"543"})}),"\n",(0,r.jsx)(n.p,{children:"Ouvrez dans votre navigateur le fichier index.html, et vous obtenez un rapport cliquable :"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104190002292",src:s(1241).Z+"",width:"1126",height:"229"})}),"\n",(0,r.jsxs)(n.p,{children:["Par d\xe9faut, le Scanner v\xe9rifie automatiquement le rapport enregistr\xe9 sous ",(0,r.jsx)(n.code,{children:"target/site/jacoco/jacoco.xml"})," et l'envoie au SonarQube."]}),"\n",(0,r.jsx)(n.p,{children:"Relancez le Scanner toujours par la m\xeame commande :"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"mvn clean verify sonar:sonar \\\r\n  -Dsonar.projectKey=devops-project-samples \\\r\n  -Dsonar.projectName='devops-project-samples' \\\r\n  -Dsonar.host.url=http://prod.local:9000 \\\r\n  -Dsonar.token=sqa_8f117f6e6633bb15a069fd78920cb35fd4325273\n"})}),"\n",(0,r.jsx)(n.p,{children:"V\xe9rifiez votre projet pour vous assurer que le pourcentage de la couverture de code a bien \xe9t\xe9 mis \xe0 jour !"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104194427580",src:s(7535).Z+"",width:"974",height:"172"})}),"\n",(0,r.jsx)(n.h3,{id:"utilisez-sonarlint-dans-votre-ide",children:"Utilisez SonarLint dans votre IDE"}),"\n",(0,r.jsx)(n.p,{children:"SonarLint est un plugin ou une extension pour les IDE, il est disponible pour IntelliJ IDEA, Eclipse et Visual Studio Code. Son objectif principal est d'apporter les fonctionnalit\xe9s d'analyse statique de code de SonarQube directement dans l'IDE, offrant ainsi une v\xe9rification continue de la qualit\xe9 du code pendant le d\xe9veloppement."}),"\n",(0,r.jsx)(n.p,{children:'Installez le plugin SonarLint dans votre IDE pour tester, dans Intellij vous pouvez le faire en acc\xe9dant \xe0 "File" => "Settings" => "Plugins"'}),"\n",(0,r.jsx)(n.p,{children:"SonarLint analyse automatiquement le code en temps r\xe9el."}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104195859997",src:s(3228).Z+"",width:"1062",height:"259"})}),"\n",(0,r.jsx)(n.h3,{id:"analysez-le-code-avec-sonarscanner-cli",children:"Analysez le code avec SonarScanner CLI"}),"\n",(0,r.jsxs)(n.p,{children:["Le SonarScanner CLI est utilis\xe9 quand aucun syst\xe8me de build n'est sp\xe9cifi\xe9, nous allons d\xe9j\xe0 tester le Scanner pour Maven avec la commande ",(0,r.jsx)(n.code,{children:"mvn clean verify sonar:sonar"})," en passant les arguments n\xe9cessaires, maintenant nous allons tester l'analyse de code avec SonnarScanner CLI."]}),"\n",(0,r.jsxs)(n.p,{children:["T\xe9l\xe9chargez SonarScannerCLI depuis le ",(0,r.jsx)(n.a,{href:"https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/",children:"site officiel"}),' et ajoutez le chemin de dossier "bin" aux variables d\'environnements']}),"\n",(0,r.jsx)(n.p,{children:"Pour Windows :"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104214723339",src:s(144).Z+"",width:"618",height:"585"})}),"\n",(0,r.jsxs)(n.p,{children:["Le fichier de configuration globale se trouve sous ",(0,r.jsx)(n.code,{children:"chemin_vers_sonarScanner/conf/sonar-scanner.properties"})," :"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-properties",children:"#Configure here general information about the environment, such as SonarQube server connection details for example\r\n#No information about specific project should appear here\r\n\r\n#----- Default SonarQube server\r\n#sonar.host.url=http://localhost:9000\r\n\r\n#----- Default source code encoding\r\n#sonar.sourceEncoding=UTF-8\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Vous pouvez \xe9galement ajouter \xe0 un fichier de configuration local sp\xe9cifique \xe0 votre projet \xe0 la racine. Cr\xe9ez le fichier ",(0,r.jsx)(n.code,{children:"sonar-project.properties"})," :"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-properties",children:"sonar.host.url=http://prod.local:9000\r\nsonar.projectKey=devops-project-samples\r\nsonar.projectName=devops-project-samples\r\nsonar.login=sqa_8f117f6e6633bb15a069fd78920cb35fd4325273\r\nsonar.java.binaries=target/classes\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Ex\xe9cutez la commande ",(0,r.jsx)(n.code,{children:"sonar-scanner"})," pour tester :"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104215823858",src:s(4058).Z+"",width:"810",height:"506"})}),"\n",(0,r.jsxs)(n.p,{children:["\xc0 la fin de l'ex\xe9cution, vous obtiendrez le m\xeame r\xe9sultat \"ANALYSIS SUCCESSFUL\" qu'avec la commande ",(0,r.jsx)(n.code,{children:"mvn sonar:sonar"}),"."]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20240104220545143",src:s(8435).Z+"",width:"904",height:"302"})}),"\n",(0,r.jsx)(n.p,{children:"En r\xe9sum\xe9, nous avons vu deux m\xe9thodes pour lancer le Sonar Scanner !"})]})}function u(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},2392:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/architecture-scanning-b9c9f7ed76ccabf35bfc6daf861a69ea.png"},1687:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240103142358842-4eef1b68d0f8728073ac0c293247b2e5.png"},5163:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240103171232209-7db48bef51a68cd736ba542c799f2698.png"},6510:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240103213134152-f19893ea87bb53fd6635480e9d9ac45e.png"},7820:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240103213324833-78aaa314e09f8ab90d8402df17561254.png"},4659:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240103215223881-16823e8e210d75140bba26358f71d9c4.png"},204:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240103220643041-987ec642d6eb14b67a7e2f46a32920c9.png"},6460:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240103221145556-f303385ea9f346be8ef3ead29ca92cc1.png"},535:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240103222758684-b91ec4d99f1af8ed84be2d8b95d94a58.png"},1989:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104011934964-a9789c7e2bab68cf51362ed7763e26b3.png"},6331:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104012858405-bc9ea6aa12c852b7873a00da668b496a.png"},1585:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104021618002-0d6e3ff6ee586d2b60f4c7e5b74991d3.png"},9848:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104022033120-cdff2d7cd0aaf44eabe2b0e6e574e53b.png"},5074:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104023853532-b39d40d0b97914e8f32ba59cfeba7797.png"},1241:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104190002292-771258740f2aac747f174b7227d5a68c.png"},8262:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104193956295-c324aa04e79c65006f79f02a00ea3f26.png"},7535:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104194427580-34f801151f627f12be5b12162027cc12.png"},3228:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104195859997-113066d992ecd7ec86ab64d97556f865.png"},144:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104214723339-f0528dc60ed6bd9f9e5d2e4366f6f92f.png"},4058:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104215823858-0c2a6f2ef91ace3d8aa5e1710231d7e9.png"},8435:(e,n,s)=>{s.d(n,{Z:()=>r});const r=s.p+"assets/images/image-20240104220545143-6bd73cb2134fda0379c2506812501a0f.png"},1151:(e,n,s)=>{s.d(n,{Z:()=>o,a:()=>t});var r=s(7294);const a={},i=r.createContext(a);function t(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:t(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);