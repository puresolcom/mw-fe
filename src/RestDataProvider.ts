import axios, { AxiosInstance } from "axios";
import { stringify } from "query-string";
import {
  DataProvider,
  HttpError,
  CrudOperators,
  CrudFilters,
} from "@pankod/refine";
import { CrudSorting } from "@pankod/refine/dist/interfaces";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case "ne":
    case "gte":
    case "lte":
      return `_${operator}`;
    case "contains":
      return "_like";
    case "eq":
      return "";
    default:
      throw Error(`Operator ${operator} is not supported`);
  }
};

const generateSort = (sorts?: CrudSorting) => {
  if (sorts && sorts.length > 0) {
    const sort: string[] = [];
    const order: string[] = [];

    sorts.map((item) => {
      sort.push(item.field);
      order.push(item.order);
    });

    return {
      sort,
      order,
    };
  }

  return;
};

const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};
  if (filters) {
    filters.map(({ field, operator, value }) => {
      if (field === "q") {
        queryFilters[field] = value;
        return;
      }

      const mappedOperator = mapOperator(operator);
      queryFilters[`${field}${mappedOperator}`] = value;
    });
  }

  return queryFilters;
};

const JsonServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): DataProvider => ({
  getList: async ({ resource, pagination, filters, sort }) => {
    const url = `${apiUrl}/${resource}`;

    // pagination
    const current = pagination?.current || 1;
    const pageSize = pagination?.pageSize || 10;

    const queryFilters = generateFilter(filters);

    const query: {
      page: number;
      perPage: number;
      sort?: string;
      order?: string;
    } = {
      page: (current - 1) * pageSize,
      perPage: current * pageSize,
    };

    const generatedSort = generateSort(sort);
    if (generatedSort) {
      const { sort, order } = generatedSort;
      query.sort = sort.join(",");
      query.order = order.join(",");
    }

    const { data, headers } = await httpClient.get(
      `${url}?${stringify(query)}&${stringify(queryFilters)}`
    );

    const total = +headers["x-total-count"];

    return {
      data,
      total,
    };
  },

  getMany: async ({ resource, ids }) => {
    const { data } = await httpClient.get(
      `${apiUrl}/${resource}?${stringify({ id: ids })}`
    );

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`;

    const { data } = await httpClient.post(url, variables);

    return {
      data,
    };
  },

  createMany: async ({ resource, variables }) => {
    const response = await Promise.all(
      variables.map(async (param) => {
        const { data } = await httpClient.post(`${apiUrl}/${resource}`, param);
        return data;
      })
    );

    return { data: response };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.patch(url, variables);

    return {
      data,
    };
  },

  updateMany: async ({ resource, ids, variables }) => {
    const response = await Promise.all(
      ids.map(async (id) => {
        const { data } = await httpClient.patch(
          `${apiUrl}/${resource}/${id}`,
          variables
        );
        return data;
      })
    );

    return { data: response };
  },

  getOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.get(url);

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.delete(url);

    return {
      data,
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const response = await Promise.all(
      ids.map(async (id) => {
        const { data } = await httpClient.delete(`${apiUrl}/${resource}/${id}`);
        return data;
      })
    );
    return { data: response };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({ url, method, filters, sort, payload, query, headers }) => {
    let requestUrl = `${url}?`;

    if (sort) {
      const generatedSort = generateSort(sort);
      if (generatedSort) {
        const { sort, order } = generatedSort;
        const sortQuery = {
          sort: sort.join(","),
          order: order.join(","),
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headers,
      };
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload);
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url);
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
});

export default JsonServer;
