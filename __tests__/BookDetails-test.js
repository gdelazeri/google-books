import React from 'react';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import renderer from 'react-test-renderer';

import BookDetails from '../components/BookDetails';
import bookSample from '../constants/bookSample';

describe('BookDetails', () => {
  jest.useFakeTimers();

  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it(`renders the BookDetails component`, () => {
    const tree = renderer.create(<BookDetails book={bookSample} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
