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
    posthog: {
      apiKey: process.env.POSTHOG_API_KEY ?? '',
      appUrl: 'https://app.posthog.com',
      enableInDevelopment: false
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false
    },
    navbar: {
      title: 'Docs',
      style: 'dark',
      logo: {
        alt: 'PureSkill.gg',
        src: 'https://csgo.cdn.pureskill.app/static/media/logo.1f05cf872108db3584aac879e4c48cef.svg',
        width: 202,
        height: 23
      },
      items: [
        {
          href: 'https://github.com/pureskillgg/docs',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'PureSkill.gg',
        src: 'https://csgo.cdn.pureskill.app/static/media/logo.1f05cf872108db3584aac879e4c48cef.svg',
        width: 202,
        height: 23
      },
      copyright: `Copyright © 2019-${new Date().getFullYear()} FPS Critic, Inc.`,
      links: [
        {
          label: 'PureSkill.gg',
          to: 'https://pureskill.gg'
        },
        {
          label: 'GitHub',
          to: 'https://github.com/pureskillgg'
        },
        {
          label: 'Discord',
          to: 'https://pureskill.gg/discord'
        },
        {
          label: 'Contact',
          to: 'mailto:contact@pureskill.gg'
        }
      ]
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          editUrl: 'https://github.com/pureskillgg/docs/tree/master/'
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
