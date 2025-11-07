import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { FormField } from "../models/formData";

export function formFieldsToJSONSchema(formFields: FormField[]): JSONSchema7 {
  const properties: Record<string, JSONSchema7Definition> = {};
  //const required: string[] = [];

    for (const field of formFields) {
    let fieldSchema: JSONSchema7;

    switch (field.type) {
      case "text":
      case "textarea":
        fieldSchema = { type: ["string", "null"] };
        break;

      case "number":
        fieldSchema = { type: ["number", "null"] };
        break;

      case "select":
        fieldSchema = {
          type: ["string", "null"],
          enum: field.options?.map(o => o.value),
        };
        break;

      default:
        fieldSchema = { type: ["string", "null"] };
        break;
    }

    if (field.placeholder) {
      fieldSchema.description = field.placeholder;
    }

    properties[field.formControlName] = fieldSchema;
    //required.push(field.formControlName);
  }

  const schema: JSONSchema7 = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties,
    //required,
    additionalProperties: false,
  };

  return schema;
}