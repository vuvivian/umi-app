/*
 * @Author: vuvivian
 * @Date: 2020-11-12 21:51:38
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-12 21:52:47
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/custom/customtranslate/customTranslate.js
 */
import translations from './translations';


export default function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
  });
}