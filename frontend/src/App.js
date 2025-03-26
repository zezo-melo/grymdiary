import React, { useState } from 'react';
import MonthGrid from '../src/components/months/MonthGrid';
import MyCalendar from '../src/components/calendar/Calendar';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <div className="App">
      {selectedMonth === null ? (
        <MonthGrid onSelectMonth={(index) => setSelectedMonth(index)} />
      ) : (
        <MyCalendar
          month={selectedMonth}
          onBack={() => setSelectedMonth(null)}
        />
      )}
    </div>
  );
}

export default App;