import { useState, useCallback, useLayoutEffect } from 'react';

type Dimensions = {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
};

function getDimensionObject(node: HTMLElement): Dimensions {
  const rect: Dimensions | ClientRect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: 'x' in rect ? rect.x : rect.top,
    left: 'y' in rect ? rect.y : rect.left,
    x: 'x' in rect ? rect.x : rect.left,
    y: 'y' in rect ? rect.y : rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
}

function useDimensions(
  liveMeasure: boolean
): [(node: HTMLElement) => void, Record<string, never> | Dimensions, HTMLElement] {
  const [dimensions, setDimensions] = useState({});
  const [node, setNode] = useState(null);

  const ref = useCallback((nodeToMeasure) => {
    setNode(nodeToMeasure);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = () =>
        window.requestAnimationFrame(() => setDimensions(getDimensionObject(node)));
      measure();
      if (liveMeasure) {
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure);

        return () => {
          window.removeEventListener('resize', measure);
          window.removeEventListener('scroll', measure);
        };
      }
    }
  }, [node, liveMeasure]);

  return [ref, dimensions, node];
}

export default useDimensions;
