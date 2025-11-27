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

    // Decorative icons exist as <svg aria-hidden="true">
    const homeSvg = homeLink.querySelector('svg[aria-hidden="true"]');
    const productsSvg = productsLink.querySelector('svg[aria-hidden="true"]');
    const mobileSvg = mobile.closest('span')?.querySelector('svg[aria-hidden="true"]');
    expect(homeSvg).toBeTruthy();
    expect(productsSvg).toBeTruthy();
    expect(mobileSvg).toBeTruthy();
  });

  test('clicking Home and Products updates hash, active crumb, content; breadcrumb icons appear for multiple items', () => {
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

    // Home crumb has icon
    const homeIcon = homeCrumb.closest('span')?.querySelector('svg[aria-hidden="true"]');
    expect(homeIcon).toBeTruthy();

    // Home content CTA
    const viewProducts = screen.getByRole('link', { name: /view products/i });
    fireEvent.click(viewProducts);
    expect(window.location.hash).toBe('#/products');

    const productsCrumb = screen.getByText('Products');
    expect(productsCrumb).toHaveAttribute('aria-current', 'page');
    expect(productsCrumb.closest('a')).toBeNull();

    // Products crumb has icon
    const productsIcon = productsCrumb.closest('span')?.querySelector('svg[aria-hidden="true"]');
    expect(productsIcon).toBeTruthy();

    // Products list
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();

    // Verify badges/icons presence near titles (cards)
    const mobileBadge = screen.getByText('Mobile').closest('div').querySelector('span[aria-hidden="true"]');
    const laptopBadge = screen.getByText('Laptop').closest('div').querySelector('span[aria-hidden="true"]');
    const tabletBadge = screen.getByText('Tablet').closest('div').querySelector('span[aria-hidden="true"]');
    const accessoriesBadge = screen.getByText('Accessories').closest('div').querySelector('span[aria-hidden="true"]');

    expect(mobileBadge).toBeTruthy();
    expect(laptopBadge).toBeTruthy();
    expect(tabletBadge).toBeTruthy();
    expect(accessoriesBadge).toBeTruthy();

    // Navigate to Mobile
    const viewMobileLink = screen.getByRole('link', { name: /view mobile/i });
    fireEvent.click(viewMobileLink);
    expect(window.location.hash).toBe('#/products/mobile');

    // Breadcrumbs should have icons for Home, Products, and Mobile
    const homeLinkEl = screen.getByRole('link', { name: 'Home' });
    const productsLinkEl = screen.getByRole('link', { name: 'Products' });
    const mobileCurrent = screen.getByText('Mobile');

    expect(homeLinkEl.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    expect(productsLinkEl.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    expect(mobileCurrent.closest('span')?.querySelector('svg[aria-hidden="true"]')).toBeTruthy();

    expect(
      screen.getByText(/latest mobile devices featuring long battery life/i)
    ).toBeInTheDocument();
  });

  test('direct route to laptop shows correct breadcrumb current, content, and laptop icon appears', () => {
    window.location.hash = '#/products/laptop';
    render(<App />);

    const laptopCrumb = screen.getByText('Laptop');
    expect(laptopCrumb).toBeInTheDocument();
    expect(laptopCrumb).toHaveAttribute('aria-current', 'page');

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });
    expect(homeLink).toBeInTheDocument();
    expect(productsLink).toBeInTheDocument();

    // Icons exist for Home, Products, and Laptop
    expect(homeLink.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    expect(productsLink.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    expect(laptopCrumb.closest('span')?.querySelector('svg[aria-hidden="true"]')).toBeTruthy();

    expect(
      screen.getByText(/performance notebooks for work and play/i)
    ).toBeInTheDocument();
  });
});
