import type { Testimonial } from '@/components/Testimonials';
import type { Dict } from '@/lib/i18n';

// Same order as dict.testimonials (tag / quote / role are translated there)
const BASE = [
  { playbackId: 'nBYa9xvTM02LWuipqqOSVMZwHkLfOS2Ynp2sKxYLxxWo', poster: '/posters/nBYa9x.webp', name: 'Margelos Ele Lorraine' },
  { playbackId: 'zWgLAad5XLeymZXHGOI01RLUU9I3WVvbTsqCpTrMFPMU', poster: '/posters/zWgLAa.webp', name: 'Scott Minto' },
  { playbackId: 'Y9a6PRT2O437PfrpSNy400vsSoo022VWJQU01LK019Txa6Q', poster: '/posters/Y9a6PR.webp', name: 'Sadio Cissé' },
  { playbackId: 'GtBazMfgz1om54NtqL1531ErJ3GV4hNQxEyPJRJQIX8', poster: '/posters/GtBazM.webp', name: 'Sébastien Teychenne' },
  { playbackId: 'ew5lUSaxtinfYQQ6PLIp00WOemrJyMS6VjoKaByyZVUI', poster: '/posters/ew5lUS.webp', name: 'Amal Jouane' },
];

export const getTestimonials = (t: Dict): Testimonial[] => BASE.map((b, i) => ({ ...b, ...t.testimonials[i] }));
