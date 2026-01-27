import React from "react";

import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';

const provider = [
  { id: 'google', name: 'Google' },
];

export default function SignIn() {

  return (
    <AppProvider >
      <SignInPage
        providers={provider}
        signIn={async (provider) => {
          if(provider.id === 'google'){
           window.location.href = "/auth/google";
          }
        }}
      />
    </AppProvider>
  );
}




