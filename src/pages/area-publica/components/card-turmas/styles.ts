import { Colors } from '~/core/styles/colors';

const cardStyle: React.CSSProperties = {
  width: 230,
  padding: 0,
  margin: 8,
  backgroundColor: Colors.BACKGROUND_CONTENT,
  borderColor: Colors.Neutral.LIGHT,
  border: '1px solid',
};
const headStyle: React.CSSProperties = {
  backgroundColor: Colors.SystemSME.ConectaFormacao.PRIMARY,
  border: 1,
  fontSize: 22,
  color: Colors.Neutral.WHITE,
  paddingTop: 30,
};
const bodyStyle: React.CSSProperties = {
  backgroundColor: Colors.BACKGROUND_CONTENT,
  padding: 0,
  paddingTop: 0,
};
const tituloHeadStyleBorder: React.CSSProperties = {
  border: 'solid',
  borderColor: Colors.Neutral.WHITE,
  padding: 10,
  paddingLeft: 30,
};
const turmaEncerradaStyle: React.CSSProperties = {
  background: Colors.Suporte.Primary.ERROR,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'left',
};
const turmaEncerradaStyleBackground: React.CSSProperties = {
  background: Colors.Suporte.Primary.ERROR,
  color: Colors.Neutral.WHITE,
  fontWeight: 'bolder',
};
const titleStyle: React.CSSProperties = {
  paddingTop: 10,
  paddingLeft: 10,
  paddingRight: 10,
};
const descriptionStyle: React.CSSProperties = {
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 5,
};

export {
  cardStyle,
  headStyle,
  bodyStyle,
  tituloHeadStyleBorder,
  turmaEncerradaStyle,
  turmaEncerradaStyleBackground,
  titleStyle,
  descriptionStyle,
};
