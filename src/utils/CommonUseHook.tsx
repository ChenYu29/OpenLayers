/**
 * @description: 自定义公共hook
 * @author: cy
 * @createTime: 2020/8/28 11:30
 **/
import React, { useEffect, useRef, CSSProperties } from 'react';

// 无边框卡片Card的props
/**
 * @description card的配置参数
 * @param title 标题
 * @param style 样式
 * @param size 大小
 * @param bordered 是否有边框
 */
export const MyCardProps = (title: string | React.ReactNode, style?: CSSProperties, size?: 'default' | 'small', bordered?: boolean) => {
  return ({
    bordered: bordered || false,
    title: title,
    style: style || { width: '100%' },
    size: size || 'default'
  });
};
/**
 * @description 清空表单，当关闭模态框时
 * @param form 表单
 * @param visible 模态框显示状态
 */
const useResetFormOnCloseModal = ({ form, visible }) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);
};
export { useResetFormOnCloseModal };

