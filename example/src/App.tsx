import { ReactElement } from 'react';
import './App.scss';
import { Img } from '@cezembre/fronts';

export default function App(): ReactElement {
  return (
    <div className="App">
      <div className="container">
        <Img
          width="100%"
          aspectRatio="16:9"
          src="https://www.mouss-le-chien.com/medias/album/border-collie-1-jpg?fx=c_700_700"
        />
      </div>
    </div>
  );
}
