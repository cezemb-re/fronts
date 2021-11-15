import { ReactElement } from 'react';
import './App.scss';
import { Img } from '@cezembre/fronts';
import { UploadImage } from '@cezembre/ui';

export default function App(): ReactElement {
  return (
    <div className="App">
      <div className="container">
        <Img width="100%" aspectRatio="16:9" placeholder />
      </div>
    </div>
  );
}
