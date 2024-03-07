import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoryCard from './CategoryCard';

const mockCategory = {
  category: 'Category 1',
  count: 5,
};

describe('CategoryCard Component', () => {
  it('matches snapshot', () => {
    const{ asFragment } = render(
      <MemoryRouter>
        <CategoryCard category={mockCategory.category} count={mockCategory.count} item="meals" />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders category card correctly', () => {
    render(
      <MemoryRouter>
        <CategoryCard category={mockCategory.category} count={mockCategory.count} item="meals" />
      </MemoryRouter>
    );

    expect(screen.getByText('CATEGORY 1')).toBeInTheDocument();
    expect(screen.getByText('5 recipes')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/recipes/meals/Category%201');
  });

  it('handles special characters in category name', () => {
    render(
      <MemoryRouter>
        <CategoryCard category="Special Category" count={3} item="drinks" />
      </MemoryRouter>
    );

    expect(screen.getByText('SPECIAL CATEGORY')).toBeInTheDocument();
    expect(screen.getByText('3 recipes')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/recipes/drinks/Special%20Category');
  });
});
