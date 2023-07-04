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
import { createGamePlayer } from 'apiSdk/game-players';
import { Error } from 'components/error';
import { gamePlayerValidationSchema } from 'validationSchema/game-players';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { StartupInterface } from 'interfaces/startup';
import { getUsers } from 'apiSdk/users';
import { getStartups } from 'apiSdk/startups';
import { GamePlayerInterface } from 'interfaces/game-player';

function GamePlayerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: GamePlayerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createGamePlayer(values);
      resetForm();
      router.push('/game-players');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<GamePlayerInterface>({
    initialValues: {
      investment: 0,
      user_id: (router.query.user_id as string) ?? null,
      startup_id: (router.query.startup_id as string) ?? null,
    },
    validationSchema: gamePlayerValidationSchema,
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
            Create Game Player
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="investment" mb="4" isInvalid={!!formik.errors?.investment}>
            <FormLabel>Investment</FormLabel>
            <NumberInput
              name="investment"
              value={formik.values?.investment}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('investment', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.investment && <FormErrorMessage>{formik.errors?.investment}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
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
    entity: 'game_player',
    operation: AccessOperationEnum.CREATE,
  }),
)(GamePlayerCreatePage);
