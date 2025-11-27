import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs component renders a navigational breadcrumb trail.
 * Props:
 * - items: Array<{ label: string, href?: string, current?: boolean }>
 * 
 * Icons:
 * - Home: house icon
 * - Products: tag/boxes icon
 * - Mobile: device/mobile icon
 * 
 * Accessibility:
 * - Icons are decorative (aria-hidden="true")
 * - Links include title for tooltip and aria-label
 * - Non-links (current crumb) use aria-current="page"
 */
export default function Breadcrumbs({ items = [] }) {
  // Choose an icon based on label. Icons are purely decorative here.
  const getIconFor = (label) => {
    const normalized = String(label || '').toLowerCase();
    if (normalized === 'home') {
      // Home icon
      return (
        <svg
          className="h-4 w-4 mr-1.5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 9.414V16a2 2 0 002 2h2a1 1 0 001-1v-3a1 1 0 112 0v3a1 1 0 001 1h2a2 2 0 002-2V9.414l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      );
    }
    if (normalized === 'products') {
      // Tag/boxes icon
      return (
        <svg
          className="h-4 w-4 mr-1.5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M2.166 10.083a2 2 0 01.585-1.414l5.918-5.918a2 2 0 011.414-.585H12a2 2 0 012 2v1.917a2 2 0 01-.585 1.414l-5.918 5.918a2 2 0 01-1.414.585H4.75a2.583 2.583 0 01-2.584-2.584v-1.333zM13.5 2a.5.5 0 00-.5.5V4a1 1 0 001 1h1.5a.5.5 0 00.5-.5V3a1 1 0 00-1-1H13.5z" />
        </svg>
      );
    }
    if (normalized === 'mobile') {
      // Mobile/device icon
      return (
        <svg
          className="h-4 w-4 mr-1.5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M7 3a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2H7zm0 2h6v10H7V5zm3 9a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      );
    }
    // Default: no specific icon for other items (Laptop/Tablet/Accessories)
    return null;
  };

  const buildTitle = (label, isCurrent) => {
    const normalized = String(label || '').toLowerCase();
    if (normalized === 'home') return 'Go to Home';
    if (normalized === 'products') return 'View Products';
    if (normalized === 'mobile') return isCurrent ? 'Current page: Mobile' : 'Go to Mobile';
    // Fallback for dynamic items: sensible defaults
    return isCurrent ? `Current page: ${label}` : `Go to ${label}`;
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center text-sm text-gray-600">
        {items.map((item, idx) => {
          const isCurrent = !!item.current;
          const isLink = !!item.href && !isCurrent;
          const icon = getIconFor(item.label);
          const title = buildTitle(item.label, isCurrent);

          return (
            <li key={`${item.label}-${idx}`} className="flex items-center">
              {idx !== 0 && (
                <span className="mx-2 text-gray-300" aria-hidden="true">
                  <svg
                    className="h-4 w-4"
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
                </span>
              )}
              {isLink ? (
                <a
                  href={item.href}
                  className="inline-flex items-center text-primary hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
                  title={title}
                  aria-label={item.label}
                >
                  {icon}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span
                  className={`inline-flex items-center ${isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
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
