export type Subscale = 'depression' | 'anxiety' | 'stress';

export interface Question {
  id: string;
  text: string;
  subscale: Subscale;
}

export const questions: Question[] = [
  // Depression questions (D1-D7)
  {
    id: 'd1',
    text: 'I can\'t seem to experience any positive feeling at all',
    subscale: 'depression'
  },
  {
    id: 'd2',
    text: 'I find it difficult to work up the initiative to do things',
    subscale: 'depression'
  },
  {
    id: 'd3',
    text: 'I feel that I have nothing to look forward to',
    subscale: 'depression'
  },
  {
    id: 'd4',
    text: 'I feel down-hearted and blue',
    subscale: 'depression'
  },
  {
    id: 'd5',
    text: 'I am unable to become enthusiastic about anything',
    subscale: 'depression'
  },
  {
    id: 'd6',
    text: 'I feel I\'m not worth much as a person',
    subscale: 'depression'
  },
  {
    id: 'd7',
    text: 'I feel that life is meaningless',
    subscale: 'depression'
  },
  // Anxiety questions (A1-A7)
  {
    id: 'a1',
    text: 'I am aware of dryness of my mouth',
    subscale: 'anxiety'
  },
  {
    id: 'a2',
    text: 'I experience breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)',
    subscale: 'anxiety'
  },
  {
    id: 'a3',
    text: 'I experience trembling (e.g., in the hands)',
    subscale: 'anxiety'
  },
  {
    id: 'a4',
    text: 'I am worried about situations in which I might panic and make a fool of myself',
    subscale: 'anxiety'
  },
  {
    id: 'a5',
    text: 'I feel I am close to panic',
    subscale: 'anxiety'
  },
  {
    id: 'a6',
    text: 'I am aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)',
    subscale: 'anxiety'
  },
  {
    id: 'a7',
    text: 'I feel scared without any good reason',
    subscale: 'anxiety'
  },
  // Stress questions (S1-S7)
  {
    id: 's1',
    text: 'I find it hard to wind down',
    subscale: 'stress'
  },
  {
    id: 's2',
    text: 'I tend to over-react to situations',
    subscale: 'stress'
  },
  {
    id: 's3',
    text: 'I feel that I am using a lot of nervous energy',
    subscale: 'stress'
  },
  {
    id: 's4',
    text: 'I find myself getting agitated',
    subscale: 'stress'
  },
  {
    id: 's5',
    text: 'I find it difficult to relax',
    subscale: 'stress'
  },
  {
    id: 's6',
    text: 'I am intolerant of anything that keeps me from getting on with what I am doing',
    subscale: 'stress'
  },
  {
    id: 's7',
    text: 'I feel that I am rather touchy',
    subscale: 'stress'
  }
];

export const getQuestionsBySubscale = (subscale: Subscale): Question[] => {
  return questions.filter(q => q.subscale === subscale);
};

export const getQuestionById = (id: string): Question | undefined => {
  return questions.find(q => q.id === id);
};
