import * as React from 'react';
import { FormikContextType } from './types';
import invariant from 'tiny-warning';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

export const formikStore = createStore<FormikContextType<any> | undefined>(() =>
  undefined
);

export function FormikProvider<Values>({
  value,
  children,
}: {
  value: FormikContextType<Values>;
  children: React.ReactNode;
}) {
  React.useLayoutEffect(() => {
    formikStore.setState(value);
  }, [value]);
  return <>{children}</>;
}

export function useFormikContext<Values>() {
  const formik = useStore(formikStore) as FormikContextType<Values> | undefined;

  invariant(
    !!formik,
    `Formik context is undefined, please verify you are calling useFormikContext() as child of a <Formik> component.`
  );

  return formik as FormikContextType<Values>;
}

export const FormikConsumer: React.FC<{
  children: (formik: FormikContextType<any>) => React.ReactNode;
}> = ({ children }) => {
  const formik = useStore(formikStore);
  return <>{formik ? children(formik) : null}</>;
};
