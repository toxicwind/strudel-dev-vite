import { getLeafLocations } from '@strudel/mini';
import { parse } from 'acorn';
import escodegen from 'escodegen';
import { walk } from 'estree-walker';

let widgetMethods = [];
export function registerWidgetType(type) {
  widgetMethods.push(type);
}

let languages = new Map();
// config = { getLocations: (code: string, offset?: number) => number[][] }
// see mondough.mjs for example use
// the language will kick in when the code contains a template literal of type
// example: mondo`...` will use language of type "mondo"
// TODO: refactor tidal.mjs to use this
export function registerLanguage(type, config) {
  languages.set(type, config);
}

export function transpiler(input, options = {}) {
  const { wrapAsync = false, addReturn = true, emitMiniLocations = true, emitWidgets = true } = options;

  const comments = [];
  let ast = parse(input, {
    ecmaVersion: 2022,
    allowAwaitOutsideFunction: true,
    locations: true,
    onComment: comments,
  });

  const miniDisableRanges = findMiniDisableRanges(comments, input.length);
  let miniLocations = [];
  const collectMiniLocations = (value, node) => {
    const minilang = languages.get('minilang');
    if (minilang) {
      const code = `[${value}]`;
      const locs = minilang.getLocations(code, node.start);
      miniLocations = miniLocations.concat(locs);
    } else {
      const leafLocs = getLeafLocations(`"${value}"`, node.start, input);
      miniLocations = miniLocations.concat(leafLocs);
    }
  };
  let widgets = [];

  walk(ast, {
    enter(node, parent /* , prop, index */) {
      if (isLanguageLiteral(node)) {
        const { name } = node.tag;
        const language = languages.get(name);
        const code = node.quasi.quasis[0].value.raw;
        const offset = node.quasi.start + 1;
        if (emitMiniLocations) {
          const locs = language.getLocations(code, offset);
          miniLocations = miniLocations.concat(locs);
        }
        this.skip();
        return this.replace(languageWithLocation(name, code, offset));
      }
      if (isTemplateLiteral(node, 'tidal')) {
        const raw = node.quasi.quasis[0].value.raw;
        const offset = node.quasi.start + 1;
        if (emitMiniLocations) {
          const stringLocs = collectHaskellMiniLocations(raw, offset);
          miniLocations = miniLocations.concat(stringLocs);
        }
        this.skip();
        return this.replace(tidalWithLocation(raw, offset));
      }
      if (isBackTickString(node, parent)) {
        if (isMiniDisabled(node.start, miniDisableRanges)) {
          return;
        }
        const { quasis } = node;
        const { raw } = quasis[0].value;
        this.skip();
        emitMiniLocations && collectMiniLocations(raw, node);
        return this.replace(miniWithLocation(raw, node));
      }
      if (isStringWithDoubleQuotes(node)) {
        if (isMiniDisabled(node.start, miniDisableRanges)) {
          return;
        }
        const { value } = node;
        this.skip();
        emitMiniLocations && collectMiniLocations(value, node);
        return this.replace(miniWithLocation(value, node));
      }
      if (isSliderFunction(node)) {
        emitWidgets &&
          widgets.push({
            from: node.arguments[0].start,
            to: node.arguments[0].end,
            value: node.arguments[0].raw, // don't use value!
            min: node.arguments[1]?.value ?? 0,
            max: node.arguments[2]?.value ?? 1,
            step: node.arguments[3]?.value,
            type: 'slider',
          });
        return this.replace(sliderWithLocation(node));
      }
      if (isWidgetMethod(node)) {
        const type = node.callee.property.name;
        const index = widgets.filter((w) => w.type === type).length;
        const widgetConfig = {
          to: node.end,
          index,
          type,
          id: options.id,
        };
        emitWidgets && widgets.push(widgetConfig);
        return this.replace(widgetWithLocation(node, widgetConfig));
      }
      if (isBareSamplesCall(node, parent)) {
        return this.replace(withAwait(node));
      }
      if (isLabelStatement(node)) {
        return this.replace(labelToP(node));
      }
    },

    leave(node, parent, prop, index) {
      if (!isKabelCall(node)) return;

      let [expr, ...rest] = node.arguments;
      if (!expr) throw new Error('K(...) requires an expression');

      if (shouldCallKabelExpression(expr)) {
        expr = {
          type: 'CallExpression',
          callee: expr,
          arguments: [],
          optional: false,
        };
      }

      const { template, patternExprs } = extractPatternPlaceholders(expr);
      if (patternExprs.length) {
        const workletArgs = [{ type: 'Literal', value: template }, ...patternExprs, ...rest];

        let callee = node.callee;
        if (callee.type === 'ChainExpression') callee = callee.expression;
        if (callee.type === 'MemberExpression') {
          return this.replace({
            type: 'CallExpression',
            callee: workletMemberAst(callee.object),
            arguments: workletArgs,
            optional: false,
          });
        }
        return this.replace({
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'worklet' },
          arguments: workletArgs,
          optional: false,
        });
      }

      const kabelSrc = genExprSource(expr);
      const workletArgs = [{ type: 'Literal', value: kabelSrc }, ...rest];

      let callee = node.callee;
      if (callee.type === 'ChainExpression') callee = callee.expression;
      if (callee.type === 'MemberExpression') {
        return this.replace({
          type: 'CallExpression',
          callee: workletMemberAst(callee.object),
          arguments: workletArgs,
          optional: false,
        });
      }
      return this.replace({
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'worklet' },
        arguments: workletArgs,
        optional: false,
      });
    },
  });

  let { body } = ast;

  if (!body.length) {
    console.warn('empty body -> fallback to silence');
    body.push({
      type: 'ExpressionStatement',
      expression: {
        type: 'Identifier',
        name: 'silence',
      },
    });
  } else if (!body?.[body.length - 1]?.expression) {
    throw new Error('unexpected ast format without body expression');
  }

  // add return to last statement
  if (addReturn) {
    const { expression } = body[body.length - 1];
    body[body.length - 1] = {
      type: 'ReturnStatement',
      argument: expression,
    };
  }
  let output = escodegen.generate(ast);
  if (wrapAsync) {
    output = `(async ()=>{${output}})()`;
  }
  if (!emitMiniLocations) {
    return { output };
  }
  return { output, miniLocations, widgets };
}

function isKabelCall(node) {
  if (node.type !== 'CallExpression') return false;
  let callee = node.callee;
  if (callee.type === 'ChainExpression') callee = callee.expression;
  if (callee.type === 'MemberExpression') return !callee.computed && callee.property?.name === 'K';
  return callee.type === 'Identifier' && callee.name === 'K';
}

function shouldCallKabelExpression(expr) {
  if (expr.type !== 'ArrowFunctionExpression' && expr.type !== 'FunctionExpression') {
    return false;
  }
  if (expr.params.length) {
    return false;
  }
  return expr.body?.type === 'BlockStatement';
}

function genExprSource(expr) {
  return escodegen.generate(expr, { format: { semicolons: false } });
}

function extractPatternPlaceholders(expr) {
  const templateExpr = cloneNode(expr);
  const parents = new Map();
  const targets = [];

  walk(templateExpr, {
    enter(node, parent, prop, index) {
      parents.set(node, { parent, prop, index });
      const patternExpr = getStrudelPatternExpr(node);
      if (patternExpr) {
        targets.push({ node, patternExpr });
        this.skip();
      }
    },
  });

  if (!targets.length) {
    return { template: genExprSource(templateExpr), patternExprs: [] };
  }

  targets.sort((a, b) => getPatternNodeOrder(a.node) - getPatternNodeOrder(b.node));

  const patternExprs = targets.map(({ patternExpr }) => cloneNode(patternExpr));

  let currentExpr = templateExpr;
  targets.forEach(({ node }, index) => {
    currentExpr = replaceNode(node, placeholderAst(index), parents, currentExpr);
  });

  const template = genExprSource(currentExpr);
  return { template, patternExprs };
}

function getStrudelPatternExpr(node) {
  if (isStrudelPatternWrap(node)) {
    const arg = node.arguments?.[0];
    if (!arg) {
      throw new Error('S(...) requires an argument');
    }
    return arg;
  }
  if (isMiniCall(node)) {
    return node;
  }
  return null;
}

function isStrudelPatternWrap(node) {
  if (node.type !== 'CallExpression') {
    return false;
  }
  const callee = node.callee;
  if (callee.type === 'Identifier') {
    return callee.name === 'S';
  }
  if (callee.type === 'MemberExpression' && !callee.computed) {
    return callee.property?.name === 'S';
  }
  return false;
}

function getMinilangName() {
  const minilang = languages.get('minilang');
  return minilang?.name || 'm';
}

// Used to identify transpiled `m(...)` calls for proper conversion
// to, say, kabelsalat placeholders
function isMiniCall(node) {
  if (node.type !== 'CallExpression') {
    return false;
  }
  const callee = node.callee;
  if (callee.type !== 'Identifier') {
    return false;
  }
  if (callee.name !== getMinilangName()) {
    return false;
  }
  const firstArg = node.arguments?.[0];
  return firstArg?.type === 'Literal' && typeof firstArg.value === 'string';
}

// If `start` is available, we use it. If it's already been transpiled
// to `m(...)`, use the provided offset
function getPatternNodeOrder(node) {
  if (typeof node.start === 'number') {
    return node.start;
  }
  if (isMiniCall(node)) {
    const offsetArg = node.arguments?.[1];
    if (offsetArg?.type === 'Literal' && typeof offsetArg.value === 'number') {
      return offsetArg.value;
    }
  }
  return 0;
}

function placeholderAst(index) {
  return {
    type: 'MemberExpression',
    object: { type: 'Identifier', name: 'pat' },
    property: { type: 'Literal', value: index },
    computed: true,
    optional: false,
  };
}

function replaceNode(node, replacement, parents, currentRoot) {
  const info = parents.get(node);
  if (!info || !info.parent) {
    return replacement;
  }

  const { parent, prop, index } = info;
  if (Array.isArray(parent[prop])) {
    parent[prop][index] = replacement;
  } else {
    parent[prop] = replacement;
  }
  parents.set(replacement, { parent, prop, index });
  return currentRoot;
}

function cloneNode(node) {
  return JSON.parse(JSON.stringify(node));
}

function workletMemberAst(objectExpr) {
  return {
    type: 'MemberExpression',
    object: objectExpr,
    property: { type: 'Identifier', name: 'worklet' },
    computed: false,
    optional: false,
  };
}

function isStringWithDoubleQuotes(node, locations, code) {
  if (node.type !== 'Literal') {
    return false;
  }
  return node.raw[0] === '"';
}

function isBackTickString(node, parent) {
  return node.type === 'TemplateLiteral' && parent.type !== 'TaggedTemplateExpression';
}

function miniWithLocation(value, node) {
  const { start: fromOffset } = node;

  const minilang = languages.get('minilang');
  let name = 'm';
  if (minilang && minilang.name) {
    name = minilang.name; // name is expected to be exported from the package of the minilang
  }

  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name,
    },
    arguments: [
      { type: 'Literal', value },
      { type: 'Literal', value: fromOffset },
    ],
    optional: false,
  };
}

// these functions are connected to @strudel/codemirror -> slider.mjs
// maybe someday there will be pluggable transpiler functions, then move this there
function isSliderFunction(node) {
  return node.type === 'CallExpression' && node.callee.name === 'slider';
}

function isWidgetMethod(node) {
  return node.type === 'CallExpression' && widgetMethods.includes(node.callee.property?.name);
}

function sliderWithLocation(node) {
  const id = 'slider_' + node.arguments[0].start; // use loc of first arg for id
  // add loc as identifier to first argument
  // the sliderWithID function is assumed to be sliderWithID(id, value, min?, max?)
  node.arguments.unshift({
    type: 'Literal',
    value: id,
    raw: id,
  });
  node.callee.name = 'sliderWithID';
  return node;
}

export function getWidgetID(widgetConfig) {
  // the widget id is used as id for the dom element + as key for eventual resources
  // for example, for each scope widget, a new analyser + buffer (large) is created
  // that means, if we use the index index of line position as id, less garbage is generated
  // return `widget_${widgetConfig.to}`; // more gargabe
  //return `widget_${widgetConfig.index}_${widgetConfig.to}`; // also more garbage
  return `${widgetConfig.id || ''}_widget_${widgetConfig.type}_${widgetConfig.index}`; // less garbage
}

function widgetWithLocation(node, widgetConfig) {
  const id = getWidgetID(widgetConfig);
  // add loc as identifier to first argument
  // the sliderWithID function is assumed to be sliderWithID(id, value, min?, max?)
  node.arguments.unshift({
    type: 'Literal',
    value: id,
    raw: id,
  });
  return node;
}

function isBareSamplesCall(node, parent) {
  return node.type === 'CallExpression' && node.callee.name === 'samples' && parent.type !== 'AwaitExpression';
}

function withAwait(node) {
  return {
    type: 'AwaitExpression',
    argument: node,
  };
}

function isLabelStatement(node) {
  return node.type === 'LabeledStatement';
}

// converts label expressions to p calls: "x: y" to "y.p('x')"
// see https://codeberg.org/uzu/strudel/issues/990
function labelToP(node) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: node.body.expression,
        property: {
          type: 'Identifier',
          name: 'p',
        },
      },
      arguments: [
        {
          type: 'Literal',
          value: node.label.name,
          raw: `'${node.label.name}'`,
        },
      ],
    },
  };
}

function isLanguageLiteral(node) {
  return node.type === 'TaggedTemplateExpression' && languages.has(node.tag.name);
}

// tidal highlighting
// this feels kind of stupid, when we also know the location inside the string op (tidal.mjs)
// but maybe it's the only way

function isTemplateLiteral(node, value) {
  return node.type === 'TaggedTemplateExpression' && node.tag.name === value;
}

function collectHaskellMiniLocations(haskellCode, offset) {
  return haskellCode
    .split('')
    .reduce((acc, char, i) => {
      if (char !== '"') {
        return acc;
      }
      if (!acc.length || acc[acc.length - 1].length > 1) {
        acc.push([i + 1]);
      } else {
        acc[acc.length - 1].push(i);
      }
      return acc;
    }, [])
    .map(([start, end]) => {
      const miniString = haskellCode.slice(start, end);
      return getLeafLocations(`"${miniString}"`, offset + start - 1);
    })
    .flat();
}

function tidalWithLocation(value, offset) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'tidal',
    },
    arguments: [
      { type: 'Literal', value },
      { type: 'Literal', value: offset },
    ],
    optional: false,
  };
}

function languageWithLocation(name, value, offset) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: name,
    },
    arguments: [
      { type: 'Literal', value },
      { type: 'Literal', value: offset },
    ],
    optional: false,
  };
}

function findMiniDisableRanges(comments, codeEnd) {
  const ranges = [];
  const stack = []; // used to track on/off pairs
  for (const comment of comments) {
    const value = comment.value.trim();
    if (value.startsWith('mini-off')) {
      stack.push(comment.start);
    } else if (value.startsWith('mini-on')) {
      const start = stack.pop();
      ranges.push([start, comment.end]);
    }
  }
  while (stack.length) {
    // If no closing mini-on is found, just turn it off until `codeEnd`
    const start = stack.pop();
    ranges.push([start, codeEnd]);
  }
  return ranges;
}

function isMiniDisabled(offset, miniDisableRanges) {
  for (const [start, end] of miniDisableRanges) {
    if (offset >= start && offset < end) {
      return true;
    }
  }
  return false;
}
