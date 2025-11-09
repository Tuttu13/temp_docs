import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: '🧭 企画・構想フェーズ',
      items: [
        'planning/vision',
        'planning/problem-definition',
        'planning/persona',
        'planning/customer-journey',
        'planning/project-charter',
      ],
    },
    {
      type: 'category',
      label: '⚙️ 要件定義フェーズ',
      items: [
        'requirements/requirements',
        'requirements/business-flow',
        'requirements/use-cases',
        'requirements/data-requirements',
        'requirements/external-interfaces',
      ],
    },
    {
      type: 'category',
      label: '🧩 設計フェーズ',
      items: [
        'design/basic-design',
        'design/detailed-design',
        'design/er-diagram',
        'design/api-specification',
        'design/ui-ux-design',
        'design/screen-transition',
        'design/security-design',
        'design/infrastructure-design',
      ],
    },
    {
      type: 'category',
      label: '🧪 実装・テストフェーズ',
      items: [
        'development/coding-standards',
        'development/dev-environment',
        'development/test-plan',
        'development/test-specification',
        'development/test-results',
        'development/bug-reports',
        'development/code-review',
      ],
    },
    {
      type: 'category',
      label: '🚀 運用・保守フェーズ',
      items: [
        'operations/operations-design',
        'operations/admin-manual',
        'operations/user-manual',
        'operations/release-notes',
        'operations/incident-reports',
        'operations/change-management',
      ],
    },
  ],
};

export default sidebars;
