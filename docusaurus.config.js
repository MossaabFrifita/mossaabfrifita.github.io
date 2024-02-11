// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Bienvenue dans Mon Blog Personnel',
  tagline: "Passionné d'informatique depuis ma plus tendre enfance, mon objectif principal est de fournir un contenu professionnel, accessible et enrichissant pour tous, tout en partageant avec vous mon expérience et mes connaissances dans le domaine.",
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://mossaabfrifita.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'MossaabFrifita', // Usually your GitHub org/user name.
  projectName: 'mossaabfrifita.github.io', // Usually your repo name.
  deploymentBranch: 'main',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Mossaab',
        logo: {
          alt: 'My Site Logo',
          src: 'img/custom-logo.jpg',
        },
        items: [
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/docs/category/devops', label: 'DevOps', position: 'left'},
          {to: '/docs/category/spring-framework', label: 'Spring', position: 'left'},
          {to: '/docs/category/angular', label: 'Angular', position: 'left'},
         
          {
            href: 'https://github.com/MossaabFrifita',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Articles',
                to: '/docs/category/devops',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/mossaab-frifita-17ba44138',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/MossaabFrifita',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Mossaab Frifita. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
