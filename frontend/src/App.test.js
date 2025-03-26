test('renderiza o título Grym Diary', () => {
  render(<App />);
  const titleElement = screen.getByText(/Grym Diary/i);
  expect(titleElement).toBeInTheDocument();
});
