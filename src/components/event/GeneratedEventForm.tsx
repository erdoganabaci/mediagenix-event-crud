import { Spin } from "antd";
import { memo } from "react";
import { useQuery } from "react-query";
import { EventForm } from "../atoms/form/EventForm";
import { RangePickerForm, SelectForm, TextAreaForm, TextForm } from "../atoms/form/types";

interface QueryFormSchemaResult {
    data?: (TextForm | SelectForm | RangePickerForm | TextAreaForm)[];
    isFetching: boolean;
    error?: null;
}

const fetchFormSchema = async () => {
    const response = await fetch("/eventFormSchema");
    const data = await response.json();
    return data;
};
const GeneratedEventForm = memo(function GeneratedEventForm
    () {
    const { data: dataFormSchema, isFetching: isFetchingFormSchema }: QueryFormSchemaResult = useQuery("eventFormSchema", fetchFormSchema);

    return (
        <div>
            {!isFetchingFormSchema ? (dataFormSchema!).map((shema, i) => {
                return <EventForm key={i} schema={shema} />
            }) : <Spin size="small" tip="Loading..." />}
        </div>
    );
}
);

export { GeneratedEventForm };

