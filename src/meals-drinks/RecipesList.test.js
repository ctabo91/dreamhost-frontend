import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RecipesList from './RecipesList';
import UserContext from '../auth/UserContext';
import DreamHostApi from '../api/api';

jest.mock('../api/api');

const mockUserContext = {
  currentUser: {
    username: 'testUser',
  },
  favMealIds: [1],
  favDrinkIds: [1],
};

const mockMealRecipes = [
  { 
    id: 1,
    name: 'Recipe 1',
    area: 'Area 1',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    thumbnail: 'Thumbnail 1'
  }
];

const mockDrinkRecipes = [
  { 
    id: 1,
    name: 'Recipe 1',
    type: 'Type 1',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    thumbnail: 'Thumbnail 1'
  }
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RecipesList Component', () => {
  it('matches snapshot', async () => {
    DreamHostApi.getRecipes.mockResolvedValueOnce(mockMealRecipes);

    const asFragment = await act(async () => {
      const { asFragment } = render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/meals']}>
            <Routes>
              <Route path="/recipes/:item" element={<RecipesList />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
      return asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders loading spinner when recipes are null', async () => {
    await act(async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/meals']}>
            <Routes>
              <Route path="/recipes/:item" element={<RecipesList />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('renders meal recipes list when item is "meals"', async () => {
    DreamHostApi.getRecipes.mockResolvedValueOnce(mockMealRecipes);

    await act(async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/meals']}>
            <Routes>
              <Route path="/recipes/:item" element={<RecipesList />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });

    expect(screen.getByText('RECIPE 1')).toBeInTheDocument();
    expect(screen.getByText('AREA 1')).toBeInTheDocument();
  });

  it('renders drink recipes list when item is "drinks"', async () => {
    DreamHostApi.getRecipes.mockResolvedValueOnce(mockDrinkRecipes);

    await act(async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/drinks']}>
            <Routes>
              <Route path="/recipes/:item" element={<RecipesList />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });

    expect(screen.getByText('RECIPE 1')).toBeInTheDocument();
    expect(screen.getByText('TYPE 1')).toBeInTheDocument();
  });

  it('shows "Filter by Category" button', async () => {
    DreamHostApi.getRecipes.mockResolvedValueOnce(mockMealRecipes);

    await act(async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/meals']}>
            <Routes>
              <Route path="/recipes/:item" element={<RecipesList />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });

    expect(screen.getByRole('button', { name: /Filter by Category/i })).toBeInTheDocument();
  });

  it('toggles between show favorites and back to all recipes', async () => {
    DreamHostApi.getRecipes.mockResolvedValueOnce(mockMealRecipes);

    await act(async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/meals']}>
            <Routes>
              <Route path="/recipes/:item" element={<RecipesList />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });
    
    const showFavoriteButton = screen.getByRole('button', { class: 'filter-button-favorite', name: /Show Favorites/i });

    // Click the "Show Favorites" button
    DreamHostApi.getRecipe.mockResolvedValueOnce(mockMealRecipes[0]);
    await act(async () => {
      fireEvent.click(showFavoriteButton);
    });

    // Check that it shows the favorites
    expect(screen.getByText('RECIPE 1')).toBeInTheDocument();

    // Click the "Back to All Meals" button
    DreamHostApi.getRecipes.mockResolvedValueOnce(mockMealRecipes);
    await act(async () => {
      fireEvent.click(showFavoriteButton);
    });

    // Check that it shows all recipes
    expect(screen.getByText('RECIPE 1')).toBeInTheDocument();
  });
});
