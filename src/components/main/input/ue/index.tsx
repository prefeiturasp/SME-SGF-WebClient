import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_MODALIDADE } from '~/core/constants/ids/select';

type SelectUEsProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectUEs: React.FC<SelectUEsProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    // const resposta = await obterUEs();
    // if (resposta.sucesso) {
    //   const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
    //   setOptions(newOptions);
    // } else {
    //   setOptions([]);
    // }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item label='UE(s)' name='ues' {...formItemProps}>
      <Select
        allowClear
        options={options}
        placeholder='UE(s)'
        id={CF_SELECT_MODALIDADE}
        {...selectProps}
      />
    </Form.Item>
  );
};
export default SelectUEs;
