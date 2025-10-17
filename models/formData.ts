export interface FormField {
  label: string;
  formControlName: string;
  placeholder: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  autocomplete?: boolean;
  options?: FormFieldSelectOption[];
}

export interface FormFieldSelectOption {
  value: string;
  label: string;
}

export const formFieldsUsingText: FormField[] = [
  { label: 'First Name', formControlName: 'firstname', placeholder: 'First Name', type: 'text', autocomplete: true },
  { label: 'Last Name', formControlName: 'lastname', placeholder: 'Last Name', type: 'text' },
  { label: 'Age', formControlName: 'age', placeholder: 'Age', type: 'number' },
  { label: 'Street', formControlName: 'street', placeholder: 'Street', type: 'text' },
  { label: 'City', formControlName: 'city', placeholder: 'City', type: 'text', },
  { label: 'Country', formControlName: 'country', placeholder: 'Country', type: 'text', },
  { label: 'Hair Color', formControlName: 'hairColor', placeholder: 'Hair Color', type: 'text',},
  { label: 'Notes', formControlName: 'notes', placeholder: 'Additional Notes', type: 'textarea' },
];

export const formFieldsUsingSelects: FormField[] = [
  { label: 'First Name', formControlName: 'firstname', placeholder: 'First Name', type: 'text', autocomplete: true },
  { label: 'Last Name', formControlName: 'lastname', placeholder: 'Last Name', type: 'text' },
  { label: 'Age', formControlName: 'age', placeholder: 'Age', type: 'select', options: [
    { value: '0-12', label: 'Child (0-12)' },
    { value: '13-19', label: 'Teen (13-19)' },
    { value: '20-64', label: 'Adult (20-64)' },
    { value: '65+', label: 'Senior (65+)' },
  ] },
  { label: 'Street', formControlName: 'street', placeholder: 'Street', type: 'text' },
  { label: 'City', formControlName: 'city', placeholder: 'City', type: 'text', },
  { label: 'Country', formControlName: 'country', placeholder: 'Country', type: 'text', },
  { label: 'Hair Color', formControlName: 'hairColor', placeholder: 'Hair Color', type: 'text',},
  { label: 'Notes', formControlName: 'notes', placeholder: 'Additional Notes', type: 'textarea' },
];