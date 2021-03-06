import Typography from 'typography';

const foxDoubtTheme = new Typography({
  baseFontSize: '16px',
  baseLineHeight: 1.65,
  fontDisplay: 'swap',
  googleFonts: [
    {
      name: 'Open Sans',
      styles: ['300', '400', '400i', '600', '800', '800i']
    },
    {
      name: 'Pacifico',
      styles: ['400']
    }
  ],
  headerFontFamily: ['Pacifico', 'cursive'],
  headerColor: '#2f2f2f',
  headerWeight: 'normal',
  bodyFontFamily: ['Open Sans', 'sans-serif'],
  bodyColor: '#2f2f2f',
  boldWeight: '800',
  overrideStyles: () => ({
    'p,hr,h3,img,figure': { marginBottom: 0 },
    '.blog-title,.blog-subtitle': {
      fontFamily: ['Open Sans', 'sans-serif'].join(',')
    }
  })
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  foxDoubtTheme.injectStyles();
}

export default foxDoubtTheme;
export const rhythm = foxDoubtTheme.rhythm;
export const scale = foxDoubtTheme.scale;
