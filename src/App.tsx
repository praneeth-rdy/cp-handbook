
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/pages/Home'
import AlgozenithProblemPage from './components/pages/problem/AlgozenithProblemPage';
import { Toaster } from './components/ui/toaster';
import { BASE_URL } from './static/constants';

function App() {

  return (
  <BrowserRouter basename={BASE_URL}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="problem/az/:chapter/:module/:problem" element={<AlgozenithProblemPage />} />
    </Routes>
    <Toaster />
  </BrowserRouter>
  )
}

export default App
