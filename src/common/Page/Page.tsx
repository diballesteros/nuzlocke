import React from 'react';
import { Back } from 'common';
import styles from './Page.module.scss';

interface PageProps {
  children: React.ReactNode;
  header: string;
}

const Page: React.FC<PageProps> = ({ children, header }) => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>{header}</h2> <Back />
      </div>
      {children}
    </div>
  );
};

export default Page;
