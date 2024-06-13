import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import XpertResultCard from '../xpertResultCard/XpertResultCard';
import { useXpertResultsWithThreshold } from '../data/hooks';
import { CONTENT_TYPE_COURSE, CONTENT_TYPE_PROGRAM, EXEC_ED_TITLE } from '../../../constants';

jest.mock('../data/hooks', () => ({
  useXpertResultsWithThreshold: jest.fn(),
}));

const mockGetXpertResultsWithThreshold = jest.fn();

const messages = {
  'catalogs.askXpert.result.card.heading': 'Xpert',
  'catalogs.askXpert.result.card.label.for.results': 'Results: {query}',
  'catalogs.askXpert.result.card.label.for.self.paced.courses': 'Self-paced courses',
  'catalogs.askXpert.result.card.label.for.self.paced.programs': 'Self-paced programs',
  'catalogs.askXpert.result.card.label.for.executive.education.courses': 'Executive education courses',
  'catalogs.askXpert.result.card.error.label': 'An error occurred. Please try a new search',
};

const defaultProps = {
  taskId: 'task-id',
  query: 'test query',
  results: {
    ocm_courses: [],
    exec_ed_courses: [],
    programs: [],
  },
  onClose: jest.fn(),
  onXpertResults: jest.fn(),
};

const renderXpertResultCard = (props = {}) => render(
  <IntlProvider locale="en" messages={messages}>
    <XpertResultCard {...defaultProps} {...props} />
  </IntlProvider>,
);

describe('XpertResultCard', () => {
  beforeEach(() => {
    useXpertResultsWithThreshold.mockReturnValue({
      loading: false,
      error: null,
      xpertResultsData: {},
      getXpertResultsWithThreshold: mockGetXpertResultsWithThreshold,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    renderXpertResultCard();
    expect(screen.getByText('Xpert')).toBeInTheDocument();
    expect(screen.getByText('Results:')).toBeInTheDocument();
    expect(screen.getByText('Self-paced courses')).toBeInTheDocument();
    expect(screen.getByText('Self-paced programs')).toBeInTheDocument();
    expect(screen.getByText('Executive education courses')).toBeInTheDocument();
  });

  it('calls onClose when New Search button is clicked', () => {
    renderXpertResultCard();
    fireEvent.click(screen.getByText('New Search'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Close icon is clicked', () => {
    renderXpertResultCard();
    fireEvent.click(screen.getByLabelText('Close XpertResultCard'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('updates the threshold value and triggers API call on slider change', async () => {
    renderXpertResultCard();
    const slider = screen.getByLabelText('Xpert result card slider');
    fireEvent.change(slider, { target: { value: '0.4' } });

    await waitFor(() => expect(mockGetXpertResultsWithThreshold).toHaveBeenCalledTimes(1), { timeout: 1500 });
    expect(mockGetXpertResultsWithThreshold).toHaveBeenCalledWith('task-id', 0.4);
  });

  it('displays error message when there is an error', () => {
    useXpertResultsWithThreshold.mockReturnValue({
      loading: false,
      error: 'An error occurred',
      xpertResultsData: {},
      getXpertResultsWithThreshold: mockGetXpertResultsWithThreshold,
    });

    renderXpertResultCard();
    expect(screen.getByText('An error occurred. Please try a new search')).toBeInTheDocument();
  });

  it('updates xpertResults and calls onXpertResults when xpertResultsData changes', async () => {
    const newXpertResultsData = {
      ocm_courses: [{ aggregation_key: 'key1' }],
      exec_ed_courses: [{ aggregation_key: 'key2' }],
      programs: [{ aggregation_key: 'key3' }],
    };

    useXpertResultsWithThreshold.mockReturnValue({
      loading: false,
      error: null,
      xpertResultsData: newXpertResultsData,
      getXpertResultsWithThreshold: mockGetXpertResultsWithThreshold,
    });

    renderXpertResultCard();

    await waitFor(() => {
      expect(defaultProps.onXpertResults).toHaveBeenCalledWith({
        [CONTENT_TYPE_COURSE]: ['key1'],
        [EXEC_ED_TITLE]: ['key2'],
        [CONTENT_TYPE_PROGRAM]: ['key3'],
      });
    });
  });
});
