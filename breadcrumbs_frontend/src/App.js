import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';
import Breadcrumbs from './components/Breadcrumbs';

/**
 * PUBLIC_INTERFACE
 * App renders a centered card with Breadcrumbs and simple hash-based navigation.
 * - Supports hierarchical routes: "#/", "#/products", and "#/products/:item"
 * - Items examples: mobile, laptop, tablet, accessories
 * - Uses Ocean Professional theme via Tailwind classes
 * - Displays contextual content per page beneath the breadcrumbs
 */
function App() {
  // Allowed product items with labels and simple descriptions
  const productItems = useMemo(
    () => ({
      mobile: {
        title: 'Mobile',
        description:
          'Explore our latest mobile devices featuring long battery life, vivid displays, and fast connectivity.',
      },
      laptop: {
        title: 'Laptop',
        description:
          'Performance notebooks for work and play, with sleek design and powerful internals.',
      },
      tablet: {
        title: 'Tablet',
        description:
          'Portable tablets perfect for reading, browsing, and creativity on the go.',
      },
      accessories: {
        title: 'Accessories',
        description:
          'Headphones, chargers, and cases designed to complement your devices.',
      },
    }),
    []
  );

  // Normalize and parse hash to get route and params
  const normalizeHash = (hash) => {
    const cleaned = (hash || '').replace(/^#/, '');
    return cleaned || '/';
  };

  const parseHash = (hash) => {
    const path = normalizeHash(hash);
    const segments = path.split('/').filter(Boolean); // remove empty
    // routes:
    // [] -> '/'
    // ['products'] -> '/products'
    // ['products', ':item'] -> '/products/:item'
    if (segments.length === 0) {
      return { route: '/', params: {} };
    }
    if (segments.length === 1 && segments[0] === 'products') {
      return { route: '/products', params: {} };
    }
    if (segments.length === 2 && segments[0] === 'products') {
      return { route: '/products/:item', params: { item: segments[1] } };
    }
    // Fallback: treat as home
    return { route: '/', params: {} };
  };

  const [routeInfo, setRouteInfo] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRouteInfo(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      onHashChange();
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to) => {
    const normalized = normalizeHash(window.location.hash);
    if (normalized !== to) {
      window.location.hash = `#${to}`;
    }
  };

  // Compute breadcrumbs dynamically based on route
  const breadcrumbItems = useMemo(() => {
    const base = [{ label: 'Home', href: '#/', current: false }];

    if (routeInfo.route === '/') {
      return [{ label: 'Home', current: true }];
    }

    if (routeInfo.route === '/products') {
      return [
        ...base,
        { label: 'Products', current: true },
      ];
    }

    if (routeInfo.route === '/products/:item') {
      const rawItem = (routeInfo.params.item || '').toLowerCase();
      // Capitalize first letter for display, keep "Mobile" as example item among others
      const label =
        productItems[rawItem]?.title ||
        (rawItem ? rawItem.charAt(0).toUpperCase() + rawItem.slice(1) : 'Item');

      return [
        ...base,
        { label: 'Products', href: '#/products' },
        { label, current: true },
      ];
    }

    // Default to home if unknown
    return [{ label: 'Home', current: true }];
  }, [routeInfo, productItems]);

  // Content rendering per route
  const renderContent = () => {
    if (routeInfo.route === '/') {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">Home</h1>
          <p className="text-gray-600">
            Welcome to the Breadcrumbs demo. Navigate using the links above to see the content update while
            maintaining a clean, modern Ocean Professional style.
          </p>
          <div>
            <a
              href="#/products"
              onClick={(e) => {
                e.preventDefault();
                navigate('/products');
              }}
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition"
            >
              View Products
            </a>
          </div>
        </div>
      );
    }

    if (routeInfo.route === '/products') {
      const products = [
        { key: 'mobile', name: 'Mobile', desc: 'Smartphones, tablets, and accessories.' },
        { key: 'laptop', name: 'Laptop', desc: 'Performance notebooks for work and play.' },
        { key: 'tablet', name: 'Tablet', desc: 'Portable tablets for reading, browsing, and more.' },
        { key: 'accessories', name: 'Accessories', desc: 'Headphones, chargers, and cases.' },
      ];
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Browse a few sample products below.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div
                key={p.key}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition"
              >
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-sm text-gray-600 mt-1">{p.desc}</div>
                <div className="mt-3">
                  <a
                    href={`#/products/${p.key}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/products/${p.key}`);
                    }}
                    className="text-primary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
                  >
                    {p.name === 'Mobile' ? 'View Mobile' : `View ${p.name}`}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (routeInfo.route === '/products/:item') {
      const rawItem = (routeInfo.params.item || '').toLowerCase();
      const meta =
        productItems[rawItem] ||
        {
          title: rawItem ? rawItem.charAt(0).toUpperCase() + rawItem.slice(1) : 'Item',
          description:
            'This is a placeholder for the selected product category. More details coming soon.',
        };

      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">{meta.title}</h1>
          <p className="text-gray-600">{meta.description}</p>
          <div className="flex gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-primary/20 text-primary px-4 py-2 bg-white hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition"
              onClick={() => navigate('/products')}
            >
              Back to Products
            </button>
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="inline-flex items-center rounded-lg px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition"
              aria-label="Go Home"
            >
              Go Home
            </a>
          </div>
        </div>
      );
    }

    // fallback
    return null;
  };

  return (
    <div className="min-h-screen bg-ocean-gradient">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto rounded-xl shadow-sm bg-surface text-text ring-1 ring-gray-100">
          <div className="p-6 sm:p-8">
            {/* Breadcrumb bar with Ocean theme accents */}
            <div className="mb-6 pb-4 border-b border-gray-100">
              <Breadcrumbs
                items={breadcrumbItems.map((item) => ({
                  ...item,
                }))}
              />
            </div>

            {/* Dynamic content area */}
            {renderContent()}
          </div>
        </div>

        <div className="sr-only">
          Use Tab to focus breadcrumb links and observe visible focus rings.
        </div>
      </div>
    </div>
  );
}

export default App;
