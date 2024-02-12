"use strict";(self.webpackChunkmy_blog=self.webpackChunkmy_blog||[]).push([[7189],{8549:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>a,contentTitle:()=>r,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>u});var i=n(5893),t=n(1151);const o={sidebar_position:1,tags:["DevOps","CI/CD","pipeline","Jenkins","Ansible","SonarQube","Nexus 3","Docker","Spring","Java"]},r=void 0,l={id:"devops/Ce que vous apprendrez",title:"Ce que vous apprendrez",description:"Dans ce cours, vous apprendrez \xe0 mettre en place un pipeline CI/CD DevOps complet dans un environnement Windows/Linux. Vous utiliserez des outils essentiels tels que Jenkins, SonarQube, Nexus, Docker et Ansible pour automatiser et am\xe9liorer votre processus de d\xe9veloppement logiciel.",source:"@site/docs/devops/Ce que vous apprendrez.md",sourceDirName:"devops",slug:"/devops/Ce que vous apprendrez",permalink:"/docs/devops/Ce que vous apprendrez",draft:!1,unlisted:!1,tags:[{label:"DevOps",permalink:"/docs/tags/dev-ops"},{label:"CI/CD",permalink:"/docs/tags/ci-cd"},{label:"pipeline",permalink:"/docs/tags/pipeline"},{label:"Jenkins",permalink:"/docs/tags/jenkins"},{label:"Ansible",permalink:"/docs/tags/ansible"},{label:"SonarQube",permalink:"/docs/tags/sonar-qube"},{label:"Nexus 3",permalink:"/docs/tags/nexus-3"},{label:"Docker",permalink:"/docs/tags/docker"},{label:"Spring",permalink:"/docs/tags/spring"},{label:"Java",permalink:"/docs/tags/java"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["DevOps","CI/CD","pipeline","Jenkins","Ansible","SonarQube","Nexus 3","Docker","Spring","Java"]},sidebar:"tutorialSidebar",previous:{title:"DevOps CI/CD pipeline",permalink:"/docs/category/devops-cicd-pipeline"},next:{title:"Cr\xe9ez votre environnement de travail",permalink:"/docs/devops/Cr\xe9ez votre environnement de travail"}},a={},u=[{value:"\xc0 qui ce cours s&#39;adresse-t-il ?",id:"\xe0-qui-ce-cours-sadresse-t-il-",level:2},{value:"Contexte du projet",id:"contexte-du-projet",level:2},{value:"D\xe9couvrez les outils utilis\xe9s",id:"d\xe9couvrez-les-outils-utilis\xe9s",level:2},{value:"D\xe9couvrez le fonctionnement de ce cours",id:"d\xe9couvrez-le-fonctionnement-de-ce-cours",level:2},{value:"Pr\xe9requis",id:"pr\xe9requis",level:2},{value:"Architecture technique du projet",id:"architecture-technique-du-projet",level:2},{value:"Liens vers les Projets Utilis\xe9s",id:"liens-vers-les-projets-utilis\xe9s",level:2}];function c(e){const s={a:"a",h2:"h2",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.p,{children:"Dans ce cours, vous apprendrez \xe0 mettre en place un pipeline CI/CD DevOps complet dans un environnement Windows/Linux. Vous utiliserez des outils essentiels tels que Jenkins, SonarQube, Nexus, Docker et Ansible pour automatiser et am\xe9liorer votre processus de d\xe9veloppement logiciel."}),"\n",(0,i.jsx)(s.h2,{id:"\xe0-qui-ce-cours-sadresse-t-il-",children:"\xc0 qui ce cours s'adresse-t-il ?"}),"\n",(0,i.jsx)(s.p,{children:"Ce cours s'adresse aux d\xe9veloppeurs souhaitant int\xe9grer des pratiques DevOps et d'automatisation dans leurs projets de d\xe9veloppement. Que vous soyez d\xe9butant ou exp\xe9riment\xe9, ce cours vous guidera \xe0 travers la mise en place d'un pipeline CI/CD robuste et efficace."}),"\n",(0,i.jsx)(s.h2,{id:"contexte-du-projet",children:"Contexte du projet"}),"\n",(0,i.jsx)(s.p,{children:"Avant de commencer, voici un peu de contexte pour comprendre l'objectif de ce cours. Vous d\xe9veloppez une API Java Spring Boot et souhaitez la d\xe9ployer sur diff\xe9rents environnements en suivant la d\xe9marche DevOps. L'objectif est de profiter des avantages de l'int\xe9gration continue et de la livraison/d\xe9ploiement continu :  fluidit\xe9 du travail entre les dev et les ops, rapidit\xe9 d\u2019int\xe9gration, flexibilit\xe9, rapidit\xe9 d\u2019it\xe9ration\u2026"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"L'int\xe9gration continue"})," implique la g\xe9n\xe9ration et le test automatiques du code \xe0 chaque modification du code source d'une application."]}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"La livraison continue"})," \xe9tend ce concept en assurant que les d\xe9veloppeurs disposent en permanence d'un artefact de g\xe9n\xe9ration pr\xeat pour le d\xe9ploiement. Ainsi, l'application est pr\xe9par\xe9e pour \xeatre d\xe9ploy\xe9e manuellement en production \xe0 tout moment."]}),"\n",(0,i.jsxs)(s.p,{children:["Quant au ",(0,i.jsx)(s.strong,{children:"d\xe9ploiement continu"}),", il repr\xe9sente une extension de la livraison continue, permettant un d\xe9ploiement automatis\xe9 de l'application. Cependant, ce processus n\xe9cessite que toutes les \xe9tapes soient valid\xe9es avant d'effectuer le d\xe9ploiement."]}),"\n",(0,i.jsx)(s.h2,{id:"d\xe9couvrez-les-outils-utilis\xe9s",children:"D\xe9couvrez les outils utilis\xe9s"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Docker"})," : Docker est un syst\xe8me de conteneurisation utilis\xe9 pour encapsuler l'application Spring Boot dans un environnement isol\xe9. Cette approche facilite le d\xe9ploiement de l'application sur diff\xe9rents environnements."]}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"SonarQube"})," : SonarQube est une plateforme d'analyse statique de code qui \xe9value la qualit\xe9 du code source d'un projet. Elle identifie les probl\xe8mes de qualit\xe9, les vuln\xe9rabilit\xe9s de s\xe9curit\xe9 et les erreurs de programmation, tout en proposant des recommandations pour am\xe9liorer la lisibilit\xe9, la maintenabilit\xe9 et la fiabilit\xe9 du code. Dans notre pipeline CI/CD, SonarQube nous permet de mesurer en continu la qualit\xe9 du code source."]}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Jenkins"})," : Jenkins est un outil d'int\xe9gration continue open-source largement utilis\xe9 dans le d\xe9veloppement logiciel. Il est utilis\xe9 pour cr\xe9er notre pipeline CI/CD."]}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Nexus 3 Repository"})," : Nexus est un gestionnaire de d\xe9p\xf4ts qui centralise la gestion de tous les artefacts g\xe9n\xe9r\xe9s et utilis\xe9s par les logiciels de l\u2019organisation."]}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Ansible"})," : Ansible est un outil d'automatisation informatique qui permet de configurer des syst\xe8mes, de d\xe9ployer des logiciels et d'orchestrer des t\xe2ches informatiques avanc\xe9es, telles que les d\xe9ploiements continus. Dans ce cours, nous l'utilisons pour d\xe9ployer de mani\xe8re continue l'application dans les environnements cibles."]}),"\n",(0,i.jsx)(s.h2,{id:"d\xe9couvrez-le-fonctionnement-de-ce-cours",children:"D\xe9couvrez le fonctionnement de ce cours"}),"\n",(0,i.jsx)(s.p,{children:"Dans cette section, nous explorerons chaque outil de mani\xe8re isol\xe9e afin de comprendre en d\xe9tail son fonctionnement. Chaque outil, y compris Jenkins, Nexus, SonarQube et Ansible, sera pr\xe9sent\xe9 individuellement. Nous examinerons en profondeur leurs fonctionnalit\xe9s, leur configuration et leur utilisation dans le contexte de notre cours, en mettant particuli\xe8rement l'accent sur leur int\xe9gration facile avec Jenkins. Cette approche vous permettra de vous familiariser pleinement avec chaque aspect, en vous fournissant les connaissances n\xe9cessaires pour tirer pleinement parti de ces outils dans vos propres projets, en particulier dans la mise en place de votre pipeline CI/CD."}),"\n",(0,i.jsx)(s.h2,{id:"pr\xe9requis",children:"Pr\xe9requis"}),"\n",(0,i.jsx)(s.p,{children:"Je vous recommande d'avoir quelques connaissances sur Git, de savoir utiliser des conteneurs comme Docker et d'avoir des notions de base sur le syst\xe8me Linux. Bien qu'elles ne soient pas obligatoires, ces comp\xe9tences vous seront utiles !"}),"\n",(0,i.jsx)(s.p,{children:"De plus,Il est conseill\xe9 d'avoir un ordinateur disposant d'au moins 16 Go de RAM pour assurer des performances optimales lors de l'ex\xe9cution des outils et des processus d\xe9crits dans ce cours."}),"\n",(0,i.jsx)(s.h2,{id:"architecture-technique-du-projet",children:"Architecture technique du projet"}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.img,{src:n(5462).Z+"",width:"911",height:"821"})}),"\n",(0,i.jsx)(s.h2,{id:"liens-vers-les-projets-utilis\xe9s",children:"Liens vers les Projets Utilis\xe9s"}),"\n",(0,i.jsx)(s.p,{children:"Voici les liens GitHub des projets utilis\xe9s dans ce cours :"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:(0,i.jsx)(s.a,{href:"https://github.com/MossaabFrifita/devops-jenkins-ci-cd",children:"devops-project-samples"})}),"\n",(0,i.jsx)(s.li,{children:(0,i.jsx)(s.a,{href:"https://github.com/MossaabFrifita/devops-ansible-deployment",children:"devops-ansible-deployment"})}),"\n"]})]})}function d(e={}){const{wrapper:s}={...(0,t.a)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},5462:(e,s,n)=>{n.d(s,{Z:()=>i});const i=n.p+"assets/images/cicd-arch.drawio-00d50d890ae1bdfe6f32a00bef5d172a.png"},1151:(e,s,n)=>{n.d(s,{Z:()=>l,a:()=>r});var i=n(7294);const t={},o=i.createContext(t);function r(e){const s=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),i.createElement(o.Provider,{value:s},e.children)}}}]);