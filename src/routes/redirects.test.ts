import { readFileSync } from 'fs';

const rules = readFileSync('netlify.toml', 'utf8').split('[[redirects]]').slice(1);

describe('netlify.toml redirects', () => {
  it('keeps the SPA fallback last, because the first match wins', () => {
    expect(rules.at(-1)).toContain('from = "/*"');
    expect(rules.at(-1)).toContain('to = "/index.html"');
    expect(rules.at(-1)).toContain('status = 200');
    expect(rules.filter((rule) => rule.includes('from = "/*"'))).toHaveLength(1);
  });

  it("doesn't force the fallback over files in the build", () => {
    expect(rules.at(-1)).not.toContain('force');
  });
});
