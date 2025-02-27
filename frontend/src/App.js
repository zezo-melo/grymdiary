import React from 'react';
import MyCalendar from './components/Calendar';

function App() {
  return (
    <div className="App" style={{ paddingLeft: 400, paddingRight: 400 }}>
      <h1 style={{ textAlign: 'center' }}>Grym Diary</h1>
      <MyCalendar />
    </div>
  );
}

export default App;