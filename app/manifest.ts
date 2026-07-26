import type { MetadataRoute } from 'next'
import { profile } from '@/content/profile'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} - ${profile.title}`,
    short_name: profile.name,
    description: `${profile.title} targeting ${profile.targetRole} roles.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#5b4fe0',
    icons: [
      { src: '/icon/192', sizes: '192x192', type: 'image/png' },
      { src: '/icon/512', sizes: '512x512', type: 'image/png' },
    ],
  }
}
