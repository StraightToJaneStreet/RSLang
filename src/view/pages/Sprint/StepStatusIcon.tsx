import React from 'react';

import MoodBadIcon from '@mui/icons-material/MoodBad';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

import { Step, isIncompletedStep } from '../../../model/feature/sprint';

interface StepStatusIconProps {
  step: Step;
}

const StepStatusIcon = ({ step }: StepStatusIconProps) => {
  return (
    <>
      {isIncompletedStep(step) ? (
        <SentimentNeutralIcon fontSize="large" color="info" />
      ) : step.result ? (
        <MoodIcon fontSize="large" color="success" />
      ) : (
        <MoodBadIcon fontSize="large" color="error" />
      )}
    </>
  );
};

export default StepStatusIcon;
