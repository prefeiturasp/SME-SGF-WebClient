import { Button, Col, Form, Row, Select } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import InputCPF from '~/components/main/input/cpf';
import InputRegistroFuncional from '~/components/main/input/input-registro-funcional';
import RadioSimNao from '~/components/main/input/profissional-rede-municipal';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';
import { CF_SELECT_CARGO } from '~/core/constants/ids/select';
import { ERRO_INSCRICAO_MANUAL, RF_NAO_INFORMADO } from '~/core/constants/mensagens';
import { DadosInscricaoCargoEolDTO } from '~/core/dto/dados-usuario-inscricao-dto';
import { InscricaoManualDTO } from '~/core/dto/inscricao-manual-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { inserirInscricaoManual, obterRfCpf } from '~/core/services/inscricao-service';
import { onClickCancelar, onClickVoltar } from '~/core/utils/form';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';
import SelectFuncaoAtividade from '~/pages/formacao-cursista/inscricao/components/funcao-atividade';

export const FormCadastrosInscricoesManuais: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();
  const profissionalRedeWatch = useWatch('profissionalRede', form);
  const [optionsSelects, setOptionsSelects] = useState<DadosInscricaoCargoEolDTO[]>();
  const [optionsCargo, setOptionsCargo] = useState<DefaultOptionType[]>();

  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;
  const inscriacaoState = location?.state;
  const formacaoNome = inscriacaoState?.nomeFormacao ? `- ${inscriacaoState?.nomeFormacao}` : '';
  const URL_ROUTE_VOLTAR = `${ROUTES.FORMACAOES_INSCRICOES_EDITAR}/${id}`;
  const devolverStateNoVoltarESalvar = {
    state: location.state,
  };

  const salvar = (params: InscricaoManualDTO) => {
    // TODO: FALTA AJUSTAR A PERSISTENCIAS DOS NOVOS VALORES
    const newParams = {
      ...params,
      cpf: removerTudoQueNaoEhDigito(params.cpf),
    };

    const notificacao = (resposta: any) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Inscrição manual realizada com sucesso!',
        });

        navigate(URL_ROUTE_VOLTAR, devolverStateNoVoltarESalvar);
      }
    };

    inserirInscricaoManual(newParams, false).then((resposta) => {
      notificacao(resposta);

      if (resposta?.mensagens.includes(ERRO_INSCRICAO_MANUAL)) {
        confirmacao({
          content: resposta.mensagens,
          onOk() {
            const newParams = {
              ...params,
              podeContinuar: true,
            };

            inserirInscricaoManual(newParams).then((resposta) => notificacao(resposta));
          },
        });
      } else {
        if (resposta?.mensagens?.length) {
          resposta?.mensagens.forEach((description) => {
            notification.error({
              message: 'Erro',
              description,
            });
          });
        }
      }
    });
  };

  const buscarRfCPF = (rfCpf?: string) => {
    if (!rfCpf) return;

    obterRfCpf(removerTudoQueNaoEhDigito(rfCpf)).then((resposta) => {
      if (resposta.sucesso) {
        const dados = resposta.dados;

        form.setFieldValue('cpf', dados.cpf);
        form.setFieldValue('nome', dados.nome);

        setOptionsSelects(dados.usuarioCargos);
      }
    });
  };

  useEffect(() => {
    form.resetFields(['nome', 'cpf', 'registroFuncional', 'usuarioCargoSelecionado']);
    form.setFieldValue('cpf', '');
    form.setFieldValue('nome', '');
    form.setFieldValue('registroFuncional', '');
    form.setFieldValue('usuarioCargoSelecionado', undefined);
  }, [profissionalRedeWatch]);

  useEffect(() => {
    if (optionsSelects) {
      let usuarioCargos: DadosInscricaoCargoEolDTO[] = [];
      // TODO: FALTA TESTAR O SELECT FUNCAO/ATIVIDADE SE VAI MOSTRAR AS OPCOES
      // let usuarioCargoSelecionado: DadosInscricaoDTO['usuarioCargoSelecionado'] = undefined;

      usuarioCargos = cloneDeep(optionsSelects).map((item) => {
        let funcoes: DadosInscricaoCargoEolDTO[] = [];

        if (item?.funcoes?.length) {
          funcoes = item.funcoes.map((f) => ({
            ...f,
            label: f.descricao,
            value: f.codigo,
            tipoVinculo: f.tipoVinculo,
          }));
        }

        const valorValue =
          item.tipoVinculo && optionsSelects.length > 1
            ? `${item.codigo}-${item.tipoVinculo}`
            : item.codigo;

        return {
          ...item,
          value: valorValue,
          label: item.descricao,
          tipoVinculo: item.tipoVinculo,
          funcoes,
          codigo: item.codigo,
        };
      });

      setOptionsCargo(usuarioCargos);
    }
  }, [optionsSelects]);

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off'>
        <HeaderPage title={`Inscrição Manual ${formacaoNome}`}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  onClick={() =>
                    onClickVoltar({
                      form,
                      navigate,
                      route: URL_ROUTE_VOLTAR,
                      paramsRoute: devolverStateNoVoltarESalvar,
                    })
                  }
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      block
                      type='default'
                      id={CF_BUTTON_CANCELAR}
                      onClick={() => onClickCancelar({ form })}
                      disabled={!form.isFieldsTouched()}
                      style={{ fontWeight: 700 }}
                    >
                      Cancelar
                    </Button>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Button
                  block
                  type='primary'
                  id={CF_BUTTON_NOVO}
                  style={{ fontWeight: 700 }}
                  onClick={() => {
                    form.validateFields().then(salvar);
                  }}
                >
                  Salvar
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12} md={8}>
                <SelectTurmaEncontros
                  idProposta={id}
                  selectProps={{ mode: undefined }}
                  formItemProps={{ tooltip: false, name: 'propostaTurmaId' }}
                />
              </Col>

              <Col xs={12} sm={6} md={8}>
                <RadioSimNao
                  formItemProps={{
                    initialValue: true,
                    name: 'profissionalRede',
                    label: 'Profissional da rede municipal',
                  }}
                />
              </Col>

              <Col xs={12} sm={6} md={8}>
                <InputRegistroFuncional
                  habilitarInputSearch
                  formItemProps={{
                    rules: [{ required: profissionalRedeWatch, message: RF_NAO_INFORMADO }],
                  }}
                  inputProps={{
                    onSearch: buscarRfCPF,
                    disabled: !profissionalRedeWatch,
                    onChange: (e) => {
                      if (!e.target.value.length) {
                        form.resetFields(['nome', 'cpf']);
                      }
                    },
                  }}
                />
              </Col>

              <Col xs={12} sm={6} md={8}>
                <InputCPF
                  habilitarInputSearch
                  formItemProps={{
                    required: !profissionalRedeWatch,
                  }}
                  inputProps={{
                    onSearch: buscarRfCPF,
                    disabled: profissionalRedeWatch || profissionalRedeWatch === undefined,
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <InputTexto
                  formItemProps={{
                    name: 'nome',
                    label: 'Nome',
                  }}
                  inputProps={{
                    disabled: true,
                    id: CF_INPUT_NOME,
                    placeholder: 'Informe o Nome',
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label='Cargo' name='usuarioCargoSelecionado'>
                  <Select
                    allowClear
                    options={optionsCargo?.length ? optionsCargo : []}
                    onChange={() => form.setFieldValue('usuarioFuncaoSelecionado', undefined)}
                    placeholder='Selecione um cargo'
                    id={CF_SELECT_CARGO}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                {/* TODO: AINDA PRECISA VERIFICAR SE ESSE SELECT
                VAI SERVIR PRA ESSA TELA OU SE PRECISARÁ CRIAR UMA VARIACAO DELA */}
                <SelectFuncaoAtividade />
              </Col>
              {/* TODO: FALTA ADICIONAR O CAMPO DE VINCULO */}
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
