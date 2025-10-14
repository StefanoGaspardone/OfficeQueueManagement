/* TEST-TYPE: Integration
  RATIONALE: Tests Officer component with API calls for counters, queues and next-customer action; network endpoints are mocked.
*/
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OfficerPage from '../Officer';

describe('OfficerPage', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('fetches counters, shows queues and calls next customer', async () => {
    global.fetch = jest.fn((url, opts) => {
      if (url.includes('/api/counters') && !url.includes('/queues')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ counters: [1,2] }) });
      }
      if (url.includes('/api/counters/1/queues')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ queues: { 'Service A': [{ id: 10, issuetime: '10:00' }], 'Service B': [] } }) });
      }
      if (url.includes('/api/counters/1/tickets') && opts && opts.method === 'POST') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ticketId: 10 }) });
      }
      return Promise.resolve({ ok: false });
    });

    render(<OfficerPage />);

    // Wait for select options
    await waitFor(() => expect(screen.getByLabelText(/Select Counter/i)).toBeInTheDocument());

  const select = screen.getByLabelText(/Select Counter/i);
  // wait for option to be present
  await waitFor(() => expect(screen.getByRole('option', { name: /Counter 1/ })).toBeInTheDocument());
  // select option by changing value
  await userEvent.selectOptions(select, '1');

    // Wait for queues to render
    await waitFor(() => expect(screen.getByText(/Queues for Counter 1/)).toBeInTheDocument());
    expect(screen.getByText('Service A')).toBeInTheDocument();
    expect(screen.getByText('Issued at 10:00')).toBeInTheDocument();

    const callButton = screen.getByRole('button', { name: /Call next customer/i });
    await userEvent.click(callButton);

    // After calling next customer, OfficerPage will re-fetch queues — ensure fetch was called for POST
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/counters/1/tickets'), expect.objectContaining({ method: 'POST' }));
  });
});
