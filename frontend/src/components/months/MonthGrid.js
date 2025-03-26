// src/components/MonthGrid.js
import React from 'react';
import './MonthGrid.css';

const months = [
  'Janeiro', 'Fevereiro', 'Março',
  'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro',
  'Outubro', 'Novembro', 'Dezembro',
];

export default function MonthGrid({ onSelectMonth }) {
  return (
    <div className="month-grid-container">
      <h2 className="title">Grym Diary</h2>
      <div className="month-grid">
        {months.map((month) => (
          <button 
            key={month} 
            type="button"
            className="month-card" 
            onClick={() => onSelectMonth(months.indexOf(month))}
            onKeyDown={(e) => e.key === 'Enter' && onSelectMonth(months.indexOf(month))}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}
