import { IModalProps } from '@/interfaces/common';
import { IDocumentInfo } from '@/interfaces/database/document';
import { Form, Modal } from 'antd';
import DOMPurify from 'dompurify';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LazyMonacoEditor = React.lazy(() => import('@monaco-editor/react'));

type FieldType = {
  meta?: string;
};

export function SetMetaModal({
  visible,
  hideModal,
  onOk,
  initialMetaData,
}: IModalProps<any> & { initialMetaData?: IDocumentInfo['meta_fields'] }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [monacoReady, setMonacoReady] = useState(false);

  const handleOk = useCallback(async () => {
    const values = await form.validateFields();
    onOk?.(values.meta);
  }, [form, onOk]);

  useEffect(() => {
    form.setFieldValue('meta', JSON.stringify(initialMetaData, null, 4));
  }, [form, initialMetaData]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@monaco-editor/react');
        mod.loader?.config({ paths: { vs: '/vs' } });
        if (!cancelled) setMonacoReady(true);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Modal
      title={t('knowledgeDetails.setMetaData')}
      open={visible}
      onOk={handleOk}
      onCancel={hideModal}
    >
      <Form
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        layout={'vertical'}
        form={form}
      >
        <Form.Item<FieldType>
          label={t('knowledgeDetails.metaData')}
          name="meta"
          rules={[
            {
              required: true,
              validator(rule, value) {
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(
                    new Error(t('knowledgeDetails.pleaseInputJson')),
                  );
                }
              },
            },
          ]}
          tooltip={
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  t('knowledgeDetails.documentMetaTips'),
                ),
              }}
            ></div>
          }
        >
          <React.Suspense fallback={<div style={{ height: 200 }} />}>
            {monacoReady ? (
              React.createElement(LazyMonacoEditor as any, {
                height: 200,
                defaultLanguage: 'json',
                theme: 'vs-dark',
              })
            ) : (
              <div style={{ height: 200 }} />
            )}
          </React.Suspense>
        </Form.Item>
      </Form>
    </Modal>
  );
}
