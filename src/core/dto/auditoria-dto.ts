import { BaseDTO } from './base-dto';

export type EntidadeBaseAuditavel = {
  criadoEm: string;
  criadoPor: string;
  alteradoEm: string;
  alteradoPor: string;
  criadoLogin: string;
  alteradoLogin: string;
} & BaseDTO;
