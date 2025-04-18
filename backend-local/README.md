项目的目录结构

tee-web-control/
├── backend-local/
│   ├── src/                      # ✅ 只放你写的源码
│   │   ├── app.ts
│   │   └── auth/
│   │       ├── controller.ts
│   │       └── service.ts
│   ├── package.json              # ✅ 记录依赖，不污染结构
│   ├── tsconfig.json             # ✅ 编译配置
│   └── README.md                 # ✅ 项目说明文档（推荐）

