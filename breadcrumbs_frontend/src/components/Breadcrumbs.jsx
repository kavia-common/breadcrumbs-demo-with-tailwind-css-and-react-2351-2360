import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs component renders a navigational breadcrumb trail.
 * Props:
 * - items: Array<{ label: string, href?: string, current?: boolean }>
 *
 * Icons:
 * - Home: house icon
 * - Products: grid/box icon
 * - Mobile: device/mobile icon
 * - Laptop: laptop icon
 * - Tablet: tablet icon
 * - Accessories: tag/plug icon
 * - Fallback: generic dot icon
 *
 * Accessibility:
 * - Icons are decorative (aria-hidden="true")
 * - Links include title for tooltip and aria-label
 * - Non-links (current crumb) use aria-current="page"
 */
export default function Breadcrumbs({ items = [] }) {
  // PUBLIC_INTERFACE
  // Choose an icon based on label. Icons are purely decorative here.
  const getIconFor = (label) => {
    const normalized = String(label || '').toLowerCase();
    const baseIconClass = 'h-4 w-4 mr-1.5 text-gray-400';

    switch (normalized) {
      case 'home':
        // Home icon
        return (
          <svg
            className={baseIconClass}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 9.414V16a2 2 0 002 2h2a1 1 0 001-1v-3a1 1 0 112 0v3a1 1 0 001 1h2a2 2 0 002-2V9.414l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      case 'products':
        // Grid/boxes icon
        return (
          <svg
            className={baseIconClass}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" />
          </svg>
        );
      case 'mobile':
        // Mobile/device icon
        return (
          <svg
            className={baseIconClass}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M7 3a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2H7zm0 2h6v10H7V5zm3 9a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        );
      case 'laptop':
        // Laptop icon
        return (
          <svg
            className={baseIconClass}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v7H4V6z" />
            <path d="M2 17a1 1 0 011-1h18a1 1 0 011 1v1H2v-1z" />
          </svg>
        );
      case 'tablet':
        // Tablet icon
        return (
          <svg
            className={baseIconClass}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v14h12V5H6zm6 13a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        );
      case 'accessories':
        // Accessories tag/plug icon
        return (
          <svg
            className={baseIconClass}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M7 7a5 5 0 0110 0v4h-2V7a3 3 0 10-6 0v4H7V7z" />
            <path d="M5 11h14a2 2 0 012 2v5a3 3 0 01-3 3H6a3 3 0 01-3-3v-5a2 2 0 012-2zm0 2v5a1 1 0 001 1h12a1 1 0 001-1v-5H5z" />
          </svg>
        );
      default:
        // Fallback generic circle/dot icon to indicate unknown items
        return (
          <svg
            className={baseIconClass}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="10" cy="10" r="3" />
          </svg>
        );
    }
  };

  const buildTitle = (label, isCurrent) => {
    const normalized = String(label || '').toLowerCase();
    if (normalized === 'home') return 'Go to Home';
    if (normalized === 'products') return 'View Products';
    if (normalized === 'mobile')
      return isCurrent ? 'Current page: Mobile' : 'Go to Mobile';
    if (normalized === 'laptop')
      return isCurrent ? 'Current page: Laptop' : 'Go to Laptop';
    if (normalized === 'tablet')
      return isCurrent ? 'Current page: Tablet' : 'Go to Tablet';
    if (normalized === 'accessories')
      return isCurrent ? 'Current page: Accessories' : 'Go to Accessories';
    // Fallback for dynamic items: sensible defaults
    return isCurrent ? `Current page: ${label}` : `Go to ${label}`;
  };

  // Chevron separator icon used between crumbs
  const Chevron = () => (
    <svg
      className="h-4 w-4 text-gray-300"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb">
      {/* Surface background and padding for improved hierarchy */}
      <ol className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-600">
        {items.map((item, idx) => {
          const isCurrent = !!item.current;
          const isLink = !!item.href && !isCurrent;
          const icon = getIconFor(item.label);
          const title = buildTitle(item.label, isCurrent);

          // Pill style base + variants
          const pillBase =
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
          const pillLink =
            'bg-white/70 hover:bg-white text-primary hover:text-secondary ring-1 ring-gray-200 shadow-sm';
          const pillCurrent =
            'bg-primary/10 text-gray-900 ring-1 ring-primary/20 font-semibold';

          return (
            <li key={`${item.label}-${idx}`} className="flex items-center">
              {idx !== 0 && (
                <span className="mx-2 flex items-center" aria-hidden="true">
                  <Chevron />
                </span>
              )}
              {isLink ? (
                <a
                  href={item.href}
                  className={`${pillBase} ${pillLink}`}
                  title={title}
                  aria-label={item.label}
                >
                  {icon}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span
                  className={`${pillBase} ${pillCurrent}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  title={title}
                >
                  {icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
