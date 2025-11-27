import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App routing and breadcrumbs', () => {
  beforeEach(() => {
    window.location.hash = '#/';
  });

  test('Home route shows Home breadcrumb current and CTA to products', () => {
    render(<App />);
    const homeCrumb = screen.getByText('Home');
    expect(homeCrumb).toBeInTheDocument();
    expect(homeCrumb).toHaveAttribute('aria-current', 'page');
    const productsLink = screen.getByRole('link', { name: /view products/i });
    expect(productsLink).toBeInTheDocument();
  });

  test('Navigate to Products: breadcrumbs update and product cards render', () => {
    render(<App />);
    const productsLink = screen.getByRole('link', { name: /view products/i });
    fireEvent.click(productsLink);

    expect(window.location.hash).toBe('#/products');
    const productsCrumb = screen.getByText('Products');
    expect(productsCrumb).toBeInTheDocument();
    expect(productsCrumb).toHaveAttribute('aria-current', 'page');

    // Products list
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();
  });

  test('Navigate to product item: Mobile - shows detail and breadcrumbs Home > Products > Mobile', () => {
    window.location.hash = '#/products';
    render(<App />);

    const viewMobile = screen.getByRole('link', { name: /view mobile/i });
    fireEvent.click(viewMobile);

    expect(window.location.hash).toBe('#/products/mobile');

    // Breadcrumbs
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });
    const mobileCurrent = screen.getByText('Mobile');

    expect(homeLink).toBeInTheDocument();
    expect(productsLink).toBeInTheDocument();
    expect(mobileCurrent).toHaveAttribute('aria-current', 'page');

    // Content
    expect(
      screen.getByText(/latest mobile devices featuring long battery life/i)
    ).toBeInTheDocument();
  });

  test('Directly navigate to Laptop route: breadcrumbs and content placeholder appear', () => {
    window.location.hash = '#/products/laptop';
    render(<App />);

    const laptopCurrent = screen.getByText('Laptop');
    expect(laptopCurrent).toBeInTheDocument();
    expect(laptopCurrent).toHaveAttribute('aria-current', 'page');

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });
    expect(homeLink).toBeInTheDocument();
    expect(productsLink).toBeInTheDocument();

    expect(
      screen.getByText(/performance notebooks for work and play/i)
    ).toBeInTheDocument();
  });
});
