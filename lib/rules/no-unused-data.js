/**
 * @fileoverview This rule reports data that haven't been used in the template
 * @author ShenHao
 */
const defaultObj = ['JSON', 'Object', 'Array']
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "This rule reports data that haven't been used in the template",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unused: 'The "{{name}}" has been defined in data but not used in the template.',
    },
  },

  create(context) {
    let hasTemplate = false

    const templateUseData = new Set()

    const documentFragment = context.parserServices.getDocumentFragment()

    const reportMsgByNode = function (node) {
      let nodeVal = node
      // get the leftmost node of the expression.
      function fun(val) {
        if (!val.object) {
          nodeVal = val
        } else {
          fun(val.object)
        }
      }
      fun(node)
      if (!defaultObj.includes(nodeVal.name)) {
        templateUseData.add(nodeVal.name)
      }
    }

    const actions = {
      Identifier: (node) => {
        templateUseData.add(node.name)
      },
      MemberExpression: (node) => {
        if (node.object.type === 'CallExpression'){
          if (node.object.callee) {
            traverseTemplateNode(node.object.callee)
          }
          if (node.object.arguments) {
            node.object.arguments.forEach((itemNode) => {
              traverseTemplateNode(itemNode)
            })
          }
        } else {
          reportMsgByNode(node)
        }
      },
      ArrayExpression: (node) => {
        if (node.elements) {
          node.elements.forEach((itemNode) => {
            traverseTemplateNode(itemNode)
          })
        }
      },
      UnaryExpression: (node) => {
        traverseTemplateNode(node.argument)
      },
      CallExpression: (node) => {
        if (node.callee) {
          traverseTemplateNode(node.callee)
        }
        if (node.arguments) {
          node.arguments.forEach((itemNode) => {
            traverseTemplateNode(itemNode)
          })
        }
      },
      BinaryExpression: (node) => {
        if (node.right) {
          traverseTemplateNode(node.right)
        }
        if (node.left) {
          traverseTemplateNode(node.left)
        }
      },
      ConditionalExpression: (node) => {
        if (node.test) {
          traverseTemplateNode(node.test)
        }
        if (node.consequent) {
          traverseTemplateNode(node.consequent)
        }
        if (node.alternate) {
          traverseTemplateNode(node.alternate)
        }
      },
      TemplateLiteral: (node) => {
        if (node.expressions) {
          node.expressions.forEach((itemNode) => {
            traverseTemplateNode(itemNode)
          })
        }
      },
      VFilterSequenceExpression: (node) => {
        if (node.expression) {
          traverseTemplateNode(node.expression)
        }
        if (node.filters) {
          node.filters.forEach((itemNode) => {
            if (itemNode.arguments) {
              itemNode.arguments.forEach((itemArg) => {
                traverseTemplateNode(itemArg)
              })
            } else {
              traverseTemplateNode(itemNode.callee)
            }
          })
        }
      },
      LogicalExpression: (node) => {
        if (node.right) {
          traverseTemplateNode(node.right)
        }
        if (node.left) {
          traverseTemplateNode(node.left)
        }
      },
      ObjectExpression: (node) => {
        node.properties.forEach((itemNode) => {
          if (!itemNode.value) {
            return
          }
          traverseTemplateNode(itemNode.value)
        })
      },
      VForExpression: (node) => {
        traverseTemplateNode(node.right)
      },
    }

    const traverseTemplateNode = (node) => {
      if (!node) {
        return
      }
      actions[node.type] && actions[node.type](node)
    }

    if (documentFragment) {
      hasTemplate = documentFragment.children.some((node) => node.name === 'template')
    }

    return context.parserServices.defineTemplateBodyVisitor(
      {
        // templateVisitor
        VExpressionContainer: (node) => {
          traverseTemplateNode(node.expression)
          // console.log(templateUseData, 111)
        },
      },
      {
        // scriptVisitor
        'ExportDefaultDeclaration>ObjectExpression>[key.name="data"]>FunctionExpression>BlockStatement>ReturnStatement>ObjectExpression>Property':
          (node) => {
            if (!node.key.name) {
              return
            }
            if (![...templateUseData].includes(node.key.name) && hasTemplate) {
              context.report({
                node: node.key,
                messageId: 'unused',
                data: {
                  name: node.key.name,
                },
              })
            }
          },
      },
      {
        templateBodyTriggerSelector: 'Program'
      }
    )
  },
}
