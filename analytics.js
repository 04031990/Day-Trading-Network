/*
 * DTN click analytics.
 * Add a GA4 Measurement ID (G-...) to the matching meta tag in index.html
 * to enable reporting. With no valid ID, this file sends no analytics data.
 */
const measurementId = document.querySelector('meta[name="ga4-measurement-id"]')?.content.trim() || '';
const validMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId);

if (validMeasurementId) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
    page_location: `${window.location.origin}${window.location.pathname}`
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(tag);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const label = (link.innerText || link.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    let eventName = 'link_click';
    let destination = 'other';
    let section = '';

    if (href.startsWith('#')) {
      section = href.slice(1) || 'top';
      eventName = link.closest('nav') ? 'nav_section_click' : 'internal_section_click';
    } else if (href.includes('discord.gg')) {
      eventName = 'discord_click';
      destination = 'discord';
    } else if (href.includes('youtube.com')) {
      eventName = 'youtube_click';
      destination = 'youtube';
    } else if (href.includes('facebook.com')) {
      eventName = 'facebook_click';
      destination = 'facebook';
    } else if (/^https?:/i.test(href)) {
      eventName = 'outbound_link_click';
      destination = 'external';
    }

    window.gtag('event', eventName, {
      link_label: label,
      destination,
      section,
      page_path: window.location.pathname
    });
  });
}
