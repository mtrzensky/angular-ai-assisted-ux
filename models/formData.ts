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
  { label: 'First Name', formControlName: 'firstname', placeholder: 'First Name', type: 'text', },
  { label: 'Last Name', formControlName: 'lastname', placeholder: 'Last Name', type: 'text' },
  { label: 'Date of Birth', formControlName: 'dob', placeholder: 'YYYY-MM-DD', type: 'text' },
  { label: 'Estimated Age', formControlName: 'estimatedAge', placeholder: 'Estimated age (years)', type: 'number' },
  { label: 'Height (cm)', formControlName: 'height', placeholder: 'Height in cm', type: 'number' },
  { label: 'Weight (kg)', formControlName: 'weight', placeholder: 'Weight in kg', type: 'number' },
  { label: 'Eye Color', formControlName: 'eyeColor', placeholder: 'Eye Color', type: 'text' },
  { label: 'Hair Color / Style', formControlName: 'hairColor', placeholder: 'Hair Color and Style', type: 'text' },
  { label: 'Clothing / Outfit', formControlName: 'clothing', placeholder: 'Describe clothing', type: 'textarea' },
  { label: 'Distinguishing Marks', formControlName: 'marks', placeholder: 'Scars, tattoos, glasses...', type: 'textarea' },
  { label: 'Mobility / Assistance', formControlName: 'mobility', placeholder: 'Walking, wheelchair, needs help', type: 'text' },
  { label: 'Allergies / Meds (known)', formControlName: 'allergies', placeholder: 'Known allergies / meds', type: 'textarea' },
  { label: 'Chief complaint / Notes', formControlName: 'notes', placeholder: 'Short clinical notes', type: 'textarea' }
];

export const formFieldsUsingSelects: FormField[] = [
  { label: 'First Name', formControlName: 'firstname', placeholder: 'First Name', type: 'text', },
  { label: 'Last Name', formControlName: 'lastname', placeholder: 'Last Name', type: 'text' },
  { label: 'Estimated Age', formControlName: 'estimatedAge', placeholder: 'Estimated age', type: 'select', options: [
    { value: '0-12', label: 'Child (0-12)' },
    { value: '13-19', label: 'Teen (13-19)' },
    { value: '20-39', label: 'Young Adult (20-39)' },
    { value: '40-64', label: 'Adult (40-64)' },
    { value: '65+', label: 'Senior (65+)' },
  ] },
  { label: 'Eye Color', formControlName: 'eyeColor', placeholder: 'Eye Color', type: 'select', options: [
    { value: 'blue', label: 'Blue' }, { value: 'brown', label: 'Brown' }, { value: 'green', label: 'Green'}, { value:'other', label:'Other' }
  ]},
  { label: 'Hair Color', formControlName: 'hairColor', placeholder: 'Hair Color', type: 'select', options: [
    { value: 'black', label: 'Black' }, { value: 'brown', label: 'Brown' }, { value: 'blonde', label: 'Blonde' }, { value: 'gray', label: 'Gray' }, { value:'other', label:'Other' }
  ]},
  { label: 'Glasses', formControlName: 'glasses', placeholder: 'Wearing glasses?', type: 'select', options: [
    { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }, { value: 'sunglasses', label: 'Sunglasses' }
  ]},
  { label: 'Mobility', formControlName: 'mobility', placeholder: 'Mobility', type: 'select', options: [
    { value: 'walking', label: 'Walking' }, { value: 'wheelchair', label: 'Wheelchair' }, { value: 'bedridden', label: 'Bedridden' }
  ]},
  { label: 'Clothing Type', formControlName: 'clothing', placeholder: 'Clothing', type: 'text' },
  { label: 'Notes', formControlName: 'notes', placeholder: 'Clinical / extra notes', type: 'textarea' }
];