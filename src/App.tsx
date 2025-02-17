
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/pages/Home'
import { Toaster } from './components/ui/toaster';
import { BASE_URL } from './static/constants';
import Problem from './components/pages/az/problem';
import Module from './components/pages/az/Module';
import Chapters from './components/pages/az/Chapters';

function App() {

  return (
  <BrowserRouter basename={BASE_URL}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="az/chapters" element={<Chapters />} />
      <Route path="az/chapters/:chapter/modules/:module" element={<Module />} />
      <Route path="az/chapters/:chapter/modules/:module/problems/:problem" element={<Problem />} />
      <Route path="*" element={<div className="container mx-auto p-6"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div>} />
    </Routes>
    <Toaster />
  </BrowserRouter>
  )
}

export default App
