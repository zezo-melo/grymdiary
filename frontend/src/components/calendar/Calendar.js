// ... imports (sem alterações)
import React, { useState, useEffect } from "react";
import { Calendar } from "react-big-calendar";
import { format, addMonths, subMonths, getDay, startOfWeek, parse } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./styles.css";

// ... locale setup
const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format: (date, formatStr) => format(date, formatStr, { locale: ptBR }),
  parse: (value, formatStr) => parse(value, formatStr, new Date(), { locale: ptBR }),
  startOfWeek: (date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

Modal.setAppElement("#root");

function MyCalendar() {
  const navigate = useNavigate();
  const { month } = useParams();
  const today = new Date();
  const initialMonth = new Date(
    today.getFullYear(),
    month !== undefined ? Number.parseInt(month, 10) : today.getMonth(),
    1
  );

  const [date, setDate] = useState(initialMonth);
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notes", config)
      .then((response) => {
        const fetchedEvents = response.data.map((note) => ({
          start: new Date(note.start),
          end: new Date(note.end),
          title: note.title,
          _id: note._id,
        }));
        setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.error("Erro ao buscar notas", error);
      });
  }, []);

  const openModal = (selectedDate) => {
    const existingEvent = events.find(
      (event) => format(event.start, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
    setNote(existingEvent ? existingEvent.title : "");
    setSelectedDate(selectedDate);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDate(null);
    setNote("");
  };

  const saveNote = () => {
    if (!selectedDate) return;

    const eventData = {
      start: new Date(selectedDate),
      end: new Date(selectedDate),
      title: note,
    };

    const existingEvent = events.find(
      (event) => format(event.start, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );

    if (existingEvent) {
      axios
        .put(`http://localhost:5000/api/notes/${existingEvent._id}`, eventData, config)
        .then(() => {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event._id === existingEvent._id ? { ...event, title: note } : event
            )
          );
        })
        .catch((error) => {
          console.error("Erro ao atualizar nota", error);
        });
    } else {
      axios
        .post("http://localhost:5000/api/notes", eventData, config)
        .then((response) => {
          setEvents((prevEvents) => [
            ...prevEvents,
            { ...eventData, _id: response.data._id },
          ]);
        })
        .catch((error) => {
          console.error("Erro ao criar nota", error);
        });
    }

    closeModal();
  };

  const deleteNote = (eventToDelete) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event !== eventToDelete));

    axios
      .delete(`http://localhost:5000/api/notes/${eventToDelete._id}`, config)
      .catch((error) => {
        console.error("Erro ao deletar nota", error);
      });
  };

  const updateMonth = (newDate) => {
    setDate(newDate);
  };

  const formattedSelectedDate = selectedDate ? format(selectedDate, "dd/MM/yyyy") : "";

  return (
    <div>
      {/* Header com botão de voltar e título */}
      <div className="calendar-page-header">
        <button
          type="button"
          className="back-round-button"
          onClick={() => navigate("/")}
        >
          ←
        </button>
        <h2 className="calendar-main-title">Minhas Anotações</h2>
      </div>

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
          date={date}
          onNavigate={updateMonth}
          components={{
            toolbar: () => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() => updateMonth(subMonths(date, 1))}
                  className="botao-anterior"
                >
                  Mês Anterior
                </button>
                <div className="titulo-mes">
                  {format(date, "MMMM yyyy", { locale: ptBR }).charAt(0).toUpperCase() +
                    format(date, "MMMM yyyy", { locale: ptBR }).slice(1)}
                </div>
                <button
                  type="button"
                  onClick={() => updateMonth(addMonths(date, 1))}
                  className="botao-proximo"
                >
                  Próximo Mês
                </button>
              </div>
            ),
            dayHeader: ({ label }) => (
              <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
            ),
            event: ({ event }) => (
              <div
                className="custom-event"
                onClick={() => openModal(event.start)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    openModal(event.start);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="event-text">{event.title}</div>
                <div className="event-actions">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(event.start);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(event);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ),
          }}
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Diário {formattedSelectedDate}</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Digite o que aconteceu neste dia..."
        />
        <div className="modal-buttons">
          <button type="button" onClick={saveNote} className="botao-salvar">
            Salvar
          </button>
          <button type="button" onClick={closeModal} className="botao-cancelar">
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default MyCalendar;
