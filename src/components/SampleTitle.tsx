import React from 'react';
import { Helmet } from 'react-helmet-async';

const DynamicTitlePage = ({ title }: any) => {
  return (
    <>
      <Helmet>
        <title>{title || "Default Title"}</title>
        <meta name="description" content="This is a dynamic page description." />
      </Helmet>
      <h1>Welcome to {title}</h1>
    </>
  );
};

export default DynamicTitlePage;
