/* TEST-TYPE: Unit
  RATIONALE: Unit test — verifies static rendering and button presence; navigation is mocked.
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../Homepage';

describe('HomePage', () => {
  test('renders title and navigation buttons', () => {
    render(<HomePage />);

    expect(screen.getByText(/Welcome to the Office Queue Management System/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Officer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /API Docs/i })).toBeInTheDocument();
  });
});
