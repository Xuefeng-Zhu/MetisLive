import React from 'react';
import { Box, Button, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField, SimpleFileUpload } from 'formik-mui';

import { useStateContext } from '../contexts/StateContextProvider';

const SearchFeed = () => {
  const { uploadFile, mintNFT } = useStateContext();

  const handleSubmit = async (values, { setSubmitting }) => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      document.querySelector('#video-element'),
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.canvas.toBlob(
      async (blob) => {
        setSubmitting(true);

        const thumbnail = await uploadFile(blob);
        const video = await uploadFile(values.video);
        await mintNFT({
          name: values.name,
          description: values.description,
          file_url: thumbnail.ipfs_url,
          external_url: video.ipfs_url,
        });

        setSubmitting(false);
      },
      'image/jpeg',
      0.75 /* quality */
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        p: 1,
        mt: 10,
      }}
    >
      <Formik
        initialValues={{
          name: '',
          description: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = 'Required';
          }
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ values, submitForm, isSubmitting }) => (
          <Form className="upload-form">
            <Field component={TextField} name="name" type="text" label="Name" />
            <br />
            <Field
              component={TextField}
              InputProps={{ multiline: true, rows: 3 }}
              name="description"
              type="text"
              label="Description"
            />
            <br />
            <Field component={SimpleFileUpload} name="video" label="Video" />
            {values.video && (
              <video id="video-element" controls height={200} width={200}>
                <source src={URL.createObjectURL(values.video)} />
              </video>
            )}
            {isSubmitting && <LinearProgress />}
            <br />
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={submitForm}
            >
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SearchFeed;
