/* TEST-TYPE: Integration
   RATIONALE: Renders `App` with routes to ensure top-level composition renders the homepage title.
*/
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders homepage title', () => {
  render(<App />);
  const title = screen.getByText(/Welcome to the Office Queue Management System/i);
  expect(title).toBeInTheDocument();
});
