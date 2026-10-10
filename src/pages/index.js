import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'

import { channels, index } from '../data/csds-channels'

import styles from './index.module.css'

const cx = (...names) => names.filter(Boolean).join(' ')

const productPage =
  'https://aws.amazon.com/marketplace/pp/prodview-v3o7zrt6okwmo'
const tutorial =
  'https://github.com/pureskillgg/makenew-pyskill/blob/master/README.rst#-start-with-the-tutorial'
const quickstart = '/datascience/adx/cs2/csds/quickstart'
const dsdk = 'https://github.com/pureskillgg/dsdk'
const discord = 'https://pureskill.gg/discord'

const stats = [
  ['Daily', 'a new revision every day'],
  ['1 to 2 years', 'of daily revisions kept'],
  ['42', 'channels per match, all Parquet'],
  ['$0', 'for the data; you pay AWS for storage']
]

const steps = [
  {
    title: 'Subscribe on AWS',
    body: 'Request the free data set on AWS Data Exchange and tell us about your project. Approval takes a few days.',
    label: 'Product page',
    to: productPage
  },
  {
    title: 'Follow the Quickstart',
    body: 'Export a day to S3, load a match in Python and run a first query over the day, step by step.',
    label: 'Quickstart',
    to: quickstart
  },
  {
    title: 'Build a tome',
    body: 'Slice the features you need across many matches into a small table you can keep around.',
    label: 'DSDK',
    to: dsdk
  }
]

const explore = [
  {
    title: 'CSDS Spec',
    body: 'Every channel and column, with types and units.',
    to: '/datascience/adx/cs2/csds/spec'
  },
  {
    title: 'Enums',
    body: 'What the codes mean: teams, win reasons, weapons, hit groups, ranks.',
    to: '/datascience/adx/cs2/csds/enums'
  },
  {
    title: 'Changelog',
    body: 'Every change to the data since CS2 began, by date and by channel.',
    to: '/datascience/adx/cs2/csds/changelog'
  },
  {
    title: 'Getting the Data',
    body: 'Daily revisions, exporting, the file layout and the index object.',
    to: '/datascience/adx/cs2/csds/getting-the-data'
  },
  {
    title: 'PII Removal',
    body: 'What is removed or replaced before a match is published.',
    to: '/datascience/adx/cs2/csds/pii-removal'
  },
  {
    title: 'FAQ',
    body: 'Who can use it, the license, and how long data is kept.',
    to: '/datascience/'
  },
  {
    title: 'Cost guide',
    body: 'Sizes per match and per day, and how to keep the AWS bill small.',
    to: '/datascience/#cost-faq'
  },
  {
    title: 'Showcase',
    body: 'Animations, heatmaps and analyses made with the data.',
    to: '/datascience/showcase/'
  },
  {
    title: 'Tutorial',
    body: "A longer course and a project skeleton. It was written for older data, and parts of it don't work with the data published now.",
    to: tutorial
  }
]

const showcase = [
  [
    'Meeting points',
    'animation',
    'https://www.youtube.com/watch?v=du0CXuuaQZ8'
  ],
  [
    'Smoke grenade analysis',
    'presentation',
    'https://www.youtube.com/watch?v=YNO2pRr-RO8'
  ],
  [
    'Bomb plant frequency',
    'heatmap',
    'https://www.instagram.com/p/B717EBqhz-0/'
  ],
  [
    "35% of players in silver don't buy anything on the first round",
    'graphic',
    'https://www.reddit.com/r/csgo/comments/iun0l8/35_of_players_in_silver_dont_buy_anything_on_the/'
  ]
]

const legend = [
  ['index', 'index'],
  ['telemetry', 'telemetry, every tick'],
  ['event', 'events'],
  ['info', 'match and player info']
]

function Hero() {
  return (
    <header className={styles.hero}>
      <div className='container'>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>
            Free · Updated daily · Non-commercial use
          </p>
          <h1 className={styles.title}>
            Every tick of real <span className={styles.accent}>CS2</span>{' '}
            matches, free for research.
          </h1>
          <p className={styles.lead}>
            Competitive Counter-Strike 2 matches from matchmaking and FACEIT,
            parsed from the demos into Parquet: every player&apos;s position and
            view angle, every kill, grenade and round event. A new revision
            lands on AWS Data Exchange every day, with names, Steam IDs and chat
            removed or replaced.
          </p>
          <div className={styles.buttons}>
            <Link
              className='button button--primary button--lg'
              to={productPage}
            >
              Get the data →
            </Link>
            <Link
              className='button button--outline button--primary button--lg'
              to={quickstart}
            >
              Start with the Quickstart
            </Link>
            <Link
              className='button button--outline button--secondary button--lg'
              to='/datascience/adx/cs2/csds/spec'
            >
              Read the spec
            </Link>
          </div>
        </div>
        <MatchObjects />
      </div>
    </header>
  )
}

function MatchObjects() {
  const tiles = [{ ...index, kind: 'index' }, ...channels]
  return (
    <section className={styles.match} aria-labelledby='match-objects'>
      <div className={styles.matchHead}>
        <h2 id='match-objects' className={styles.matchTitle}>
          One match = {tiles.length} objects
        </h2>
        <ul className={styles.legend}>
          {legend.map(([kind, label]) => (
            <li key={kind}>
              <span className={cx(styles.swatch, styles[kind])} />
              {label}
            </li>
          ))}
        </ul>
      </div>
      <ul className={styles.tiles}>
        {tiles.map(({ name, kind, to }) => (
          <li key={name}>
            <Link className={cx(styles.tile, styles[kind])} to={to}>
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Stats() {
  return (
    <section className={styles.stats}>
      <div className={cx('container', styles.statsGrid)}>
        {stats.map(([value, label]) => (
          <div key={value} className={styles.stat}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Section({ title, children }) {
  return (
    <section className={cx('container', styles.section)}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <Layout
      title='Free CS2 match data for research'
      description='Free, tick-level Counter-Strike 2 match data on AWS Data Exchange: every player position, view angle, kill, grenade and round event, published daily.'
    >
      <Hero />
      <main>
        <Stats />

        <Section title='Start in three steps'>
          <div className={styles.grid3}>
            {steps.map(({ title, body, label, to }, i) => (
              <Link key={title} className={styles.card} to={to}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className={styles.more}>{label} →</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section title='Explore the docs'>
          <div className={styles.grid3}>
            {explore.map(({ title, body, to }) => (
              <Link key={title} className={styles.card} to={to}>
                <h3>{title}</h3>
                <p>{body}</p>
              </Link>
            ))}
          </div>
        </Section>

        <Section title='Made with the data'>
          <ul className={styles.showcase}>
            {showcase.map(([title, kind, href]) => (
              <li key={title}>
                <Link to={href}>{title}</Link> ({kind})
              </li>
            ))}
          </ul>
        </Section>

        <section className='container'>
          <div className={styles.cta}>
            <div>
              <h2>Built something with it?</h2>
              <p>
                Show us on Discord; we feature community work in the Showcase.
              </p>
            </div>
            <Link className='button button--primary button--lg' to={discord}>
              Join the Discord →
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
