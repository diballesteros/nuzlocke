import { useCallback } from 'react';
import type { TCalculatorForm } from 'constants/types';
import useStore from 'store';
import { Button } from '@/components/ui/button';

interface ButtonControllerProps {
  label: string;
  name: keyof TCalculatorForm;
}

// Semantic's `toggle` Button: grey, and green while it's on
function ButtonController({ label, name }: ButtonControllerProps): React.JSX.Element {
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  const toggle = () => {
    update({ [name]: !form[name] });
  };

  return (
    <Button
      aria-pressed={!!form[name]}
      // Semantic's buttons wrap long labels in the side-condition grid
      className="whitespace-normal"
      data-testid={name}
      onClick={toggle}
      type="button"
      variant={form[name] ? 'solid-green' : 'secondary'}
    >
      {label}
    </Button>
  );
}

export default ButtonController;
