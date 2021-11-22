import { TYPE_COLOR } from 'constants/colors';
import { Type } from 'constants/types';
import { selectBuilderStrong, selectBuilderWeak } from 'selectors';
import useStore from 'store';
import styles from './Coverage.module.scss';

function Coverage(): JSX.Element {
  const strong = useStore(selectBuilderStrong);
  const weak = useStore(selectBuilderWeak);

  return (
    <section className={styles.container}>
      <h2># of moves strong against</h2>
      <div className={styles.types}>
        {Object.entries(strong)
          .sort((a, b) => b[1] - a[1])
          .map((entry) => {
            return (
              <div
                className={styles.type}
                key={`strong-type-${entry[0]}`}
                style={{ backgroundColor: TYPE_COLOR[entry[0] as Type] }}
              >
                {entry[0]} {entry[1]}
              </div>
            );
          })}
      </div>
      <h2>Weak Against</h2>
      <div className={styles.types}>
        {Object.entries(weak)
          .sort((a, b) => b[1] - a[1])
          .map((entry) => {
            return (
              <div
                className={styles.type}
                key={`weak-type-${entry[0]}`}
                style={{ backgroundColor: TYPE_COLOR[entry[0] as Type] }}
              >
                {entry[0]} {entry[1]}
              </div>
            );
          })}
      </div>
    </section>
  );
}

export default Coverage;
