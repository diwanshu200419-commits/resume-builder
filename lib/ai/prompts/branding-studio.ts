export function getBrandingStudioPrompt(name: string, role: string, techStack: string): string {
  return `Generate personal branding assets for a software developer named ${name} specializing as ${role}.

Tech Stack: ${techStack}

Outputs:
1. Recruiter-attracting LinkedIn Headline
2. High-converting LinkedIn About Bio Summary
3. Developer GitHub Profile README.md
4. Custom SVG LinkedIn Cover Banner Specification`;
}
