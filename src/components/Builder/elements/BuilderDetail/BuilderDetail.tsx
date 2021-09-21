import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useStore from 'store';
import { Page } from 'common';
import styles from './BuilderDetail.module.scss';

const BuilderDetail: React.FC = () => {
  const { game } = useParams<{ game: string }>();
  const history = useHistory();
  const team = useStore(
    useCallback(
      (state) => (state?.selectedGame?.value ? state.team[state?.selectedGame?.value] : null),
      []
    )
  );

  useEffect(() => {
    if (!team) {
      history.push('/');
    }
  }, [history, team]);

  const test = useMemo(() => {}, [team]);

  return <Page header="Builder Details">{game}</Page>;
};

export default BuilderDetail;
