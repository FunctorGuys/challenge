import $ from 'jquery';
import * as SignUpService from './signup.service';
import queryString from 'query-string';
import { propOr } from 'ramda';
import toastr from 'toastr';

$(() => {
  const signUp = (e) => {
    const $form = $(e.currentTarget);
    const $inputs = $form.find(':input');

    if (SignUpService.validate($inputs)) {
      const data = queryString.parse($form.serialize());

      $('.js-loader').removeClass('u-hide');
      SignUpService.signUp(data)
        .then(() => {
          toastr.success('Sign up successfully');
          $form.trigger('reset');
        })
        .catch((err) => {
          toastr.error(propOr('Something went wrong', 'title', err));
        })
        .finally(() => {
          $('.js-loader').addClass('u-hide');
        });
    }
  };

  $('.js-signup-mail').on('submit', (e) => {
    e.preventDefault();
    signUp(e);
  });
});
