/**
 * 图片审核状态枚举
 * 定义了图片审核的三种状态：待审核、通过、拒绝
 */
export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

/**
 * 图片审核状态映射表
 * 将审核状态码映射为对应的中文描述
 */
export const PIC_REVIEW_STATUS_MAP = {
  0: '待审核',
  1: '通过',
  2: '拒绝',
}

/**
 * 图片审核状态选项数组
 * 基于审核状态映射表生成包含label和value的对象数组，用于下拉选项等场景
 * @returns 包含label和value属性的对象数组，label为状态中文描述，value为状态码
 */
export const PIC_REVIEW_STATUS_OPTIONS = Object.keys(PIC_REVIEW_STATUS_MAP).map((key) => {
  const numericKey = Number(key) as keyof typeof PIC_REVIEW_STATUS_MAP;
  return {
    label: PIC_REVIEW_STATUS_MAP[numericKey],
    value: numericKey,
  }
})

/**
 * 图片编辑消息类型枚举
 * 定义了图片编辑过程中可能产生的消息类型
 */
export const PICTURE_EDIT_MESSAGE_TYPE_ENUM = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  ENTER_EDIT: 'ENTER_EDIT',
  EXIT_EDIT: 'EXIT_EDIT',
  EDIT_ACTION: 'EDIT_ACTION',
};

/**
 * 图片编辑消息类型映射表
 * 将消息类型映射为对应的中文描述
 */
export const PICTURE_EDIT_MESSAGE_TYPE_MAP = {
  INFO: '发送通知',
  ERROR: '发送错误',
  ENTER_EDIT: '进入编辑状态',
  EXIT_EDIT: '退出编辑状态',
  EDIT_ACTION: '执行编辑操作',
};

/**
 * 图片编辑操作枚举
 * 定义了图片编辑支持的基本操作类型
 */
export const PICTURE_EDIT_ACTION_ENUM = {
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
  ROTATE_LEFT: 'ROTATE_LEFT',
  ROTATE_RIGHT: 'ROTATE_RIGHT',
};

/**
 * 图片编辑操作映射表
 * 将编辑操作类型映射为对应的中文描述
 */
export const PICTURE_EDIT_ACTION_MAP = {
  ZOOM_IN: '放大操作',
  ZOOM_OUT: '缩小操作',
  ROTATE_LEFT: '左旋操作',
  ROTATE_RIGHT: '右旋操作',
};

