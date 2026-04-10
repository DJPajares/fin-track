import currenciesMockData from '@shared/mockData/currencies.json';
import typesMockData from '@shared/mockData/types.json';
import type {
  CategoryDataResponse,
  CategoryResponse,
  CustomCategoryRequest,
  FetchCategoryRequest,
} from '@shared/types/Category';
import { ErrorProps } from '@shared/types/Error';
import type { ListProps } from '@shared/types/List';
import type { CurrencyProps } from '@web/types/Currency';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

type ApiError = {
  message: string;
  status: number;
  code: string;
  data: ErrorProps;
};

type TypeOption = ListProps & {
  id: string;
};

const normalizeTypeOptions = (
  types: Array<{ _id: string; name: string; id?: string }>,
): TypeOption[] => {
  return types.map((type) => ({
    value: type._id,
    label: type.name,
    id: type.id || type.name.toLowerCase(),
  }));
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

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
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

  return payload as T;
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

const fetchCategoriesApi = async ({
  userId,
}: FetchCategoryRequest): Promise<CategoryResponse> => {
  const url = `categories?sort=name${userId ? `&userId=${userId}` : ''}`;

  try {
    return await request(url);
  } catch (error) {
    throw handleApiError(error);
  }
};

const createCustomCategoryApi = async (
  categoryData: CustomCategoryRequest,
): Promise<CategoryDataResponse> => {
  const url = `categories/custom`;

  try {
    return await request<CategoryDataResponse>(url, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

const updateCategoryApi = async (
  categoryData: CustomCategoryRequest,
): Promise<CategoryDataResponse> => {
  const url = `categories/${categoryData._id}`;

  try {
    return await request<CategoryDataResponse>(url, {
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

const fetchTypes = async (): Promise<TypeOption[]> => {
  try {
    if (useMockedData) {
      return normalizeTypeOptions(typesMockData);
    }

    const response = await fetch(typesUrl, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch types with status ${response.status}`);
    }

    const data = (await response.json()) as {
      data?: Array<{ _id: string; name: string; id?: string }>;
    };
    return normalizeTypeOptions(data.data || []);
  } catch (error) {
    console.error('Fetch failed', error);
    return [];
  }
};

const fetchCurrencies = async (): Promise<CurrencyProps[]> => {
  try {
    if (useMockedData) return currenciesMockData as CurrencyProps[];

    const response = await fetch(currenciesUrl, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch currencies with status ${response.status}`,
      );
    }

    const data = (await response.json()) as { data?: CurrencyProps[] };
    return data.data || [];
  } catch (error) {
    console.error('Fetch failed', error);
    return [];
  }
};

const fetchCurrencyByName = async (name: string): Promise<CurrencyProps> => {
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

    const data = (await response.json()) as CurrencyProps | null;

    if (!data) {
      throw new Error(`Currency not found: ${name}`);
    }

    return data;
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
