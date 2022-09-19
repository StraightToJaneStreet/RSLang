const DI_TYPES = {
  App: Symbol.for('App'),
  RegistrationService: Symbol.for('Register'),
  WordsService: Symbol.for('WordsService'),
  AuthService: Symbol.for('Auth'),
  DictionaryService: Symbol.for('DictionaryService'),
  StatisticsService: Symbol.for('StatisticsService'),
  AudioChallengeGame: Symbol.for('AudioChallengeGame'),
  SprintGame: Symbol.for('SpringGame'),
};

export default DI_TYPES;
