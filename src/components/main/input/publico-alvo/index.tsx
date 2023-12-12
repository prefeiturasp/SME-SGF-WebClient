import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PUBLICO_ALVO } from '~/core/constants/ids/select';
import { obterPublicoAlvo } from '~/core/services/cargo-funcao-service';
import { Colors } from '~/core/styles/colors';
import { getTooltipFormInfoCircleFilled } from '../../tooltip';

type SelectPublicoAlvoProps = {
  formItemProps?: FormItemProps;
  exibirTooltip?: boolean | true;
  selectProps?: SelectProps;
};

const SelectPublicoAlvo: React.FC<SelectPublicoAlvoProps> = ({
  selectProps,
  formItemProps,
  exibirTooltip = true,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterPublicoAlvo();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );

  return (
    <Form.Item
      label='Público alvo'
      name='publicosAlvo'
      tooltip={getTooltipFormInfoCircleFilled(
        'Indicar somente aqueles que têm relação com o tema e objetivos da formação.',
      )}
      {...formItemProps}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Público alvo'
        {...selectProps}
        id={CF_SELECT_PUBLICO_ALVO}
      />
    </Form.Item>
  );
};

export default SelectPublicoAlvo;
