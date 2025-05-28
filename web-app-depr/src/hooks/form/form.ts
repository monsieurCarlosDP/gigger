import { useState, useReducer } from "react";
import { TFormFields, ValueErrors} from "./TForm"
import { formStateReducer, TFormActions } from "./FormState";
// Calculated valid and changed fields
interface IFormValidationState<TForm> {
    invalidFields: Set<keyof TForm>;
    changedFields: Set<keyof TForm>;
  }

// form and flags 
interface IFormInteractions<TForm> {
    form: TFormFields<TForm>;
    invalid: boolean;
    changed: boolean;
  
    setFieldValue: <TField extends keyof TForm>(field: TField, value: TForm[TField]) => void;
    setFieldRequired: <TField extends keyof TForm>(field: TField, required: boolean) => void;
    setFieldErrors: <TField extends keyof TForm>(field: TField, errors: ValueErrors) => void;
    setFormFieldValues: (formFieldValues: TForm, resetInitialValues?: boolean) => void;
  }

export const useForm = <TForm>(initialForm: TFormFields<TForm>): IFormInteractions<TForm> => {
    const [initialFormState, setInitialFormState] = useState(initialForm);
    const [formValidationState, setFormValidationState] = useState<IFormValidationState<TForm>>({
        invalidFields: new Set<keyof TForm>(),
        changedFields: new Set<keyof TForm>(),
    });

    const [formState, dispatch] = useReducer<React.Reducer<TFormFields<TForm>, TFormActions<TForm>>>(
      formStateReducer<TForm>,
      initialForm,
    );
    

}