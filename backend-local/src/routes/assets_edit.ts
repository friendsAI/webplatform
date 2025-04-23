// assets_edit.ts – **增量功能文件**
// 仅新增“编辑数据资产”相关方法，不触碰原有 assets.ts 逻辑。
// 使用方式：在需要的组件里 `import { updateAsset, buildSafeAssetUpdate } from "./assets_edit"`

import request from '@/utils/request'; // 与项目现有请求工具保持一致

/* ------------------------------------------------------------------ */
/*                       类型定义（沿用原项目风格）                   */
/* ------------------------------------------------------------------ */

export interface UpdateAssetPayload {
  id: number;               // 资产主键（必传）
  name?: string;            // 数据集名称
  generate_key?: string;    // 产生密钥
  encrypted_file?: string;  // 加密文件
  submission_file?: string; // 提交应密文件
  // 其余字段即使存在，也不会被发送给后端
}

/* ----------------------- 可编辑字段白名单 ------------------------- */

const EDITABLE_FIELDS = new Set<keyof UpdateAssetPayload>([
  'name',
  'generate_key',
  'encrypted_file',
  'submission_file',
]);

/**
 * 过滤掉不允许修改的字段，生成安全 payload
 * @param payload 原始表单数据
 * @returns 一个仅包含白名单字段的对象
 */
export const buildSafeAssetUpdate = (payload: UpdateAssetPayload): UpdateAssetPayload => {
  const safe: UpdateAssetPayload = { id: payload.id };
  Object.entries(payload).forEach(([k, v]) => {
    if (EDITABLE_FIELDS.has(k as keyof UpdateAssetPayload) && v !== undefined) {
      (safe as any)[k] = v;
    }
  });
  return safe;
};

/**
 * 编辑资产
 * 仅发送允许的字段，避免后端收到不支持的字段
 * @example
 * const raw = { id: 1, name: '新数据集', encrypted_file: 'file.enc' };
 * await updateAsset(buildSafeAssetUpdate(raw));
 */
export const updateAsset = async (payload: UpdateAssetPayload) => {
  const { id, ...data } = payload;
  return request(`/api/assets/${id}`, {
    method: 'PUT',
    data,
  });
};

/* ------------------------------------------------------------------ */
/*                       使用示例（可删除）                            */
/* ------------------------------------------------------------------ */

// import { buildSafeAssetUpdate, updateAsset } from './assets_edit';
// const handleSave = async (formValues) => {
//   const safePayload = buildSafeAssetUpdate({ id: current.id, ...formValues });
//   await updateAsset(safePayload);
// };

