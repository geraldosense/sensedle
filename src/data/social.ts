export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/geralsense',
  facebook: 'https://www.facebook.com/geralsense',
  tiktok: 'https://www.tiktok.com/@geralsense',
} as const;

export type SocialPlatform = keyof typeof SOCIAL_LINKS;

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram — Geral Sense',
  facebook: 'Facebook — Geral Sense',
  tiktok: 'TikTok — Geral Sense',
};
