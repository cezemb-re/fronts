import { ReactElement } from 'react';
import './App.scss';

export default function App(): ReactElement {
  return (
    <div className="App">
      <div className="container wide">
        <h1>Wide</h1>
      </div>
      <div className="container large">
        <h1>Large</h1>
      </div>
      <div className="container medium">
        <h1>Medium</h1>
      </div>
      <div className="container small">
        <h1>Small</h1>
      </div>
    </div>
  );
}
