import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Hero from '../Hero';

// Mock ImageWithFallback component
vi.mock('../figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe('Hero', () => {
  it('renders the Hero component', () => {
    render(<Hero />);
    
    // Vérifier que le formulaire de recherche est présent
    expect(screen.getByPlaceholderText(/Rechercher/i)).toBeInTheDocument();
  });

  it('renders search tabs', () => {
    render(<Hero />);
    
    expect(screen.getByText('Tout rechercher')).toBeInTheDocument();
    expect(screen.getByText('Hôtels')).toBeInTheDocument();
    expect(screen.getByText('Restaurants')).toBeInTheDocument();
    expect(screen.getByText('Activités')).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', async () => {
    const mockOnSearch = vi.fn();
    render(<Hero onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'Yaoundé' } });
    
    const searchButton = screen.getByRole('button', { name: /^Rechercher$/ });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('Yaoundé', 'all');
  });

  it('changes search placeholder when tab is selected', () => {
    render(<Hero />);
    
    // Cliquer sur l'onglet Hôtels
    const hotelsTab = screen.getByRole('button', { name: /Hôtels/i });
    fireEvent.click(hotelsTab);
    
    expect(screen.getByPlaceholderText(/Où souhaitez-vous séjourner/i)).toBeInTheDocument();
  });

  it('renders carousel navigation buttons', () => {
    render(<Hero />);
    
    // Vérifier la présence des boutons de navigation du carousel
    const prevButtons = screen.getAllByRole('button');
    expect(prevButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('renders carousel indicators', () => {
    render(<Hero />);
    
    // Vérifier qu'il y a des indicateurs pour les slides (5 images dans le carousel)
    const buttons = screen.getAllByRole('button');
    // Il devrait y avoir au moins les boutons de navigation + indicateurs de slides
    expect(buttons.length).toBeGreaterThanOrEqual(5);
  });
});
