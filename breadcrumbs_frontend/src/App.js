import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';
import Breadcrumbs from './components/Breadcrumbs';

/**
 * PUBLIC_INTERFACE
 * App renders a centered card with Breadcrumbs and simple hash-based navigation.
 * - Pages: "/", "/products", "/products/mobile"
 * - Uses Ocean Professional theme via Tailwind classes
 * - Displays contextual content per page beneath the breadcrumbs
 * - Removes any debug/footer panels below the main content
 */
function App() {
  const routes = useMemo(
    () => ({
      '/': { title: 'Home', description: 'Welcome to our Ocean-themed demo.' },
      '/products': { title: 'Products', description: 'Browse a few sample products below.' },
      '/products/mobile': { title: 'Mobile', description: 'A quick look at our Mobile product line.' },
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

  // Render content per current route
  const renderContent = () => {
    if (path === '/') {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
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
    if (path === '/products') {
      const products = [
        { id: 1, name: 'Mobile', href: '#/products/mobile', desc: 'Smartphones, tablets, and accessories.' },
        { id: 2, name: 'Laptop', href: '#/products', desc: 'Performance notebooks for work and play.' },
        { id: 3, name: 'Audio', href: '#/products', desc: 'Headphones and speakers with rich sound.' },
      ];
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
            <p className="text-gray-600 mt-1">{currentPage.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition"
              >
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-sm text-gray-600 mt-1">{p.desc}</div>
                <div className="mt-3">
                  <a
                    href={p.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (p.name === 'Mobile') {
                        navigate('/products/mobile');
                      }
                    }}
                    className="text-primary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
                  >
                    {p.name === 'Mobile' ? 'View Mobile' : 'Learn more'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    // /products/mobile
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
        <p className="text-gray-600">
          Explore our latest mobile devices featuring long battery life, vivid displays, and fast connectivity.
        </p>
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
          >
            Go Home
          </a>
        </div>
      </div>
    );
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
