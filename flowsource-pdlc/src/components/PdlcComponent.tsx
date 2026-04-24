import React from 'react';
import Page from './page';
import StoreProvider from '../store/store-provider';
import { UserInitializer } from './user-initializer';

export const PdlcComponent = () => {
    return (
        <StoreProvider>
            <UserInitializer />
            <Page />
        </StoreProvider>
    );
};