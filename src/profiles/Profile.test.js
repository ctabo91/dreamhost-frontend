import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import DreamHostApi from '../api/api';
import UserContext from '../auth/UserContext';

jest.mock('../api/api');

const mockCurrentUser = {
  username: 'testUser',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
};

const mockSetCurrentUser = jest.fn();

const renderProfileComponent = () => {
  return render(
    <MemoryRouter>
      <UserContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: mockSetCurrentUser }}>
        <Profile />
      </UserContext.Provider>
    </MemoryRouter>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Profile Component', () => {
  it('matches snapshot', async () => {
    const asFragment = await act(async () => {
      const { asFragment } = renderProfileComponent();
      return asFragment;
    })

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders user profile information correctly', async () => {
    await act(async () => renderProfileComponent());

    expect(screen.getByText('Username: testUser')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john.doe@example.com');
    expect(screen.getByLabelText('Password')).toHaveValue('');
  });

  it('updates form data on input change', async () => {
    await act(async () => renderProfileComponent());

    await act(async () => {
      userEvent.type(screen.getByLabelText('First Name'), 'NewFirstName');
      userEvent.type(screen.getByLabelText('Last Name'), 'NewLastName');
      userEvent.type(screen.getByLabelText('Email'), 'new.email@example.com');
      userEvent.type(screen.getByLabelText('Password'), 'newPassword');
    });

    expect(screen.getByLabelText('First Name')).toHaveValue('JohnNewFirstName');
    expect(screen.getByLabelText('Last Name')).toHaveValue('DoeNewLastName');
    expect(screen.getByLabelText('Email')).toHaveValue('john.doe@example.comnew.email@example.com');
    expect(screen.getByLabelText('Password')).toHaveValue('newPassword');
  });

  it('handles form submission successfully', async () => {
    DreamHostApi.updateUser.mockResolvedValueOnce({
      ...mockCurrentUser,
      firstName: 'NewJohn',
      lastName: 'NewDoe',
      email: 'new.john.doe@example.com',
    });

    await act(async () => renderProfileComponent());

    await act(async () => {
      userEvent.clear(screen.getByLabelText("First Name"));
      userEvent.clear(screen.getByLabelText("Last Name"));
      userEvent.clear(screen.getByLabelText("Email"));
    });

    await act(async () => {
      userEvent.type(screen.getByLabelText('First Name'), 'NewJohn');
      userEvent.type(screen.getByLabelText('Last Name'), 'NewDoe');
      userEvent.type(screen.getByLabelText('Email'), 'new.john.doe@example.com');
    });

    await act(async () => {
      userEvent.click(screen.getByText('Save Changes'));
    });

    expect(DreamHostApi.updateUser).toHaveBeenCalledWith('testUser', {
        firstName: 'NewJohn',
        lastName: 'NewDoe',
        email: 'new.john.doe@example.com',
        password: '',
    });

    expect(screen.getByLabelText('First Name')).toHaveValue('NewJohn');
    expect(screen.getByLabelText('Last Name')).toHaveValue('NewDoe');
    expect(screen.getByLabelText('Email')).toHaveValue('new.john.doe@example.com');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(mockSetCurrentUser).toHaveBeenCalledWith({
      ...mockCurrentUser,
      firstName: 'NewJohn',
      lastName: 'NewDoe',
      email: 'new.john.doe@example.com',
    });
  });

  it('handles form submission with errors', async () => {
    DreamHostApi.updateUser.mockRejectedValueOnce(['Error 1', 'Error 2']);

    await act(async () => renderProfileComponent());

    await act(async () => {
      userEvent.clear(screen.getByLabelText("First Name"));
      userEvent.clear(screen.getByLabelText("Last Name"));
      userEvent.clear(screen.getByLabelText("Email"));
    });

    await act(async () => {
      userEvent.type(screen.getByLabelText('First Name'), 'NewJohn');
      userEvent.type(screen.getByLabelText('Last Name'), 'NewDoe');
      userEvent.type(screen.getByLabelText('Email'), 'new.john.doe@example.com');
    });

    await act(async () => {
      userEvent.click(screen.getByText('Save Changes'));
    });

    expect(DreamHostApi.updateUser).toHaveBeenCalledWith('testUser', {
      firstName: 'NewJohn',
      lastName: 'NewDoe',
      email: 'new.john.doe@example.com',
      password: '',
    });

    expect(screen.getByLabelText('First Name')).toHaveValue('NewJohn');
    expect(screen.getByLabelText('Last Name')).toHaveValue('NewDoe');
    expect(screen.getByLabelText('Email')).toHaveValue('new.john.doe@example.com');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
    expect(mockSetCurrentUser).not.toHaveBeenCalled();
  });
});
