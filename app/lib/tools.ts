import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'app/data');

export function getDetail(topic: string): string {
  const projectPath = path.join(DATA_DIR, 'projects', `${topic}.md`);
  const topLevelPath = path.join(DATA_DIR, `${topic}.md`);

  if (fs.existsSync(projectPath)) {
    return fs.readFileSync(projectPath, 'utf-8');
  }
  if (fs.existsSync(topLevelPath)) {
    return fs.readFileSync(topLevelPath, 'utf-8');
  }
  return `No detailed information available for "${topic}".`;
}

export function getAvailableTopics(): string[] {
  const projectDir = path.join(DATA_DIR, 'projects');
  const projectFiles = fs.existsSync(projectDir)
    ? fs.readdirSync(projectDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace('.md', ''))
    : [];
  const topLevelFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''));
  return [...projectFiles, ...topLevelFiles];
}

export function getToolDefinitions() {
  return [
    {
      name: 'get_detail',
      description:
        'Get detailed information about a specific project, your background, or your design philosophy. Use when the visitor asks about specifics.',
      input_schema: {
        type: 'object' as const,
        properties: {
          topic: {
            type: 'string',
            description: 'The topic to look up.',
            enum: getAvailableTopics(),
          },
        },
        required: ['topic'],
      },
    },
  ];
}
