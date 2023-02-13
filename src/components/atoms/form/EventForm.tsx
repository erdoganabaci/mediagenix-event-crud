import { memo } from "react";
import { DateRangePickerBox } from "./DateRangePickerBox";
import { InputBox } from "./InputBox";
import { SelectBox } from "./SelectBox";
import { TextAreaBox } from "./TextAreaBox";
import { RangePickerForm, SelectForm, TextAreaForm, TextForm } from "./types";

interface EventFormProps {
  schema: TextForm | SelectForm | RangePickerForm | TextAreaForm;
}

const EventForm = memo(function EventForm
  (props: EventFormProps) {
  switch (props.schema.component) {
    case "textarea":
      return <TextAreaBox
        label={props.schema.label}
        name={props.schema.name}
        component={props.schema.component}

      />;
    case "text":
      return <InputBox
        label={props.schema.label}
        name={props.schema.name}
        required={props.schema.required}
        component={props.schema.component}
      />;
    case "range_picker":
      return <DateRangePickerBox
        label={props.schema.label}
        name={props.schema.name}
        component={props.schema.component} />
    case "select":
      return <SelectBox
        label={props.schema.label}
        name={props.schema.name}
        options={props.schema.options}
        component={props.schema.component} />;
  }
}
);

export { EventForm };

