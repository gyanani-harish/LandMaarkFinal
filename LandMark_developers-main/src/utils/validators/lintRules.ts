import { Rule } from 'eslint';
import * as fs from 'fs';
import * as path from 'path';
import * as ESTree from 'estree';

// Allowed spacing values in pixels
const ALLOWED_SPACING_PX = new Set([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64]);

// Allowed font sizes (px)
const ALLOWED_FONT_SIZES = new Set([12, 14, 16, 18, 20, 24, 30, 36]);

// Allowed font weights
const ALLOWED_FONT_WEIGHTS = new Set([400, 500, 600, 700]);

// Tailwind spacing class prefixes to check
const SPACING_PREFIXES = [
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
  'gap', 'gap-x', 'gap-y',
  'space-x', 'space-y',
  'w', 'h',
  'top', 'left', 'right', 'bottom'
];

/**
 * Check if a raw spacing value (number or string) is allowed.
 */
function isAllowedSpacing(value: string | number): boolean {
  if (typeof value === 'number') {
    return ALLOWED_SPACING_PX.has(value);
  }
  
  const trimmed = value.trim();
  if (trimmed === '0') return true;

  // px match
  const pxMatch = trimmed.match(/^([\d.]+)\s*px$/);
  if (pxMatch) {
    return ALLOWED_SPACING_PX.has(parseFloat(pxMatch[1]));
  }

  // rem match (1rem = 16px)
  const remMatch = trimmed.match(/^([\d.]+)\s*rem$/);
  if (remMatch) {
    const pxVal = parseFloat(remMatch[1]) * 16;
    return Array.from(ALLOWED_SPACING_PX).some(val => Math.abs(val - pxVal) < 0.01);
  }

  // Any other units containing raw numbers (e.g. 5em, 13vh) should fail if they look like random values
  const hasUnit = trimmed.match(/^([\d.]+)\s*(px|rem|em|vh|vw|%|pt)$/);
  if (hasUnit) {
    return false;
  }

  return true;
}

/**
 * Check if a raw font size value is allowed.
 */
function isAllowedFontSize(value: string | number): boolean {
  if (typeof value === 'number') {
    return ALLOWED_FONT_SIZES.has(value);
  }
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

/**
 * Check if a value is a hardcoded color literal.
 */
function isColorLiteral(val: unknown): boolean {
  if (typeof val !== 'string') return false;
  if (/^#([A-Fa-f0-9]{3,4}){1,2}$/.test(val)) return true;
  if (/\[#([A-Fa-f0-9]{3,4}){1,2}\]/.test(val)) return true;
  if (/\[(rgba?|hsla?)\(/.test(val)) return true;
  if (/\b(rgba?|hsla?)\(/.test(val)) return true;
  return false;
}

// Global cached values for file scan
let cachedComponentUsages: Record<string, number> | null = null;
let cachedComponentCount = 0;

function scanCodebaseForComponents(rootPath: string) {
  if (cachedComponentUsages !== null) return;

  const usages: Record<string, number> = {};
  const componentNames: string[] = [];

  function walk(dir: string) {
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

  function countUsages(dir: string) {
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

export const rules: Record<string, Rule.RuleModule> = {
  'no-hardcoded-colors': {
    meta: {
      type: 'problem',
      docs: { description: 'Disallow hardcoded colors. Use colors.ts tokens.' },
    },
    create(context) {
      const filepath = context.filename || context.getFilename();
      if (filepath.includes(path.join('src', 'styles', 'colors.ts'))) {
        return {};
      }
      return {
        Literal(node) {
          const literalNode = node as unknown as ESTree.Literal;
          if (isColorLiteral(literalNode.value)) {
            context.report({
              node,
              message: `No hardcoded colors: "${literalNode.value}". Import from src/styles/colors.ts instead.`,
            });
          }
        },
        TemplateElement(node) {
          const templateElementNode = node as unknown as ESTree.TemplateElement;
          if (isColorLiteral(templateElementNode.value.cooked)) {
            context.report({
              node,
              message: `No hardcoded colors: "${templateElementNode.value.cooked}". Import from src/styles/colors.ts instead.`,
            });
          }
        },
      };
    },
  },

  'no-restricted-spacing-values': {
    meta: {
      type: 'problem',
      docs: { description: 'Restrict spacing values to the 11 allowed steps.' },
    },
    create(context) {
      return {
        Property(node) {
          const propertyNode = node as unknown as ESTree.Property;
          if (propertyNode.key.type === 'Identifier') {
            const name = propertyNode.key.name;
            const isSpacingProp = /^(margin|padding|gap|top|left|right|bottom|width|height)/i.test(name);
            if (isSpacingProp && propertyNode.value.type === 'Literal') {
              const val = (propertyNode.value as ESTree.Literal).value;
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
          const attrNode = node as unknown as { name: { name: string }; value?: ESTree.Literal };
          if (attrNode.name.name === 'className' && attrNode.value && attrNode.value.type === 'Literal' && typeof attrNode.value.value === 'string') {
            const classes = attrNode.value.value.split(/\s+/);
            for (const cls of classes) {
              const cleanCls = cls.startsWith('-') ? cls.slice(1) : cls;
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
      docs: { description: 'Strict font sizes, weights, and required line heights.' },
    },
    create(context) {
      return {
        Property(node) {
          const propertyNode = node as unknown as ESTree.Property;
          if (propertyNode.key.type === 'Identifier') {
            const name = propertyNode.key.name;
            if (name === 'fontSize' && propertyNode.value.type === 'Literal') {
              const val = (propertyNode.value as ESTree.Literal).value;
              if (typeof val === 'number' || typeof val === 'string') {
                if (!isAllowedFontSize(val)) {
                  context.report({
                    node,
                    message: `Invalid font size "${val}". Allowed values: 12, 14, 16, 18, 20, 24, 30, 36px/rem.`,
                  });
                }
              }
            }
            if (name === 'fontWeight' && propertyNode.value.type === 'Literal') {
              const val = (propertyNode.value as ESTree.Literal).value;
              const numericWeight = typeof val === 'string' ? parseInt(val, 10) : (typeof val === 'number' ? val : null);
              if (numericWeight !== null && !ALLOWED_FONT_WEIGHTS.has(numericWeight)) {
                context.report({
                  node,
                  message: `Invalid font weight "${val}". Allowed values: 400, 500, 600, 700.`,
                });
              }
            }
          }
        },
        JSXAttribute(node) {
          const attrNode = node as unknown as { name: { name: string }; value?: ESTree.Literal };
          if (attrNode.name.name === 'className' && attrNode.value && attrNode.value.type === 'Literal' && typeof attrNode.value.value === 'string') {
            const classes = attrNode.value.value.split(/\s+/);
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
      docs: { description: 'Enforce limits on React component lines, props, and hooks.' },
    },
    create(context) {
      interface ComponentInfo {
        name: string;
        node: ESTree.Node;
        useEffectCount: number;
        useStateCount: number;
      }
      const componentStack: ComponentInfo[] = [];

      function checkComponentLimits(node: ESTree.Node, name: string) {
        if (!node.loc) return;
        const startLine = node.loc.start.line;
        const endLine = node.loc.end.line;
        const linesCount = endLine - startLine + 1;

        if (linesCount > 200) {
          context.report({
            node: node as unknown as Rule.Node,
            message: `Component "${name}" exceeds maximum allowed length of 200 lines (current: ${linesCount}).`,
          });
        } else if (linesCount > 150) {
          context.report({
            node: node as unknown as Rule.Node,
            message: `Component "${name}" is approaching maximum line count (current: ${linesCount}, warning at 150).`,
          });
        }

        const fnNode = node as unknown as { params?: ESTree.Pattern[] };
        if (fnNode.params && fnNode.params[0]) {
          const propsParam = fnNode.params[0];
          if (propsParam.type === 'ObjectPattern') {
            const propsCount = propsParam.properties.length;
            if (propsCount > 8) {
              context.report({
                node: propsParam as unknown as Rule.Node,
                message: `Component "${name}" has too many props (${propsCount}). Maximum allowed is 8.`,
              });
            }
          }
        }
      }

      function checkHookCounts(node: ESTree.Node, name: string, useEffectCount: number, useStateCount: number) {
        if (useEffectCount > 3) {
          context.report({
            node: node as unknown as Rule.Node,
            message: `Component "${name}" has ${useEffectCount} useEffect hooks. Maximum allowed is 3.`,
          });
        }
        if (useStateCount > 5) {
          context.report({
            node: node as unknown as Rule.Node,
            message: `Component "${name}" has ${useStateCount} useState hooks. Maximum allowed is 5.`,
          });
        }
      }

      return {
        FunctionDeclaration(node) {
          const fnNode = node as unknown as ESTree.FunctionDeclaration;
          if (fnNode.id && fnNode.id.name && /^[A-Z]/.test(fnNode.id.name)) {
            checkComponentLimits(fnNode, fnNode.id.name);
            componentStack.push({ name: fnNode.id.name, node: fnNode, useEffectCount: 0, useStateCount: 0 });
          }
        },
        'FunctionDeclaration:exit'(node) {
          const fnNode = node as unknown as ESTree.FunctionDeclaration;
          if (fnNode.id && fnNode.id.name && /^[A-Z]/.test(fnNode.id.name)) {
            const comp = componentStack.pop();
            if (comp) {
              checkHookCounts(comp.node, comp.name, comp.useEffectCount, comp.useStateCount);
            }
          }
        },
        VariableDeclarator(node) {
          const decNode = node as unknown as ESTree.VariableDeclarator;
          if (decNode.id && decNode.id.type === 'Identifier' && /^[A-Z]/.test(decNode.id.name) && decNode.init && (decNode.init.type === 'ArrowFunctionExpression' || decNode.init.type === 'FunctionExpression')) {
            checkComponentLimits(decNode.init, decNode.id.name);
            componentStack.push({ name: decNode.id.name, node: decNode.init, useEffectCount: 0, useStateCount: 0 });
          }
        },
        'VariableDeclarator:exit'(node) {
          const decNode = node as unknown as ESTree.VariableDeclarator;
          if (decNode.id && decNode.id.type === 'Identifier' && /^[A-Z]/.test(decNode.id.name) && decNode.init && (decNode.init.type === 'ArrowFunctionExpression' || decNode.init.type === 'FunctionExpression')) {
            const comp = componentStack.pop();
            if (comp) {
              checkHookCounts(comp.node, comp.name, comp.useEffectCount, comp.useStateCount);
            }
          }
        },
        CallExpression(node) {
          const callNode = node as unknown as ESTree.CallExpression;
          if (componentStack.length > 0) {
            const callee = callNode.callee as unknown as { name?: string; property?: { name?: string } };
            const calleeName = callee.name || (callee.property && callee.property.name);
            if (calleeName === 'useEffect') {
              componentStack[componentStack.length - 1].useEffectCount++;
            }
            if (calleeName === 'useState') {
              componentStack[componentStack.length - 1].useStateCount++;
            }
          }
        },
        JSXAttribute(node) {
          const attrNode = node as unknown as { value?: { type: string; expression: ESTree.Expression } };
          if (attrNode.value && attrNode.value.type === 'JSXExpressionContainer') {
            const expr = attrNode.value.expression;
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
      docs: { description: 'Enforce component count, naming, and minimum usage rules.' },
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
      docs: { description: 'All JSX text and labels must come from localization files.' },
    },
    create(context) {
      return {
        JSXText(node) {
          const textNode = node as unknown as { value: string };
          const rawText = textNode.value.trim();
          if (/[a-zA-Z]/.test(rawText)) {
            context.report({
              node,
              message: `No hardcoded literal strings in JSX: "${rawText}". Use translation keys from src/locales/ instead.`,
            });
          }
        },
        JSXAttribute(node) {
          const attrNode = node as unknown as { name?: { name?: string }; value?: ESTree.Literal };
          const userFacingAttrs = ['placeholder', 'alt', 'title', 'label', 'aria-label'];
          if (attrNode.name && attrNode.name.name && userFacingAttrs.includes(attrNode.name.name) && attrNode.value && attrNode.value.type === 'Literal') {
            const val = attrNode.value.value;
            if (typeof val === 'string' && /[a-zA-Z]/.test(val)) {
              context.report({
                node,
                message: `No hardcoded literal strings in attribute "${attrNode.name.name}": "${val}". Use translation keys from src/locales/ instead.`,
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
      docs: { description: 'Accessibility (A11y) rules for images, buttons, and headings.' },
    },
    create(context) {
      let highestHeadingSeen = 0;

      return {
        JSXOpeningElement(node) {
          const openNode = node as unknown as { name: { type: string; name: string }; attributes: { type: string; name: { name: string }; value?: ESTree.Literal }[] };
          const nameNode = openNode.name;
          if (nameNode.type === 'JSXIdentifier') {
            const name = nameNode.name;

            if (name === 'img') {
              const altAttr = openNode.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'alt');
              if (!altAttr) {
                context.report({
                  node,
                  message: 'Accessibility: Images must have an "alt" attribute.',
                });
              }
            }

            if (name === 'button') {
              const hasAriaLabel = openNode.attributes.some(attr => attr.type === 'JSXAttribute' && ['aria-label', 'aria-labelledby'].includes(attr.name.name));
              if (!hasAriaLabel) {
                const parentNode = (node as unknown as { parent?: { children?: { type: string; value?: string }[] } }).parent;
                let hasTextChild = false;
                if (parentNode && parentNode.children) {
                  hasTextChild = parentNode.children.some((child) => {
                    if (child.type === 'JSXText' && child.value && /[a-zA-Z0-9]/.test(child.value.trim())) {
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
      docs: { description: 'Performance checks: lazy load images and disallow inline styles.' },
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          const openNode = node as unknown as { name: { type: string; name: string }; attributes: { type: string; name: { name: string }; value?: ESTree.Literal }[] };
          const nameNode = openNode.name;
          if (nameNode.type === 'JSXIdentifier') {
            const name = nameNode.name;

            if (name === 'img') {
              const loadingAttr = openNode.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'loading');
              const hasLazy = loadingAttr && loadingAttr.type === 'JSXAttribute' && loadingAttr.value && loadingAttr.value.type === 'Literal' && loadingAttr.value.value === 'lazy';
              if (!hasLazy) {
                context.report({
                  node,
                  message: 'Performance: Image tag must have loading="lazy" attribute.',
                });
              }
            }

            const styleAttr = openNode.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'style');
            if (styleAttr) {
              context.report({
                node: styleAttr as unknown as Rule.Node,
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
      const componentNodes: { node: ESTree.Node; name: string }[] = [];
      return {
        FunctionDeclaration(node) {
          const fnNode = node as unknown as ESTree.FunctionDeclaration;
          if (fnNode.id && fnNode.id.name && /^[A-Z]/.test(fnNode.id.name)) {
            componentCount++;
            componentNodes.push({ node: fnNode, name: fnNode.id.name });
          }
        },
        VariableDeclarator(node) {
          const decNode = node as unknown as ESTree.VariableDeclarator;
          if (decNode.id && decNode.id.type === 'Identifier' && /^[A-Z]/.test(decNode.id.name) && decNode.init && (decNode.init.type === 'ArrowFunctionExpression' || decNode.init.type === 'FunctionExpression')) {
            componentCount++;
            componentNodes.push({ node: decNode.init, name: decNode.id.name });
          }
        },
        'Program:exit'() {
          if (componentCount > 1) {
            for (const comp of componentNodes) {
              context.report({
                node: comp.node as unknown as Rule.Node,
                message: `File contains multiple components (${componentNodes.map(c => c.name).join(', ')}). Enforce single component per file.`,
              });
            }
          }
        }
      };
    },
  },
};
