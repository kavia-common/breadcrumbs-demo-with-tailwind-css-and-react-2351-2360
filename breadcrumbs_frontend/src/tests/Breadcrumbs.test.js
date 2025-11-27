import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('Breadcrumbs Demo', () => {
  beforeEach(() => {
    // Reset hash before each test
    window.location.hash = '#/products/mobile';
  });

  test('renders Home, Products, Mobile in order with correct aria and tooltips', () => {
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

    // Tooltip titles
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });
    expect(homeLink).toHaveAttribute('title', 'Go to Home');
    expect(productsLink).toHaveAttribute('title', 'View Products');
  });

  test('clicking Home and Products updates hash, active crumb, and content', () => {
    render(<App />);

    // Start at /products/mobile
    expect(window.location.hash).toBe('#/products/mobile');

    // Click Home via content "Go Home" link
    const goHomeLink = screen.getByRole('link', { name: /go home/i });
    fireEvent.click(goHomeLink);
    expect(window.location.hash).toBe('#/');

    const homeCrumb = screen.getByText('Home');
    expect(homeCrumb).toHaveAttribute('aria-current', 'page');
    expect(homeCrumb.closest('a')).toBeNull();

    // Home content CTA
    const viewProducts = screen.getByRole('link', { name: /view products/i });
    fireEvent.click(viewProducts);
    expect(window.location.hash).toBe('#/products');

    const productsCrumb = screen.getByText('Products');
    expect(productsCrumb).toHaveAttribute('aria-current', 'page');
    expect(productsCrumb.closest('a')).toBeNull();

    // Products list
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();

    // Navigate to Mobile
    const viewMobileLink = screen.getByRole('link', { name: /view mobile/i });
    fireEvent.click(viewMobileLink);
    expect(window.location.hash).toBe('#/products/mobile');

    expect(
      screen.getByText(/latest mobile devices featuring long battery life/i)
    ).toBeInTheDocument();
  });

  test('direct route to laptop shows correct breadcrumb current and content', () => {
    window.location.hash = '#/products/laptop';
    render(<App />);

    const laptopCrumb = screen.getByText('Laptop');
    expect(laptopCrumb).toBeInTheDocument();
    expect(laptopCrumb).toHaveAttribute('aria-current', 'page');

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });
    expect(homeLink).toBeInTheDocument();
    expect(productsLink).toBeInTheDocument();

    expect(
      screen.getByText(/performance notebooks for work and play/i)
    ).toBeInTheDocument();
  });
});
