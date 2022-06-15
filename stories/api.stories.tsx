import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JSXElementConstructor, useEffect, useState } from 'react';
import { ApiProvider, useApi } from '../src';

interface Props {}

export default {
  title: 'State/API',
  argTypes: {},
} as ComponentMeta<JSXElementConstructor<Props>>;

function App() {
  const api = useApi();
  const [clubs, setClubs] = useState<{ clubs: { name: string }[] }>();
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/clubs');
      setClubs(data as { clubs: { name: string }[] });
    })();
  }, [api]);
  return (
    <div>
      {clubs?.clubs?.map((club) => (
        <div key={club.name}>
          <span>{club.name}</span>
          <br />
        </div>
      ))}
    </div>
  );
}

const Template: ComponentStory<JSXElementConstructor<Props>> = ({}: Props) => (
  <ApiProvider host="http://localhost:4200" apiKey="pk_aXJeQNWOzfe8IsHyzGtN93nzrEFmBFmF9gIakI3W">
    <App />
  </ApiProvider>
);

export const Default = Template.bind({});

Default.args = {};
