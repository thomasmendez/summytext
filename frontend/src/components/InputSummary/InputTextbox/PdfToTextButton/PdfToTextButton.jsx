import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import 'regenerator-runtime/runtime';
import { Button } from '@mui/material';
import { analysisActions } from '../../../../store/analysis';

const PDFJS = require('pdfjs-dist/webpack');

/* eslint-disable react/jsx-child-element-spacing */

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  const fileData = await readFileAsArrayBuffer(file);
  const pdf = await PDFJS.getDocument(fileData).promise;
  // Use the 'pdf' object for further operations, such as rendering pages
  const numPages = pdf.numPages;
  let extractedText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    extractedText += pageText;
  }

  return extractedText;
};

const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const PdfToTextButton = () => {

  const dispatch = useDispatch();

  return(
    <Button fullWidth variant="contained" component="label" color="success" size="large">
      PDF to Text
      <input
        hidden
        accept="application/pdf"
        type="file"
        onChange={(e) => {
            handleFileChange(e).then((text) => {
              dispatch(analysisActions.handleTextFieldChange(text));
            }).catch((err) => {
              console.error(err);
            });
        }}
      />
    </Button>
  );
};

PdfToTextButton.defaultProps = {
};

PdfToTextButton.propTypes = {
};

export default PdfToTextButton;
