import { TFormFields, ValueErrors } from "./TForm";

export type TFormActions<TForm> =
  | TSetFieldValueAction<TForm, keyof TForm>
  | TSetFieldRequiredAction<TForm, keyof TForm>
  | TSetFieldErrorsAction<TForm, keyof TForm>
  | IAction<'setFormFieldValues', { formFieldValues: TForm; resetInitialValues?: boolean }>
  | IAction<'resetForm', { form: TFormFields<TForm> }>;

  interface IAction<T, P = undefined> {
    type: T;
    payload: P;
  }
  
  type TSetFieldValueAction<TForm, TField extends keyof TForm> = IAction<
    'setFieldValue',
    { field: TField; value: TForm[TField] }
  >;
  
  type TSetFieldRequiredAction<TForm, TField extends keyof TForm> = IAction<
    'setFieldRequired',
    { field: TField; required: boolean }
  >;
  
  type TSetFieldErrorsAction<TForm, TField extends keyof TForm> = IAction<
    'setFieldErrors',
    { field: TField; errors: ValueErrors }
  >;

  export const formStateReducer = <TForm>(state: TFormFields<TForm>, action: TFormActions<TForm>): TFormFields<TForm> => {
    let newState = { ...state };
  switch (action.type) {
    case 'setFieldValue': {
      const fieldName = action.payload.field;
      const field = state[fieldName];
      const value = action.payload.value;
      const validatorErrors = field?.validator?.(value) ?? [];
      const errors = toBuildFieldErrors({ required: field.required, value, errors: validatorErrors });
      const changed = toBuildFieldChanged({ value, initialValue: field.initialValue });
      newState[fieldName] = {
        ...field,
        value,
        errors,
        changed,
        valid: errors.length === 0,
      };
      return newState;
    }

    case 'setFieldRequired': {
      const fieldName = action.payload.field;
      const field = state[fieldName];
      const required = action.payload.required;
      const errors = toBuildFieldErrors({ required, value: field.value, errors: field.errors });
      newState[fieldName] = {
        ...field,
        valid: errors.length === 0,
        errors,
        required,
      };
      return newState;
    }

    case 'setFieldErrors': {
      const fieldName = action.payload.field;
      const field = state[fieldName];
      newState[fieldName] = {
        ...field,
        valid: action.payload.errors.length === 0,
        errors: [...action.payload.errors],
      };
      return newState;
    }

    case 'setFormFieldValues': {
      const resetInitialValues = action.payload.resetInitialValues ?? true;
      const formFieldValues = action.payload.formFieldValues;
      for (const fieldName in formFieldValues) {
        const value = formFieldValues[fieldName];
        const field = state[fieldName];

        if (resetInitialValues) {
          newState[fieldName] = toBuildField(value, field.required, field?.validator);
        } else {
          const validatorErrors = field?.validator?.(value) ?? [];
          const errors = toBuildFieldErrors({
            required: field.required,
            value,
            errors: validatorErrors,
          });
          const changed = toBuildFieldChanged({ value, initialValue: field.initialValue });
          newState[fieldName] = {
            ...field,
            value,
            errors,
            changed,
            valid: errors.length === 0,
          };
        }
      }
      return newState;
    }

    case 'resetForm': {
      return action.payload.form;
    }

    default: {
      action satisfies never;
      return newState;
    }
  }
  }