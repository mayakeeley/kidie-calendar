import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = { items: [] };

  componentDidMount() {
    fetch(
      "https://www.googleapis.com/calendar/v3/calendars/nology.io_5smheaincm2skd1tcmvv7m37d8@group.calendar.google.com/events?key=AIzaSyCvy_mLdV4A3bPoy9u0hDgACQ1K-h3Fn-Q"
    )
      .then(results => {
        return results.json();
      })
      .then(data => {
        let items = data.items.map(item => {
          let date = item.start.date
            ? new Date(item.start.date)
            : new Date(item.start.dateTime);
          let startTime =
            date.getHours() > 11
              ? date.getHours() > 12
                ? `${date.getHours() - 12}PM`
                : `${date.getHours()}PM`
              : `${date.getHours()}AM`;
          let endDate = item.end.date
            ? new Date(item.end.date)
            : new Date(item.end.dateTime);
          let endTime =
            endDate.getHours() > 11
              ? date.getHours() >= 12
                ? `${endDate.getHours() - 12}PM`
                : `${endDate.getHours()}PM`
              : `${endDate.getHours()}AM`;
          let dates =
            date.toDateString() === endDate.toDateString()
              ? `${date.toDateString()} ${startTime} - ${endTime}`
              : `${date.toDateString()} ${startTime} - ${endDate.toDateString()} ${endTime}`;
          let recurringWeekly =
            item.recurrence != null
              ? item.recurrence.toString().includes("WEEKLY")
                ? "Weekly event"
                : "Monthly event"
              : null;
          return {
            id: item.id,
            summary: item.summary,
            start: dates,
            date: date,
            recurrence: recurringWeekly,
            organizer: item.organizer.displayName
          };
        });
        let filteredItems = items.filter(
          item => item.organizer === "Interpretive Dance Institute"
        );
        let sortedItems = filteredItems.sort((a, b) => a.date - b.date);
        this.setState({ items: sortedItems });
      });
  }
  render() {
    const allItems = this.state.items.map(item => {
      return (
        <div key={item.id}>
          <h2>{item.summary}</h2>
          <p>{item.start}</p>
          <p>{item.end}</p>
          <p>{item.recurrence}</p>
        </div>
      );
    });
    // const mondayFilter = this.state.items.filter(item => {
    //   return item.date.getDay() === 1;
    // });
    return (
      <div className="App">
        <h1>KIDIE Calendar</h1>
        {allItems}
      </div>
    );
  }
}

export default App;
