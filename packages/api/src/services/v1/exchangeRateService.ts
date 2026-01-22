import {
  ExchangeRateModel,
  ExchangeRateProps,
} from '../../models/v1/exchangeRateModel';
import type { QueryParamsProps, SortObjProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: ExchangeRateProps) => {
  return await ExchangeRateModel.create(data);
};

const getAll = async (query: QueryParamsProps) => {
  // [SAMPLE ENDPOINT]: /exchangeRates?page=2&limit=4&sort=-name

  const { filter, sort } = query;

  // Pagination
  const totalDocuments = await ExchangeRateModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // Filter
  const filterObj = filter ? JSON.parse(filter) : {};

  // Sort
  const sortObj: SortObjProps = {};
  if (sort) {
    sort.split(',').forEach((sortField: string) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }

  const data = await ExchangeRateModel.find(filterObj)
    .sort(sortObj)
    .collation({ locale: 'en' }) // case insensitive sorting
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination,
  };
};

const get = async (_id: ExchangeRateProps['_id']) => {
  return await ExchangeRateModel.find({ _id });
};

const update = async (
  _id: ExchangeRateProps['_id'],
  data: ExchangeRateProps,
) => {
  return await ExchangeRateModel.findByIdAndUpdate({ _id }, data, {
    new: true,
  });
};

const remove = async (_id: ExchangeRateProps['_id']) => {
  return await ExchangeRateModel.findByIdAndDelete({ _id });
};

const getLatest = async () => {
  try {
    // Fetch from external API
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates from external API');
    }

    const externalData = await response.json();

    // Transform to our schema format
    const exchangeRateData = {
      baseCurrency: externalData.base,
      date: new Date(externalData.date),
      rates: externalData.rates,
    };

    // Check if we already have this data for the same date
    const existingRate = await ExchangeRateModel.findOne({
      baseCurrency: exchangeRateData.baseCurrency,
      date: exchangeRateData.date,
    });

    // If exists, return it; otherwise create a new one
    if (existingRate) {
      return existingRate;
    }

    const newRate = await ExchangeRateModel.create(exchangeRateData);
    return newRate;
  } catch (error) {
    throw new Error(
      `Error fetching latest exchange rates: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export { create, getAll, get, update, remove, getLatest };
