import { ReactElement } from 'react';
import './App.scss';
import { UploadImage } from '@cezembre/ui';

export default function App(): ReactElement {
  return (
    <div className="App">
      <div className="container">
        <UploadImage width="100%" aspectRatio="16:9" placeholder />
      </div>
    </div>
  );
}
