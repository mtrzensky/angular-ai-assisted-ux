import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { FormField } from '../models/formData';

function fieldToSchema(field: FormField): JSONSchema7 {
  switch (field.type) {
    case 'number':
      return { type: ['number', 'null'] };
    case 'select':
      return { type: ['string', 'null'], enum: field.options?.map((o) => o.value) };
    case 'text':
    case 'textarea':
    default:
      return { type: ['string', 'null'] };
  }
}

export function formFieldsToJSONSchema(formFields: FormField[]): JSONSchema7 {
  const properties: Record<string, JSONSchema7Definition> = {};
  for (const field of formFields) {
    properties[field.formControlName] = fieldToSchema(field);
  }

  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties,
    additionalProperties: false,
  };
}
