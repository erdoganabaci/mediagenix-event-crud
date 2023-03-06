import { DatePicker, Form } from "antd";
import { memo } from "react";
import { RangePickerForm } from "./types";

const { RangePicker } = DatePicker;

const DateRangePickerBox = memo(function DateRangePickerBox
  ({ label, name }: RangePickerForm) {
  const nameConcatenated = name.join(""); // change id of range picker to be able to use it in form
  return (
    <Form.Item label={label} name={nameConcatenated}>
      <RangePicker />
    </Form.Item>
  );
}
);

export { DateRangePickerBox };

