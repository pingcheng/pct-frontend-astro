import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';

// Mock the profile data for consistent tests
vi.mock('@/data/profile', () => ({
    profile: {
        avatarUrl: 'https://example.com/avatar.jpg',
        fullName: 'Test User'
    }
}));

describe('Avatar Component', () => {
    it('renders the image by default', () => {
        render(<Avatar width={100} height={100} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
        expect(img).toHaveAttribute('alt', 'Test User profile photo');
    });

    it('renders fallback when image loading errors', () => {
        render(<Avatar width={100} height={100} />);
        const img = screen.getByRole('img');

        // Trigger error event
        fireEvent.error(img);

        // Original image is unmounted, replaced by fallback div
        expect(screen.queryByRole('img', { name: 'Test User profile photo' })).toBeNull();
        // Fallback div has role='img' and aria-label
        expect(screen.getByLabelText('Test User profile photo (image unavailable)')).toBeInTheDocument();
        expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('uses provided alt text', () => {
        render(<Avatar width={100} height={100} alt="Custom Alt" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Custom Alt');
    });

    it('adds custom className', () => {
        render(<Avatar width={100} height={100} className="custom-class" />);
        const container = screen.getByRole('img').parentElement;
        expect(container).toHaveClass('custom-class');
    });
});
