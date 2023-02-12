import { DatePicker, Form } from "antd";
import { memo } from "react";
import { RangePickerForm } from "./types";

const { RangePicker } = DatePicker;

const DateRangePickerBox = memo(function DateRangePickerBox
  ({ label, name }: RangePickerForm) {
  return (
    <Form.Item label={label} name={name}>
      <RangePicker />
    </Form.Item>
  );
}
);

export { DateRangePickerBox };

