// 空间级别枚举
export const SPACE_LEVEL_ENUM = {
  COMMON: 0,
  PROFESSIONAL: 1,
  FLAGSHIP: 2,
} as const;

// 空间级别文本映射
export const SPACE_LEVEL_MAP: Record<number, string> = {
  0: '普通版',
  1: '专业版',
  2: '旗舰版',
};

/**
 * 空间级别选项列表
 *
 * 说明：
 * - 从 SPACE_LEVEL_MAP 构造出选项数组，用于下拉选择等场景
 * - 每个元素包含 label（显示文本）和 value（对应数值）
 */
export const SPACE_LEVEL_OPTIONS = Object.keys(SPACE_LEVEL_MAP).map((key) => {
  const value = Number(key); // Convert string key to number
  return {
    label: SPACE_LEVEL_MAP[value],
    value,
  };
});

// 空间类型枚举
export const SPACE_TYPE_ENUM = {
  PRIVATE: 0,
  TEAM: 1,
}

// 空间类型文本映射
export const SPACE_TYPE_MAP: Record<number, string> = {
  0: '私有空间',
  1: '团队空间',
}

/**
 * 空间类型选项列表
 *
 * 说明：
 * - 从 SPACE_TYPE_MAP 构造出选项数组，用于界面展示与选择
 * - 每个元素包含 label（显示文本）和 value（对应数值）
 */
export const SPACE_TYPE_OPTIONS = Object.keys(SPACE_TYPE_MAP).map((key) => {
  const value = Number(key) // 将字符串 key 转换为数字
  return {
    label: SPACE_TYPE_MAP[value],
    value,
  }
})

// 空间角色枚举
export const SPACE_ROLE_ENUM = {
  VIEWER: "viewer",
  EDITOR: "editor",
  ADMIN: "admin",
} as const;

// 空间角色文本映射
export const SPACE_ROLE_MAP: Record<string, string> = {
  viewer: "浏览者",
  editor: "编辑者",
  admin: "管理员",
};

/**
 * 空间角色选项列表
 *
 * 说明：
 * - 从 SPACE_ROLE_MAP 构造出选项数组
 * - 每个元素包含 label（显示文本）和 value（对应字符串标识）
 */
export const SPACE_ROLE_OPTIONS = Object.keys(SPACE_ROLE_MAP).map((key) => {
  return {
    label: SPACE_ROLE_MAP[key],
    value: key,
  };
});

/**
 * 空间权限常量定义
 *
 * 包含各种可分配的空间操作权限标识符：
 * - SPACE_USER_MANAGE: 空间用户管理权限
 * - PICTURE_VIEW: 图片查看权限
 * - PICTURE_UPLOAD: 图片上传权限
 * - PICTURE_EDIT: 图片编辑权限
 * - PICTURE_DELETE: 图片删除权限
 */
export const SPACE_PERMISSION_ENUM = {
  SPACE_USER_MANAGE: "spaceUser:manage",
  PICTURE_VIEW: "picture:view",
  PICTURE_UPLOAD: "picture:upload",
  PICTURE_EDIT: "picture:edit",
  PICTURE_DELETE: "picture:delete",
} as const;
