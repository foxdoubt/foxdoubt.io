import Typography from 'typography';

const foxDoubtTheme = new Typography({
  baseFontSize: '14px',
  googleFonts: [
    {
      name: 'Open Sans',
      styles: ['300', '400', '400i', '800', '800i']
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
    p: { marginBottom: 0 }
  })
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  foxDoubtTheme.injectStyles();
}

export default foxDoubtTheme;
export const rhythm = foxDoubtTheme.rhythm;
export const scale = foxDoubtTheme.scale;
