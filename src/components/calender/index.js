import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import events from './testevent'

const localizer = momentLocalizer(moment)

const Calender = props => (
  <div style={{margin:10}}>
    <Calendar
      localizer={localizer}
      onSelectEvent={event=>window.alert(event.title)}
      events={props.events}
      style={{ height: 500,width:"100%" }}
    />
  </div>
);


export default Calender;