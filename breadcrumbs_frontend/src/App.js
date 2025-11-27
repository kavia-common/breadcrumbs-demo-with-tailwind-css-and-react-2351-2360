import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';
import Breadcrumbs from './components/Breadcrumbs';

/**
 * PUBLIC_INTERFACE
 * App renders a centered card with Breadcrumbs and simple hash-based navigation.
 * - Pages: "/", "/products", "/products/mobile"
 * - Uses Ocean Professional theme via Tailwind classes
 * - Includes a small footer showing env var presence (masked)
 */
function App() {
  const routes = useMemo(
    () => ({
      '/': { title: 'Home', description: 'Welcome to the homepage.' },
      '/products': { title: 'Products', description: 'Explore our product categories.' },
      '/products/mobile': { title: 'Mobile', description: 'Discover our mobile devices and accessories.' },
    }),
    []
  );

  const normalizeHash = (hash) => {
    const cleaned = hash.replace(/^#/, '');
    return cleaned || '/';
  };

  const [path, setPath] = useState(() => normalizeHash(window.location.hash) || '/');

  useEffect(() => {
    const onHashChange = () => {
      const next = normalizeHash(window.location.hash);
      setPath(next);
    };
    window.addEventListener('hashchange', onHashChange);
    // Initialize if empty
    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      onHashChange();
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to) => {
    if (normalizeHash(window.location.hash) !== to) {
      window.location.hash = `#${to}`;
    }
  };

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: 'Home', href: '#/', current: false },
      { label: 'Products', href: '#/products', current: false },
      { label: 'Mobile', href: undefined, current: false },
    ];
    if (path === '/') {
      items[0].href = undefined;
      items[0].current = true;
    } else if (path === '/products') {
      items[1].href = undefined;
      items[1].current = true;
    } else {
      // default to mobile page as per demo
      items[2].current = true;
    }
    return items;
  }, [path]);

  const currentPage = routes[path] || routes['/products/mobile'];

  // PUBLIC_INTERFACE
  const masked = (val) => {
    if (!val) return 'unset';
    const s = String(val);
    return s.length > 4 ? `${s.slice(0, 4)}…` : s;
  };

  const envInfo = [
    'REACT_APP_API_BASE',
    'REACT_APP_BACKEND_URL',
    'REACT_APP_FRONTEND_URL',
    'REACT_APP_WS_URL',
    'REACT_APP_NODE_ENV',
    'REACT_APP_NEXT_TELEMETRY_DISABLED',
    'REACT_APP_ENABLE_SOURCE_MAPS',
    'REACT_APP_PORT',
    'REACT_APP_TRUST_PROXY',
    'REACT_APP_LOG_LEVEL',
    'REACT_APP_HEALTHCHECK_PATH',
    'REACT_APP_FEATURE_FLAGS',
    'REACT_APP_EXPERIMENTS_ENABLED',
  ].map((key) => ({
    key,
    value: masked(process.env[key]),
  }));

  return (
    <div className="min-h-screen bg-ocean-gradient">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto rounded-xl shadow-sm bg-surface text-text ring-1 ring-gray-100">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <Breadcrumbs
                items={breadcrumbItems.map((item) => ({
                  ...item,
                  // Intercept clicks to manage navigation without reload
                  href: item.href,
                }))}
              />
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{currentPage.title}</h1>
            <p className="text-gray-600">{currentPage.description}</p>

            <div className="mt-6 flex gap-3">
              <a
                href="#/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition"
              >
                Home
              </a>
              <a
                href="#/products"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/products');
                }}
                className="inline-flex items-center rounded-md border border-primary/20 text-primary px-3 py-1.5 bg-white hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition"
              >
                Products
              </a>
              <a
                href="#/products/mobile"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/products/mobile');
                }}
                className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition"
              >
                Mobile
              </a>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50 p-4 rounded-b-xl">
            <div className="text-xs text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {envInfo.map(({ key, value }) => (
                <div key={key} className="flex justify-between gap-2">
                  <span className="font-medium">{key}</span>
                  <span className="font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sr-only">
          {/* Instructions for keyboard users: tab to breadcrumb links and observe ring focus styles */}
          Use Tab to focus breadcrumb links and observe visible focus rings.
        </div>
      </div>
    </div>
  );
}

export default App;
