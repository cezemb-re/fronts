import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JSXElementConstructor } from 'react';
import { useScreen } from '../src';

interface Props {}

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
} as ComponentMeta<JSXElementConstructor<Props>>;

const Template: ComponentStory<JSXElementConstructor<Props>> = ({}: Props) => <App />;

export const Default = Template.bind({});

Default.args = {};
