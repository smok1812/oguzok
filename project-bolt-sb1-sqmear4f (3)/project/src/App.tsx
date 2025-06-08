import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import TrainingPage from './pages/TrainingPage';
import EquipmentPage from './pages/EquipmentPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
      </Routes>
    </Router>
  );
};

export default App;