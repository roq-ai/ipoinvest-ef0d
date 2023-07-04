import * as yup from 'yup';

export const gmpValidationSchema = yup.object().shape({
  value: yup.number().integer(),
  startup_id: yup.string().nullable(),
});
