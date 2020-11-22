import {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [caption, setCaption] = useState(0);

  useEffect(() => {
    fetch('/marissa').then(res => res.json()).then(data => {
      setCaption(data.cap)
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{caption}</p>
      </header>
    </div>
  );
}

export default App;
