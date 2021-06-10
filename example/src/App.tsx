import React, { ReactElement, useState } from 'react';
import './App.scss';
import { Table, Button, Overlay, IconName, Input, Textarea, DataType, Wysiwyg } from '@cezembre/ui';
import { Field, Form } from '@cezembre/forms';

interface Article {
  id: string;
  date: Date;
  title: string;
  author: string;
  active: boolean;
  description: string;
}

const articles: Article[] = [
  {
    id: '1',
    date: new Date(),
    title: 'Un premier article',
    author: 'Lucien Perouze',
    active: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '2',
    date: new Date(),
    title: 'Un deuxième article',
    author: 'Lucien Perouze',
    active: true,
    description: 'Hello World!',
  },
  {
    id: '3',
    date: new Date(),
    title: "L'article du siecle",
    author: 'Lucien Perouze',
    active: false,
    description: 'Une description',
  },
  {
    id: '4',
    date: new Date(),
    title: 'Les articles sont le kiff',
    author: 'Lucien Perouze',
    active: false,
    description: 'Oui ceci est un article',
  },
];

export default function App(): ReactElement {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  return (
    <div className="App">
      <div className="header">
        <Button
          buttonStyle="link"
          // theme="light"
          leftIcon={IconName.ARROW}
          leftIconRotation={180}
          onClick={() => {
            setVisible(true);
            setClosed(false);
          }}>
          Oui
        </Button>
      </div>

      <div style={{ position: 'relative' }}>
        <Overlay visible={visible} closed={closed}>
          <Button
            buttonStyle="text"
            onClick={() => {
              setVisible(false);
              setClosed(true);
            }}>
            Close
          </Button>
        </Overlay>
      </div>

      <Table<Article>
        columns={[
          {
            key: 'title',
            title: 'Titre',
            width: 300,
          },
          { key: 'date', title: 'Date', width: 200, type: DataType.DATETIME },
          { key: 'author', title: 'Auteur', width: 200 },
          { key: 'active', title: 'Active', width: 100 },
          { key: 'description', title: 'Description' },
        ]}
        data={articles}
        onClickItem={() => null}
      />

      <Form className="form cezembre-ui-form">
        <div className="field title">
          <Field name="title" placeholder="Titre ..." component={Input} inputStyle="inline" />
        </div>

        <div className="field">
          <Field name="description" label="Description" component={Textarea} />
        </div>

        <div className="field composition">
          <Field
            name="composition"
            component={Wysiwyg}
            type="paragraph"
            placeholder="Composition ..."
          />
        </div>
      </Form>

      <Button buttonStyle="link">Oui</Button>
    </div>
  );
}
