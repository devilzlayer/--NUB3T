import React, { useState, useEffect, useContext , useMemo} from "react";
import DatePicker from 'react-mobile-datepicker';
import moment from 'moment'

import { getDates } from "../../../util";

const Calendar = (props) =>{
    const { onDate } = props

    const date  = new Date();
    const year  = date.getFullYear();
    const month = date.getMonth();
    const day   = date.getDate();

    
    const [ dateRange , setRange ]= useState({
        min : new Date(1989,0,1),
        max : new Date(year - 18, month, day)
    })
    const [ time , setTime ] = useState(new Date(year - 18, month, day))


    const onChange = (e) =>{
        const newDate   = new Date(e);
        const year      = newDate.getFullYear();
        const month     = newDate.getMonth();
        const day       = newDate.getDate();
        setTime(e)
        onDate(`${year}年${month + 1}月${day}日`)
    }


    return (
        <div className="calendar-setting">
            <DatePicker
                value={time}
                isOpen={true}
                isPopup={false}
                showHeader={false}
                showFooter={false}
                min={dateRange.min}
                max={dateRange.max}
                onChange={onChange}
                />
        </div>
    );
}

export default Calendar