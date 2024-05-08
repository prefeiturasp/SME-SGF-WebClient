import { Dayjs } from 'dayjs';
import { FormacaoHomologada } from '../enum/formacao-homologada';
import { Formato } from '../enum/formato';
import { SituacaoProposta } from '../enum/situacao-proposta';
import { TipoFormacao } from '../enum/tipo-formacao';
import { AuditoriaDTO } from './auditoria-dto';
import { TotalDePareceresDTO } from './parecer-proposta-dto';
import { PropostaAnoTurmaDTO } from './proposta-ano-turmas-dto';
import { PropostaAreaPromotoraDTO } from './proposta-area-promotora-dto';
import { PropostaComponenteCurricularDTO } from './proposta-componente-curriculares-dto';
import { PropostaCriterioValidacaoInscricaoDTO } from './proposta-criterio-validacao-inscricao-dto';
import { PropostaDresDTO } from './proposta-dres-dto';
import { PropostaFuncaoEspecificaDTO } from './proposta-funcao-especifica-dto';
import { PropostaImagemDivulgacaoDTO } from './proposta-imagem-divulgacao-dto';
import { PropostaModalidadeDTO } from './proposta-modalidade-dto';
import { PropostaMovimentacaoDTO } from './proposta-movimentacao-dto';
import { PropostaPublicoAlvoDTO } from './proposta-publico-alvo-dto';
import { PropostaVagaRemanecenteDTO } from './proposta-vaga-remanecente-dto';
import { DreDTO } from './retorno-listagem-dto';

export type PropostaDTO = {
  formacaoHomologada?: FormacaoHomologada;
  tipoFormacao?: TipoFormacao;
  formato?: Formato;
  tiposInscricao?: TipoInscricaoType[];
  dreIdPropostas: number | null;
  nomeFormacao?: string;
  quantidadeTurmas?: number | null;
  quantidadeVagasTurma?: number | null;
  funcaoEspecificaOutros: string;
  publicoAlvoOutros: string;
  criterioValidacaoInscricaoOutros: string;
  situacao: SituacaoProposta;
  arquivoImagemDivulgacaoId?: number;
  dataRealizacaoInicio?: string;
  dataRealizacaoFim?: string;
  dataInscricaoInicio?: string;
  dataInscricaoFim?: string;
  publicosAlvo: PropostaPublicoAlvoDTO[];
  funcoesEspecificas: PropostaFuncaoEspecificaDTO[];
  vagasRemanecentes: PropostaVagaRemanecenteDTO[];
  criteriosValidacaoInscricao: PropostaCriterioValidacaoInscricaoDTO[];
  cargaHorariaPresencial?: string;
  cargaHorariaSincrona?: string;
  cargaHorariaDistancia?: string;
  justificativa?: string;
  objetivos?: string;
  referencia?: string;
  procedimentoMetadologico?: string;
  conteudoProgramatico?: string;
  palavrasChaves: PropostaPalavraChaveDTO[];
  criterioCertificacao: CriterioCertificacaoDTO[];
  cursoComCertificado: boolean;
  acaoInformativa: boolean;
  acaoFormativaTexto?: string;
  acaoFormativaLink?: string;
  descricaoDaAtividade?: string;
  turmas?: PropostaTurmaDTO[];
  dres?: PropostaDresDTO[];
  modalidades?: PropostaModalidadeDTO[];
  anosTurmas?: PropostaAnoTurmaDTO[];
  componentesCurriculares?: PropostaComponenteCurricularDTO[];
  integrarNoSGA?: boolean;
  desativarAnoEhComponente?: boolean;
  rfResponsavelDf?: string;
  movimentacao?: PropostaMovimentacaoDTO;
  areaPromotora?: PropostaAreaPromotoraDTO;
  ultimaJustificativaDevolucao?: string;
  linkParaInscricoesExterna?: string;
  codigoEventoSigpec?: number;
  numeroHomologacao?: number;
  pareceristas?: PropostaPareceristaDTO[];
  podeEnviarParecer?: boolean;
  podeEnviar?: boolean;
  totalDePareceres?: TotalDePareceresDTO[];
  podeAprovar?: boolean;
  labelAprovar?: string;
  podeRecusar?: boolean;
  labelRecusar?: string;
};

export type TipoInscricaoType = {
  tipoInscricao: number;
};

export type PropostaCompletoDTO = {
  auditoria: AuditoriaDTO;
  arquivoImagemDivulgacao?: PropostaImagemDivulgacaoDTO;
} & PropostaDTO;

export type PropostaFormDTO = {
  formacaoHomologada?: FormacaoHomologada;
  tipoFormacao?: TipoFormacao;
  formato?: Formato;
  tiposInscricao?: number[];
  dreIdPropostas?: number | null;
  nomeFormacao?: string;
  quantidadeTurmas?: number | null;
  quantidadeTurmasOriginal?: number | null;
  quantidadeVagasTurma?: number | null;
  publicosAlvo?: number[];
  funcoesEspecificas?: number[];
  funcaoEspecificaOutros?: string;
  publicoAlvoOutros?: string;
  vagasRemanecentes?: number[];
  criteriosValidacaoInscricao?: number[];
  criterioValidacaoInscricaoOutros?: string;
  situacao?: SituacaoProposta;
  nomeSituacao?: string;
  auditoria?: AuditoriaDTO;
  arquivos?: any[];
  periodoRealizacao?: Dayjs[];
  periodoInscricao?: Dayjs[];
  cargaHorariaPresencial?: string;
  cargaHorariaSincrona?: string;
  cargaHorariaDistancia?: string;
  justificativa?: string;
  objetivos?: string;
  referencia?: string;
  procedimentoMetadologico?: string;
  conteudoProgramatico?: string;
  palavrasChaves?: number[];
  criterioCertificacao?: number[];
  cursoComCertificado?: boolean;
  acaoInformativa?: boolean;
  descricaoDaAtividade?: string;
  acaoFormativaTexto?: string;
  acaoFormativaLink?: string;
  turmas?: PropostaTurmaFormDTO[];
  dres?: DreDTO[];
  modalidade?: number;
  anosTurmas?: number[];
  componentesCurriculares?: number[];
  listaDres?: DreDTO[];
  integrarNoSGA?: boolean;
  desativarAnoEhComponente?: boolean;
  rfResponsavelDf?: string;
  movimentacao?: PropostaMovimentacaoDTO;
  areaPromotora?: PropostaAreaPromotoraDTO;
  ultimaJustificativaDevolucao?: string;
  totalDePareceres?: TotalDePareceresDTO[];
  linkParaInscricoesExterna?: string;
  codigoEventoSigpec?: number;
  numeroHomologacao?: number;
  qtdeLimitePareceristaProposta?: number;
  podeEnviar?: boolean;
  exibirParecer?: boolean;
  podeEnviarParecer?: boolean;
  pareceristas?: PropostaPareceristaFormDTO[];
  podeAprovar?: boolean;
  labelAprovar?: string;
  podeRecusar?: boolean;
  labelRecusar?: string;
};

export type PropostaPalavraChaveDTO = {
  palavraChaveId: number;
};

export type CriterioCertificacaoDTO = {
  criterioCertificacaoId: number;
};

export type PropostaTurmaDTO = {
  id?: number;
  nome: string;
  dresIds?: number[];
};

export type PropostaTurmaFormDTO = {
  key: number;
  id?: number;
  nome: string;
  dres?: DreDTO[];
};

export type PropostaPareceristaFormDTO = {
  id?: number;
  label?: string;
  value?: string;
};

export type PropostaPareceristaDTO = {
  id?: number;
  nomeParecerista?: string;
  registroFuncional?: string;
};
