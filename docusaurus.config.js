const config = {
  title: 'PureSkill.gg Docs',
  tagline: 'Beep Boop.',
  url: 'https://docs.pureskill.gg',
  baseUrl: '/',
  favicon: 'https://csgo.cdn.pureskill.app/17.2.0/favicon.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/'
        },
        blog: false,
        theme: {
          customCss: [require.resolve('./src/css/custom.css')]
        }
      }
    ]
  ]
}

module.exports = config
