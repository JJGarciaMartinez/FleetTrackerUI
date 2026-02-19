import { Routes, Route } from 'react-router-dom'
import VehiclesList from '@routes/vehicles/index.tsx'
import VehicleDetail from '@routes/vehicles/[id].tsx'
import VehicleNew from '@routes/vehicles/new.tsx'
import Dashboard from '@routes/index.tsx'
import './App.css'

function App() {
  return (
    <main className="main-app-container">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<VehiclesList />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/vehicles/new" element={<VehicleNew />} />
      </Routes>
    </main>
  )
}

export default App
