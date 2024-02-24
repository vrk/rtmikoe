import { useState, useEffect, useCallback} from 'react';
import styles from './playable.module.css';
import { clsx } from 'clsx';

export default function PlayableSentence({ index, textspan, indexPlaying, setIndexPlaying }) {
  return (
    <div onClick={() => { setIndexPlaying(index); } } className={clsx({
      [styles.playing]: index === indexPlaying,
      [styles.playable]: true
    })}>
      {textspan}
    </div>
  );
};
