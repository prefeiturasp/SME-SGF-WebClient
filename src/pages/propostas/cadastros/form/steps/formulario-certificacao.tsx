import { Col, Form, Radio, RadioChangeEvent, Row } from 'antd';
import React, { useEffect, useState, useContext } from 'react';
import CheckboxAcaoInformatica from '~/components/lib/checkbox';
import SelectCriterioCertificacao from '~/components/main/input/criterio-certificacao';
import EditorTexto from '~/components/main/input/editor-texto';
import { DESCRICAO_DA_CERTIFICACAO_NAO_INFORMADA } from '~/core/constants/mensagens';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

const FormularioCertificacao: React.FC = () => {
  const form = Form.useFormInstance();

  const { desabilitarCampos } = useContext(PermissaoContext);

  const [valuePossuiCertificado, setValuePossuiCertificado] = useState(false);
  const [editorRequerido, setEditorRequerido] = useState(false);
  const obterPossuiCertificado = (e: RadioChangeEvent) => {
    setValuePossuiCertificado(e.target.value);
    form.setFieldValue('cursoComCertificado', e.target.value);
  };

  const obterDados = async () => {
    setTimeout(() => {
      setValuePossuiCertificado(form.getFieldValue('cursoComCertificado'));
    }, 2000);
  };

  const verificarCriteriosSelecionados = () => {
    const atividadeObrigatorioCodigo = 4;
    const criteriosSelecionados: number[] = form.getFieldValue('criterioCertificacao');
    const criterioExiste = criteriosSelecionados?.includes(atividadeObrigatorioCodigo);
    setTimeout(() => {
      setEditorRequerido(criterioExiste);
      setValuePossuiCertificado(form.getFieldValue('cursoComCertificado'));
    }, 1000);
    const error = form.getFieldError('descricaoDaAtividade');
    if (!criterioExiste && error.length > 0) {
      form.setFields([
        {
          name: 'descricaoDaAtividade',
          errors: [],
        },
      ]);
    }
  };

  useEffect(() => {
    obterDados();
    verificarCriteriosSelecionados();
  }, [verificarCriteriosSelecionados]);

  return (
    <>
      <Col>
        <Row>
          <Col>
            <Form.Item
              label='Curso com certificação'
              name='cursoComCertificado'
              rules={[{ required: true }]}
            >
              <Radio.Group
                onChange={obterPossuiCertificado}
                value={valuePossuiCertificado}
                defaultValue={false}
              >
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <SelectCriterioCertificacao onchange={verificarCriteriosSelecionados} />
          </Col>
          <Col span={24}>
            <EditorTexto
              nome='descricaoDaAtividade'
              label='Descrição da atividade obrigatória para certificação'
              required={editorRequerido}
              mensagemErro={DESCRICAO_DA_CERTIFICACAO_NAO_INFORMADA}
              mensagemTooltip='Deve ser proposta ao menos uma atividade que será considerada na atribuição do conceito ao participante, na qual o cursista se posicione criticamente sobre suas ações ou experiências no exercício da sua atuação profissional. A atividade obrigatória deve atender a diversidade e as particularidades do público-alvo.'
              disabled={desabilitarCampos}
            />
          </Col>
          <Col span={24}>
            <CheckboxAcaoInformatica />
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default FormularioCertificacao;
