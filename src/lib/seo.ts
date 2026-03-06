import { SITE_URL } from '@/constants/env'

const BASE_URL = SITE_URL || 'https://anshori.com'
const SITE_NAME = 'Achmad Anshori'
const DEFAULT_DESCRIPTION = 'Software Engineer based in Jakarta, Indonesia.'
const TWITTER_HANDLE = '@20arik_'

type PageMetaOptions = {
  title?: string
  description?: string
  path?: string
  ogTitle?: string
  ogDescription?: string
  ogSubtitle?: string
  noindex?: boolean
}

type PageMeta = {
  meta: Array<Record<string, string>>
  links: Array<Record<string, string>>
}

export function createPageMeta(options: PageMetaOptions = {}): PageMeta {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    path = '/',
    ogTitle,
    ogDescription,
    ogSubtitle,
    noindex = false,
  } = options

  const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME
  const pageUrl = `${BASE_URL}${path}`

  const ogImageParams = new URLSearchParams()
  if (title) ogImageParams.set('title', ogTitle ?? title)
  if (ogSubtitle) ogImageParams.set('subtitle', ogSubtitle)
  const ogImageUrl = ogImageParams.size
    ? `${BASE_URL}/api/og?${ogImageParams.toString()}`
    : `${BASE_URL}/api/og`

  const meta: Array<Record<string, string>> = [
    { title: fullTitle },
    { name: 'description', content: ogDescription ?? description },
    ...(noindex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    { property: 'og:title', content: ogTitle ?? fullTitle },
    { property: 'og:description', content: ogDescription ?? description },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: ogImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:site_name', content: SITE_NAME },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: TWITTER_HANDLE },
    { name: 'twitter:creator', content: TWITTER_HANDLE },
    { name: 'twitter:title', content: ogTitle ?? fullTitle },
    { name: 'twitter:description', content: ogDescription ?? description },
    { name: 'twitter:image', content: ogImageUrl },
    { name: 'twitter:url', content: pageUrl },
  ]

  const links: Array<Record<string, string>> = [
    { rel: 'canonical', href: pageUrl },
  ]

  return { meta, links }
}
