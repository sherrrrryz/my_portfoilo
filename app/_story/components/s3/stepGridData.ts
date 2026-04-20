import type { ScatterTagColor } from './ScatterTag';

export type ImageCard = {
  id: string;
  kind: 'image';
  src: string;
  alt: string;
  label: string;
  labelColor?: ScatterTagColor;
  emoji?: string;
  noteColor?: string; // CSS var, e.g. 'var(--tag-amber-bg)'
};

export type TextCard = {
  id: string;
  kind: 'text';
  body: string;
  label: string;
  labelColor?: ScatterTagColor;
  emoji?: string;
};

export type StepCard = ImageCard | TextCard;

// Placeholder asset paths — replace with real images when ready.
export const STEP_CARDS: StepCard[] = [
  {
    id: 'sg-01', kind: 'image',
    src: '/story-s3/vote-result.jpg', alt: 'Vote result sticky notes on wall',
    label: 'vote result', labelColor: 'amber',
    noteColor: 'var(--tag-amber-bg)',
  },
  {
    id: 'sg-02', kind: 'text',
    body: 'Grew the team from 2 to 7',
    label: 'team growth', labelColor: 'mint',
    emoji: '😊',
  },
  {
    id: 'sg-03', kind: 'text',
    body: 'Held a 40-person workshop with design, PM, and research',
    label: 'workshop', labelColor: 'sky',
    emoji: '😊',
  },
  {
    id: 'sg-04', kind: 'text',
    body: 'Invited engineers to share their pain points',
    label: 'research', labelColor: 'peach',
  },
  {
    id: 'sg-05', kind: 'image',
    src: '/story-s3/interview-script.jpg', alt: 'Interview script document',
    label: 'interview script', labelColor: 'lavender',
    noteColor: 'var(--tag-lavender-bg)',
  },
  {
    id: 'sg-06', kind: 'text',
    body: 'Cross-role review: 10 designers + 10 PMs + 10 engineers',
    label: 'cross-role review', labelColor: 'rose',
  },
  {
    id: 'sg-07', kind: 'image',
    src: '/story-s3/workshop.jpg', alt: 'Workshop session photo',
    label: 'Workshop', labelColor: 'mint',
    noteColor: 'var(--tag-mint-bg)',
  },
  {
    id: 'sg-08', kind: 'text',
    body: 'Helped everyone understand the current state',
    label: 'alignment', labelColor: 'sky',
    emoji: '✨',
  },
  {
    id: 'sg-09', kind: 'image',
    src: '/story-s3/figma-guideline.jpg', alt: 'Figma design guideline screenshot',
    label: 'figma guideline', labelColor: 'amber',
    noteColor: 'var(--tag-peach-bg)',
  },
  {
    id: 'sg-10', kind: 'text',
    body: 'Gathered evidence to set a clear direction',
    label: 'direction', labelColor: 'peach',
    emoji: '✌️',
  },
  {
    id: 'sg-11', kind: 'image',
    src: '/story-s3/user-interview.jpg', alt: 'User interview session',
    label: 'user interview', labelColor: 'rose',
    noteColor: 'var(--tag-rose-bg)',
  },
  {
    id: 'sg-12', kind: 'text',
    body: 'Took the first step alone so others could follow',
    label: 'leadership', labelColor: 'lavender',
  },
];
