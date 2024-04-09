import { useCallback } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import type { TCalculatorForm } from 'constants/types';
import useStore from 'store';

interface ButtonControllerProps {
  label: string;
  name: keyof TCalculatorForm;
}

function ButtonController({ label, name }: ButtonControllerProps): React.JSX.Element {
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  const toggle = () => {
    update({ [name]: !form[name] });
  };

  return (
    <Button active={!!form[name]} data-testid={name} onClick={toggle} toggle type="button">
      {label}
    </Button>
  );
}

export default ButtonController;
