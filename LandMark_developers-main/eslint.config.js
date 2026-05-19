import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import fs from 'fs';
import path from 'path';

// --- Custom ESLint Rule Constants & Helpers ---

const ALLOWED_SPACING_PX = new Set([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64]);
const ALLOWED_FONT_SIZES = new Set([12, 14, 16, 18, 20, 24, 30, 36]);
const ALLOWED_FONT_WEIGHTS = new Set([400, 500, 600, 700]);

const SPACING_PREFIXES = [
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
  'gap', 'gap-x', 'gap-y',
  'space-x', 'space-y',
  'w', 'h',
  'top', 'left', 'right', 'bottom'
];

function isAllowedSpacing(value) {
  if (typeof value === 'number') {
    return ALLOWED_SPACING_PX.has(value);
  }
  if (typeof value !== 'string') return true;

  const trimmed = value.trim();
  if (trimmed === '0') return true;

  const pxMatch = trimmed.match(/^([\d.]+)\s*px$/);
  if (pxMatch) {
    return ALLOWED_SPACING_PX.has(parseFloat(pxMatch[1]));
  }

  const remMatch = trimmed.match(/^([\d.]+)\s*rem$/);
  if (remMatch) {
    const pxVal = parseFloat(remMatch[1]) * 16;
    return Array.from(ALLOWED_SPACING_PX).some(val => Math.abs(val - pxVal) < 0.01);
  }

  const hasUnit = trimmed.match(/^([\d.]+)\s*(px|rem|em|vh|vw|%|pt)$/);
  if (hasUnit) {
    return false; // has layout unit but is not in the allowed scale
  }

  return true;
}

function isAllowedFontSize(value) {
  if (typeof value === 'number') {
    return ALLOWED_FONT_SIZES.has(value);
  }
  if (typeof value !== 'string') return true;

  const trimmed = value.trim();
  const pxMatch = trimmed.match(/^([\d.]+)\s*px$/);
  if (pxMatch) {
    return ALLOWED_FONT_SIZES.has(parseFloat(pxMatch[1]));
  }
  const remMatch = trimmed.match(/^([\d.]+)\s*rem$/);
  if (remMatch) {
    const pxVal = parseFloat(remMatch[1]) * 16;
    return Array.from(ALLOWED_FONT_SIZES).some(val => Math.abs(val - pxVal) < 0.01);
  }
  return true;
}

// Global caching for component analysis to run quickly
let cachedComponentUsages = null;
let cachedComponentCount = 0;

function scanCodebaseForComponents(rootPath) {
  if (cachedComponentUsages !== null) return;

  const usages = {};
  const componentNames = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
          walk(fullPath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        if (fullPath.includes(path.join('src', 'Components'))) {
          const name = path.basename(file, path.extname(file));
          if (name !== 'index' && !name.endsWith('.test') && !name.endsWith('.spec')) {
            componentNames.push(name);
            usages[name] = 0;
          }
        }
      }
    }
  }

  walk(rootPath);
  cachedComponentCount = componentNames.length;

  function countUsages(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
          countUsages(fullPath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const name of componentNames) {
          const currentFileBasename = path.basename(file, path.extname(file));
          if (currentFileBasename !== name) {
            const importRegex = new RegExp(`\\bimport\\b.*\\b${name}\\b`, 'g');
            const jsxRegex = new RegExp(`<${name}\\b`, 'g');
            if (importRegex.test(content) || jsxRegex.test(content)) {
              usages[name] = (usages[name] || 0) + 1;
            }
          }
        }
      }
    }
  }

  countUsages(rootPath);
  cachedComponentUsages = usages;
}

// --- Custom Plugin Object ---

const customRulesPlugin = {
  rules: {
    'no-restricted-values': {
      meta: {
        type: 'problem',
        docs: { description: 'Strict spacing scale validator.' },
      },
      create(context) {
        return {
          Property(node) {
            if (node.key.type === 'Identifier') {
              const name = node.key.name;
              const isSpacingProp = /^(margin|padding|gap|top|left|right|bottom|width|height)/i.test(name);
              if (isSpacingProp && node.value.type === 'Literal') {
                const val = node.value.value;
                if (typeof val === 'number' || typeof val === 'string') {
                  if (!isAllowedSpacing(val)) {
                    context.report({
                      node,
                      message: `Invalid spacing value "${val}". Allowed values: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.`,
                    });
                  }
                }
              }
            }
          },
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
              const classes = node.value.value.split(/\s+/);
              for (const cls of classes) {
                let cleanCls = cls.startsWith('-') ? cls.slice(1) : cls;
                for (const prefix of SPACING_PREFIXES) {
                  if (cleanCls.startsWith(prefix + '-')) {
                    const value = cleanCls.slice(prefix.length + 1);
                    if (value.startsWith('[') && value.endsWith(']')) {
                      const inside = value.slice(1, -1);
                      if (!isAllowedSpacing(inside)) {
                        context.report({
                          node,
                          message: `Invalid arbitrary spacing in class "${cls}". Allowed values: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.`,
                        });
                      }
                    } else if (/^\d+(\.\d+)?$/.test(value)) {
                      const allowedTailwindKeys = new Set(['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16']);
                      if (!allowedTailwindKeys.has(value)) {
                        context.report({
                          node,
                          message: `Invalid Tailwind spacing key in class "${cls}". Allowed keys: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16.`,
                        });
                      }
                    }
                  }
                }
              }
            }
          },
        };
      },
    },

    'typography-strictness': {
      meta: {
        type: 'problem',
        docs: { description: 'Strict font sizes, weights, and line heights.' },
      },
      create(context) {
        return {
          Property(node) {
            if (node.key.type === 'Identifier') {
              const name = node.key.name;
              if (name === 'fontSize' && node.value.type === 'Literal') {
                const val = node.value.value;
                if (typeof val === 'number' || typeof val === 'string') {
                  if (!isAllowedFontSize(val)) {
                    context.report({
                      node,
                      message: `Invalid font size "${val}". Allowed values: 12, 14, 16, 18, 20, 24, 30, 36px/rem.`,
                    });
                  }
                }
              }
              if (name === 'fontWeight' && node.value.type === 'Literal') {
                const val = node.value.value;
                const numericWeight = typeof val === 'string' ? parseInt(val, 10) : val;
                if (typeof numericWeight === 'number' && !ALLOWED_FONT_WEIGHTS.has(numericWeight)) {
                  context.report({
                    node,
                    message: `Invalid font weight "${val}". Allowed values: 400, 500, 600, 700.`,
                  });
                }
              }
            }
          },
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
              const classes = node.value.value.split(/\s+/);
              for (const cls of classes) {
                if (cls.startsWith('text-')) {
                  const size = cls.slice(5);
                  if (size.startsWith('[') && size.endsWith(']')) {
                    const inside = size.slice(1, -1);
                    if (!isAllowedFontSize(inside)) {
                      context.report({
                        node,
                        message: `Invalid arbitrary font size in class "${cls}". Allowed values: 12, 14, 16, 18, 20, 24, 30, 36px/rem.`,
                      });
                    }
                  } else if (/^(5xl|6xl|7xl|8xl|9xl)$/.test(size) || (/^\d?xl$/.test(size) && !['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].includes(size))) {
                    context.report({
                      node,
                      message: `Invalid font size class "${cls}". Allowed: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl.`,
                    });
                  }
                }
                if (cls.startsWith('font-')) {
                  const weight = cls.slice(5);
                  if (['thin', 'extralight', 'light', 'extrabold', 'black'].includes(weight)) {
                    context.report({
                      node,
                      message: `Invalid font weight class "${cls}". Allowed: font-normal, font-medium, font-semibold, font-bold.`,
                    });
                  }
                }
              }
            }
          },
        };
      },
    },

    'component-strictness': {
      meta: {
        type: 'problem',
        docs: { description: 'Strict component design bounds.' },
      },
      create(context) {
        const componentStack = [];

        function checkComponentLimits(node, name) {
          const startLine = node.loc.start.line;
          const endLine = node.loc.end.line;
          const linesCount = endLine - startLine + 1;

          if (linesCount > 200) {
            context.report({
              node,
              message: `Component "${name}" exceeds maximum allowed length of 200 lines (current: ${linesCount}).`,
            });
          } else if (linesCount > 150) {
            context.report({
              node,
              message: `Component "${name}" is approaching maximum line count (current: ${linesCount}, warning at 150).`,
            });
          }

          if (node.params && node.params[0]) {
            const propsParam = node.params[0];
            if (propsParam.type === 'ObjectPattern') {
              const propsCount = propsParam.properties.length;
              if (propsCount > 8) {
                context.report({
                  node: propsParam,
                  message: `Component "${name}" has too many props (${propsCount}). Maximum allowed is 8.`,
                });
              }
            }
          }
        }

        function checkHookCounts(node, name, useEffectCount, useStateCount) {
          if (useEffectCount > 3) {
            context.report({
              node,
              message: `Component "${name}" has ${useEffectCount} useEffect hooks. Maximum allowed is 3.`,
            });
          }
          if (useStateCount > 5) {
            context.report({
              node,
              message: `Component "${name}" has ${useStateCount} useState hooks. Maximum allowed is 5.`,
            });
          }
        }

        return {
          FunctionDeclaration(node) {
            if (node.id && node.id.name && /^[A-Z]/.test(node.id.name)) {
              checkComponentLimits(node, node.id.name);
              componentStack.push({ name: node.id.name, node, useEffectCount: 0, useStateCount: 0 });
            }
          },
          'FunctionDeclaration:exit'(node) {
            if (node.id && node.id.name && /^[A-Z]/.test(node.id.name)) {
              const comp = componentStack.pop();
              if (comp) {
                checkHookCounts(comp.node, comp.name, comp.useEffectCount, comp.useStateCount);
              }
            }
          },
          VariableDeclarator(node) {
            if (node.id && node.id.type === 'Identifier' && /^[A-Z]/.test(node.id.name) && node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
              checkComponentLimits(node.init, node.id.name);
              componentStack.push({ name: node.id.name, node: node.init, useEffectCount: 0, useStateCount: 0 });
            }
          },
          'VariableDeclarator:exit'(node) {
            if (node.id && node.id.type === 'Identifier' && /^[A-Z]/.test(node.id.name) && node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
              const comp = componentStack.pop();
              if (comp) {
                checkHookCounts(comp.node, comp.name, comp.useEffectCount, comp.useStateCount);
              }
            }
          },
          CallExpression(node) {
            if (componentStack.length > 0) {
              const calleeName = node.callee.name || (node.callee.property && node.callee.property.name);
              if (calleeName === 'useEffect') {
                componentStack[componentStack.length - 1].useEffectCount++;
              }
              if (calleeName === 'useState') {
                componentStack[componentStack.length - 1].useStateCount++;
              }
            }
          },
          JSXAttribute(node) {
            if (node.value && node.value.type === 'JSXExpressionContainer') {
              const expr = node.value.expression;
              if (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression') {
                context.report({
                  node,
                  message: 'Do not use inline functions in JSX props. Extract it and wrap in useCallback.',
                });
              }
            }
          },
        };
      },
    },

    'reusability-rules': {
      meta: {
        type: 'problem',
        docs: { description: 'Checks component count and minimum usage count.' },
      },
      create(context) {
        const filepath = context.filename || context.getFilename();
        const workspaceRoot = process.cwd();
        scanCodebaseForComponents(workspaceRoot);

        return {
          Program(node) {
            if (cachedComponentCount > 30) {
              context.report({
                node,
                message: `Workspace has ${cachedComponentCount} components, which exceeds the project limit of 30.`,
              });
            }

            if (filepath.includes(path.join('src', 'Components'))) {
              const name = path.basename(filepath, path.extname(filepath));
              if (name !== 'index' && !name.endsWith('.test') && !name.endsWith('.spec')) {
                if (name === 'PrimaryButton' || name === 'SecondaryButton') {
                  context.report({
                    node,
                    message: `Do not use component name "${name}". Use "Button" with a "variant" prop instead.`,
                  });
                }

                if (cachedComponentUsages && cachedComponentUsages[name] !== undefined) {
                  const count = cachedComponentUsages[name];
                  if (count < 3) {
                    context.report({
                      node,
                      message: `Component "${name}" has only ${count} usage(s) across the codebase. It must be used at least 3 times.`,
                    });
                  }
                }
              }
            }
          },
        };
      },
    },

    'no-literal-strings-in-jsx': {
      meta: {
        type: 'problem',
        docs: { description: 'Checks for hardcoded user facing text.' },
      },
      create(context) {
        return {
          JSXText(node) {
            const rawText = node.value.trim();
            if (/[a-zA-Z]/.test(rawText)) {
              context.report({
                node,
                message: `No hardcoded literal strings in JSX: "${rawText}". Use translation keys from src/locales/ instead.`,
              });
            }
          },
          JSXAttribute(node) {
            const userFacingAttrs = ['placeholder', 'alt', 'title', 'label', 'aria-label'];
            if (node.name && userFacingAttrs.includes(node.name.name) && node.value && node.value.type === 'Literal') {
              const val = node.value.value;
              if (typeof val === 'string' && /[a-zA-Z]/.test(val)) {
                context.report({
                  node,
                  message: `No hardcoded literal strings in attribute "${node.name.name}": "${val}". Use translation keys from src/locales/ instead.`,
                });
              }
            }
          },
        };
      },
    },

    'a11y-strictness': {
      meta: {
        type: 'problem',
        docs: { description: 'Checks accessibility rules.' },
      },
      create(context) {
        let highestHeadingSeen = 0;

        return {
          JSXOpeningElement(node) {
            const nameNode = node.name;
            if (nameNode.type === 'JSXIdentifier') {
              const name = nameNode.name;

              if (name === 'img') {
                const altAttr = node.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'alt');
                if (!altAttr) {
                  context.report({
                    node,
                    message: 'Accessibility: Images must have an "alt" attribute.',
                  });
                }
              }

              if (name === 'button') {
                const hasAriaLabel = node.attributes.some(attr => attr.type === 'JSXAttribute' && ['aria-label', 'aria-labelledby'].includes(attr.name.name));
                if (!hasAriaLabel) {
                  const parentNode = node.parent;
                  let hasTextChild = false;
                  if (parentNode && parentNode.children) {
                    hasTextChild = parentNode.children.some(child => {
                      if (child.type === 'JSXText' && /[a-zA-Z0-9]/.test(child.value.trim())) {
                        return true;
                      }
                      if (child.type === 'JSXExpressionContainer') {
                        return true;
                      }
                      return false;
                    });
                  }
                  if (!hasTextChild) {
                    context.report({
                      node,
                      message: 'Accessibility: Buttons with no visible text must have an "aria-label" or "aria-labelledby" attribute.',
                    });
                  }
                }
              }

              const headingMatch = name.match(/^h([1-6])$/);
              if (headingMatch) {
                const level = parseInt(headingMatch[1], 10);
                if (level > 1 && level > highestHeadingSeen + 1) {
                  context.report({
                    node,
                    message: `Accessibility: Heading level <h${level}> skipped a level. Preceding heading was <h${highestHeadingSeen || 'none'}>.`,
                  });
                }
                highestHeadingSeen = Math.max(highestHeadingSeen, level);
              }
            }
          },
        };
      },
    },

    'performance-strictness': {
      meta: {
        type: 'problem',
        docs: { description: 'Checks performance patterns.' },
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            const nameNode = node.name;
            if (nameNode.type === 'JSXIdentifier') {
              const name = nameNode.name;

              if (name === 'img') {
                const loadingAttr = node.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'loading');
                const hasLazy = loadingAttr && loadingAttr.type === 'JSXAttribute' && loadingAttr.value && loadingAttr.value.type === 'Literal' && loadingAttr.value.value === 'lazy';
                if (!hasLazy) {
                  context.report({
                    node,
                    message: 'Performance: Image tag must have loading="lazy" attribute.',
                  });
                }
              }

              const styleAttr = node.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'style');
              if (styleAttr) {
                context.report({
                  node: styleAttr,
                  message: 'Performance: Inline styles are not allowed. Move styles to CSS modules.',
                });
              }
            }
          },
        };
      },
    },

    'one-component-per-file': {
      meta: {
        type: 'problem',
        docs: { description: 'Enforce one component per file.' },
      },
      create(context) {
        let componentCount = 0;
        const componentNodes = [];
        return {
          FunctionDeclaration(node) {
            if (node.id && node.id.name && /^[A-Z]/.test(node.id.name)) {
              componentCount++;
              componentNodes.push({ node, name: node.id.name });
            }
          },
          VariableDeclarator(node) {
            if (node.id && node.id.type === 'Identifier' && /^[A-Z]/.test(node.id.name) && node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
              componentCount++;
              componentNodes.push({ node: node.init, name: node.id.name });
            }
          },
          'Program:exit'() {
            if (componentCount > 1) {
              for (const comp of componentNodes) {
                context.report({
                  node: comp.node,
                  message: `File contains multiple components (${componentNodes.map(c => c.name).join(', ')}). Enforce single component per file.`,
                });
              }
            }
          }
        };
      },
    },
  },
};

// --- ESLint Flat Config Array ---

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      custom: customRulesPlugin,
    },
    rules: {
      // Custom system constraints
      'custom/no-restricted-values': 'error',
      'custom/typography-strictness': 'error',
      'custom/component-strictness': 'error',
      'custom/reusability-rules': 'warn', // Warning to prevent hard blocking development immediately
      'custom/no-literal-strings-in-jsx': 'error',
      'custom/a11y-strictness': 'error',
      'custom/performance-strictness': 'error',
      'custom/one-component-per-file': 'error',

      // Avoid console.log in production
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Rule: Max 100 lines/file for UI components (.tsx files)
    files: ['**/*.tsx'],
    rules: {
      'max-lines': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
    }
  },
  {
    // Override: Check hex/rgb/rgba hardcoded colors strictly outside theme definitions
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/styles/colors.ts', 'src/styles/colors.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/^#([A-Fa-f0-9]{3,4}){1,2}$/], Literal[value=/^(rgb|hsl)a?\\(/i]",
          message: "No hardcoded hex/rgb/rgba colors. Import from src/styles/colors.ts instead."
        },
        {
          selector: "TemplateElement[value.cooked=/^#([A-Fa-f0-9]{3,4}){1,2}$/], TemplateElement[value.cooked=/^(rgb|hsl)a?\\(/i]",
          message: "No hardcoded hex/rgb/rgba colors. Import from src/styles/colors.ts instead."
        }
      ]
    }
  }
]);
