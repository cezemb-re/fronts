import { ReactElement } from 'react';
import './App.scss';
import { Img } from '@cezembre/fronts';
import cover from './cover.webp';

export default function App(): ReactElement {
  return (
    <div className="App">
      <div className="container">
        <Img width="100%" aspectRatio="2.35:1" src={cover} backgroundColor="green" placeholder />
      </div>
    </div>
  );
}
