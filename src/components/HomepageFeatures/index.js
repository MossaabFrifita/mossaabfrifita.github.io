import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Spring Framework',
    Svg: require('@site/static/img/spring.svg').default,
    description: (
      <>
      Explorez mes articles et tutoriels sur le développement avec Spring Framework. Maîtrisez la création d'applications Java robustes et évolutives.

      </>
    ),
  },
  {
    title: 'DevOps',
    Svg: require('@site/static/img/devops-2.svg').default,
    description: (
      <>
      Plongez dans le monde du DevOps avec mes retours d'expérience sur l'intégration continue, le déploiement automatisé et la gestion efficace des infrastructures.

      </>
    ),
  },
  {
    title: 'Angular Framework',
    Svg: require('@site/static/img/angular2.svg').default,
    description: (
      <>
      Découvrez mes expériences avec le framework Angular. De la création de composants réutilisables à la navigation avancée, suivez mes astuces et meilleures pratiques.

      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
