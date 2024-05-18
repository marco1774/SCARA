import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { MainContainer } from 'app/components/MainContainer';
import { Button } from 'app/components/Button';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="A SCARA application homepage" />
      </Helmet>
      <MainContainer>
        <section>
          <h1>Scara</h1>
          <Button
            variant="contained"
            onclick={() => {
              navigate('simulation2d');
            }}
          >
            prova
          </Button>
        </section>
      </MainContainer>
    </>
  );
}
