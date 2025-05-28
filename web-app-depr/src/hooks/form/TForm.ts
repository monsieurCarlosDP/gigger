
export type ValueErrors = string[];

export interface IInitValueObjectDTO<T> {
    value: T;
    initialValue?: T;  }
  

export interface IFieldValidated<TFieldValue> extends IInitValueObjectDTO<TFieldValue> {
    validator?: (value: TFieldValue) => ValueErrors;
    valid: boolean;
    required: boolean;
    errors: ValueErrors;
    changed: boolean;
  }
  
export type TFormFields<TForm> = {
    [TField in keyof TForm]: IFieldValidated<TForm[TField]>;
  };
  