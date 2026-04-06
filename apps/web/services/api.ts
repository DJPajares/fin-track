import currenciesMockData from '@shared/mockData/currencies.json';
import typesMockData from '@shared/mockData/types.json';
import type {
  CustomCategoryRequest,
  FetchCategoryRequest,
} from 'packages/shared/types/Category';
import { ErrorProps } from 'packages/shared/types/Error';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

type ApiError = {
  message: string;
  status: number;
  code: string;
  data: ErrorProps;
};

const toAbsoluteUrl = (path: string): string => {
  const normalizedBase = BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${normalizedBase}/${normalizedPath}`;
};

const parseJsonResponse = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
};

const getErrorData = (payload: unknown): ErrorProps | undefined => {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const payloadRecord = payload as Record<string, unknown>;
  const nestedError = payloadRecord.error;

  if (nestedError && typeof nestedError === 'object') {
    return nestedError as ErrorProps;
  }

  return payload as ErrorProps;
};

const request = async (
  path: string,
  init: RequestInit = {},
): Promise<unknown> => {
  const headers = new Headers(init.headers);

  headers.set('Access-Control-Allow-Origin', '*');
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(toAbsoluteUrl(path), {
    ...init,
    headers,
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    const data = getErrorData(payload);
    const message =
      data?.message || response.statusText || 'An unexpected error occurred';

    const error: ApiError = {
      message,
      status: response.status,
      code: data?.code ? String(data.code) : 'HTTP_ERROR',
      data: data || { message },
    };

    throw error;
  }

  return payload;
};

const handleApiError = (error: unknown) => {
  if (error && typeof error === 'object') {
    const maybeError = error as Partial<ApiError>;
    const message = maybeError.message || 'An unexpected error occurred';
    const status =
      typeof maybeError.status === 'number' ? maybeError.status : 500;
    const code = maybeError.code || 'UNKNOWN_ERROR';
    const data = maybeError.data || { message };

    return {
      message,
      status,
      code,
      data,
    };
  }

  return {
    message: 'An unknown error occurred',
    status: 500,
    code: 'UNKNOWN_ERROR',
    data: { message: 'An unknown error occurred' },
  };
};

const fetchCategoriesApi = async ({ userId }: FetchCategoryRequest) => {
  const url = `categories?sort=name${userId ? `&userId=${userId}` : ''}`;

  try {
    return await request(url);
  } catch (error) {
    throw handleApiError(error);
  }
};

const createCustomCategoryApi = async (categoryData: CustomCategoryRequest) => {
  const url = `categories/custom`;

  try {
    return await request(url, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

const updateCategoryApi = async (categoryData: CustomCategoryRequest) => {
  const url = `categories/${categoryData._id}`;

  try {
    return await request(url, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

// --- old implementation below ---

const typesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/types?sort=name`;
const currenciesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/currencies?sort=name`;

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const fetchTypes = async () => {
  try {
    if (useMockedData) return typesMockData;

    const response = await fetch(typesUrl, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch types with status ${response.status}`);
    }

    const data = (await response.json()) as { data?: unknown };
    return data.data;
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const fetchCurrencies = async () => {
  try {
    if (useMockedData) return currenciesMockData;

    const response = await fetch(currenciesUrl, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch currencies with status ${response.status}`,
      );
    }

    const data = (await response.json()) as { data?: unknown };
    return data.data;
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const fetchCurrencyByName = async (name: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/currencies/by-name/${name}`;

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch currency by name with status ${response.status}`,
      );
    }

    return (await response.json()) as unknown;
  } catch (error) {
    console.error('Fetch currency by name failed', error);
    throw error;
  }
};

export {
  createCustomCategoryApi,
  fetchCategoriesApi,
  fetchCurrencies,
  fetchCurrencyByName,
  fetchTypes,
  updateCategoryApi,
};
