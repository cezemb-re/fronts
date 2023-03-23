import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JSXElementConstructor } from 'react';
import { useScreen } from '../src';

function App() {
  const screen = useScreen();
  return (
    <div>
      <h1>{screen}</h1>
    </div>
  );
}

export default {
  title: 'UI/Screens',
} as ComponentMeta<JSXElementConstructor<unknown>>;

const Template: ComponentStory<JSXElementConstructor<unknown>> = () => <App />;

export const Default = Template.bind({});

Default.args = {};
