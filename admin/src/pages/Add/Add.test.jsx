import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import axios from 'axios';
import {toast} from 'react-toastify';
import Add from './Add';
import '@testing-library/jest-dom';

vi.mock('axios');
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

vi.mock('../../assets/assets', () => ({
    assets: {
        upload_area: '/mock-path/upload_area.png'
    }
}));

describe('Add page', () => {
    const mockUrl = 'http://localhost:4000';

    beforeEach(() => {
        vi.resetAllMocks();
        global.URL.createObjectURL = vi.fn(() => 'mocked-url');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Form rendering', () => {
        it('renders the form with all input fields', () => {
            render(
                <Add url={mockUrl} />
            );
            expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();

            expect(screen.getByText(/Product Name/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Type here/i)).toBeInTheDocument();

            expect(screen.getByText(/Description/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Write content here/i)).toBeInTheDocument();

            expect(screen.getByText(/Category/i)).toBeInTheDocument();
            const categorySelect = screen.getByRole('combobox');
            expect(categorySelect).toBeInTheDocument(); 

            expect(screen.getByText(/Product Price/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/\$20/i)).toBeInTheDocument();

            expect(screen.getByRole('button', {name: /Add/i})).toBeInTheDocument();
        });

        it('has all required category options', () => {
            render(
                <Add url={mockUrl} />
            );
            const categorySelect = screen.getByRole('combobox');
            const options = Array.from(categorySelect.options).map(option => option.value);

            expect(options).toContain('Salad');
            expect(options).toContain('Rolls');
            expect(options).toContain('Deserts');
            expect(options).toContain('Sandwich');
            expect(options).toContain('Cake');
            expect(options).toContain('Pure Veg');
            expect(options).toContain('Pasta');
            expect(options).toContain('Noodles'); 
        });
    });
    describe ("Input handling", () => {
        it("updates state when input values change", () => {
            render(
                <Add url={mockUrl}/>
            );

            const nameInput = screen.getByPlaceholderText(/Type here/i);
            fireEvent.change(nameInput, {target: {value: 'Test pizza'}});
            expect(nameInput.value).toBe('Test pizza');

            const descriptionInput = screen.getByPlaceholderText(/Write content here/i);
            fireEvent.change(descriptionInput, {target: {value: 'Test description'}});
            expect(descriptionInput.value).toBe('Test description');

            const categorySelect = screen.getByRole('combobox');
            fireEvent.change(categorySelect, {target: {value: 'Pasta'}});
            expect(categorySelect.value).toBe('Pasta');

            const priceInput = screen.getByPlaceholderText(/\$20/i);
            fireEvent.change(priceInput, {target: {value: '30'}});
            expect(priceInput.value).toBe('30');
        });
    });
})