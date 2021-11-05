import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Page from './Page';
import '@testing-library/jest-dom';

describe('Page', () => {
  test('Page renders correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <Page header="Test">
          <div>Test</div>
        </Page>
      </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
