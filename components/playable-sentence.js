import { useState, useEffect, useCallback} from 'react';
import styles from './playable.module.css';
import { clsx } from 'clsx';

export default function PlayableSentence({ index, textspan, indexPlaying, setAutoAdvance, setIndexPlaying }) {
  return (
    <div onClick={() => { setIndexPlaying(index); setAutoAdvance(false); } } className={clsx({
      [styles.playing]: index === indexPlaying,
      [styles.playable]: true
    })}>
      {textspan}
    </div>
  );
};
