import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RecipeCard from './RecipeCard';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DreamHostApi from '../api/api';
import UserContext from '../auth/UserContext';
import RecipeDetails from './RecipeDetails';

jest.mock('../api/api');

const mockUserContext = {
  currentUser: {
    username: 'testUser',
  },
  hasFavoritedRecipe: jest.fn(),
  favoriteRecipe: jest.fn(),
};

const mockMealRecipe = {
  access: 'global',
  item: 'meals',
  id: 1,
  name: 'Test Recipe',
  thumbnail: 'test-thumbnail.jpg',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  instructions: '1. Test instruction 1. Test instruction 2.',
  area: 'Test Area',
};

const mockDrinkRecipe = {
  access: 'global',
  item: 'drinks',
  id: 1,
  name: 'Test Recipe',
  category: 'Test Category',
  thumbnail: 'test-thumbnail.jpg',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  instructions: '1. Test instruction 1. Test instruction 2.',
  type: 'Test Type',
  glass: 'Test Glass',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RecipeCard Component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <RecipeCard {...mockMealRecipe} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the component with correct information for a meal', () => {
    render(
      <MemoryRouter>
        <RecipeCard {...mockMealRecipe} />
      </MemoryRouter>
    );

    // Check that the name is rendered
    expect(screen.getByText('TEST RECIPE')).toBeInTheDocument();

    // Check that the image is rendered
    expect(screen.getByAltText('Test Recipe')).toBeInTheDocument();

    // Check that the area or type is rendered
    expect(screen.getByText('TEST AREA')).toBeInTheDocument();

    // Check that the ingredients are rendered
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Ingredient 1')).toBeInTheDocument();
    expect(screen.getByText('Ingredient 2')).toBeInTheDocument();
  });

  it('renders the component with correct information for a drink', () => {
    render(
      <MemoryRouter>
        <RecipeCard {...mockDrinkRecipe} />
      </MemoryRouter>
    );

    // Check that the name is rendered
    expect(screen.getByText('TEST RECIPE')).toBeInTheDocument();

    // Check that the image is rendered
    expect(screen.getByAltText('Test Recipe')).toBeInTheDocument();

    // Check that the area or type is rendered
    expect(screen.getByText('TEST TYPE')).toBeInTheDocument();

    // Check that the ingredients are rendered
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Ingredient 1')).toBeInTheDocument();
    expect(screen.getByText('Ingredient 2')).toBeInTheDocument();
  });

  it('navigates to the correct details page when clicked', async () => {
    render(
      <MemoryRouter>
        <RecipeCard {...mockMealRecipe} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { class: 'RecipeCard' });

    // Simulate a click on the link
    fireEvent.click(link);

    DreamHostApi.getRecipe.mockResolvedValueOnce(mockMealRecipe);

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

    // Check that the correct details page is navigated to
    expect(screen.getByText('Test instruction')).toBeInTheDocument();
    expect(screen.getByText('Test instruction 2.')).toBeInTheDocument();
  });
});
