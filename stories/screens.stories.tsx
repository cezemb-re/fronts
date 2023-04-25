import { useScreen } from '../src';

export default {
  title: 'UI/Screens',
};

function Template() {
  const screen = useScreen();
  return (
    <div>
      <h1>{screen}</h1>
    </div>
  );
}

export const Default = Template.bind({});
