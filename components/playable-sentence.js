import { useState, useEffect, useCallback} from 'react';
import styles from './playable.module.css';
import { clsx } from 'clsx';
import Image from 'next/image';


export default function PlayableSentence({ index, textspan, indexPlaying, setIndexPlaying, isPaused }) {
  return (
    <div onClick={() => { setIndexPlaying(index); } } className={clsx({
      [styles.playing]: index === indexPlaying,
      [styles.playable]: true
    })}>
      {textspan}
      {
        index === indexPlaying ? 
        (isPaused ? <Image src="/images/dognotalk2.png" width="50" height="50"/> : <Image src="/images/dogtalk2.gif" width="50" height="50"/>) :
        ""
      }
    </div>
  );
};
