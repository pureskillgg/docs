// remark-math and rehype-katex are ESM only, so the config is built in an async function
const createConfig = async () => {
  const remarkMath = (await import('remark-math')).default
  const rehypeKatex = (await import('rehype-katex')).default
  return config({ remarkMath, rehypeKatex })
}

const config = ({ remarkMath, rehypeKatex }) => ({
  title: 'PureSkill.gg Docs',
  tagline: 'Free, tick-level Counter-Strike 2 match data for research.',
  url: 'https://docs.pureskill.gg',
  baseUrl: '/',
  favicon: 'https://csgo.cdn.pureskill.app/17.2.0/favicon.ico',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  plugins: [
    [
      'posthog-docusaurus',
      {
        apiKey: process.env.POSTHOG_API_KEY || 'phc_placeholder',
        appUrl: 'https://csgo.pureskill.gg/_ph',
        enableInDevelopment: false
      }
    ]
  ],
  themeConfig: {
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
          to: '/datascience/',
          label: 'Data Science',
          position: 'left'
        },
        {
          to: '/datascience/adx/cs2/csds/spec',
          label: 'CSDS Spec',
          position: 'left'
        },
        {
          to: '/datascience/adx/cs2/csds/changelog',
          label: 'Changelog',
          position: 'left'
        },
        {
          href: 'https://pureskill.gg',
          label: 'Home',
          position: 'right'
        },
        {
          href: 'https://pureskill.gg/discord',
          label: 'Discord',
          position: 'right'
        },
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
          label: 'YouTube',
          to: 'https://www.youtube.com/channel/UCmgWqRfvuX94XwbuN9CEu_A'
        },
        {
          label: 'LinkedIn',
          to: 'https://www.linkedin.com/company/itspureskillgg'
        },
        {
          label: 'Twitter',
          to: 'https://twitter.com/itspureskillgg'
        },
        {
          label: 'Facebook',
          to: 'https://www.facebook.com/itspureskillgg'
        },
        {
          label: 'Instagram',
          to: 'https://www.instagram.com/itspureskillgg'
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
          editUrl: 'https://github.com/pureskillgg/docs/tree/master/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex]
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('katex/dist/katex.min.css')
          ]
        }
      }
    ]
  ]
})

module.exports = createConfig
