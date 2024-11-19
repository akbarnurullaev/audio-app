import metadata from '../metadata.json';

export interface PhraseInterface {
  speaker: string;
  words: string;
  startTime: number;
}

class PlayerLogic {
  public phrases: PhraseInterface[] = [];

  private readonly intervals: number[] = [];

  constructor() {
    this.phrases = this.processTranscript();
    this.intervals = this.phrases.map((phrase) => phrase.startTime);
    this.findIntervalIndex = this.findIntervalIndex.bind(this);
    this.rewind = this.rewind.bind(this);
    this.forward = this.forward.bind(this);
  }

  public findIntervalIndex(number: number) {
    for (let i = 0; i < this.intervals.length - 1; i++) {
      if (number >= this.intervals[i] && number < this.intervals[i + 1]) {
        return i;
      }
    }

    if (number >= this.intervals[this.intervals.length - 1]) {
      return this.intervals.length - 1;
    }

    return -1;
  }

  public rewind(positionMillis: number) {
    for (let i = this.phrases.length - 1; i >= 0; i--) {
      if (positionMillis > this.phrases[i].startTime) {
        return this.phrases[i].startTime;
      } else if (positionMillis === this.phrases[i].startTime) {
        return i > 0 ? this.phrases[i - 1].startTime : this.phrases[this.phrases.length - 1].startTime;
      }
    }
    return 0;
  }

  public forward(positionMillis: number) {
    for (let i = 0; i < this.phrases.length; i++) {
      if (positionMillis < this.phrases[i].startTime) {
        return this.phrases[i].startTime;
      }
    }
    return this.phrases[0].startTime;
  }

  public comparePhrase(phrase?: PhraseInterface, newPhrase?: PhraseInterface) {
    if (!(phrase && newPhrase)) {
      return false;
    }
    return phrase.startTime + phrase.speaker === newPhrase.startTime + newPhrase.speaker;
  }

  private processTranscript() {
    const { speakers, pause } = metadata;

    const phrases: PhraseInterface[] = [];
    let currentTime = 0;

    const maxPhrases = Math.max(
      ...speakers.map((speaker) => speaker.phrases.length)
    );

    for (let i = 0; i < maxPhrases; i++) {
      speakers.forEach((speaker) => {
        if (i < speaker.phrases.length) {
          const phrase = speaker.phrases[i];
          phrases.push({
            speaker: speaker.name,
            words: phrase.words,
            startTime: currentTime,
          });
          currentTime += phrase.time + pause;
        }
      });
    }

    return phrases;
  }
}

export const playerLogic = new PlayerLogic();
