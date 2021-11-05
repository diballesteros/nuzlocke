import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Back from './Back';
import '@testing-library/jest-dom';

describe('Back', () => {
  test('Back renders correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <Back />
      </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
