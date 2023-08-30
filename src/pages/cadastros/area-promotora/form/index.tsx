import { Button, Col, Form, Input, Row, Select, notification } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputEmail from '~/components/main/input/email';
import TelefoneLista from '~/components/main/input/telefone-lista';
import Auditoria from '~/components/main/text/auditoria';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_EMAIL, CF_INPUT_NOME } from '~/core/constants/ids/input';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  DESEJA_EXCLUIR_REGISTRO,
} from '~/core/constants/mensagens';
import { AreaPromotoraDTO } from '~/core/dto/area-promotora-dto';
import { AreaPromotoraTipoDTO } from '~/core/dto/area-promotora-tipo-dto';
import { GrupoDTO } from '~/core/dto/grupo-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { confirmacao } from '~/core/services/alerta-service';
import {
  alterarRegistro,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from '~/core/services/api';

const FormCadastrosAreaPromotora: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const { Option } = Select;
  const id = paramsRoute?.id || 0;

  const URL_DEFAULT = 'v1/AreaPromotora';

  const [listaGrupos, setListaGrupos] = useState<GrupoDTO[]>();
  const [listaTipos, setListaTipos] = useState<AreaPromotoraTipoDTO[]>();
  const [formInitialValues, setFormInitialValues] = useState<AreaPromotoraDTO>();

  const tituloPagina = paramsRoute?.id
    ? 'Alteração da Área Promotora'
    : 'Cadastro da Área Promotora';

  const validateMessages: FormProps['validateMessages'] = {
    required: 'Campo obrigatório',
    string: {
      range: 'Por favor, digite Nome',
    },
    types: {
      email: 'Por favor, Informe um e-mail válido',
    },
    whitespace: 'Campo obrigatório',
  };

  const carregarDados = useCallback(async () => {
    const resposta = await obterRegistro<AreaPromotoraDTO>(`${URL_DEFAULT}/${id}`);

    if (resposta.sucesso) {
      if (!resposta.dados?.telefones?.length) {
        resposta.dados.telefones = [{ telefone: '' }];
      }
      setFormInitialValues(resposta.dados);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [carregarDados, id]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  const obterGrupos = useCallback(async () => {
    const resposta = await obterRegistro<GrupoDTO[]>('v1/Grupo');
    if (resposta.sucesso) {
      setListaGrupos(resposta.dados);
    }
  }, [id]);

  const obterTipos = useCallback(async () => {
    const resposta = await obterRegistro<AreaPromotoraTipoDTO[]>(`${URL_DEFAULT}/tipos`);
    if (resposta.sucesso) {
      setListaTipos(resposta.dados);
    }
  }, []);

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          navigate(ROUTES.AREA_PROMOTORA);
        },
      });
    } else {
      navigate(ROUTES.AREA_PROMOTORA);
    }
  };

  const onClickCancelar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
        },
      });
    }
  };

  const salvar = async (values: any) => {
    let response = null;
    const valoresSalvar = { ...values };

    if (valoresSalvar?.telefones?.length) {
      valoresSalvar.telefones = valoresSalvar.telefones.filter((item: any) => !!item?.telefone);
    }
    if (id) {
      response = await alterarRegistro(`${URL_DEFAULT}/${id}`, {
        ...valoresSalvar,
      });
    } else {
      response = await inserirRegistro(URL_DEFAULT, valoresSalvar);
    }

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: `Registro ${id ? 'alterado' : 'inserido'} com sucesso!`,
      });
      navigate(ROUTES.AREA_PROMOTORA);
    }
  };

  const onClickExcluir = () => {
    if (id) {
      confirmacao({
        content: DESEJA_EXCLUIR_REGISTRO,
        onOk() {
          deletarRegistro(`${URL_DEFAULT}/${id}`).then((response) => {
            if (response.sucesso) {
              notification.success({
                message: 'Sucesso',
                description: 'Registro excluído com sucesso',
              });
              navigate(ROUTES.AREA_PROMOTORA);
            }
          });
        },
      });
    }
  };

  useEffect(() => {
    obterGrupos();
    obterTipos();
  }, [obterGrupos, obterTipos]);

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={salvar}
        validateMessages={validateMessages}
        initialValues={formInitialValues}
      >
        <HeaderPage title={tituloPagina}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
              </Col>
              {id ? (
                <Col>
                  <ButtonExcluir id={CF_BUTTON_EXCLUIR} onClick={onClickExcluir} />
                </Col>
              ) : (
                <></>
              )}
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      block
                      type='default'
                      id={CF_BUTTON_CANCELAR}
                      onClick={onClickCancelar}
                      style={{ fontWeight: 700 }}
                      disabled={!form.isFieldsTouched()}
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
                  htmlType='submit'
                  id={CF_BUTTON_NOVO}
                  style={{ fontWeight: 700 }}
                >
                  {id ? 'Alterar' : 'Salvar'}
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label='Área promotora'
                  key='nome'
                  name='nome'
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input
                    type='text'
                    maxLength={50}
                    id={CF_INPUT_NOME}
                    placeholder='Nome da área promotra'
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label='Tipo' key='tipo' name='tipo' rules={[{ required: true }]}>
                  <Select placeholder='Selecione o Tipo' allowClear>
                    {listaTipos?.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.nome}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <TelefoneLista />

              <Col xs={24} sm={12}>
                <InputEmail inputProps={{ id: CF_INPUT_EMAIL }} />
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label='Perfil' key='grupoId' name='grupoId' rules={[{ required: true }]}>
                  <Select placeholder='Selecione o Perfil' allowClear>
                    {listaGrupos?.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.nome}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Auditoria dados={formInitialValues?.auditoria} />
        </CardContent>
      </Form>
    </Col>
  );
};

export default FormCadastrosAreaPromotora;
