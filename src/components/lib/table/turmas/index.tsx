import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  id: string;
  nome: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const form = Form.useFormInstance();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} é requerido`,
          },
        ]}
      >
        <Input
          ref={inputRef}
          //  onPressEnter={save} onBlur={save}
        />
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  id: React.Key;
  nome: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const TabelaTurmas: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      id: '1',
      nome: 'Turma 1',
    },
  ]);

  const [count, setCount] = useState(2);

  //   const handleDelete = (key: React.Key) => {
  //     const newData = dataSource.filter((item) => item.key !== key);
  //     setDataSource(newData);
  //   };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Turma',
      dataIndex: 'nome',
      width: '60%',
      editable: true,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      id: count,
      nome: `Turma ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex + Math.random(),
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Button onClick={handleAdd} type='primary' style={{ marginBottom: 16 }}>
        Adicionar Turma
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default TabelaTurmas;
