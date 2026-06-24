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
    text: 'I couldn\'t seem to experience any positive feeling at all',
    subscale: 'depression'
  },
  {
    id: 'd2',
    text: 'I found it difficult to work up the initiative to do things',
    subscale: 'depression'
  },
  {
    id: 'd3',
    text: 'I felt that I had nothing to look forward to',
    subscale: 'depression'
  },
  {
    id: 'd4',
    text: 'I felt down-hearted and blue',
    subscale: 'depression'
  },
  {
    id: 'd5',
    text: 'I was unable to become enthusiastic about anything',
    subscale: 'depression'
  },
  {
    id: 'd6',
    text: 'I felt I wasn\'t worth much as a person',
    subscale: 'depression'
  },
  {
    id: 'd7',
    text: 'I felt that life was meaningless',
    subscale: 'depression'
  },
  // Anxiety questions (A1-A7)
  {
    id: 'a1',
    text: 'I was aware of dryness of my mouth',
    subscale: 'anxiety'
  },
  {
    id: 'a2',
    text: 'I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)',
    subscale: 'anxiety'
  },
  {
    id: 'a3',
    text: 'I found it difficult to work up the initiative to do things',
    subscale: 'anxiety'
  },
  {
    id: 'a4',
    text: 'I tended to over-react to situations',
    subscale: 'anxiety'
  },
  {
    id: 'a5',
    text: 'I felt that I was using a lot of nervous energy',
    subscale: 'anxiety'
  },
  {
    id: 'a6',
    text: 'I felt that I was rather touchy',
    subscale: 'anxiety'
  },
  {
    id: 'a7',
    text: 'I found it hard to wind down',
    subscale: 'anxiety'
  },
  // Stress questions (S1-S7)
  {
    id: 's1',
    text: 'I found it hard to wind down',
    subscale: 'stress'
  },
  {
    id: 's2',
    text: 'I was aware of dryness of my mouth',
    subscale: 'stress'
  },
  {
    id: 's3',
    text: 'I couldn\'t seem to experience any positive feeling at all',
    subscale: 'stress'
  },
  {
    id: 's4',
    text: 'I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)',
    subscale: 'stress'
  },
  {
    id: 's5',
    text: 'I found it difficult to work up the initiative to do things',
    subscale: 'stress'
  },
  {
    id: 's6',
    text: 'I tended to over-react to situations',
    subscale: 'stress'
  },
  {
    id: 's7',
    text: 'I felt that I was using a lot of nervous energy',
    subscale: 'stress'
  }
];

export const getQuestionsBySubscale = (subscale: Subscale): Question[] => {
  return questions.filter(q => q.subscale === subscale);
};

export const getQuestionById = (id: string): Question | undefined => {
  return questions.find(q => q.id === id);
};
