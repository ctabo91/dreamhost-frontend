import React from 'react';
import { render, screen, act } from '@testing-library/react';
import CategoryList from './CategoryList';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DreamHostApi from '../api/api';

jest.mock('../api/api');

const mockCategories = [
  { category: 'Category 1', count: 5 },
  { category: 'Category 2', count: 6 },
  { category: 'Category 3', count: 7 },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CategoryList Component', () => {
  it("matches snapshot", async () => {
    DreamHostApi.getCategories.mockResolvedValueOnce(mockCategories);

    const asFragment = await act(async () => {
      const { asFragment } = render(
        <MemoryRouter initialEntries={['/categories/meals']}>
          <Routes>
            <Route path="/categories/:item" element={<CategoryList />} />
          </Routes>
        </MemoryRouter>
      );
      return asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
  })

  it('renders loading spinner while fetching categories', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/categories/meals']}>
          <Routes>
            <Route path="/categories/:item" element={<CategoryList />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('renders meal categories correctly', async () => {
    DreamHostApi.getCategories.mockResolvedValueOnce(mockCategories);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/categories/meals']}>
          <Routes>
            <Route path="/categories/:item" element={<CategoryList />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Wait for the API call to resolve
    await screen.findByText('- Select A Meal Category -');

    expect(screen.getByText('CATEGORY 1')).toBeInTheDocument();
    expect(screen.getByText('CATEGORY 2')).toBeInTheDocument();
    expect(screen.getByText('CATEGORY 3')).toBeInTheDocument();
  });

  it('renders drink categories correctly', async () => {
    DreamHostApi.getCategories.mockResolvedValueOnce(mockCategories);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/categories/drinks']}>
          <Routes>
            <Route path="/categories/:item" element={<CategoryList />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Wait for the API call to resolve
    await screen.findByText('- Select A Drink Category -');

    expect(screen.getByText('CATEGORY 1')).toBeInTheDocument();
    expect(screen.getByText('CATEGORY 2')).toBeInTheDocument();
    expect(screen.getByText('CATEGORY 3')).toBeInTheDocument();
  });

  it('displays "Sorry, no results were found!" when no categories are available', async () => {
    DreamHostApi.getCategories.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/categories/meals']}>
          <Routes>
            <Route path="/categories/:item" element={<CategoryList />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Wait for the API call to resolve
    await screen.findByText('Sorry, no results were found!');

    expect(screen.getByText('Sorry, no results were found!')).toBeInTheDocument();
  });
});
