export interface LayersTheme {
  bgBase: string;
  bgHover: string;
  bgSelected: string;
  bgCanvas: string;
  textPrimary: string;
  textSelected: string;
  iconPrimary: string;
  iconSelected: string;
  borderColor: string;
  shadowColor: string;
}
export declare const lightTheme: LayersTheme;
export declare const darkTheme: LayersTheme;
export declare const getTheme: (mode?: 'light' | 'dark') => LayersTheme;
