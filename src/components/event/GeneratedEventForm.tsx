import { memo } from "react";
import { EventForm } from "../atoms/form/EventForm";
import { RangePickerForm, SelectForm, TextAreaForm, TextForm } from "../atoms/form/types";

interface GeneratedEventFormProps {
    schemas: (TextForm | SelectForm | RangePickerForm | TextAreaForm)[];
}

const GeneratedEventForm = memo(function GeneratedEventForm
    (props: GeneratedEventFormProps) {
    return (
        <div>
            {props.schemas.map((shema, i) => {
                return <EventForm key={i} schema={shema} />
            })}
        </div>
    );
}
);

export { GeneratedEventForm };

