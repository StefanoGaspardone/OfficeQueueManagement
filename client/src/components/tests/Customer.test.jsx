/* TEST-TYPE: Integration
  RATIONALE: Exercises the Customer component together with the API flow and the InfoDisplay child; mocks network/socket layers.
*/
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerPage from '../Customer';

describe('CustomerPage', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('renders services, allows selecting a service and getting a ticket', async () => {
    // Mock fetch for getServices and getTicket
    global.fetch = jest.fn((url, opts) => {
      if (url.includes('/api/services')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ services: [{ id: 1, type: 'A' }, { id: 2, type: 'B' }] }) });
      }
      if (url.includes('/api/tickets') && opts && opts.method === 'POST') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ticketId: 42, serviceId: 1, serviceType: 'A' }) });
      }
      // InfoDisplay might request counters and waiting tickets during mount
      if (url.includes('/api/counters')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ counters: [] }) });
      }
      if (url.includes('/api/tickets') && !opts) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ queue: [] }) });
      }
      return Promise.resolve({ ok: false });
    });

    render(<CustomerPage />);

  // Wait for service buttons to be rendered
  await waitFor(() => expect(screen.getByRole('list')).toBeInTheDocument());
  const buttons = await screen.findAllByRole('button', { name: /A|B/ });
  expect(buttons.length).toBe(2);

    // Click first service
    await userEvent.click(buttons[0]);

    const getTicketButton = screen.getByRole('button', { name: /Get Ticket/i });
    expect(getTicketButton).toBeEnabled();

    // Click Get Ticket and expect ticket id to appear
    await userEvent.click(getTicketButton);

    await waitFor(() => expect(screen.getByText(/Your ticket ID is: 42/)).toBeInTheDocument());
  });
});
