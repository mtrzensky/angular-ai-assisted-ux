export interface FormField {
  label: string;
  formControlName: string;
  placeholder: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  options?: FormFieldSelectOption[];
}

export interface FormFieldSelectOption {
  value: string;
  label: string;
}

export const formFieldsUsingText: FormField[] = [
  { label: 'fields.firstname.label', formControlName: 'firstname', placeholder: 'fields.firstname.placeholder', type: 'text' },
  { label: 'fields.lastname.label', formControlName: 'lastname', placeholder: 'fields.lastname.placeholder', type: 'text' },
  { label: 'fields.estimatedAge.label', formControlName: 'estimatedAge', placeholder: 'fields.estimatedAge.placeholder', type: 'number' },
  { label: 'fields.eye_color.label', formControlName: 'eye_color', placeholder: 'fields.eye_color.placeholder', type: 'text' },
  { label: 'fields.hair_color.label', formControlName: 'hair_color', placeholder: 'fields.hair_color.placeholder', type: 'text' },
  { label: 'fields.notes.label', formControlName: 'notes', placeholder: 'fields.notes.placeholder', type: 'textarea' },
];

export const formFieldsUsingSelects: FormField[] = [
  { label: 'fields.firstname.label', formControlName: 'firstname', placeholder: 'fields.firstname.placeholder', type: 'text' },
  { label: 'fields.lastname.label', formControlName: 'lastname', placeholder: 'fields.lastname.placeholder', type: 'text' },
  {
    label: 'fields.estimatedAge.label',
    formControlName: 'estimatedAge',
    placeholder: 'fields.estimatedAge.placeholder',
    type: 'select',
    options: [
      { value: '0-12', label: 'options.estimatedAge.0-12' },
      { value: '13-19', label: 'options.estimatedAge.13-19' },
      { value: '20-39', label: 'options.estimatedAge.20-39' },
      { value: '40-64', label: 'options.estimatedAge.40-64' },
      { value: '65+', label: 'options.estimatedAge.65+' },
    ],
  },
  {
    label: 'fields.eye_color.label',
    formControlName: 'eye_color',
    placeholder: 'fields.eye_color.placeholder',
    type: 'select',
    options: [
      { value: 'blue', label: 'options.eye_color.blue' },
      { value: 'brown', label: 'options.eye_color.brown' },
      { value: 'green', label: 'options.eye_color.green' },
      { value: 'other', label: 'options.eye_color.other' },
    ],
  },
  {
    label: 'fields.hair_color.label',
    formControlName: 'hair_color',
    placeholder: 'fields.hair_color.placeholder',
    type: 'select',
    options: [
      { value: 'black', label: 'options.hair_color.black' },
      { value: 'brown', label: 'options.hair_color.brown' },
      { value: 'blonde', label: 'options.hair_color.blonde' },
      { value: 'gray', label: 'options.hair_color.gray' },
      { value: 'other', label: 'options.hair_color.other' },
    ],
  },
  { label: 'fields.notes.label', formControlName: 'notes', placeholder: 'fields.notes.placeholder', type: 'textarea' },
];
