import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JSXElementConstructor, ReactElement, useCallback, useMemo, useState } from 'react';
import { useWindowInfiniteScroll } from '../src';

interface Page {
  id: string;
  content: ReactElement;
}

function App() {
  const [pages, setPages] = useState<number>(1);

  const loadNextPage = useCallback(() => {
    setPages((p) => {
      console.log('New page: ', p + 1);
      return p + 1;
    });
  }, []);

  const { ref, distance, progress, remains, active } = useWindowInfiniteScroll<HTMLDivElement>({
    loadNextPage,
  });

  const book = useMemo<Page[]>(() => {
    return new Array(pages).fill(null).map((p, i) => ({
      id: `page-${i + 1}`,
      content: (
        <div>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
          <p>Page: {i + 1}</p>
        </div>
      ),
    }));
  }, [pages]);

  return (
    <div>
      <p>Distance: {distance}</p>
      <p>Progress: {progress}</p>
      <p>Remains: {remains}</p>
      <p>Active: {active ? 'True' : 'False'}</p>
      <div ref={ref} style={{ background: 'pink' }}>
        {book.map(({ id, content }) => (
          <div key={id}>{content}</div>
        ))}
      </div>
    </div>
  );
}

export default {
  title: 'UI/Scroll',
} as ComponentMeta<JSXElementConstructor<unknown>>;

const Template: ComponentStory<JSXElementConstructor<unknown>> = () => <App />;

export const Default = Template.bind({});
