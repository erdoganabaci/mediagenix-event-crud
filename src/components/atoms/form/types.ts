interface BaseFormSchema {
  label: string;
}

interface TextForm extends BaseFormSchema {
  name: string;
  component: "text";
  required: boolean;
}

interface SelectForm extends BaseFormSchema {
  name: string;
  component: "select";
  options: { label: string; value: string }[];
}

interface RangePickerForm extends BaseFormSchema {
  name: [string, string];
  component: "range_picker";
}

interface TextAreaForm extends BaseFormSchema {
  name: string;
  component: "textarea";
}

export type { TextForm, SelectForm, RangePickerForm, TextAreaForm}