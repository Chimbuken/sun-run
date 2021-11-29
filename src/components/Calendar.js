import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";

function Calendar() {
    const [runDate, setRunDate] = useState(newDate());
    return(
        <div>
            <Calendar
            onChange={setRunDate}
            value={runDate}
            />
        </div>
    )
}

export default Calendar;