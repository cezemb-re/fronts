import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JSXElementConstructor } from 'react';
import { Property } from 'csstype';
import Img, { AspectRatio, Orientation } from '../src/ui/image';

interface Props {
  width?: number;
  aspectRatio?: AspectRatio;
  orientation?: Orientation;
  objectFit?: Property.ObjectFit;
  objectPosition?: Property.ObjectPosition;
  defined?: boolean;
}

export default {
  title: 'UI/Img',
  component: Img,
  argTypes: {
    width: {
      control: {
        type: 'range',
        min: 10,
        max: 600,
        step: 1,
      },
    },
    aspectRatio: {
      options: [
        'cover',
        'fit',
        'square',
        '5:4',
        '4:3',
        '3:2',
        '16:10',
        '16:9',
        '1.85:1',
        '2.35:1',
        '2.76:1',
      ],
      control: {
        type: 'select',
      },
    },
    orientation: {
      options: ['landscape', 'portrait'],
      control: {
        type: 'inline-radio',
      },
    },
    objectFit: {
      options: ['contain', 'cover', 'fill', 'none', 'scale-down'],
      control: {
        type: 'select',
      },
    },
    objectPosition: {
      options: ['center center'],
      control: {
        type: 'select',
      },
    },
    defined: {
      control: {
        type: 'boolean',
      },
    },
  },
} as ComponentMeta<JSXElementConstructor<Props>>;

const Template: ComponentStory<JSXElementConstructor<Props>> = ({
  defined,
  width,
  aspectRatio,
  orientation,
  objectFit,
  objectPosition,
}: Props) => (
  <Img
    width={width}
    aspectRatio={aspectRatio}
    orientation={orientation}
    objectFit={objectFit}
    objectPosition={objectPosition}
    src={
      defined
        ? 'https://www.mouss-le-chien.com/medias/album/border-collie-1-jpg?fx=c_700_700'
        : undefined
    }
  />
);

export const Default = Template.bind({});

Default.args = {
  width: 550,
  aspectRatio: '4:3',
};
