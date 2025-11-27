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

    const items = screen.getAllByText(/Home|Products|Mobile/);
    // Ensure all labels exist
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();

    // Mobile is current page (aria-current="page") and not a link
    const mobile = screen.getByText('Mobile');
    expect(mobile).toHaveAttribute('aria-current', 'page');
    expect(mobile.closest('a')).toBeNull();
  });

  test('clicking Home or Products updates hash and active crumb', () => {
    render(<App />);

    // Start at /products/mobile
    expect(window.location.hash).toBe('#/products/mobile');

    // Click Home
    const homeLinkButton = screen.getByRole('link', { name: 'Home' });
    fireEvent.click(homeLinkButton);
    expect(window.location.hash).toBe('#/');

    // After clicking, "Home" becomes current and is not a link
    const homeCrumb = screen.getByText('Home');
    expect(homeCrumb).toHaveAttribute('aria-current', 'page');
    expect(homeCrumb.closest('a')).toBeNull();

    // Click Products (navigate via link/button)
    const productsButton = screen.getByRole('link', { name: 'Products' });
    fireEvent.click(productsButton);
    expect(window.location.hash).toBe('#/products');

    const productsCrumb = screen.getByText('Products');
    expect(productsCrumb).toHaveAttribute('aria-current', 'page');
    expect(productsCrumb.closest('a')).toBeNull();
  });
});
