import { SerializedError } from '@reduxjs/toolkit';

interface UnknownError {
  status: number;
  data: unknown;
}

interface FetchError {
  status: 'FETCH_ERROR';
  data?: undefined;
  error: string;
}

interface ParsingError {
  status: 'PARSING_ERROR';
  originalStatus: number;
  data: string;
  error: string;
}

interface CustomError {
  status: 'CUSTOM_ERROR';
  data?: unknown;
  error: string;
}

type KnownError = FetchError | ParsingError | CustomError;

export const isSuccessResponse = <T>(response: { data: T } | Record<string, unknown>): response is { data: T } =>
  'data' in response;

export const isSerializedError = (error: { status: unknown } | SerializedError): error is SerializedError =>
  !('status' in error);

export const isUnknownError = (error: { status: number | string }): error is UnknownError =>
  typeof error.status === 'number';

export const isFetchError = (error: KnownError): error is FetchError => error.status === 'FETCH_ERROR';
export const isParsingError = (error: KnownError): error is ParsingError => error.status === 'PARSING_ERROR';
export const isCustomError = (error: KnownError): error is CustomError => error.status === 'CUSTOM_ERROR';
