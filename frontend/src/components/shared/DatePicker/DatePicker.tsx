import Picker from "react-datepicker";
import { ru } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date | null) => void;
}
const DatePicker: React.FC<DatePickerProps> = (props) => {
  const { date, setDate } = props;

  return (
    <Picker
      selected={date}
      onChange={setDate}
      dateFormat="d MMMM yyyy"
      locale={ru}
      inline
    />
  );
};

export default DatePicker;
