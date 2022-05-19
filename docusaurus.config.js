const config = {
  title: 'PureSkill.gg Docs',
  tagline: 'Beep Boop.',
  url: 'https://docs.pureskill.gg',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/'
        },
        blog: false
      }
    ]
  ]
}

module.exports = config
