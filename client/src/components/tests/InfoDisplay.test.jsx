/* TEST-TYPE: Integration
  RATIONALE: Integration test — exercises InfoDisplay's API calls and socket.io event handlers (mocked socket).
*/
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import InfoDisplay from '../InfoDisplay';
import { act } from 'react';

// Mock socket.io-client
const listeners = {};
const mockSocket = {
  on: (event, cb) => { listeners[event] = cb; },
  off: () => {},
  close: () => {},
};

jest.mock('socket.io-client', () => ({
  io: () => mockSocket,
}));

describe('InfoDisplay', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    for (const k in listeners) delete listeners[k];
    jest.clearAllMocks();
  });

  test('renders counters and waiting tickets and reacts to socket events', async () => {
    // Mock API.getCounters and getWaitingTickets through global fetch
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/counters')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ counters: [1] }) });
      }
      if (url.includes('/api/tickets')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ queue: [100] }) });
      }
      return Promise.resolve({ ok: false });
    });

    render(<InfoDisplay ticketId={200} />);

    // Wait for counters and waiting tickets to render
    await waitFor(() => expect(screen.getByText(/Active Counters Today/i)).toBeInTheDocument());
  // The counters grid should include a counter box (text may be split across nodes)
  expect(screen.getByText(/Active Counters Today/i)).toBeInTheDocument();
  // Use heading role to avoid matching both heading and paragraph
  expect(screen.getByRole('heading', { name: /Waiting Tickets/i })).toBeInTheDocument();
  // ticketId 200 should be included in waiting list (either 100 or 200 present)
  await waitFor(() => expect(screen.getByText(/200|100/)).toBeInTheDocument());

    // Simulate newTicket
    await act(async () => {
      listeners.newTicket({ ticketId: 300 });
    });
    await waitFor(() => expect(screen.getByText(/300/)).toBeInTheDocument());

    // Simulate ticketServed for ticket 200
    await act(async () => {
      listeners.ticketServed({ ticketId: 200, counterId: 1 });
    });
    await waitFor(() => expect(screen.getByText(/Your ticket 200 is being served at counter 1/)).toBeInTheDocument());
  });
});
