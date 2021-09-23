import React from 'react';
import { render } from '@testing-library/react';
import Back from './Back';
import '@testing-library/jest-dom';

describe('Back', () => {
  test('Back renders correctly', () => {
    const { container } = render(<Back />);
    expect(container).toMatchSnapshot();
  });
});
