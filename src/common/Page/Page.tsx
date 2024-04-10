import { Back } from 'common';
import styles from './Page.module.scss';

interface PageProps {
  children: React.ReactNode;
  header: string;
}

function Page({ children, header }: PageProps): React.JSX.Element {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h2>{header}</h2> <Back />
      </div>
      {children}
    </section>
  );
}

export default Page;
