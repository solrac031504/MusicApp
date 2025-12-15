import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// pages and components
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <div className = "pages">
            <Routes>
                <Route path="/" element={ <Login /> } />
                <Route path="/home" element={ <Home /> } />
                <Route path="*" element= { <h1>404: Page Not Found</h1> } />
            </Routes>
        </div>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
