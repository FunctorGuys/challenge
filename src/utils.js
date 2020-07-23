import $ from 'jquery';
import {
  pathOr,
  pipe,
  reject,
  propSatisfies,
  includes,
  __,
  prop,
  identity,
  bind,
} from 'ramda';
import validator from 'validator';

const REJECT = ['BUTTON'];
const filterFormElements = reject(
  propSatisfies(includes(__, REJECT), 'tagName'),
);

const normalizeElements = (elements) =>
  elements.map((item) => {
    const defaultValue = JSON.stringify([]);
    const rules = pipe(
      pathOr(defaultValue, ['dataset', 'rules']),
      JSON.parse.bind(JSON),
    )(item);

    return {
      element: item,
      rules: rules,
    };
  });

const showErrorMessage = (element, message) => {
  const $formError = $(element).siblings('.js-form-errors');

  if (!$formError.length) {
    $(element).after('<div class="c-errors js-form-errors"></div>');
  }

  const $errors = $(element).siblings('.js-form-errors');
  $errors.append(`<p class="c-errors__item">${message}</p>`);
};

const removeErrorMessage = (element) => {
  $(element).siblings('.js-form-errors').html('');
};

const mapping = {
  isEmpty: (...args) => !validator.isEmpty(...args),
};

// TODO: Need to refactor to avoid side-effects
const validateElements = (elements) =>
  elements.reduce((acc, item) => {
    removeErrorMessage(item.element);

    const isValidateValid = item.rules.reduce((acc, ruleItem) => {
      const ruleName = prop('rule', ruleItem);
      const func = bind(
        mapping[ruleName] || validator[ruleName] || identity,
        validator,
      );
      const value = $(item.element).val();
      const isValid = func(value);

      if (!isValid) {
        showErrorMessage(item.element, ruleItem.message);
      }

      return acc && isValid;
    }, true);

    return acc && isValidateValid;
  }, true);

export const validateForm = pipe(
  Array.from,
  filterFormElements,
  normalizeElements,
  validateElements,
);
