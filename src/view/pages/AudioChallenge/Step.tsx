import React from 'react';

import IWord from '../../../core/IWord';

import { words as wordsApi } from '../../../model/api/public';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import AudioPlayer from '../../components/AudioPlayer';
import { FILES_STORAGE_HOST } from '../../../core/constants';
import { IAudioChallengeGame } from '../../../services/interfaces/IAudioChallengeGame';
import DIContainer from '../../../DI/DIContainer';
import DI_TYPES from '../../../DI/DITypes';

type VariantButtonProps = {
  word: IWord;
  clickHandler: (wordId: string) => void;
};

const VariantButton = ({ word, clickHandler }: VariantButtonProps) => {
  return (
    <Button variant="contained" onClick={() => clickHandler(word.id)}>
      {word.wordTranslate}
    </Button>
  );
};
type StepProps = {
  rightAnswer: string;
  variantsIds: [string, string, string, string];
};

const Step = ({ rightAnswer, variantsIds }: StepProps) => {
  const { data: word } = wordsApi.useReadWordQuery({ wordId: rightAnswer });

  const [{ data: wordVariant0 }, { data: wordVariant1 }, { data: wordVariant2 }, { data: wordVariant3 }] = [
    wordsApi.useReadWordQuery({ wordId: variantsIds[0] }),
    wordsApi.useReadWordQuery({ wordId: variantsIds[1] }),
    wordsApi.useReadWordQuery({ wordId: variantsIds[2] }),
    wordsApi.useReadWordQuery({ wordId: variantsIds[3] }),
  ];

  const gameService: IAudioChallengeGame = DIContainer.get(DI_TYPES.AudioChallengeGame);

  const variantSelectionHandler = (wordId: string) => {
    gameService.selectAnswerVariant(wordId);
  };

  return (
    <Box>
      {!word || !wordVariant0 || !wordVariant1 || !wordVariant2 || !wordVariant3 ? (
        <CircularProgress />
      ) : (
        <>
          <Box display="flex" justifyContent="center" alignItems="center">
            <AudioPlayer tracks={[`${FILES_STORAGE_HOST}/${word.audio}`]} />
          </Box>

          <Box className="answers-btn">
            <VariantButton word={wordVariant0} clickHandler={variantSelectionHandler} />
            <VariantButton word={wordVariant1} clickHandler={variantSelectionHandler} />
            <VariantButton word={wordVariant2} clickHandler={variantSelectionHandler} />
            <VariantButton word={wordVariant3} clickHandler={variantSelectionHandler} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Step;
