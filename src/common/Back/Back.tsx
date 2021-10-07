import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';

function Back(): JSX.Element {
  const history = useHistory();
  const darkMode = useStore(useCallback((state) => state.darkMode, []));

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Button onClick={handleBack} style={{ height: 36 }} inverted={darkMode} type="button">
      <Icon name="arrow left" />
      Back
    </Button>
  );
}

export default Back;
