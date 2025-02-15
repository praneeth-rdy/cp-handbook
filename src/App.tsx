
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/pages/Home'
import AlgozenithProblem from './components/pages/az/AlgozenithProblem';
import { Toaster } from './components/ui/toaster';
import { BASE_URL } from './static/constants';
import AlgozenithChapters from './components/pages/az/AlgozenithChapters';
import AlgozenithModule from './components/pages/az/AlgozenithModule';

function App() {

  return (
  <BrowserRouter basename={BASE_URL}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="az/chapters" element={<AlgozenithChapters />} />
      <Route path="az/chapters/:chapter/modules/:module" element={<AlgozenithModule />} />
      <Route path="az/chapters/:chapter/modules/:module/problems/:problem" element={<AlgozenithProblem />} />
      <Route path="*" element={<div className="container mx-auto p-6"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div>} />
    </Routes>
    <Toaster />
  </BrowserRouter>
  )
}

export default App
