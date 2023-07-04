import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createGmp } from 'apiSdk/gmps';
import { Error } from 'components/error';
import { gmpValidationSchema } from 'validationSchema/gmps';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { StartupInterface } from 'interfaces/startup';
import { getStartups } from 'apiSdk/startups';
import { GmpInterface } from 'interfaces/gmp';

function GmpCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: GmpInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createGmp(values);
      resetForm();
      router.push('/gmps');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<GmpInterface>({
    initialValues: {
      value: 0,
      startup_id: (router.query.startup_id as string) ?? null,
    },
    validationSchema: gmpValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Gmp
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="value" mb="4" isInvalid={!!formik.errors?.value}>
            <FormLabel>Value</FormLabel>
            <NumberInput
              name="value"
              value={formik.values?.value}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('value', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.value && <FormErrorMessage>{formik.errors?.value}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<StartupInterface>
            formik={formik}
            name={'startup_id'}
            label={'Select Startup'}
            placeholder={'Select Startup'}
            fetcher={getStartups}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'gmp',
    operation: AccessOperationEnum.CREATE,
  }),
)(GmpCreatePage);
