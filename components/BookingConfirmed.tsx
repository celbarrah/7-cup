'use client';

import { useEffect } from 'react';
import { trackBookingOnce } from '@/lib/track';

/**
 * Runs on the thank-you page:
 *  1. If the booking widget redirected *inside its iframe*, lift the page out to the full window.
 *  2. Fire the booking conversion (GA4 + Meta Schedule on both pixels) unless the widget's
 *     confirmation message already did it this session.
 */
export default function BookingConfirmed() {
  useEffect(() => {
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = window.location.href;
        return;
      }
    } catch {
      /* cross-origin parent — stay put */
    }
    return trackBookingOnce('thank-you');
  }, []);

  return null;
}
