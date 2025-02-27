import React, { useState } from "react";
import { Calendar } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import { FaTrash, FaEdit } from "react-icons/fa"; // Importando ícones de lápis e lixeira
import "./styles.css";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

Modal.setAppElement("#root");

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");

  // Abre o modal para adicionar/editar a nota
  const openModal = (selectedDate) => {
    const existingEvent = events.find(event =>
      format(event.start, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
    setNote(existingEvent ? existingEvent.title : "");
    setSelectedDate(selectedDate);
    setModalIsOpen(true);
  };

  // Fecha o modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDate(null);
    setNote("");
  };

  // Salva ou atualiza a nota
  const saveNote = () => {
    if (!selectedDate) return;

    const updatedEvents = events.filter(event =>
      format(event.start, "yyyy-MM-dd") !== format(selectedDate, "yyyy-MM-dd")
    );

    if (note.trim() !== "") {
      updatedEvents.push({
        start: selectedDate,
        end: selectedDate,
        title: note,
      });
    }

    setEvents(updatedEvents);
    closeModal();
  };

  // Exclui uma nota
  const deleteNote = (eventToDelete) => {
    const updatedEvents = events.filter(event => event !== eventToDelete);
    setEvents(updatedEvents);
  };

  // Captura a navegação entre meses
  const handleNavigate = (newDate) => setDate(newDate);

  const formattedSelectedDate = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';

  return (
    <div>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          selectable
          onSelectSlot={({ start }) => openModal(start)}
          views={["month"]}
          defaultView="month"
          date={date}
          onNavigate={handleNavigate}
          components={{
            toolbar: () => (
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "20px" }}>
                <button onClick={() => setDate(subMonths(date, 1))} className="botao-anterior">
                  Mês Anterior
                </button>
                <div className="titulo-mes">{format(date, "MMMM yyyy", { locale: ptBR }).charAt(0).toUpperCase() + format(date, "MMMM yyyy", { locale: ptBR }).slice(1)}</div>
                <button onClick={() => setDate(addMonths(date, 1))} className="botao-proximo">
                  Próximo Mês
                </button>
              </div>
            ),
            event: ({ event }) => (
              <div 
                className="custom-event"
                onClick={() => openModal(event.start)} // Abre o modal ao clicar na faixa do evento
                style={{ cursor: 'pointer' }} // Adiciona o cursor de pointer para indicar que é clicável
              >
                <div className="event-text">{event.title}</div>
                <div className="event-actions">
                  <button className="edit-btn" onClick={(e) => { e.stopPropagation(); openModal(event.start); }}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteNote(event); }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ),
          }}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <h2>Diário {formattedSelectedDate}</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Digite o que aconteceu neste dia..."
        />
        <div className="modal-buttons">
          <button onClick={saveNote} className="botao-salvar">Salvar</button>
          <button onClick={closeModal} className="botao-cancelar">Cancelar</button>
        </div>
      </Modal>
    </div>
  );
}

export default MyCalendar;
