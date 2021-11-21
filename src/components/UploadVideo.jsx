import React, { useState } from 'react';
import {
  Box,
  Button,
  LinearProgress,
  Alert,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogContentText,
  Input,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Formik, Form, Field } from 'formik';
import { TextField, SimpleFileUpload, Switch } from 'formik-mui';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useStateContext } from '../contexts/StateContextProvider';
import { useWeb3Context } from '../contexts/Web3ContextProvider';

const SearchFeed = () => {
  const { address } = useWeb3Context();
  const { uploadFile, createStream, mintNFT } = useStateContext();
  const [streamKey, setStreamKey] = useState();

  const createLive = async (values) => {
    if (!values.thumbnail) {
      return alert('Please upload thumbnail');
    }

    const { playbackId, streamKey } = await createStream(values.name);
    const thumbnail = await uploadFile(values.thumbnail);

    await mintNFT(
      {
        name: values.name,
        description: values.description,
        file_url: thumbnail.ipfs_url,
        custom_fields: {
          playbackId,
        },
      },
      address
    );

    setStreamKey(streamKey);
  };

  const createVideo = async (values, setSubmitting) => {
    if (!values.video) {
      return alert('Please upload video');
    }

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

        const thumbnail = await uploadFile(values.thumbnail && blob);
        const video = await uploadFile(values.video);
        await mintNFT(
          {
            name: values.name,
            description: values.description,
            file_url: thumbnail.ipfs_url,
            external_url: video.ipfs_url,
          },
          address
        );

        setSubmitting(false);
      },
      'image/jpeg',
      0.75 /* quality */
    );
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (values.live) {
      return await createLive(values);
    }

    await createVideo(values, setSubmitting);
  };

  let content = <Alert severity="error">Please connect to wallet</Alert>;

  if (address) {
    content = (
      <Formik
        initialValues={{
          name: '',
          description: '',
          live: false,
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
            <Field
              component={SimpleFileUpload}
              name="thumbnail"
              label="Thumbnail"
            />
            <br />
            <FormControlLabel
              control={<Field component={Switch} type="checkbox" name="live" />}
              label="Live"
            />
            <br />
            {!values.live && (
              <Field component={SimpleFileUpload} name="video" label="Video" />
            )}
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
    );
  }

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
      {content}
      <Dialog open={streamKey} onClose={() => setStreamKey('')}>
        <DialogContent>
          <DialogContentText>
            Please save stream key in order to host the live streaming
          </DialogContentText>
          <Input
            label="Stream key"
            defaultValue={streamKey}
            fullWidth
            readOnly
            endAdornment={
              <InputAdornment position="end">
                <CopyToClipboard text={streamKey}>
                  <IconButton>
                    <ContentCopyIcon />
                  </IconButton>
                </CopyToClipboard>
              </InputAdornment>
            }
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SearchFeed;
