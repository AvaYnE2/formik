import * as React from 'react';
import { FormikContextType } from './types';
import invariant from 'tiny-warning';
import { createStore, StoreApi } from 'zustand';
import { useStore } from 'zustand';

const FormikStoreContext = React.createContext<StoreApi<FormikContextType<any>> | undefined>(
  undefined
);
FormikStoreContext.displayName = 'FormikStoreContext';

export function FormikProvider<Values>({
  value,
  children,
}: {
  value: FormikContextType<Values>;
  children: React.ReactNode;
}) {
  const storeRef = React.useRef<StoreApi<FormikContextType<Values>>>();

  if (!storeRef.current) {
    storeRef.current = createStore<FormikContextType<Values>>(() => value);
  }

  React.useLayoutEffect(() => {
    storeRef.current!.setState(value);
  }, [value]);

  return (
    <FormikStoreContext.Provider value={storeRef.current}>
      {children}
    </FormikStoreContext.Provider>
  );
}

export function useFormikContext<Values>() {
  const store = React.useContext(FormikStoreContext);

  invariant(
    !!store,
    `Formik context is undefined, please verify you are calling useFormikContext() as child of a <Formik> component.`
  );

  return useStore(store!) as FormikContextType<Values>;
}

export const FormikConsumer: React.FC<{
  children: (formik: FormikContextType<any>) => React.ReactNode;
}> = ({ children }) => {
  const formik = useFormikContext<any>();
  return <>{children(formik)}</>;
};
