/**
 * @fileoverview This rule reports data that have not been used in the template
 * @author ShenHao
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex')

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports = {
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  rules: requireIndex(__dirname + '/rules'),
  configs: {
    recommended: {
      // plugins 属性值可以省略包名中的 eslint-plugin- 前缀，也就是说可以直接通过 vue-extends 引入
      plugins: ['vue-extends'],
      rules: {
        'vue-extends/no-unused-data': 'warn' // rules 也可以省略 eslint-plugin- 前缀
      }
    }
  }
}
