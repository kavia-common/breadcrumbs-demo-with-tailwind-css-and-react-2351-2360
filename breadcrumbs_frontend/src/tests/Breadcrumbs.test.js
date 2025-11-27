import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('Breadcrumbs Demo', () => {
  beforeEach(() => {
    // Reset hash before each test
    window.location.hash = '#/products/mobile';
  });

  test('renders Home, Products, Mobile in order with correct aria', () => {
    render(<App />);

    const nav = screen.getByLabelText(/breadcrumb/i);
    expect(nav).toBeInTheDocument();

    // Ensure all labels exist
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();

    // Mobile is current page (aria-current="page") and not a link
    const mobile = screen.getByText('Mobile');
    expect(mobile).toHaveAttribute('aria-current', 'page');
    expect(mobile.closest('a')).toBeNull();

    // On initial mobile page, show the mobile details content snippet
    expect(
      screen.getByText(/latest mobile devices featuring long battery life/i)
    ).toBeInTheDocument();

    // Ensure no debug/footer panel entries exist (env var keys should not render)
    expect(screen.queryByText('REACT_APP_API_BASE')).not.toBeInTheDocument();
  });

  test('clicking Home or Products updates hash, active crumb, and content', () => {
    render(<App />);

    // Start at /products/mobile
    expect(window.location.hash).toBe('#/products/mobile');

    // Click Home (via a link in content or breadcrumb link if present)
    const goHomeLink = screen.getByRole('link', { name: /go home/i });
    fireEvent.click(goHomeLink);
    expect(window.location.hash).toBe('#/');

    const homeCrumb = screen.getByText('Home');
    expect(homeCrumb).toHaveAttribute('aria-current', 'page');
    expect(homeCrumb.closest('a')).toBeNull();

    // Home content should be visible with CTA to view products
    expect(screen.getByText(/Breadcrumbs demo/i)).toBeInTheDocument();
    const viewProducts = screen.getByRole('link', { name: /view products/i });
    expect(viewProducts).toBeInTheDocument();

    // Click Products and verify content updates
    fireEvent.click(viewProducts);
    expect(window.location.hash).toBe('#/products');

    const productsCrumb = screen.getByText('Products');
    expect(productsCrumb).toHaveAttribute('aria-current', 'page');
    expect(productsCrumb.closest('a')).toBeNull();

    // Products grid/list present
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();

    // Navigate to Mobile via the "View Mobile" link
    const viewMobileLink = screen.getByRole('link', { name: /view mobile/i });
    fireEvent.click(viewMobileLink);
    expect(window.location.hash).toBe('#/products/mobile');

    // Back to mobile details view
    expect(
      screen.getByText(/latest mobile devices featuring long battery life/i)
    ).toBeInTheDocument();
  });
});
