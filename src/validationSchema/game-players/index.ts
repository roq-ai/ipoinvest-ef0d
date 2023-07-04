import * as yup from 'yup';

export const gamePlayerValidationSchema = yup.object().shape({
  investment: yup.number().integer(),
  user_id: yup.string().nullable(),
  startup_id: yup.string().nullable(),
});
