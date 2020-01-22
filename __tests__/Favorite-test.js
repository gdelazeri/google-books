import React from 'react';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import renderer from 'react-test-renderer';

import Favorite from '../components/Favorite';

describe('Favorite', () => {
  jest.useFakeTimers();

  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it(`renders the Favorite component`, () => {
    const tree = renderer.create(<Favorite id={'3465f65465f'} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
