import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { DonationButton } from '../DonationButton';

const useDeviceDetectMock = vi.fn();
vi.mock('../../../hooks/useDeviceDetect', () => ({
  useDeviceDetect: () => useDeviceDetectMock(),
}));

describe('DonationButton', () => {
  beforeEach(() => {
    useDeviceDetectMock.mockReturnValue(false);
    vi.stubEnv('VITE_DONATION_URL', 'https://mp.example.com/donate');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
    useDeviceDetectMock.mockReset();
  });

  it('renders nothing when VITE_DONATION_URL is missing or empty', () => {
    vi.stubEnv('VITE_DONATION_URL', '');
    const { container } = render(<DonationButton />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a donation link with icon and label on desktop', () => {
    render(<DonationButton />);

    const link = screen.getByRole('link', { name: 'Dona' });
    expect(link.getAttribute('href')).toBe('https://mp.example.com/donate');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.className).toContain('fixed');
    expect(link.className).toContain('bottom-5');
    expect(link.className).toContain('left-5');
    expect(link.querySelector('svg')).toBeTruthy();
    expect(screen.getByText('Dona')).toBeTruthy();
  });

  it('keeps the label visible on mobile before the 3s timer fires', () => {
    vi.useFakeTimers();
    useDeviceDetectMock.mockReturnValue(true);
    render(<DonationButton />);

    const label = screen.getByTestId('donation-label');
    expect(label.className).toContain('opacity-100');
    expect(label.className).not.toContain('opacity-0');
  });

  it('hides the label after 3 seconds on mobile but keeps the icon', () => {
    vi.useFakeTimers();
    useDeviceDetectMock.mockReturnValue(true);
    render(<DonationButton />);

    const label = screen.getByTestId('donation-label');
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(label.className).toContain('opacity-0');
    expect(screen.getByRole('link', { name: 'Dona' })).toBeTruthy();
  });
});
