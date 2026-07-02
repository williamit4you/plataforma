export type LessonSection = {
  title: string;
  content: string;
};

const headingRegex = /^##\s+(.+)$/gm;

export function splitMarkdownSections(markdown: string): LessonSection[] {
  const matches = [...markdown.matchAll(headingRegex)];

  if (!matches.length) {
    return [{ title: "Aula", content: markdown.trim() }];
  }

  const intro = markdown.slice(0, matches[0].index).trim();
  const sections: LessonSection[] = intro ? [{ title: "Introducao", content: intro }] : [];

  matches.forEach((match, index) => {
    const title = match[1].trim();
    const contentStart = (match.index ?? 0) + match[0].length;
    const contentEnd = index + 1 < matches.length ? matches[index + 1].index ?? markdown.length : markdown.length;
    const content = markdown.slice(contentStart, contentEnd).trim();
    if (content) sections.push({ title, content });
  });

  return sections;
}
