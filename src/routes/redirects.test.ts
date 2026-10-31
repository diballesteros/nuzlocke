import { readFileSync } from 'fs';

const rules = readFileSync('netlify.toml', 'utf8').split('[[redirects]]').slice(1);
const lastRule = rules[rules.length - 1];

describe('netlify.toml redirects', () => {
  it('keeps the SPA fallback last, because the first match wins', () => {
    expect(lastRule).toContain('from = "/*"');
    expect(lastRule).toContain('to = "/index.html"');
    expect(lastRule).toContain('status = 200');
    expect(rules.filter((rule) => rule.includes('from = "/*"'))).toHaveLength(1);
  });

  it("doesn't force the fallback over files in the build", () => {
    expect(lastRule).not.toContain('force');
  });
});
