import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import CreateOrUpdateRecipeForm from './CreateOrUpdateRecipeForm';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DreamHostApi from '../api/api';
import UserContext from '../auth/UserContext';

jest.mock('../api/api');

const mockUserContext = {
  currentUser: {
    username: 'testUser',
  },
};

const mockPersonalMealRecipe = {
  id: 1,
  name: 'Test Recipe',
  category: 'Test Category',
  area: 'Test Area',
  instructions: 'Test Instructions',
  thumbnail: 'test-thumbnail.jpg',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  username: 'testUser',
};

const mockPersonalDrinkRecipe = {
  id: 1,
  name: 'Test Recipe',
  category: 'Test Category',
  type: 'Test Type',
  glass: 'Test Glass',
  instructions: 'Test Instructions',
  thumbnail: 'test-thumbnail.jpg',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  username: 'testUser',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CreateOrUpdateRecipeForm Component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/recipes/create/meals']}>
        <UserContext.Provider value={mockUserContext}>
          <Routes>
            <Route path="/recipes/create/:item" element={<CreateOrUpdateRecipeForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the create meal form correctly', () => {
    render(
      <MemoryRouter initialEntries={['/recipes/create/meals']}>
        <UserContext.Provider value={mockUserContext}>
          <Routes>
            <Route path="/recipes/create/:item" element={<CreateOrUpdateRecipeForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('- Create Meal -')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Area')).toBeInTheDocument();
    expect(screen.getByLabelText('Instructions')).toBeInTheDocument();
    expect(screen.getByLabelText('Thumbnail')).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });

  it('renders the create drink form correctly', () => {
    render(
      <MemoryRouter initialEntries={['/recipes/create/drinks']}>
        <UserContext.Provider value={mockUserContext}>
          <Routes>
            <Route path="/recipes/create/:item" element={<CreateOrUpdateRecipeForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('- Create Drink -')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Alcoholic')).toBeInTheDocument();
    expect(screen.getByLabelText('Non-Alcoholic')).toBeInTheDocument();
    expect(screen.getByLabelText('Glass')).toBeInTheDocument();
    expect(screen.getByLabelText('Instructions')).toBeInTheDocument();
    expect(screen.getByLabelText('Thumbnail')).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });

  it('renders the update meal form correctly', async () => {
    DreamHostApi.getPersonalRecipe.mockResolvedValueOnce(mockPersonalMealRecipe);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/recipes/update/meals/1']}>
          <UserContext.Provider value={mockUserContext}>
            <Routes>
              <Route path="/recipes/update/:item/:id" element={<CreateOrUpdateRecipeForm />} />
            </Routes>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });

    // Wait for the API call to resolve
    await screen.findByText('- Update Meal -');

    expect(screen.getByLabelText('Name')).toHaveValue('Test Recipe');
    expect(screen.getByLabelText('Category')).toHaveValue('Test Category');
    expect(screen.getByLabelText('Area')).toHaveValue('Test Area');
    expect(screen.getByLabelText('Instructions')).toHaveValue('Test Instructions');
    expect(screen.getByLabelText('Thumbnail')).toHaveValue('test-thumbnail.jpg');
  });

  it('renders the update drink form correctly', async () => {
    DreamHostApi.getPersonalRecipe.mockResolvedValueOnce(mockPersonalDrinkRecipe);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/recipes/update/drinks/1']}>
          <UserContext.Provider value={mockUserContext}>
            <Routes>
              <Route path="/recipes/update/:item/:id" element={<CreateOrUpdateRecipeForm />} />
            </Routes>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });

    // Wait for the API call to resolve
    await screen.findByText('- Update Drink -');

    expect(screen.getByLabelText('Name')).toHaveValue('Test Recipe');
    expect(screen.getByLabelText('Category')).toHaveValue('Test Category');
    expect(screen.getByLabelText('Glass')).toHaveValue('Test Glass');
    expect(screen.getByLabelText('Instructions')).toHaveValue('Test Instructions');
    expect(screen.getByLabelText('Thumbnail')).toHaveValue('test-thumbnail.jpg');
  });

  it('submits the form correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/recipes/create/meals']}>
        <UserContext.Provider value={mockUserContext}>
          <Routes>
            <Route path="/recipes/create/:item" element={<CreateOrUpdateRecipeForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Recipe' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'New Category' } });

    // Trigger form submission
    await act(async () => {
      fireEvent.click(screen.getByText('Create'));
    });
    // Add assertions for the form submission, e.g., check if the API is called correctly
    expect(DreamHostApi.createPersonalRecipe).toHaveBeenCalledWith(
      'testUser',
      expect.objectContaining({
        name: 'New Recipe',
        category: 'New Category',
      }),
      'meals'
    );
  });
});
