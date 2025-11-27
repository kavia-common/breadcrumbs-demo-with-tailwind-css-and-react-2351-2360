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

  test('Navigate to Products: breadcrumbs update, product cards render with icons/badges', () => {
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

    // Each item has a "View <name>" link (keyboard focusable) and decorative icon/badge present
    expect(screen.getByRole('link', { name: /view mobile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view laptop/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view tablet/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view accessories/i })).toBeInTheDocument();

    // Decorative icons exist as <svg aria-hidden="true"> preceding titles - query by closest card
    // We check the existence of badge containers by their computed class indicative of badges
    const mobileBadge = screen.getByText('Mobile').closest('div').querySelector('span[aria-hidden="true"]');
    const laptopBadge = screen.getByText('Laptop').closest('div').querySelector('span[aria-hidden="true"]');
    const tabletBadge = screen.getByText('Tablet').closest('div').querySelector('span[aria-hidden="true"]');
    const accessoriesBadge = screen.getByText('Accessories').closest('div').querySelector('span[aria-hidden="true"]');

    expect(mobileBadge).toBeTruthy();
    expect(laptopBadge).toBeTruthy();
    expect(tabletBadge).toBeTruthy();
    expect(accessoriesBadge).toBeTruthy();
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
