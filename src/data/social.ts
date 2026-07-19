export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/geraldo_sense/?hl=pt',
  facebook:
    'https://www.facebook.com/people/Geraldo-De-Assunção/pfbid0ErHCiVJcz4uHW5LSj6CiNvqTPtmWJEPRSA9itdaGkF6CuQ5XW5uHNiunUe1SyRxRl/',
  tiktok: 'https://www.tiktok.com/@geraldo.sense',
} as const;

export type SocialPlatform = keyof typeof SOCIAL_LINKS;

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram — Geraldo Sense',
  facebook: 'Facebook — Geraldo De Assunção',
  tiktok: 'TikTok — Geraldo Sense',
};
