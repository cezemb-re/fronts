import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JSXElementConstructor, useCallback } from 'react';
import { ModalsContext, useModals } from '../src';

interface Props {}

function App() {
  const { pushModal } = useModals();
  const openModal = useCallback(() => {
    pushModal({ component: () => <h1>Test</h1> });
  }, []);
  return <button onClick={openModal}>Open modal</button>;
}

export default {
  title: 'UI/Modal',
} as ComponentMeta<JSXElementConstructor<Props>>;

const Template: ComponentStory<JSXElementConstructor<Props>> = ({}: Props) => (
  <ModalsContext>
    <App />
  </ModalsContext>
);

export const Default = Template.bind({});

Default.args = {};
