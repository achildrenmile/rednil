import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Load TTF font files for satori (woff2 not supported)
function loadFont(name: string): Buffer {
  const fontsDir = join(process.cwd(), 'src', 'assets', 'fonts');
  return readFileSync(join(fontsDir, `${name}.ttf`));
}

export async function generateOGImage(title: string, description?: string): Promise<Buffer> {
  const newsreaderFont = loadFont('newsreader');
  const interTightFont = loadFont('inter-tight');

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%',
          padding: '60px 80px',
          backgroundColor: '#1a1614',
          color: '#f5f3f0',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      fontFamily: 'Inter Tight',
                      color: '#c4623a',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase' as const,
                    },
                    children: 'rednil.at',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 60 ? '40px' : '52px',
                      fontFamily: 'Newsreader',
                      fontWeight: 700,
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                    },
                    children: title,
                  },
                },
                ...(description
                  ? [
                      {
                        type: 'div' as const,
                        props: {
                          style: {
                            fontSize: '22px',
                            fontFamily: 'Inter Tight',
                            color: '#a09890',
                            lineHeight: 1.5,
                            marginTop: '8px',
                          },
                          children:
                            description.length > 140
                              ? description.slice(0, 137) + '...'
                              : description,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Newsreader',
          data: newsreaderFont,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Inter Tight',
          data: interTightFont,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter Tight',
          data: interTightFont,
          weight: 600,
          style: 'normal',
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  return Buffer.from(resvg.render().asPng());
}
