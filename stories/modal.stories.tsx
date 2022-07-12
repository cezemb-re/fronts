import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JSXElementConstructor, useCallback } from 'react';
import { ModalsContext, useModals } from '../src';

interface Props {}

function App() {
  const { pushModal } = useModals();
  const openModal = useCallback(() => {
    pushModal({
      component: ({ dismissModal }) => (
        <div>
          <h1>First modal !</h1>
          <button onClick={dismissModal}>Dismiss !</button>
        </div>
      ),
      onDismiss: () => console.log('First modal dismissed !'),
    });
    pushModal({
      component: ({ dismissModal }) => (
        <div>
          <h1>Second modal !</h1>
          <button onClick={dismissModal}>Dismiss !</button>
        </div>
      ),
      onDismiss: () => console.log('Second modal dismissed !'),
    });
    pushModal({
      component: ({ dismissModal }) => (
        <div>
          <h1>Third modal !</h1>
          <button onClick={dismissModal}>Dismiss !</button>
        </div>
      ),
      onDismiss: () => console.log('Third modal dismissed !'),
    });
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
