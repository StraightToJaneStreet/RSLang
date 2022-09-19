type RegularVariant = {
  status: 'REGULAR';
};

type SuccessVariant = {
  status: 'SUCCESS';
  message: string;
};

type FailVariant = {
  status: 'FAIL';
  message: string;
};

export type FormVariant = RegularVariant | SuccessVariant | FailVariant;

export const createRegularVariant = (): RegularVariant => ({ status: 'REGULAR' });
export const createSuccessVariant = (message: string): SuccessVariant => ({ status: 'SUCCESS', message });
export const createFailVariant = (message: string): FailVariant => ({ status: 'FAIL', message });

export const isRegularVariant = (variant: FormVariant): variant is RegularVariant => variant.status === 'REGULAR';
export const isSuccessVariant = (variant: FormVariant): variant is SuccessVariant => variant.status === 'SUCCESS';
export const isFailVariant = (variant: FormVariant): variant is FailVariant => variant.status === 'FAIL';
