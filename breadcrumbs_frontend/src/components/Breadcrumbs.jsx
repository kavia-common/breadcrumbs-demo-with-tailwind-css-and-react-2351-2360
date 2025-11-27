import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs component renders a navigational breadcrumb trail.
 * Props:
 * - items: Array<{ label: string, href?: string, current?: boolean }>
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center text-sm text-gray-600">
        {items.map((item, idx) => {
          const isCurrent = !!item.current;
          const isLink = !!item.href && !isCurrent;

          return (
            <li key={`${item.label}-${idx}`} className="flex items-center">
              {idx !== 0 && (
                <span className="mx-2 text-gray-300" aria-hidden="true">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
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
                  className="text-primary hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
