import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JSXElementConstructor } from 'react';

interface Props {}

function App() {
  return (
    <div>
      <h1>Container test</h1>
    </div>
  );
}

export default {
  title: 'UI/Container',
} as ComponentMeta<JSXElementConstructor<Props>>;

const Template: ComponentStory<JSXElementConstructor<Props>> = ({}: Props) => <App />;

export const Default = Template.bind({});

Default.args = {};
