import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the Footer component', () => {
    render(<Footer />);
    
    // Vérifier le nom de la marque
    expect(screen.getByText('CamerTrip')).toBeInTheDocument();
  });

  it('displays the company tagline', () => {
    render(<Footer />);
    
    expect(
      screen.getByText(/Votre guide de confiance pour explorer les merveilles du Cameroun/i)
    ).toBeInTheDocument();
  });

  it('renders destination links', () => {
    render(<Footer />);
    
    const destinations = ['Yaoundé', 'Douala', 'Kribi', 'Limbe', 'Bafoussam', 'Maroua'];
    destinations.forEach((destination) => {
      expect(screen.getByRole('link', { name: destination })).toBeInTheDocument();
    });
  });

  it('renders quick links section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Liens rapides')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Accueil' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Destinations' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Activités' })).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText(/Avenue Kennedy, Yaoundé, Cameroun/i)).toBeInTheDocument();
    expect(screen.getByText(/contact@camertrip.cm/i)).toBeInTheDocument();
  });

  it('displays copyright notice', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2025 CamerTrip. Tous droits réservés./i)).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: 'Conditions' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Confidentialité' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mentions légales' })).toBeInTheDocument();
  });
});
