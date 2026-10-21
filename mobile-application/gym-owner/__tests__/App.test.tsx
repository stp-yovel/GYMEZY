/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-camera-kit', () => ({
  Camera: 'Camera',
}));
jest.mock('react-native-camera-kit/dist/Camera.android', () => 'Camera');

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
