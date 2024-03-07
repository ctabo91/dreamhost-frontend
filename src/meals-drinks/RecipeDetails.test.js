import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RecipeDetails from './RecipeDetails';
import UserContext from '../auth/UserContext';
import DreamHostApi from '../api/api';

jest.mock('../api/api');

const mockUserContext = {
  currentUser: {
    username: 'testUser',
  },
  hasFavoritedRecipe: jest.fn(),
  favoriteRecipe: jest.fn(),
};

const mockRecipe = {
  id: 1,
  name: 'Test Recipe',
  area: 'Test Area',
  category: 'Test Category',
  type: 'Test Type',
  glass: 'Test Glass',
  instructions: '1. Test instruction 1. Test instruction 2.',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  thumbnail: 'test-thumbnail.jpg',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RecipeDetails Component', () => {
  it('matches snapshot', async () => {
    DreamHostApi.getRecipe.mockResolvedValueOnce(mockRecipe);

    const asFragment = await act(async () => {
      const { asFragment } = render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/global/meals/1']}>
            <Routes>
              <Route path="/recipes/:access/:item/:id" element={<RecipeDetails />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
      return asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders loading spinner when recipe is null', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={mockUserContext}>
            <RecipeDetails />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('renders recipe details for meals when item is "meals"', async () => {
    DreamHostApi.getRecipe.mockResolvedValueOnce(mockRecipe);

    await act(async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/global/meals/1']}>
            <Routes>
              <Route path="/recipes/:access/:item/:id" element={<RecipeDetails />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });
    
    expect(screen.getByText('TEST RECIPE')).toBeInTheDocument();
    expect(screen.getByText('Test Area Test Category Dish')).toBeInTheDocument();
    expect(screen.getByText('Test instruction')).toBeInTheDocument();
    expect(screen.getByText('Test instruction 2.')).toBeInTheDocument();
    expect(screen.getByText('Ingredient 1')).toBeInTheDocument();
    expect(screen.getByText('Ingredient 2')).toBeInTheDocument();
  });

  it('renders recipe details for drinks when item is "drinks"', async () => {
    const drinkRecipe = { ...mockRecipe, item: 'drinks' };
    DreamHostApi.getRecipe.mockResolvedValueOnce(drinkRecipe);

    await act(async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/global/drinks/1']}>
            <Routes>
              <Route path="/recipes/:access/:item/:id" element={<RecipeDetails />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });

    expect(screen.getByText('TEST RECIPE')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('Test Type')).toBeInTheDocument();
    expect(screen.getByText('*Serve in a Test Glass*')).toBeInTheDocument();
  });

  it('renders favorite button when access is "global"', async () => {
    DreamHostApi.getRecipe.mockResolvedValueOnce(mockRecipe);
    mockUserContext.hasFavoritedRecipe.mockReturnValueOnce(false);

    await act(async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <MemoryRouter initialEntries={['/recipes/global/meals/1']}>
            <Routes>
              <Route path="/recipes/:access/:item/:id" element={<RecipeDetails />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });

    const favoriteButton = screen.getByRole('button', { class: 'btn-favorite' });
    expect(favoriteButton).toBeInTheDocument();

    userEvent.click(favoriteButton);
    expect(mockUserContext.favoriteRecipe).toHaveBeenCalledWith('1', 'meals');
  });

  it('renders edit button when access is "personal"', async () => {
    const personalUserContext = { ...mockUserContext, access: 'personal' };
    const personalRecipe = { ...mockUserContext, ...mockRecipe, item: "meals" }

    DreamHostApi.getPersonalRecipe.mockResolvedValueOnce(personalRecipe);

    await act(async () => {
      render(
        <UserContext.Provider value={personalUserContext}>
          <MemoryRouter initialEntries={['/recipes/personal/meals/1']}>
            <Routes>
              <Route path="/recipes/:access/:item/:id" element={<RecipeDetails />} />
            </Routes>
          </MemoryRouter>
        </UserContext.Provider>
      );
    });

    const editButton = screen.getByRole('button', { name: /edit recipe/i });
    expect(editButton).toBeInTheDocument();
  });
});
