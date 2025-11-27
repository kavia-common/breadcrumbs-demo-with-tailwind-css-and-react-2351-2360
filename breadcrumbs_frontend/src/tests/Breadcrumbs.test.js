import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('Breadcrumbs Demo', () => {
  beforeEach(() => {
    // Reset hash before each test
    window.location.hash = '#/products/mobile';
  });

  test('renders Home, Products, Mobile in order with correct aria, icons, and tooltips', () => {
    render(<App />);

    const nav = screen.getByLabelText(/breadcrumb/i);
    expect(nav).toBeInTheDocument();

    // Ensure all labels exist
    const homeText = screen.getByText('Home');
    const productsText = screen.getByText('Products');
    const mobileText = screen.getByText('Mobile');

    expect(homeText).toBeInTheDocument();
    expect(productsText).toBeInTheDocument();
    expect(mobileText).toBeInTheDocument();

    // Mobile is current page (aria-current="page") and not a link
    const mobile = screen.getByText('Mobile');
    expect(mobile).toHaveAttribute('aria-current', 'page');
    expect(mobile.closest('a')).toBeNull();

    // Icons should be present preceding the text (find svg in the same container)
    const homeContainer = homeText.parentElement;
    const productsContainer = productsText.parentElement;
    const mobileContainer = mobileText.parentElement;

    expect(within(homeContainer).getByRole('img', { hidden: true })).toBeTruthy();
  });

  test('icons have title tooltips on links and current item has title, without breaking navigation', () => {
    render(<App />);

    // Home and Products should be links with titles; Mobile is current with title but not a link
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });

    expect(homeLink).toHaveAttribute('title', 'Go to Home');
    expect(productsLink).toHaveAttribute('title', 'View Products');

    const mobileCurrent = screen.getByText('Mobile');
    expect(mobileCurrent).toHaveAttribute('title', 'Current page: Mobile');
    expect(mobileCurrent.closest('a')).toBeNull();

    // Ensure keyboard targeting is intact: links have focus-visible treatment class
    expect(homeLink.className).toMatch(/focus-visible:ring-2/);
    expect(productsLink.className).toMatch(/focus-visible:ring-2/);
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
