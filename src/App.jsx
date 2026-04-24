import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import LocationDetail from './pages/LocationDetail';

// Top-level layout. NavBar shows on every page; Routes picks the page.
export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location/:iata" element={<LocationDetail />} />
          {/* Unknown URLs fall back to Home. */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}
