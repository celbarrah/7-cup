'use client';

import { useEffect } from 'react';
import { onFirstInteraction } from '@/lib/defer';
import { GA_ID, LINKEDIN_PARTNER_ID, META_PIXEL_ID } from '@/lib/config';

type W = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
  _fbq?: unknown;
  _linkedin_partner_id?: string;
  _linkedin_data_partner_ids?: string[];
};

const addScript = (src: string) => {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
};

/**
 * GA4, Meta Pixel and LinkedIn Insight — injected on the visitor's first interaction,
 * or 5s after hydration at the latest, so every visit (including bounces) is still counted
 * while none of the ~300KB of tag code competes with the first render.
 */
export default function Analytics() {
  useEffect(() => {
    return onFirstInteraction(() => {
      const w = window as W;

      // Google Analytics 4
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
      w.gtag('js', new Date());
      w.gtag('config', GA_ID);
      addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);

      // Meta Pixel (standard bootstrap, queues calls until fbevents.js arrives)
      if (!w.fbq) {
        const fbq = function (...args: unknown[]) {
          if (fbq.callMethod) fbq.callMethod(...args);
          else fbq.queue!.push(args);
        } as NonNullable<W['fbq']>;
        fbq.queue = [];
        fbq.loaded = true;
        fbq.version = '2.0';
        fbq.push = fbq;
        w.fbq = fbq;
        w._fbq = fbq;
        addScript('https://connect.facebook.net/en_US/fbevents.js');
      }
      w.fbq('init', META_PIXEL_ID);
      w.fbq('track', 'PageView');

      // LinkedIn Insight
      w._linkedin_partner_id = LINKEDIN_PARTNER_ID;
      w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || [];
      w._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);
      addScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
    }, 5000);
  }, []);

  return null;
}
