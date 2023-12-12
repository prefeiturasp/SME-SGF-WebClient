import dayjs from 'dayjs';
import { OpcaoListagem } from '~/core/enum/opcao-listagem';

export const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

export const formatarDataHoraAuditoria = (data: string) =>
  dayjs(data).format('DD/MM/YYYY [às] HH:mm');

export const formatarDuasCasasDecimais = (value: any) =>
  removerTudoQueNaoEhDigito(value).replace(/(\d{3})(\d{2})$/, '$1:$2');

export const validarOnChangeMultiSelectOutros = (newValues: any[], currentValues: any[]) => {
  let valorParaSetar: any[] = newValues;
  const valorAtualTemOpcaoOutros = currentValues?.includes(OpcaoListagem.Outros);
  const valoresNovosTemOpcaoOutros = newValues.includes(OpcaoListagem.Outros);

  if (valorAtualTemOpcaoOutros) {
    const listaSemOpcaoOutros = newValues.filter((valor) => valor !== OpcaoListagem.Outros);
    valorParaSetar = listaSemOpcaoOutros;
  }
  if (!valorAtualTemOpcaoOutros && valoresNovosTemOpcaoOutros) {
    valorParaSetar = [OpcaoListagem.Outros];
  }

  return valorParaSetar;
};

export const validarOnChangeMultiSelectUnico = (valoresNovos: any, valoreAtuais: any) => {
  if (!valoresNovos?.length) return [];

  let valorParaSetar: any[] = valoresNovos;

  const valorAtualTemOpcaoUnico = valoreAtuais?.find((item: any) => item?.unico);
  const valoresNovosTemOpcaoUnico = valoresNovos.find((item: any) => item?.unico);

  if (valorAtualTemOpcaoUnico) {
    const listaSemOpcaoUnico = valoresNovos.filter((item: any) => !item?.unico);
    valorParaSetar = listaSemOpcaoUnico;
  }
  if (!valorAtualTemOpcaoUnico && valoresNovosTemOpcaoUnico) {
    return [valoresNovosTemOpcaoUnico.value];
  }

  return valorParaSetar.map((item) => item?.value);
};

export const onchangeMultiSelectOpcaoTodos = (
  valores: any[],
  valorAtual: any[],
  valorTodosComparacao: any = OpcaoListagem.Todos,
) => {
  let valorParaSetar = valores;
  const valorAtualTemOpcaoTodos = valorAtual?.includes(valorTodosComparacao);
  const valoresTemOpcaoTodos = valores.includes(valorTodosComparacao);

  if (valorAtualTemOpcaoTodos) {
    const listaSemOpcaoTodos = valores.filter((valor) => valor !== valorTodosComparacao);
    valorParaSetar = listaSemOpcaoTodos;
  }
  if (!valorAtualTemOpcaoTodos && valoresTemOpcaoTodos) {
    valorParaSetar = [valorTodosComparacao];
  }

  return valorParaSetar;
};
