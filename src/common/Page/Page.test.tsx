import { render } from '@testing-library/react';
import Page from './Page';
import '@testing-library/jest-dom';

describe('Page', () => {
  test('Page renders correctly', () => {
    const { container } = render(
      <Page header="Test">
        <div>Test</div>
      </Page>
    );
    expect(container).toMatchSnapshot();
  });
});
