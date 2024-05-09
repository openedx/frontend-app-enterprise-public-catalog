import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AskXpertQueryField from '../AskXpertQueryField';

describe('AskXpertQueryField Component', () => {
  const mockOnSubmit = jest.fn();
  const mockIsDisabled = false;
  const placeholderText = 'Describe a skill, competency or job title you are trying to train';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AskXpertQueryField component correctly', () => {
    render(<AskXpertQueryField onSubmit={mockOnSubmit} isDisabled={mockIsDisabled} />);

    const inputElement = screen.getByPlaceholderText(placeholderText);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toBeEnabled();
  });

  test('triggers onSubmit callback when Send button is clicked', async () => {
    render(<AskXpertQueryField onSubmit={mockOnSubmit} isDisabled={mockIsDisabled} />);

    const inputElement = screen.getByPlaceholderText(placeholderText);
    fireEvent.change(inputElement, { target: { value: 'Mock query' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('does not trigger onSubmit callback when input is empty', () => {
    render(<AskXpertQueryField onSubmit={mockOnSubmit} isDisabled={mockIsDisabled} />);

    const inputElement = screen.getByPlaceholderText(placeholderText);

    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('does not trigger onSubmit callback when component is disabled', () => {
    render(<AskXpertQueryField onSubmit={mockOnSubmit} isDisabled />);

    const inputElement = screen.getByPlaceholderText(placeholderText);
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    fireEvent.click(screen.getByLabelText('Enter Ask Xpert Query'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
