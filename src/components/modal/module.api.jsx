import { useEffect } from 'react'
import { Card, Col, Collapse, Row, Tooltip } from 'antd';
import { ProFormSwitch } from '@ant-design/pro-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { grey } from '@ant-design/colors';

import { colorMethod, groupByPermission } from '../../config/utils';

const ModuleApi = (props) => {
  const { form, listPermissions, singleRole, openModal } = props;

  useEffect(() => {
    if (listPermissions?.length && singleRole?.id && openModal === true) {

      //current permissions of role
      const userPermissions = groupByPermission(singleRole.permissions);

      const p = {};

      listPermissions.forEach(x => {
        let allCheck = true;
        x.permissions?.forEach(y => {
          const temp = userPermissions.find(z => z.module === x.module);

          p[y.id] = false;

          if (temp) {
            const isExist = temp.permissions.find(k => k.id === y.id);
            if (isExist) {
              form.setFieldValue(['permissions', y.id ], true);
              p[y.id] = true;
            } else allCheck = false;
          } else {
            allCheck = false;
          }
        })


        form.setFieldValue(['permissions', x.module], allCheck);
        p[x.module] = allCheck;

      })

      form.setFieldsValue({
        name: singleRole.name,
        active: singleRole.active,
        description: singleRole.description,
        permissions: p
      })

    }
  }, [form, listPermissions, openModal, singleRole.active, singleRole.description, singleRole?.id, singleRole.name, singleRole.permissions])

  const handleSingleCheck = (value, child, parent) => {
    form.setFieldValue(['permissions', child], value);

    //check all
    const temp = listPermissions?.find(item => item.module === parent);
    if (temp?.module) {
      const restPermission = temp?.permissions?.filter(item => item.id !== child);
      if (restPermission && restPermission.length) {
        const allTrue = restPermission.every(item => form.getFieldValue(['permissions', item.id]));
        form.setFieldValue(['permissions', parent], allTrue && value)
      }
    }

  }

  const handleSwitchAll = (value, name) => {
    const child = listPermissions?.find(item => item.module === name);
    if (child) {
      child?.permissions?.forEach(item => {
        if (item.id)
          form.setFieldValue(['permissions', item.id], value)
      })
    }
  }
  const panels = listPermissions?.map((item, index) => ({
    key: `${index}-parent`,
    label: <div>{item.module}</div>,
    forceRender: true,
    extra: (
      <div className='customize-form-item'>
        <ProFormSwitch
          name={['permissions', item.module]}
          fieldProps={{
            defaultChecked: false,
            onClick: (u, e) => { e.stopPropagation() },
            onChange: (value) => handleSwitchAll(value, item.module),
          }}
        />
      </div>
    ),
    children: (
      <Row gutter={[16, 16]}>
        {
          item.permissions?.map((value, i) => (
            <Col lg={12} md={12} sm={24} key={`${i}-child-${item.module}`}>
              <Card size='small' bodyStyle={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ProFormSwitch
                    name={['permissions', value.id]}
                    fieldProps={{
                      defaultChecked: false,
                      onChange: (v) => handleSingleCheck(v, (value.id), item.module)
                    }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Tooltip title={value?.name}>
                    <p style={{ paddingLeft: 10, marginBottom: 3 }}>{value?.name || ''}</p>
                    <div style={{ display: 'flex' }}>
                      <p style={{ paddingLeft: 10, fontWeight: 'bold', marginBottom: 0, color: colorMethod(value?.method) }}>{value?.method || ''}</p>
                      <p style={{ paddingLeft: 10, marginBottom: 0, color: grey[5] }}>{value?.apiPath || ''}</p>
                    </div>
                  </Tooltip>
                </div>
              </Card>
            </Col>
          ))
        }
      </Row>
    )
  }));

  return (
    <>
      <Card size='small' bordered={false}>
        <Collapse items={panels} />
      </Card>
    </>
  )
}

export default ModuleApi