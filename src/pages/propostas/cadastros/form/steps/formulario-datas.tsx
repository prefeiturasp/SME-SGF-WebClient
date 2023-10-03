import { Button, Col, Form, FormInstance, Row, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Dayjs } from 'dayjs';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataTableEncontros from '~/components/lib/card-table-encontros';
import DrawerFormularioEncontroTurmas from '~/components/lib/drawer';
import DatePickerPeriodo from '~/components/main/input/date-range';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { DataEncontro } from '~/core/dto/formulario-drawer-encontro-dto';
import { Colors } from '~/core/styles/colors';

const columns: ColumnsType<CronogramaEncontrosPaginadoDto> = [
  { key: 'turmas', title: 'Turma', dataIndex: 'turmas' },
  { key: 'datas', title: 'Data', dataIndex: 'datas' },
  { key: 'hora', title: 'Hora', dataIndex: 'hora' },
  { key: 'tipoEncontroDescricao', title: 'Tipo de Encontro', dataIndex: 'tipoEncontroDescricao' },
];
const contentStyle: React.CSSProperties = {
  fontSize: 18,
  color: Colors.ORANGE_CONECTA_FORMACAO,
  fontWeight: 'bold',
};
const stuleButtonAddData: React.CSSProperties = {
  textAlign: 'center',
  width: '200px',
  marginBottom: '10px',
  marginTop: '2px',
  justifyContent: 'center',
  display: 'flex',
};
const contentStyleTituloListagem: React.CSSProperties = {
  fontSize: 16,
  color: 'black',
  fontWeight: 'bold',
};
type FormularioDatasProps = {
  form: FormInstance;
  idProposta?: string;
};
const FormularioDatas: React.FC<FormularioDatasProps> = ({ form, idProposta }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const paramsRoute = useParams();
  const [dadosEncontro, setDadosEncontro] = useState<CronogramaEncontrosPaginadoDto>();
  const id = paramsRoute?.id || 0;
  const refTable = useRef<any>(null);

  const datasPeriodoRealizacao = Form.useWatch('periodoRealizacao', form);

  const dataInicio = datasPeriodoRealizacao?.[0] as Dayjs;
  const dataFim = datasPeriodoRealizacao?.[1] as Dayjs;

  const periodoRealizacao: DataEncontro = {
    dataInicio,
    dataFim,
  };

  const propostaId = idProposta ? parseInt(id.toString()) : 0;

  const url_api_encontro = `v1/Proposta/${id}/encontro`;

  const abrirModal = () => {
    setDadosEncontro(undefined);
    const permiteAbrirModal = validiarPeriodo();

    if (permiteAbrirModal) {
      setOpenModal(true);
      return true;
    }
    return false;
  };

  const validiarPeriodo = () => {
    if (!dataInicio || !dataFim || !dataInicio?.isValid() || !dataFim?.isValid()) {
      notification.warning({
        message: 'Atenção',
        description: 'Informe a data do Período de realização',
      });

      return false;
    }

    return true;
  };

  const onCloseModal = (recarregarLista: boolean) => {
    setDadosEncontro(undefined);
    setOpenModal(false);

    if (recarregarLista && refTable?.current) {
      refTable.current?.reloadTable();
    }
  };

  const onClickEditar = (encontro: CronogramaEncontrosPaginadoDto) => {
    if (abrirModal()) {
      setDadosEncontro(encontro);
    }
  };

  return (
    <>
      {openModal && (
        <DrawerFormularioEncontroTurmas
          openModal={openModal}
          onCloseModal={onCloseModal}
          periodoRealizacao={periodoRealizacao}
          dadosEncontro={dadosEncontro}
        />
      )}
      <Col>
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={14} md={24} style={contentStyle}>
            Cronograma geral
          </Col>
          <Col sm={24} md={12} lg={8}>
            <b>
              <DatePickerPeriodo
                label='Período de realização'
                name='periodoRealizacao'
                required
                exibirTooltip
                titleToolTip='Primeiro dia da primeira turma até o último dia da última turma.'
              />
            </b>
          </Col>
          <Col xs={24}>
            <Row wrap={false} justify='space-between'>
              <Col style={contentStyle}>Cronograma de encontros</Col>
              <Col>
                <Button
                  type='primary'
                  id={CF_BUTTON_NOVO}
                  onClick={abrirModal}
                  style={stuleButtonAddData}
                >
                  Adicionar datas
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={14} md={24} style={contentStyleTituloListagem}>
            Listagem de encontros
          </Col>
          <Col span={24}>
            <DataTableEncontros
              ref={refTable}
              url={`v1/Proposta/${id}/encontro`}
              columns={columns}
              onRow={(row) => ({
                onClick: () => {
                  onClickEditar(row);
                },
              })}
            />
          </Col>
          <Col xs={24} sm={14} md={24} style={contentStyle}>
            Inscrição
          </Col>
          <Col xs={24} sm={10} md={7} lg={7} xl={5}>
            <b>
              <DatePickerPeriodo label='Período de inscricao' name='periodoInscricao' required />
            </b>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default FormularioDatas;
