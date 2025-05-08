import { renderHook, act, waitFor } from '@testing-library/react';
import useInterval, { useXpertResultsWithThreshold } from '../../data/hooks';
import EnterpriseCatalogAiCurationApiService from '../../data/service';

jest.mock('../../data/service');
jest.mock('@edx/frontend-platform/logging');

describe('useInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should call callback after specified delay', () => {
    const callback = jest.fn();

    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not call callback if delay is null', () => {
    const callback = jest.fn();

    renderHook(() => useInterval(callback, null));

    jest.advanceTimersByTime(1000);

    expect(callback).not.toBeCalled();
  });

  it('should clear interval on unmount', () => {
    const callback = jest.fn();

    const { unmount } = renderHook(() => useInterval(callback, 1000));

    unmount();

    jest.advanceTimersByTime(1000);

    expect(callback).not.toBeCalled();
  });
});

describe('useXpertResultsWithThreshold', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useXpertResultsWithThreshold());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.xpertResultsData).toEqual([]);
  });

  it('should fetch results and update state correctly on success', async () => {
    const mockResponse = {
      status: 200,
      data: { result: { ocm_courses: [], exec_ed_courses: [], programs: [] } },
    };
    EnterpriseCatalogAiCurationApiService.getXpertResults.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useXpertResultsWithThreshold());

    act(() => {
      result.current.getXpertResultsWithThreshold('task-id', 0.5);
    });
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.xpertResultsData).toEqual(mockResponse.data.result);
    });
  });

  it('should handle errors correctly', async () => {
    const mockError = new Error('Network Error');
    EnterpriseCatalogAiCurationApiService.getXpertResults.mockRejectedValue(mockError);

    const { result } = renderHook(() => useXpertResultsWithThreshold());
    act(() => {
      result.current.getXpertResultsWithThreshold('task-id', 0.5);
    });
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.error).toBe(mockError));
    await waitFor(() => expect(result.current.xpertResultsData).toEqual({}));
  });

  it('should handle HTTP errors correctly', async () => {
    const mockResponse = {
      status: 500,
      data: { error: 'Internal Server Error' },
    };
    EnterpriseCatalogAiCurationApiService.getXpertResults.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useXpertResultsWithThreshold());

    act(() => {
      result.current.getXpertResultsWithThreshold('task-id', 0.5);
    });
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockResponse.data.error);
      expect(result.current.xpertResultsData).toEqual({});
    });
  });
});
