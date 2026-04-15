import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Typography,
  TypographyBody,
  TypographyBodySm,
  TypographyCaption,
  TypographyCardTitle,
  TypographyCode,
  TypographyHero,
  TypographyLabel,
  TypographyLead,
  TypographyMuted,
  TypographyOverline,
  TypographyPageTitle,
  TypographySectionTitle,
  TypographySubsectionTitle,
} from './Typography';

describe('Typography', () => {
  describe('default element per variant', () => {
    const cases: [string, string, string][] = [
      ['hero', 'h1', 'Hero text'],
      ['pageTitle', 'h2', 'Page title'],
      ['sectionTitle', 'h3', 'Section title'],
      ['cardTitle', 'h4', 'Card title'],
      ['subsectionTitle', 'h5', 'Subsection title'],
      ['body', 'p', 'Body text'],
      ['bodySm', 'p', 'Small body'],
      ['lead', 'p', 'Lead text'],
      ['label', 'p', 'Label text'],
      ['muted', 'p', 'Muted text'],
      ['caption', 'span', 'Caption text'],
      ['overline', 'span', 'Overline text'],
      ['code', 'code', 'Code text'],
    ];

    it.each(cases)(
      'variant "%s" renders as <%s>',
      (variant, expectedTag, content) => {
        render(
          <Typography
            variant={variant as Parameters<typeof Typography>[0]['variant']}
          >
            {content}
          </Typography>,
        );
        const el = screen.getByText(content);
        expect(el.tagName.toLowerCase()).toBe(expectedTag);
      },
    );
  });

  it('renders as default <p> when no variant is specified', () => {
    render(<Typography>Default text</Typography>);
    expect(screen.getByText('Default text').tagName.toLowerCase()).toBe('p');
  });

  it('overrides element with "as" prop', () => {
    render(
      <Typography as="section" variant="body">
        As section
      </Typography>,
    );
    expect(screen.getByText('As section').tagName.toLowerCase()).toBe(
      'section',
    );
  });

  it('adds "truncate" class when truncate prop is true', () => {
    render(<Typography truncate>Truncated</Typography>);
    expect(screen.getByText('Truncated').className).toContain('truncate');
  });

  it('does not add "truncate" class by default', () => {
    render(<Typography>Normal</Typography>);
    expect(screen.getByText('Normal').className).not.toContain('truncate');
  });

  it('merges custom className', () => {
    render(<Typography className="custom-class">Styled</Typography>);
    expect(screen.getByText('Styled').className).toContain('custom-class');
  });

  it('renders children correctly', () => {
    render(<Typography>Hello world</Typography>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });
});

describe('named variant components', () => {
  it('TypographyHero renders as h1', () => {
    render(<TypographyHero>Hero</TypographyHero>);
    expect(screen.getByText('Hero').tagName.toLowerCase()).toBe('h1');
  });

  it('TypographyPageTitle renders as h2', () => {
    render(<TypographyPageTitle>Page</TypographyPageTitle>);
    expect(screen.getByText('Page').tagName.toLowerCase()).toBe('h2');
  });

  it('TypographySectionTitle renders as h3', () => {
    render(<TypographySectionTitle>Section</TypographySectionTitle>);
    expect(screen.getByText('Section').tagName.toLowerCase()).toBe('h3');
  });

  it('TypographyCardTitle renders as h4', () => {
    render(<TypographyCardTitle>Card</TypographyCardTitle>);
    expect(screen.getByText('Card').tagName.toLowerCase()).toBe('h4');
  });

  it('TypographySubsectionTitle renders as h5', () => {
    render(<TypographySubsectionTitle>Sub</TypographySubsectionTitle>);
    expect(screen.getByText('Sub').tagName.toLowerCase()).toBe('h5');
  });

  it('TypographyBody renders as p', () => {
    render(<TypographyBody>Body</TypographyBody>);
    expect(screen.getByText('Body').tagName.toLowerCase()).toBe('p');
  });

  it('TypographyBodySm renders as p', () => {
    render(<TypographyBodySm>Body Sm</TypographyBodySm>);
    expect(screen.getByText('Body Sm').tagName.toLowerCase()).toBe('p');
  });

  it('TypographyLead renders as p', () => {
    render(<TypographyLead>Lead</TypographyLead>);
    expect(screen.getByText('Lead').tagName.toLowerCase()).toBe('p');
  });

  it('TypographyMuted renders as p', () => {
    render(<TypographyMuted>Muted</TypographyMuted>);
    expect(screen.getByText('Muted').tagName.toLowerCase()).toBe('p');
  });

  it('TypographyLabel renders as p', () => {
    render(<TypographyLabel>Label</TypographyLabel>);
    expect(screen.getByText('Label').tagName.toLowerCase()).toBe('p');
  });

  it('TypographyCaption renders as span', () => {
    render(<TypographyCaption>Caption</TypographyCaption>);
    expect(screen.getByText('Caption').tagName.toLowerCase()).toBe('span');
  });

  it('TypographyOverline renders as span', () => {
    render(<TypographyOverline>Overline</TypographyOverline>);
    expect(screen.getByText('Overline').tagName.toLowerCase()).toBe('span');
  });

  it('TypographyCode renders as code', () => {
    render(<TypographyCode>Code</TypographyCode>);
    expect(screen.getByText('Code').tagName.toLowerCase()).toBe('code');
  });
});
